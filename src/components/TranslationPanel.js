import { useState } from "react"; // Ajoute `useState`
import LanguageSelector from "./LanguageSelector";
import TextArea from "./TextArea";
import TranslateButton from "./TranslateButton";
import CorrectionPanel from "./CorrectionPanel";
import CorrectionHistory from "./CorrectionHistory";
import { translateText } from "../utils/translator";

function TranslationPanel() {
    const [sourceText, setSourceText] = useState('');
    const [translatedText, setTranslatedText] = useState('');
    const [sourceLang, setSourceLang] = useState('ar-TD');
    const [targetLang, setTargetLang] = useState('fr');
    const [isLoading, setIsLoading] = useState(false);
    const [showCorrection, setShowCorrection] = useState(false);

    const languages = [
        { code: "fr", name: "Français" },
        { code: "ar-TD", name: "arabe" }
    ];

    const handleTranslate = async () => {
        if (!sourceText.trim() || !sourceLang || !targetLang) return;

        setIsLoading(true);
        setShowCorrection(false);
        try {
            const result = await translateText(sourceText, sourceLang, targetLang);
            setTranslatedText(result);
        } catch (error) {
            console.error("Translation error:", error);
            reportError(error);
            setTranslatedText("Erreur de traduction. Veuillez réessayer.");
        } finally {
            setIsLoading(false);
        }
    };

    const swapLanguages = () => {
        setSourceLang(targetLang);
        setTargetLang(sourceLang);
        setSourceText(translatedText);
        setTranslatedText(sourceText);
        setShowCorrection(false);
    };

    const handleCorrection = (correctedText) => {
        if (correctedText) {
            setTranslatedText(correctedText);
        }
        setShowCorrection(false);
    };

    return (
        <div className="translate-container">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="flex items-center justify-between p-4 bg-gray-50 border-b">
                    <LanguageSelector
                        value={sourceLang}
                        onChange={setSourceLang}
                        languages={languages}
                        placeholder="Détecter la langue"
                    />
                    <button
                        onClick={swapLanguages}
                        className="language-swap-btn p-2 hover:bg-white rounded-full"
                    >
                        <i className="fas fa-exchange-alt text-blue-600"></i>
                    </button>
                    <LanguageSelector
                        value={targetLang}
                        onChange={setTargetLang}
                        languages={languages}
                        placeholder="Choisir la langue"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x">
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
                            onChange={() => {}}
                            placeholder="Traduction..."
                            isReadOnly={true}
                        />
                        {translatedText && (
                            <button
                                onClick={() => setShowCorrection(true)}
                                className="absolute bottom-2 left-2 p-2 text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50 rounded-full"
                                title="Corriger la traduction"
                            >
                                <i className="fas fa-edit"></i>
                            </button>
                        )}
                    </div>
                </div>

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

            <CorrectionHistory />
        </div>
    );
}

export default TranslationPanel;
