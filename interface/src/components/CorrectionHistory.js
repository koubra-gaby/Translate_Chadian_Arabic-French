// frontend/src/components/CorrectionHistory.js

import React, { useState, useEffect } from 'react';
import { trickleListObjects } from '../utils/trickleApi';

function CorrectionHistory({ user }) {
    const [translations, setTranslations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        const fetchTranslations = async () => {
            if (!user) {
                setTranslations([]);
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            try {
                const response = await trickleListObjects('translation_correction');

                const validTranslations = response.items
                    .map(item => item.objectData)
                    .filter(item => item.sourceText && item.translatedText);

                const sortedTranslations = validTranslations
                    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

                setTranslations(sortedTranslations);
            } catch (error) {
                console.error("Error fetching translation history:", error);
                setTranslations([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTranslations();

        return () => {
            // Nettoyage si nécessaire
        };
    }, [user]);

    const handleTranslationSelect = (translation) => {
        console.log("DEBUG Frontend: CorrectionHistory - Traduction cliquée, passant à window.onTranslationSelect:", translation);
        if (window.onTranslationSelect) {
            window.onTranslationSelect(translation);
            setIsExpanded(false);
        } else {
            console.warn("window.onTranslationSelect est introuvable. Le panneau de traduction n'est peut-être pas prêt.");
        }
    };

    return (
        <div data-name="correction-history" data-file="components/CorrectionHistory.js"
             className="glass-card mt-6 p-4"> {/* glass-card s'adapte maintenant via index.css */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between
                           text-blue-300 hover:text-blue-200 /* Mode Sombre */
                           light:text-blue-700 light:hover:text-blue-600 /* Mode Clair */
                           transition-colors duration-200"
            >
                <h2 className="text-lg font-semibold">
                    <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'} mr-3 text-sm`}></i>
                    Mon historique de traductions ({translations.length})
                </h2>
                {isLoading && (
                    <i className="fas fa-spinner fa-spin text-blue-400 light:text-blue-600"></i>
                )}
            </button>

            {isExpanded && (
                <div className="mt-4 max-h-80 overflow-y-auto custom-scrollbar">
                    {translations.length === 0 && !isLoading ? (
                        <p className="text-center py-4
                                      text-slate-400 /* Mode Sombre */
                                      light:text-gray-600 /* Mode Clair */">Aucune traduction trouvée.</p>
                    ) : (
                        translations.map((translation) => (
                            <div
                                key={translation.id}
                                onClick={() => handleTranslationSelect(translation)}
                                className="mb-2 p-3 rounded-lg cursor-pointer transition-colors duration-200
                                           bg-slate-800/50 hover:bg-slate-700/70 /* Mode Sombre: Fond gris foncé semi-transparent */
                                           light:bg-gray-100/70 light:hover:bg-gray-200/90 light:shadow-sm /* Mode Clair: Fond gris très clair semi-transparent */
                                           "
                            >
                                <div className="text-xs
                                                text-slate-400 /* Mode Sombre */
                                                light:text-gray-700 /* Mode Clair */">
                                    {translation.timestamp ? new Date(translation.timestamp).toLocaleString('fr-FR') : 'Date inconnue'}
                                    <span className="ml-2 px-2 py-0.5 rounded-full text-xs
                                                   bg-blue-600/30 text-blue-300 /* Mode Sombre: Badge bleu */
                                                   light:bg-blue-100 light:text-blue-800 /* Mode Clair: Badge bleu clair */">
                                        {translation.fromLang} → {translation.toLang}
                                    </span>
                                    {translation.isCorrection && (
                                        <span className="ml-2 px-2 py-0.5 rounded-full text-xs
                                                       bg-yellow-600/30 text-yellow-300 /* Mode Sombre: Badge jaune */
                                                       light:bg-yellow-100 light:text-yellow-800 /* Mode Clair: Badge jaune clair */">
                                            Corrigée
                                        </span>
                                    )}
                                </div>
                                <p className="mt-1
                                            text-slate-200 /* Mode Sombre */
                                            light:text-gray-900 /* Mode Clair: Noir */">Source: <span className="font-medium">{translation.sourceText}</span></p>
                                <p className="
                                            text-slate-100 /* Mode Sombre */
                                            light:text-black /* Mode Clair: Noir pur */">Traduction: <span className="font-medium">{translation.translatedText}</span></p>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

export default CorrectionHistory;