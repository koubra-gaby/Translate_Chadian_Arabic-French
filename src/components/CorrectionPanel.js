import  { useState, useEffect } from "react";
import { saveCorrection } from "../utils/corrections"; // Adjust the import path as needed

function CorrectionPanel({ translatedText, onCorrection, isVisible }) {
    const [correctedText, setCorrectedText] = useState('');
    const [feedback, setFeedback] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setCorrectedText(translatedText);
    }, [translatedText]);

    const handleSubmitCorrection = async () => {
        if (!correctedText.trim()) return;

        setIsSubmitting(true);
        try {
            await saveCorrection({
                originalTranslation: translatedText,
                correctedTranslation: correctedText,
                feedback: feedback,
                timestamp: new Date().toISOString()
            });
            onCorrection(correctedText);
            setFeedback('');
            alert('Correction enregistrée avec succès !');
        } catch (error) {
            console.error("Error saving correction:", error);
            reportError(error);
            alert("Erreur lors de l'enregistrement");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isVisible) return null;

    return (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="text-sm font-medium text-yellow-800 mb-3">
                <i className="fas fa-edit mr-2"></i>
                Corriger la traduction
            </h3>

            <textarea
                value={correctedText}
                onChange={(e) => setCorrectedText(e.target.value)}
                className="w-full h-24 p-3 border border-yellow-300 rounded-md resize-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Modifiez la traduction ici..."
            />

            <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full h-16 mt-2 p-3 border border-yellow-300 rounded-md resize-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Commentaire optionnel sur la correction..."
            />

            <div className="flex justify-end mt-3 space-x-2">
                <button
                    onClick={() => onCorrection(null)}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                >
                    Annuler
                </button>
                <button
                    onClick={handleSubmitCorrection}
                    disabled={isSubmitting || !correctedText.trim()}
                    className="px-4 py-2 bg-yellow-600 text-white text-sm rounded-md hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? "Enregistrement..." : "Enregistrer"}
                </button>
            </div>
        </div>
    );
}

export default CorrectionPanel;
