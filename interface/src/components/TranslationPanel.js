// src/components/TranslationPanel.js

import React, { useState, useEffect } from 'react';
import LanguageSelector from './LanguageSelector';
import TextArea from './TextArea';
import TranslateButton from './TranslateButton';
import CorrectionPanel from './CorrectionPanel';
import CorrectionHistory from './CorrectionHistory';

import { translateText } from '../utils/translator';

function TranslationPanel({ user }) {
    const [sourceText, setSourceText] = useState('');
    const [translatedText, setTranslatedText] = useState('');
    const [sourceLang, setSourceLang] = useState('ar-TD');
    const [targetLang, setTargetLang] = useState('fr');
    const [isLoading, setIsLoading] = useState(false);
    const [isCorrectionPanelVisible, setIsCorrectionPanelVisible] = useState(false);
    const [selectedOriginalTranslationEntry, setSelectedOriginalTranslationEntry] = useState(null);

    const languages = [
        { code: 'fr', name: 'Français' },
        { code: 'ar-TD', name: 'Arabe Tchadien' }
    ];

    useEffect(() => {
        if (user) {
            window.onTranslationSelect = (translation) => {
                console.log("1. DEBUG TPanel: onTranslationSelect received from history:", translation);
                setSourceText(translation.sourceText || '');
                setTranslatedText(translation.translatedText || '');
                setSourceLang(translation.fromLang || 'ar-TD');
                setTargetLang(translation.toLang || 'fr');

                setSelectedOriginalTranslationEntry(translation);
                setIsCorrectionPanelVisible(true);

                console.log("2. DEBUG TPanel: State updated from history. selectedOriginalTranslationEntry:", translation, "isCorrectionPanelVisible:", true);
            };
        } else {
            if (window.onTranslationSelect) {
                delete window.onTranslationSelect;
            }
        }

        return () => {
            if (window.onTranslationSelect) {
                delete window.onTranslationSelect;
            }
        };
    }, [user]);

    useEffect(() => {
        console.log("3. DEBUG TPanel: State after render cycle - isCorrectionPanelVisible:", isCorrectionPanelVisible, "selectedOriginalTranslationEntry:", selectedOriginalTranslationEntry);
    }, [isCorrectionPanelVisible, selectedOriginalTranslationEntry]);

    const handleTranslate = async () => {
        if (!sourceText.trim() || !sourceLang || !targetLang) return;

        setIsLoading(true);
        setIsCorrectionPanelVisible(false);
        setSelectedOriginalTranslationEntry(null);
        setTranslatedText('');
        console.log("4. DEBUG TPanel: handleTranslate - States reset.");

        try {
            const result = await translateText(sourceText, sourceLang, targetLang, user ? user.id : null);

            if (typeof result === 'string') {
                // Si la traduction est une simple chaîne (erreur ou réponse non formatée)
                setTranslatedText(result);
                setSelectedOriginalTranslationEntry(null); // Pas d'ID, donc pas de correction
            }
            // MODIFICATION ICI : Assouplir la condition pour permettre l'affichage même si l'ID est null (non connecté)
            else if (result && result.translatedText !== undefined) { // <-- Supprimé 'result.id' de la condition
                setTranslatedText(result.translatedText);
                
                // Si l'ID est null, setSelectedOriginalTranslationEntry sera un objet avec id: null.
                // Cela permettra d'afficher la traduction mais de masquer le bouton de correction.
                setSelectedOriginalTranslationEntry(result); 

                // Logique pour le débogage de l'ID
                if (result.id) {
                    console.log("DEBUG TPanel: Nouvelle traduction enregistrée avec ID DB:", result.id);
                } else {
                    console.log("DEBUG TPanel: Nouvelle traduction (non enregistrée car non connecté). Pas d'ID DB.");
                }
            } else {
                console.error("Translation API returned an unexpected object structure or missing translatedText:", result); // Message d'erreur mis à jour
                setTranslatedText('Erreur de traduction : format de réponse inattendu.');
                setSelectedOriginalTranslationEntry(null);
            }

        } catch (error) {
            console.error('Translation error:', error);
            setTranslatedText('Erreur de traduction. Veuillez réessayer.');
            setSelectedOriginalTranslationEntry(null);
        } finally {
            setIsLoading(false);
        }
    };

    const swapLanguages = () => {
        setSourceLang(targetLang);
        setTargetLang(sourceLang);
        setSourceText(translatedText || '');
        setTranslatedText(sourceText || '');
        setIsCorrectionPanelVisible(false);
        setSelectedOriginalTranslationEntry(null);
        console.log("5. DEBUG TPanel: swapLanguages - States reset.");
    };

    const handleCorrection = (correctedTextFromPanel) => {
        if (correctedTextFromPanel !== undefined && correctedTextFromPanel !== null) {
            setTranslatedText(correctedTextFromPanel);
        }
        setIsCorrectionPanelVisible(false);
        setSelectedOriginalTranslationEntry(null);
        console.log("6. DEBUG TPanel: handleCorrection - States reset after correction/cancel.");
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

                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x md:divide-slate-700/50">
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
                            onChange={() => {}} // Lecture seule
                            placeholder="Traduction..."
                            isReadOnly={true}
                        />
                        {/* Affiche le bouton de correction uniquement si une traduction existe et a un ID */}
                        {translatedText && selectedOriginalTranslationEntry &&
                         selectedOriginalTranslationEntry.id !== undefined && selectedOriginalTranslationEntry.id !== null && (
                            <button
                                onClick={() => {
                                    setIsCorrectionPanelVisible(true);
                                    console.log("DEBUG TPanel: Crayon cliqué. Ouverture correction pour ID:", selectedOriginalTranslationEntry.id);
                                }}
                                className="absolute bottom-3 left-4 p-2 text-yellow-400 hover:text-yellow-300 hover:bg-slate-700/50 rounded-lg transition-all duration-200"
                                title="Corriger la traduction"
                            >
                                <i className="fas fa-edit"></i>
                            </button>
                        )}
                        {/* Message si l'ID est manquant pour la correction (si non connecté) */}
                        {translatedText && (!selectedOriginalTranslationEntry || selectedOriginalTranslationEntry.id === null || selectedOriginalTranslationEntry.id === undefined) && !isLoading && (
                            <span className="absolute bottom-3 left-4 text-red-400 text-sm"></span>
                        )}
                    </div>
                </div>

                <CorrectionPanel
                    originalTranslationEntry={selectedOriginalTranslationEntry}
                    onCorrection={handleCorrection}
                    isVisible={isCorrectionPanelVisible}
                />
            </div>

            <TranslateButton
                onClick={handleTranslate}
                isLoading={isLoading}
                disabled={!sourceText.trim() || !sourceLang || !targetLang}
            />

            <CorrectionHistory user={user} />

        </div>
    );
}

export default TranslationPanel;