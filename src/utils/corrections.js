import { trickleCreateObject, trickleListObjects } from './trickleApi';

async function saveCorrection(correctionData) {
    try {
        const correction = await trickleCreateObject('translation_correction', correctionData);
        return correction;
    } catch (error) {
        console.error('Error saving correction:', error);
        throw error;
    }
}

async function getCorrections() {
    try {
        const result = await trickleListObjects('translation_correction', 50, true);
        return result.items.map(item => item.objectData);
    } catch (error) {
        console.error('Error fetching corrections:', error);
        return [];
    }
}

async function updateTranslationWithCorrections(text, fromLang, toLang) {
    try {
        const corrections = await getCorrections();
        const relevantCorrections = corrections.filter(c => 
            c.originalTranslation && 
            c.originalTranslation.toLowerCase().includes(text.toLowerCase().substring(0, 50))
        );
        
        if (relevantCorrections.length > 0) {
            const contextPrompt = relevantCorrections.map(c => 
                `Original: "${c.originalTranslation}" -> Corrected: "${c.correctedTranslation}"`
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