import { useState } from 'react'; // Importer useState explicitement


function LoginModal({ isVisible, onClose, onLogin }) {
    // SUPPRIMEZ le bloc try...catch qui enveloppe le composant entier.
    // Les Hooks DOIVENT être appelés au top niveau du composant.
    const [email, setEmail] = useState(''); // Utilisez useState directement
    const [password, setPassword] = useState(''); // Utilisez useState directement
    const [confirmPassword, setConfirmPassword] = useState(''); // Utilisez useState directement
    const [isLoading, setIsLoading] = useState(false); // Utilisez useState directement
    const [isSignUp, setIsSignUp] = useState(false); // Utilisez useState directement
    const [error, setError] = useState(''); // Utilisez useState directement

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Réinitialiser l'erreur à chaque soumission
        
        if (!email.trim() || !password.trim()) {
            setError('Veuillez remplir tous les champs');
            return;
        }

        if (isSignUp) {
            if (password !== confirmPassword) {
                setError('Les mots de passe ne correspondent pas');
                return;
            }
            if (password.length < 6) {
                setError('Le mot de passe doit contenir au moins 6 caractères');
                return;
            }
        }

        setIsLoading(true);
        try {
            let response;
            let data;

            if (isSignUp) {
                // Logique pour l'inscription (appel au backend /register)
                response = await fetch("http://localhost:5000/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username: email, password: password }) // Utilisez 'username' ou 'email' selon votre backend
                });
                data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || "Erreur lors de la création du compte.");
                }

                alert(data.message || 'Compte créé avec succès ! Vous pouvez maintenant vous connecter.');
                setIsSignUp(false); // Basculer en mode connexion après inscription réussie
                setEmail(''); // Vider les champs
                setPassword('');
                setConfirmPassword('');

            } else {
                // Logique pour la connexion (appel au backend /login)
                response = await fetch("http://localhost:5000/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username: email, password: password }) // Utilisez 'username' ou 'email' selon votre backend
                });
                data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || "Nom d'utilisateur ou mot de passe incorrect.");
                }

                // Connexion réussie, appeler la prop onLogin avec les données utilisateur et le token
                if (onLogin && data.access_token) {
                    onLogin(
                        { id: data.user.id, username: data.user.username, email: email }, // Passez les infos utilisateur
                        data.access_token // Passez le token d'accès
                    );
                    onClose(); // Ferme le modal après connexion réussie
                } else {
                    // Cas où la réponse est OK mais pas de token (improbable avec le backend JWT)
                    throw new Error("Connexion réussie mais token manquant.");
                }
            }

        } catch (err) {
            console.error('Authentication error:', err);
            setError(err.message || 'Une erreur inattendue est survenue.');
        } finally {
            setIsLoading(false);
        }
    };

    const switchMode = () => {
        setIsSignUp(!isSignUp);
        setError(''); // Réinitialiser l'erreur
        setPassword(''); // Vider le mot de passe
        setConfirmPassword(''); // Vider la confirmation du mot de passe
    };

    // Le rendu conditionnel du modal doit être fait en dehors du return null
    if (!isVisible) return null;

    return (
        <div data-name="login-modal" data-file="components/LoginModal.js"
             className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="glass-card p-8 w-96 max-w-md">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-100">
                        {isSignUp ? 'Créer un compte' : 'Se connecter'}
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-200 p-1">
                        <i className="fas fa-times text-xl"></i>
                    </button>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-sm">
                        <i className="fas fa-exclamation-triangle mr-2"></i>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <input
                            type="email" // Changed to email type for better validation in browser
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email" // Changed placeholder from "Email" to match the input type
                            className="w-full p-4 bg-slate-800/50 border border-slate-600/50 rounded-xl text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            required
                            autoComplete="username" // Helps browser autofill
                        />
                    </div>
                    <div className="mb-4">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Mot de passe"
                            className="w-full p-4 bg-slate-800/50 border border-slate-600/50 rounded-xl text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            required
                            autoComplete={isSignUp ? "new-password" : "current-password"} // Helps browser autofill
                        />
                    </div>
                    {isSignUp && (
                        <div className="mb-6">
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirmer le mot de passe"
                                className="w-full p-4 bg-slate-800/50 border border-slate-600/50 rounded-xl text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                required
                                autoComplete="new-password" // Helps browser autofill
                            />
                        </div>
                    )}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl hover:from-blue-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
                    >
                        {isLoading ? 'Chargement...' : (isSignUp ? 'Créer le compte' : 'Se connecter')}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={switchMode}
                        className="text-blue-400 hover:text-blue-300 text-sm transition-colors duration-200"
                    >
                        {isSignUp ? 'Déjà un compte ? Se connecter' : 'Pas de compte ? S\'inscrire'}
                    </button>
                </div>
            </div>
        </div>
    );
    // SUPPRIMEZ le catch ici.
}

export default LoginModal; // Assurez-vous d'avoir cet export par défaut