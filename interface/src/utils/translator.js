// src/utils/translator.js

const TRANSLATIONS_STORAGE_KEY = 'translation_history_guest';

/**
 * Appelle le backend Flask pour obtenir la traduction.
 * @param {string} text - Le texte à traduire.
 * @param {string} sourceLang - La langue source.
 * @param {string} targetLang - La langue cible.
 * @param {string | null} userId - L'ID de l'utilisateur connecté, ou null si non connecté.
 * @returns {Promise<object | string>} L'objet complet de la traduction (avec ID) ou un message d'erreur sous forme de chaîne.
 */
async function invokeAIAgent(text, sourceLang, targetLang, userId = null) {
    try {
        const token = userId ? localStorage.getItem('authToken') : null;
        const headers = {
            "Content-Type": "application/json",
            "Accept": "application/json"
        };
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        // IMPORTANT: Envoyer les données à Flask en utilisant snake_case, car votre route Flask l'attend.
        const res = await fetch('http://localhost:5000/api/translate', {
            method: "POST",
            headers: headers,
            body: JSON.stringify({
                source_text: text, // Flask attend source_text
                from_lang: sourceLang,   // Flask attend from_lang
                to_lang: targetLang,     // Flask attend to_lang
                user_id: userId          // Flask attend user_id
            })
        });

        if (!res.ok) {
            const errorPayload = await res.json().catch(() => ({}));
            console.error(`HTTP error ${res.status} from /translate:`, errorPayload.error || res.statusText);
            return errorPayload.error || "Erreur de traduction.";
        }

        const payload = await res.json();
        // Le payload reçu ici sera en camelCase d'après to_dict() de Flask
        console.log("translator.js: Réponse de l'API /api/translate (objet complet):", payload);
        return payload;
    } catch (error) {
        console.error("Fetch error to /translate:", error);
        return "Erreur de connexion au service.";
    }
}

/**
 * Fonction de haut niveau pour traduire le texte.
 * Elle délègue la logique de sauvegarde au backend si un userId est fourni.
 *
 * @param {string} text - Le texte à traduire.
 * @param {string} sourceLang - La langue source.
 * @param {string} targetLang - La langue cible.
 * @param {string | null} userId - L'ID de l'utilisateur connecté, ou null si non connecté.
 * @returns {Promise<object | string>} L'objet traduit complet (avec ID) ou un message d'erreur.
 */
export async function translateText(text, sourceLang, targetLang, userId = null) {
  const result = await invokeAIAgent(text, sourceLang, targetLang, userId);

  // Si 'result' est une chaîne, c'est un message d'erreur de invokeAIAgent.
  if (typeof result === 'string') {
      return result; // Retourne directement le message d'erreur
  }

  // Si userId est null (utilisateur non connecté) et que la traduction est réussie,
  // vous pouvez choisir de la sauvegarder localement ici si vous le souhaitez.
  // Utilise translatedText (camelCase) ici
  if (!userId && result && result.translatedText) {
      console.log("Traduction effectuée pour un utilisateur non connecté (pas de sauvegarde backend).");
      // Exemple pour les non-connectés si vous avez une gestion locale:
      // saveTranslationLocally({
      //     id: `local-${Date.now()}`, // Un ID unique pour le stockage local
      //     sourceText: text, // Utilise camelCase pour la cohérence locale
      //     translatedText: result.translatedText,
      //     fromLang: sourceLang,
      //     toLang: targetLang,
      //     timestamp: new Date().toISOString(),
      //     userId: null
      // });
  }

  // Retourne l'objet complet de la traduction (incluant l'ID de la base de données).
  return result;
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
        const token = localStorage.getItem('authToken');
        if (!token) {
            console.warn("Token d'authentification manquant. Impossible de récupérer l'historique utilisateur.");
            return [];
        }

        const res = await fetch("http://localhost:5000/api/get_translations", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (!res.ok) {
            const errorPayload = await res.json().catch(() => ({}));
            console.error(`HTTP error ${res.status} from /get_translations:`, errorPayload.error || res.statusText);
            return [];
        }

        const data = await res.json();
        // Les données reçues ici seront en camelCase d'après to_dict() de Flask via get_translations
        return data;
    } catch (error) {
        console.error("Fetch error to /get_translations:", error);
        return [];
    }
}

// Fonctions de stockage local (si vous les utilisez pour les utilisateurs non connectés)
export function saveTranslationLocally(translation) {
    try {
        const existingTranslations = getTranslationsLocally();
        const newTranslations = [translation, ...existingTranslations];
        const limitedTranslations = newTranslations.slice(0, 50);
        localStorage.setItem(TRANSLATIONS_STORAGE_KEY, JSON.stringify(limitedTranslations));
    } catch (error) {
        console.error("Error saving translation to local storage:", error);
    }
}

export function getTranslationsLocally() {
    try {
        const translationsString = localStorage.getItem(TRANSLATIONS_STORAGE_KEY);
        return translationsString ? JSON.parse(translationsString) : [];
    } catch (error) {
        console.error("Error retrieving translations from local storage:", error);
        return [];
    }
}