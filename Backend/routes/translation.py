# backend/routes/translation.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, decode_token
from models import Translation, User, db
from datetime import datetime
import json
# IMPORTS NÉCESSAIRES POUR L'INFÉRENCE LOCALE
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
import os
import torch

translation_bp = Blueprint('translation', __name__)

# --- Configuration des Modèles Hugging Face locaux ---
# Ajout des codes de langue NLLB (utilisés pour tokenizer.src_lang et forced_bos_token_id)
MODEL_CONFIGS = {
    "ar-TD_to_fr": {
        "id": "Koubra-Gaby/facebook-NLLB-arb-fr", # Ou "Koubra-Gaby/facebook-NLLB-arb-fr" si c'est le même modèle renommé
        "source_lang_app": "ar-TD", # Langue utilisée par l'application frontend
        "target_lang_app": "fr",    # Langue utilisée par l'application frontend
        "source_lang_nllb": "acm_Latn", # Code NLLB réel pour l'arabe tchadien (latin)
        "target_lang_nllb": "fra_Latn"  # Code NLLB réel pour le français
    },
    "fr_to_ar-TD": {
        "id": "Koubra-Gaby/facebook-NLLB-fr-arb", # Ou "/content/sample_data/Modele_facebook/checkpoint-19000" si c'est un chemin local spécifique
        "source_lang_app": "fr",
        "target_lang_app": "ar-TD",
        "source_lang_nllb": "fra_Latn",
        "target_lang_nllb": "arb_Latn" # Code NLLB réel pour l'arabe standard (latin) ou acm_Latn si c'est Tchadien
    }
}

loaded_models = {}
global_device = "cuda" if torch.cuda.is_available() else "cpu"
print(f"Périphérique global pour les modèles : {global_device.upper()}")

def load_model_and_tokenizer(model_id):
    # La logique de chargement reste la même. Les NLLB codes sont gérés plus tard.
    cache_key = model_id
    if cache_key in loaded_models:
        print(f"Modèle '{model_id}' déjà en cache. Utilisation de la version chargée.")
        return loaded_models[cache_key]["tokenizer"], loaded_models[cache_key]["model"], loaded_models[cache_key]["device"]

    try:
        print(f"Chargement du tokenizer '{model_id}'...")
        tokenizer = AutoTokenizer.from_pretrained(model_id)
        print(f"Chargement du modèle '{model_id}'...")
        model = AutoModelForSeq2SeqLM.from_pretrained(model_id)
        model.to(global_device)

        loaded_models[cache_key] = {
            "tokenizer": tokenizer,
            "model": model,
            "device": global_device
        }
        print(f"Modèle '{model_id}' chargé localement et mis en cache sur {global_device.upper()}.")
        return tokenizer, model, global_device

    except Exception as e:
        print(f"ERREUR: Impossible de charger le modèle '{model_id}'.")
        print(f"Détails de l'erreur: {e}")
        return None, None, None


# MODIFICATION ICI : perform_translation doit maintenant accepter les codes de langue NLLB
def perform_translation(text, tokenizer, model, device, source_lang_nllb, target_lang_nllb):
    if not model or not tokenizer:
        raise RuntimeError("Le modèle de traduction ou le tokenizer n'a pas pu être chargé.")

    # 1. Configurer le tokenizer pour la langue source NLLB
    tokenizer.src_lang = source_lang_nllb

    # 2. Tokeniser l'entrée (le tokenizer ajoute automatiquement le token de langue source)
    inputs = tokenizer(text, return_tensors="pt", padding=True, truncation=True)
    inputs = {k: v.to(device) for k, v in inputs.items()}

    # 3. Obtenir l'ID du token de langue cible NLLB
    # On préfixe et on suffixe avec "__" pour qu'il corresponde à la forme des tokens de langue NLLB
    target_lang_token_id = tokenizer.convert_tokens_to_ids(f"__{target_lang_nllb}__")
    
    if target_lang_token_id is None:
        raise ValueError(f"Impossible de trouver l'ID du token pour la langue cible NLLB: {target_lang_nllb}")

    # 4. Générer la traduction
    outputs = model.generate(
        **inputs,
        forced_bos_token_id=target_lang_token_id, # Utilisation de l'ID corrigé
        max_new_tokens=200,
        do_sample=False
    )

    # 5. Décoder la traduction
    translation_result = tokenizer.batch_decode(outputs, skip_special_tokens=True)
    translated_text = translation_result[0]

    return translated_text

