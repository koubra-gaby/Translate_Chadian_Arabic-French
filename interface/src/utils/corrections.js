// frontend/src/utils/correction.js

import { trickleCreateObject, trickleListObjects } from './trickleApi';

/**
 * Sauvegarde une correction de traduction dans la base de données.
 * @param {object} correctionData - Les données de la correction (en camelCase depuis le frontend).
 * @param {string} correctionData.originalTranslationSource - Le texte source original.
 * @param {string} correctionData.originalTranslationText - La traduction originale (utilisée pour l'affichage uniquement, non envoyé au backend Flask).
 * @param {string} correctionData.correctedText - Le texte corrigé.
 * @param {string} correctionData.fromLang - La langue source.
 * @param {string} correctionData.toLang - La langue cible.
 * @param {number} correctionData.originalTranslationId - L'ID de la traduction originale dans la DB.
 */
async function saveCorrection(correctionData) {
    console.log("DEBUG corrections.js: Données de correction reçues (camelCase):", correctionData);

    // CONVERSION DES DONNÉES DE CAMELCASE EN SNAKE_CASE POUR LE BACKEND FLASK
    const payloadForBackend = {
        source_text: correctionData.originalTranslationSource, // Mappe originalTranslationSource (camelCase) à source_text (snake_case)
        translated_text: correctionData.correctedText,         // Mappe correctedText (camelCase) à translated_text (snake_case)
        from_lang: correctionData.fromLang,
        to_lang: correctionData.toLang,
        is_correction: true,                                   // Force à true pour le backend
        original_translation_id: correctionData.originalTranslationId // Mappe originalTranslationId (camelCase) à original_translation_id (snake_case)
    };

    try {
        // Le type 'translation_correction' sera intercepté par trickleCreateObject pour appeler /api/save_correction
        // Nous passons le payload déjà converti en snake_case.
        const correction = await trickleCreateObject('translation_correction', payloadForBackend);
        console.log("DEBUG corrections.js: Correction sauvegardée avec succès:", correction);
        return correction;
    } catch (error) {
        console.error('Error saving correction in corrections.js:', error);
        throw error; // Propager l'erreur pour qu'elle soit gérée par CorrectionPanel
    }
}

/**
 * Récupère toutes les traductions et corrections de l'historique de l'utilisateur.
 * Filtre ensuite pour ne garder que les entrées marquées comme des corrections.
 */
async function getCorrections() {
    try {
        // Appelle trickleListObjects qui appellera get_translations_api
        const result = await trickleListObjects('translation_correction'); // Le type sert à déclencher la logique API
        // result.items contiendra un tableau d'objets où chaque élément est { objectData: { ... traduction réelle ... } }
        // Les données de objectData sont déjà en camelCase grâce à Translation.to_dict() du backend
        const corrections = result.items
            .filter(item => item.objectData && item.objectData.isCorrection === true) // isCorrection est en camelCase ici
            .map(item => item.objectData); // Extrait juste l'objet de données de la correction

        return corrections;
    } catch (error) {
        console.error('Error fetching corrections:', error);
        return [];
    }
}

async function updateTranslationWithCorrections(text, fromLang, toLang) {
    try {
        const corrections = await getCorrections();
        const relevantCorrections = corrections.filter(c =>
            // Utilisez les champs en camelCase qui viennent de Translation.to_dict() du backend
            c.sourceText &&
            c.sourceText.toLowerCase().includes(text.toLowerCase().substring(0, 50))
            // Ajoutez ici d'autres critères si nécessaire, comme fromLang et toLang pour une meilleure correspondance
        );

        if (relevantCorrections.length > 0) {
            const contextPrompt = relevantCorrections.map(c =>
                // Utilisez les champs en camelCase pour construire le prompt
                `Original: "${c.sourceText}" -> Corrected: "${c.translatedText}"`
            ).join('\n');

            return contextPrompt;
        }

        return '';
    } catch (error) {
        console.error('Error getting correction context:', error);
        return '';
    }
}

export { saveCorrection, getCorrections, updateTranslationWithCorrections };