// src/utils/trickleApi.js

// Fausse API pour tester
export async function trickleCreateObject(type, data) {
    console.log(`Création de l'objet: type=${type}`, data);
    return { success: true, data };
}

export async function trickleListObjects(type, limit = 50) {
    console.log(`Liste des objets de type: ${type}, limite=${limit}`);
    return { items: [] }; // Retourne un tableau vide pour éviter les erreurs
}
