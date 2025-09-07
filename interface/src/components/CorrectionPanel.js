// src/components/CorrectionPanel.js

import React, { useState, useEffect } from "react";
import { saveCorrection } from "../utils/corrections"; // Importation correcte de saveCorrection
// N'oubliez pas d'importer TextArea si c'est un composant séparé que vous utilisez
// import TextArea from './TextArea'; // Si vous utilisez un composant TextArea personnalisé

function CorrectionPanel({ originalTranslationEntry, onCorrection, isVisible }) {
    const [correctedText, setCorrectedText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null); // Ajout d'un état d'erreur pour un meilleur feedback

    useEffect(() => {
        if (originalTranslationEntry && originalTranslationEntry.translatedText) {
            setCorrectedText(originalTranslationEntry.translatedText);
            setError(null); // Réinitialiser l'erreur quand l'entrée change
        } else {
            setCorrectedText(''); // Réinitialiser le texte si pas d'entrée valide
            setError(null);
        }
    }, [originalTranslationEntry]);

    const handleSubmitCorrection = async () => {
        if (!correctedText.trim()) {
            setError("La correction ne peut pas être vide."); // Utiliser l'état d'erreur
            return;
        }

        if (!originalTranslationEntry || !originalTranslationEntry.id) {
            setError("Erreur: Impossible d'identifier la traduction originale pour la correction."); // Utiliser l'état d'erreur
            console.error("Missing originalTranslationEntry or originalTranslationEntry.id for correction.");
            return;
        }

        setIsSubmitting(true);
        setError(null); // Réinitialiser l'erreur avant la soumission

        try {
            // saveCorrection va formater les données en snake_case pour le backend
            await saveCorrection({
                originalTranslationSource: originalTranslationEntry.sourceText, // camelCase -> snake_case dans saveCorrection
                originalTranslationText: originalTranslationEntry.translatedText, // Non utilisé par le backend, mais utile pour le frontend
                correctedText: correctedText, // C'est le texte corrigé
                fromLang: originalTranslationEntry.fromLang,
                toLang: originalTranslationEntry.toLang,
                originalTranslationId: originalTranslationEntry.id // L'ID original
            });

            onCorrection(correctedText); // Appel de la fonction de rappel après succès
            // alert('Correction enregistrée avec succès !'); // Pas besoin d'alert, onCorrection va fermer le panneau

        } catch (error) {
            console.error("Error saving correction:", error);
            setError("Erreur lors de l'enregistrement de la correction: " + (error.message || "Erreur inconnue.")); // Afficher l'erreur
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isVisible) return null; // Affiche le panneau uniquement si isVisible est true

    return (
        <div data-name="correction-panel" data-file="components/CorrectionPanel.js"
             className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="text-sm font-medium text-yellow-800 mb-3">
                <i className="fas fa-edit mr-2"></i>
                Corriger la traduction
            </h3>

            {originalTranslationEntry && (
                <div className="mb-2 text-sm text-gray-700">
                    <p>Source Originale: <span className="font-semibold">{originalTranslationEntry.sourceText}</span></p>
                    <p>Traduction Initiale: <span className="font-semibold">{originalTranslationEntry.translatedText}</span></p>
                </div>
            )}

            <textarea
                value={correctedText}
                onChange={(e) => setCorrectedText(e.target.value)}
                className="w-full h-24 p-3 border border-yellow-300 rounded-md resize-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-black"
                placeholder="Modifiez la traduction ici..."
            />

            {error && <p className="text-red-500 text-xs mt-2">{error}</p>} {/* Affichage de l'erreur */}

            <div className="flex justify-end mt-3 space-x-2">
                <button
                    onClick={() => onCorrection(null)} // onCorrection(null) pour annuler et cacher le panneau
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                >
                    Annuler
                </button>
                <button
                    onClick={handleSubmitCorrection}
                    disabled={isSubmitting || !correctedText.trim()}
                    className="px-4 py-2 bg-yellow-600 text-white text-sm rounded-md hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
                </button>
            </div>
        </div>
    );
}

export default CorrectionPanel;