@translation_bp.route('/translate', methods=['POST'])
# @jwt_required() # <--- Décommentez ceci si vous voulez que la traduction nécessite une authentification
def translate():
    payload = request.get_json() or {}
    source_text = payload.get("source_text", "").strip()
    from_lang = payload.get("from_lang", "").strip()
    to_lang = payload.get("to_lang", "").strip()
    user_id = payload.get('user_id', None)

    if not source_text:
        return jsonify({"error": "Le champ 'source_text' est vide."}), 400
    if not from_lang or not to_lang:
        return jsonify({"error": "Les langues source et cible sont requises."}), 400

    model_config = None
    if from_lang == MODEL_CONFIGS["ar-TD_to_fr"]["source_lang_app"] and to_lang == MODEL_CONFIGS["ar-TD_to_fr"]["target_lang_app"]:
        model_config = MODEL_CONFIGS["ar-TD_to_fr"]
    elif from_lang == MODEL_CONFIGS["fr_to_ar-TD"]["source_lang_app"] and to_lang == MODEL_CONFIGS["fr_to_ar-TD"]["target_lang_app"]:
        model_config = MODEL_CONFIGS["fr_to_ar-TD"]
    else:
        return jsonify({"error": "Combinaison de langues non supportée pour la traduction."}), 400

    if not model_config:
        return jsonify({"error": "Configuration de modèle introuvable pour la paire de langues spécifiée."}), 400


    tokenizer, model, device = load_model_and_tokenizer(model_config["id"])

    if not model or not tokenizer:
        return jsonify({"error": f"Le service de traduction pour la paire {from_lang}-{to_lang} n'est pas disponible (modèle non chargé)."}), 503

    try:
        # APPEL À perform_translation AVEC LES CODES NLLB
        translation_clean = perform_translation(
            source_text,
            tokenizer,
            model,
            device,
            model_config["source_lang_nllb"], # Passer le code NLLB source
            model_config["target_lang_nllb"]  # Passer le code NLLB cible
        )

        if not translation_clean.strip():
            raise ValueError("Le texte traduit est vide après le traitement.")

    except Exception as e:
        print(f"Erreur lors de la traduction locale pour {from_lang} vers {to_lang}: {e}")
        return jsonify({'error': f"Échec de la traduction locale: {type(e).__name__}: {str(e)}"}), 500

    # Logic for saving to database
    translation_entry = None
    if user_id:
        try:
            user_exists = User.query.get(user_id)
            if user_exists:
                new_translation = Translation(
                    user_id=user_exists.id,
                    source_text=source_text,
                    translated_text=translation_clean,
                    from_lang=from_lang,
                    to_lang=to_lang,
                    is_correction=False,
                    timestamp=datetime.utcnow()
                )
                db.session.add(new_translation)
                db.session.commit()
                translation_entry = new_translation
                print(f"DEBUG Backend: Nouvelle traduction enregistrée avec ID: {translation_entry.id}")
            else:
                print(f"Avertissement: Utilisateur avec l'ID {user_id} introuvable pour la sauvegarde de la traduction. Traduction non enregistrée dans l'historique.")
        except Exception as e:
            db.session.rollback()
            print(f"Erreur lors de la sauvegarde de la traduction pour l'utilisateur {user_id} dans la BDD: {e}")
            pass

    if translation_entry:
        return jsonify(translation_entry.to_dict()), 200
    else:
        return jsonify({
            'id': None,
            'sourceText': source_text,
            'translatedText': translation_clean,
            'fromLang': from_lang,
            'toLang': to_lang,
            'isCorrection': False,
            'originalTranslationId': None,
            'timestamp': datetime.utcnow().isoformat()
        }), 200

@translation_bp.route('/save_correction', methods=['POST'])
@jwt_required()
def save_correction():
    current_user_id = get_jwt_identity()
    data = request.get_json()

    source_text = data.get('source_text')
    corrected_text_from_frontend = data.get('translated_text')
    from_lang = data.get('from_lang')
    to_lang = data.get('to_lang')
    is_correction = data.get('is_correction')
    original_translation_id = data.get('original_translation_id')

    if not all([source_text, corrected_text_from_frontend, from_lang, to_lang, original_translation_id]):
        return jsonify({"error": "Paramètres de correction manquants ou incomplets."}), 400

    try:
        original_entry_exists = Translation.query.filter_by(
            id=original_translation_id,
            user_id=current_user_id
        ).first()

        if not original_entry_exists:
            return jsonify({"error": "Traduction originale introuvable ou non autorisée pour la correction."}), 404

        new_correction = Translation(
            user_id=current_user_id,
            source_text=source_text,
            translated_text=corrected_text_from_frontend,
            from_lang=from_lang,
            to_lang=to_lang,
            is_correction=True,
            original_translation_id=original_translation_id,
            timestamp=datetime.utcnow()
        )
        db.session.add(new_correction)
        db.session.commit()

        print(f"DEBUG Backend: Correction enregistrée avec ID: {new_correction.id} pour l'original ID: {original_translation_id}")
        return jsonify(new_correction.to_dict()), 201

    except Exception as e:
        db.session.rollback()
        print(f"Erreur lors de la sauvegarde de la correction: {e}")
        return jsonify({"error": f"Erreur lors de la sauvegarde de la correction: {str(e)}"}), 500


@translation_bp.route('/get_translations', methods=['GET'])
@jwt_required()
def get_translations_api():
    auth_header = request.headers.get('Authorization')
    if auth_header and auth_header.startswith('Bearer '):
        token = auth_header.split(" ")[1]
        try:
            current_user_id = get_jwt_identity()
            if not current_user_id:
                print("Avertissement: get_jwt_identity() a retourné None. Utilisateur non authentifié ou token invalide.")
                return jsonify({'error': 'Authentification requise.'}), 401

            user_entries = Translation.query.filter_by(user_id=current_user_id).order_by(Translation.timestamp.desc()).all()
            
            translations_data = [entry.to_dict() for entry in user_entries]
            
            print("Données d'historique récupérées avec succès (via to_dict()):", translations_data)
            return jsonify(translations_data), 200

        except Exception as e:
            print(f"--- Erreur inattendue dans get_translations_api: {e} ---")
            return jsonify({"error": f"Erreur de traitement de la requête: {str(e)}"}), 500

    else:
        print("Aucun header Authorization 'Bearer' valide trouvé pour /get_translations. Accès non autorisé.")
        return jsonify({"msg": "Authentification requise"}), 401