import React, { useState, useEffect } from "react"; // Importe React, useState, et useEffect
import LanguageSelector from "./LanguageSelector";
import TextArea from "./TextArea";
import TranslateButton from "./TranslateButton";
import CorrectionPanel from "./CorrectionPanel";
import CorrectionHistory from "./CorrectionHistory"; // Utilisez CorrectionHistory, pas TranslationHistory
import { translateText } from "../utils/translator";
// Assurez-vous que reportError est défini globalement ou importé si vous le décommentez
// function reportError(error) { console.error("Reporting error:", error); }

// Le composant acceptera maintenant une prop 'user'
function TranslationPanel({ user }) {
    // SUPPRIMEZ le bloc try...catch qui enveloppe le composant entier.
    // Les Hooks doivent être appelés au top niveau.
    const [sourceText, setSourceText] = useState('');
    const [translatedText, setTranslatedText] = useState('');
    const [sourceLang, setSourceLang] = useState('ar-TD'); // Langue source par défaut
    const [targetLang, setTargetLang] = useState('fr'); // Langue cible par défaut
    const [isLoading, setIsLoading] = useState(false);
    const [showCorrection, setShowCorrection] = useState(false);

    // Liste complète des langues comme dans votre deuxième snippet
    const languages = [
        { code: 'fr', name: 'Français' },
        { code: 'ar-TD', name: 'Arabe Tchadien' } // Gardez votre spécificité si c'est pertinent
    
    ];

    // Effet pour gérer la sélection de traduction depuis l'historique
    useEffect(() => {
        if (user) {
            // Définir une fonction globale pour que CorrectionHistory puisse l'appeler
            window.onTranslationSelect = (translation) => {
                setSourceText(translation.sourceText);
                setTranslatedText(translation.translatedText);
                setSourceLang(translation.fromLang);
                setTargetLang(translation.toLang);
                setShowCorrection(false); // Masque le panneau de correction si une traduction est sélectionnée
            };
        } else {
            // Nettoyer la fonction globale si l'utilisateur se déconnecte
            if (window.onTranslationSelect) {
                delete window.onTranslationSelect;
            }
        }
        // Cet effet dépend de l'objet user. Il se réexécute si user change.
        return () => {
            // Nettoyage à la désinitialisation du composant
            if (window.onTranslationSelect) {
                delete window.onTranslationSelect;
            }
        };
    }, [user]); // Dépend de l'objet 'user'

    const handleTranslate = async () => {
        if (!sourceText.trim() || !sourceLang || !targetLang) return;

        setIsLoading(true);
        setShowCorrection(false); // Toujours masquer la correction au début d'une nouvelle traduction
        try {
            // Appelle translateText en lui passant l'ID de l'utilisateur s'il est connecté
            const result = await translateText(sourceText, sourceLang, targetLang, user ? user.id : null);
            setTranslatedText(result);

            // La logique de saveTranslation est maintenant encapsulée DANS translateText
            // Donc, pas besoin d'appeler saveTranslation ici.
            // La fonction translateText est responsable de décider si la traduction doit être sauvegardée
            // en fonction de la présence de l'userId.

        } catch (error) {
            console.error("Translation error:", error);
            // reportError(error); // Décommentez si vous avez une fonction globale reportError
            setTranslatedText("Erreur de traduction. Veuillez réessayer.");
        } finally {
            setIsLoading(false);
        }
    };

    const swapLanguages = () => {
        // Échange les langues et les textes pour une nouvelle traduction.
        setSourceLang(targetLang);
        setTargetLang(sourceLang);
        setSourceText(translatedText);
        setTranslatedText(sourceText);
        setShowCorrection(false); // Masque le panneau de correction après l'échange
    };

    const handleCorrection = (correctedText) => {
        // Appelé par CorrectionPanel quand une correction est soumise ou annulée
        if (correctedText) {
            setTranslatedText(correctedText); // Met à jour le texte traduit principal
        }
        setShowCorrection(false); // Cache le panneau de correction
    };

    return (
        <div data-name="translation-panel" data-file="components/TranslationPanel.js" className="translate-container">
            <div className="glass-card overflow-hidden"> 
                <div className="flex items-center justify-between p-6 bg-slate-800/30 border-b border-slate-700/50"> 
                    <LanguageSelector
                        value={sourceLang}
                        onChange={setSourceLang}
                        languages={languages}
                        placeholder="Détecter la langue"
                    />
                    <button
                        onClick={swapLanguages}
                        className="language-swap-btn p-3 rounded-xl" 
                    >
                        <i className="fas fa-exchange-alt text-blue-400 text-lg"></i> 
                    </button>
                    <LanguageSelector
                        value={targetLang}
                        onChange={setTargetLang}
                        languages={languages}
                        placeholder="Choisir la langue"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x md:divide-slate-700/50"> {/* Styles du deuxième snippet */}
                    <div className="p-0">
                        <TextArea
                            value={sourceText}
                            onChange={setSourceText}
                            placeholder="Saisissez votre texte ici..."
                        />
                    </div>
                    <div className="p-0 relative">
                        <TextArea
                            value={translatedText}
                            onChange={() => {}} // Lecture seule, donc pas de onChange
                            placeholder="Traduction..."
                            isReadOnly={true}
                        />
                        {translatedText && (
                            <button
                                onClick={() => setShowCorrection(true)}
                                className="absolute bottom-3 left-4 p-2 text-yellow-400 hover:text-yellow-300 hover:bg-slate-700/50 rounded-lg transition-all duration-200" 
                                title="Corriger la traduction"
                            >
                                <i className="fas fa-edit"></i>
                            </button>
                        )}
                    </div>
                </div>

                {/* CorrectionPanel reste le même, il est juste intégré ici */}
                <CorrectionPanel
                    translatedText={translatedText}
                    onCorrection={handleCorrection}
                    isVisible={showCorrection}
                />
            </div>

            <TranslateButton
                onClick={handleTranslate}
                isLoading={isLoading}
                disabled={!sourceText.trim() || !sourceLang || !targetLang}
            />

            {/* Affiche TranslationHistory (CorrectionHistory) seulement si l'utilisateur est connecté */}
            {user && <CorrectionHistory user={user} />} {/* Passe l'objet 'user' complet */}

            {/* Message pour les utilisateurs non connectés */}
            {!user && (
                <div className="mt-6 p-4 bg-blue-900/20 border border-blue-700/30 rounded-xl text-center backdrop-blur-sm">
                    <p className="text-blue-300 text-sm">
                        <i className="fas fa-info-circle mr-2"></i>
                        Connectez-vous pour accéder à l'historique de vos traductions
                    </p>
                </div>
            )}
        </div>
    );
    // SUPPRIMEZ le catch ici.
}

export default TranslationPanel;