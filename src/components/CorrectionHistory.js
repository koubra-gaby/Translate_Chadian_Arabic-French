// src/components/CorrectionHistory.js

import { useState, useEffect, useCallback } from "react"; // Ajout de useCallback
// Importe la fonction pour obtenir les traductions depuis le backend
import { getTranslationsFromBackend } from "../utils/translator"; // <-- CORRECTION ICI

// Renommée la fonction pour refléter son objectif principal, mais elle reste exportée sous le nom de fichier CorrectionHistory.
function CorrectionHistory({ user }) {
    const [translations, setTranslations] = useState([]);
    const [isVisible, setIsVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Enveloppe loadTranslations dans useCallback pour stabiliser sa référence
    // et éviter le warning ESLint sur useEffect.
    const loadTranslations = useCallback(async () => {
        // Ne charge les traductions que si un utilisateur est connecté (ie. `user` n'est pas null)
        // et qu'il a un ID ou un email valide pour récupérer l'historique.
        if (!user || (!user.id && !user.email)) {
            setTranslations([]); // Vide l'historique si pas d'utilisateur
            setIsLoading(false); // S'assurer que isLoading est désactivé
            return;
        }

        setIsLoading(true);
        try {
            // Appelle getTranslationsFromBackend avec l'ID de l'utilisateur
            const data = await getTranslationsFromBackend(user.id); // <-- Utilise la nouvelle fonction
            setTranslations(data);
        } catch (error) {
            console.error('Error loading translations:', error);
            // reportError(error); // Décommentez si vous avez une fonction reportError globale
            setTranslations([]); // Vide les traductions en cas d'erreur
        } finally {
            setIsLoading(false);
        }
    }, [user]); // loadTranslations dépend maintenant de 'user'

    useEffect(() => {
        // Déclenche le chargement si isVisible change OU si l'utilisateur change (connexion/déconnexion)
        // et seulement si le modal est visible.
        if (isVisible) {
            loadTranslations();
        } else {
            // Si le modal n'est pas visible, on vide les traductions pour ne pas garder de données obsolètes
            // et économiser de la mémoire, mais pas obligatoire.
            setTranslations([]);
        }
    }, [isVisible, user, loadTranslations]); // <-- CORRECTION ICI : Ajout de loadTranslations aux dépendances

    const handleTranslationClick = (translation) => {
        // Cette fonction permet de réutiliser une traduction passée.
        // Vous devrez implémenter `window.onTranslationSelect` dans votre composant parent (TranslationPanel)
        // pour que cela fonctionne et mette à jour les champs source/cible.
        if (window.onTranslationSelect) {
            window.onTranslationSelect(translation);
            // Optionnel: fermer l'historique après avoir sélectionné une traduction
            setIsVisible(false);
        }
    };

    // Le rendu du composant
    return (
        <div data-name="translation-history" className="mt-4">
            <button
                onClick={() => setIsVisible(!isVisible)}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 text-sm"
                // Désactiver le bouton si aucun utilisateur n'est connecté et l'historique n'est pas visible
                // Pour éviter des appels inutiles à loadTranslations.
                disabled={!user && !isVisible}
            >
                <i className={`fas fa-chevron-${isVisible ? 'up' : 'down'}`}></i>
                {/* Le texte du bouton changera selon que l'utilisateur est connecté ou non */}
                <span>
                    {user ? `Mes traductions (${translations.length})` : 'Historique (Connexion requise)'}
                </span>
            </button>

            {isVisible && (
                <div className="mt-3 bg-white border rounded-lg shadow-sm max-h-64 overflow-y-auto">
                    {/* Condition pour afficher le message si pas d'utilisateur connecté */}
                    {!user ? (
                        <div className="p-4 text-center text-gray-500">
                            Connectez-vous pour voir votre historique de traductions.
                        </div>
                    ) : isLoading ? (
                        <div className="p-4 text-center text-gray-500">
                            Chargement...
                        </div>
                    ) : translations.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                            Aucune traduction enregistrée.
                        </div>
                    ) : (
                        translations.map((translation, index) => (
                            <div key={index}
                                 className="p-3 border-b last:border-b-0 hover:bg-gray-50 cursor-pointer"
                                 onClick={() => handleTranslationClick(translation)}>
                                <div className="text-sm text-gray-600 mb-1">
                                    {/* Affiche la date/heure et les langues */}
                                    {new Date(translation.timestamp).toLocaleString('fr-FR')}
                                    <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                        {translation.fromLang} → {translation.toLang}
                                    </span>
                                </div>
                                <div className="text-sm">
                                    {/* Affiche le texte source et la traduction */}
                                    <div className="text-gray-800 mb-1">
                                        <strong>Source:</strong> {translation.sourceText}
                                    </div>
                                    <div className="text-blue-600">
                                        <strong>Traduction:</strong> {translation.translatedText}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

export default CorrectionHistory;