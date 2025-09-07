// src/utils/trickleApi.js

// Fonction utilitaire pour récupérer le token JWT
function getAuthToken() {
    const token = localStorage.getItem('authToken');
    if (!token) {
        console.error("Token d'authentification manquant.");
        throw new Error("Authentification requise. Veuillez vous connecter.");
    }
    return token;
}

// Fonction pour créer un objet (utilisée pour les corrections)
export async function trickleCreateObject(type, data) {
    console.log(`Tentative de création d'objet réel: type=${type}`, data);

    if (type === 'translation_correction') {
        const token = getAuthToken();
        try {
            const response = await fetch("http://localhost:5000/api/save_correction", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error(`Erreur HTTP lors de la sauvegarde de la correction: ${response.status}`, errorData);
                throw new Error(errorData.error || `Échec de la sauvegarde de la correction: ${response.statusText}`);
            }

            const result = await response.json();
            console.log("Correction enregistrée avec succès via l'API réelle:", result);
            return result; // Retourne le message du backend
        } catch (error) {
            console.error('Erreur lors de l\'appel API save_correction:', error);
            throw error;
        }
    } else {
        // Pour les autres types, vous pouvez garder le comportement simulé ou ajouter d'autres logiques API
        console.warn(`Type de création d'objet non géré par l'API réelle: ${type}. Comportement par défaut.`);
        return { success: false, message: "Type d'objet non supporté par l'API réelle." };
    }
}

// Fonction pour lister les objets (utilisée pour l'historique des traductions, y compris les corrections)
export async function trickleListObjects(type, limit = 50, includeDetails = false) {
    console.log(`Tentative de lister les objets réels: type=${type}, limite=${limit}`);

    if (type === 'translation_correction') {
        // Pour l'historique, nous allons appeler votre route get_translations
        const token = getAuthToken();
        try {
            const response = await fetch("http://localhost:5000/api/get_translations", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }

            });
        
            if (!response.ok) {
                const errorData = await response.json();
                console.error(`Erreur HTTP lors de la récupération des traductions/corrections: ${response.status}`, errorData);
                throw new Error(errorData.error || `Échec de la récupération: ${response.statusText}`);
            }

            const items = await response.json();
            console.log("Données d'historique récupérées avec succès:", items);
            // La route get_translations renvoie directement le tableau des items
            // Donc, nous mappons simplement pour correspondre à la structure attendue par correction.js si nécessaire
            return { items: items.map(item => ({ objectData: item })) };
            

        } catch (error) {
            console.error('Erreur lors de l\'appel API get_translations:', error);
            throw error;
        }
    } else {
        // Pour les autres types, vous pouvez garder le comportement simulé ou ajouter d'autres logiques API
        console.warn(`Type de liste d'objets non géré par l'API réelle: ${type}. Comportement par défaut.`);
        return { items: [] }; // Retourne un tableau vide
    }
}