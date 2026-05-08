// src/utils/translator.js

// Clé pour stocker les traductions dans le localStorage (optionnel si tout est géré par le backend)
// Je la laisse pour l'instant si vous décidez d'avoir un historique local pour les utilisateurs non-connectés,
// mais la logique actuelle se concentre sur le backend pour les utilisateurs connectés.
const TRANSLATIONS_STORAGE_KEY = 'translation_history_guest';

/**
 * Appelle le backend Flask pour obtenir la traduction.
 * @param {string} text - Le texte à traduire.
 * @param {string} sourceLang - La langue source.
 * @param {string} targetLang - La langue cible.
 * @returns {Promise<string>} La traduction du texte ou un message d'erreur.
 */
async function invokeAIAgent(text, sourceLang, targetLang) {
    try {
        const res = await fetch("http://localhost:5000/translate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({ text, sourceLang, targetLang })
        });

        if (!res.ok) {
            const errorPayload = await res.json().catch(() => ({}));
            console.error(`HTTP error ${res.status} from /translate:`, errorPayload.error || res.statusText);
            return errorPayload.error || "Erreur de traduction.";
        }

        const payload = await res.json();
        return payload.translatedText || "Erreur de traduction.";
    } catch (error) {
        console.error("Fetch error to /translate:", error);
        return "Erreur de connexion au service.";
    }
}

/**
 * Fonction de haut niveau pour traduire le texte.
 * Elle sauvegarde la traduction dans le backend si un userId est fourni,
 * sinon elle ne sauvegarde pas l'historique (pour les non-connectés).
 *
 * @param {string} text - Le texte à traduire.
 * @param {string} sourceLang - La langue source.
 * @param {string} targetLang - La langue cible.
 * @param {string | null} userId - L'ID de l'utilisateur connecté, ou null si non connecté.
 * @returns {Promise<string>} Le texte traduit.
 */
export async function translateText(text, sourceLang, targetLang, userId = null) {
  const translated = await invokeAIAgent(text, sourceLang, targetLang);

  // Sauvegarde la traduction dans le backend si elle a réussi ET qu'un utilisateur est connecté
  if (translated && !translated.startsWith("Erreur") && userId) {
    await saveTranslationToBackend({
      sourceText: text,
      translatedText: translated,
      fromLang: sourceLang,
      toLang: targetLang,
      timestamp: new Date().toISOString()
    }, userId);
  } else if (!userId) {
      console.log("Traduction effectuée sans sauvegarde (utilisateur non connecté).");
      // Si vous voulez conserver un historique local pour les invités, implémentez-le ici
      // saveTranslationLocally({ /* ... */ });
  }

  return translated.trim();
}

/**
 * Sauvegarde une traduction dans le backend.
 * Cette fonction est appelée par `translateText` si un utilisateur est connecté.
 * @param {object} translationData - L'objet traduction à sauvegarder.
 * @param {string} translationData.sourceText - Le texte original.
 * @param {string} translationData.translatedText - Le texte traduit.
 * @param {string} translationData.fromLang - La langue source.
 * @param {string} translationData.toLang - La langue cible.
 * @param {string} translationData.timestamp - Le timestamp de la traduction.
 * @param {string} userId - L'ID de l'utilisateur connecté.
 * @returns {Promise<object>} La réponse du backend ou une erreur.
 */
export async function saveTranslationToBackend(translationData, userId) {
    if (!userId) {
        console.error("Impossible de sauvegarder la traduction au backend: userId manquant.");
        throw new Error("Utilisateur non authentifié.");
    }

    try {
        const token = localStorage.getItem('authToken'); // Récupère le token JWT
        if (!token) {
            console.error("Token d'authentification manquant. Connexion requise pour sauvegarder.");
            throw new Error("Token d'authentification manquant.");
        }

        const res = await fetch("http://localhost:5000/save_translation", { // Endpoint Flask
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` // Inclut le token dans l'en-tête Authorization
            },
            body: JSON.stringify({ ...translationData, userId: userId })
        });

        if (!res.ok) {
            const errorPayload = await res.json().catch(() => ({}));
            console.error(`HTTP error ${res.status} from /save_translation:`, errorPayload.error || res.statusText);
            throw new Error(errorPayload.error || "Échec de l'enregistrement de la traduction.");
        }

        const payload = await res.json();
        console.log("Traduction sauvegardée avec succès sur le backend:", payload);
        return payload;
    } catch (error) {
        console.error("Fetch error to /save_translation:", error);
        throw error; // Propage l'erreur pour que le composant puisse la gérer
    }
}

/**
 * Récupère l'historique des traductions depuis le backend pour un utilisateur spécifique.
 * @param {string} userId - L'ID de l'utilisateur pour lequel récupérer l'historique.
 * @returns {Promise<Array<object>>} Un tableau d'objets traduction.
 */
export async function getTranslationsFromBackend(userId) {
    if (!userId) {
        console.error("Impossible de récupérer l'historique: userId manquant.");
        return [];
    }

    try {
        const token = localStorage.getItem('authToken'); // Récupère le token JWT
        if (!token) {
            console.warn("Token d'authentification manquant. Impossible de récupérer l'historique utilisateur.");
            return [];
        }

        const res = await fetch("http://localhost:5000/get_translations", { // Endpoint Flask
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` // Inclut le token dans l'en-tête Authorization
            }
        });

        if (!res.ok) {
            const errorPayload = await res.json().catch(() => ({}));
            console.error(`HTTP error ${res.status} from /get_translations:`, errorPayload.error || res.statusText);
            return [];
        }

        const data = await res.json();
        return data; // Devrait être un tableau de traductions
    } catch (error) {
        console.error("Fetch error to /get_translations:", error);
        return [];
    }
}

// ANCIENNES FONCTIONS (maintenues mais non utilisées par la nouvelle logique si un user est connecté)
// Si vous voulez conserver un historique local pour les utilisateurs NON connectés,
// vous devrez appeler ces fonctions depuis translateText ou CorrectionHistory si user est null.

/**
 * Sauvegarde une traduction dans le stockage local du navigateur (pour les non-connectés/invités).
 * @param {object} translation - L'objet traduction à sauvegarder.
 * @param {string} translation.sourceText - Le texte original.
 * @param {string} translation.sourceText - Le texte original.
 * @param {string} translation.translatedText - Le texte traduit.
 * @param {string} translation.fromLang - La langue source.
 * @param {string} translation.toLang - La langue cible.
 * @param {string} translation.timestamp - Le timestamp de la traduction.
 */
export function saveTranslationLocally(translation) {
    try {
        const existingTranslations = getTranslationsLocally(); // Utilise la fonction locale
        const newTranslations = [translation, ...existingTranslations];
        const limitedTranslations = newTranslations.slice(0, 50); // Limite à 50
        localStorage.setItem(TRANSLATIONS_STORAGE_KEY, JSON.stringify(limitedTranslations));
    } catch (error) {
        console.error("Error saving translation to local storage:", error);
    }
}

/**
 * Récupère l'historique des traductions depuis le stockage local du navigateur (pour les non-connectés/invités).
 * @returns {Array<object>} Un tableau d'objets traduction.
 */
export function getTranslationsLocally() {
    try {
        const translationsString = localStorage.getItem(TRANSLATIONS_STORAGE_KEY);
        return translationsString ? JSON.parse(translationsString) : [];
    } catch (error) {
        console.error("Error retrieving translations from local storage:", error);
        return [];
    }
}

