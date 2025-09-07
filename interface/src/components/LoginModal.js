// src/components/LoginModal.js (CODE CORRECT ET FINAL)
import React, { useState } from 'react';

function LoginModal({ isVisible, onClose, onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (!email.trim() || !password.trim()) {
            setError('Veuillez remplir tous les champs.');
            return;
        }

        if (isSignUp) {
            if (password !== confirmPassword) {
                setError('Les mots de passe ne correspondent pas.');
                return;
            }
            if (password.length < 6) {
                setError('Le mot de passe doit contenir au moins 6 caractères.');
                return;
            }
        }

        setIsLoading(true);
        try {
            let response;
            let data;
            
            if (isSignUp) {
                // Requête d'inscription (vers /register)
                response = await fetch('http://localhost:5000/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                data = await response.json();

                if (!response.ok) {
                    setError(data.error || 'Erreur lors de la création du compte.');
                    return;
                }
                alert('Compte créé avec succès ! Veuillez vous connecter.');
                setIsSignUp(false); // Passe en mode connexion après inscription réussie
                setEmail('');
                setPassword('');
                setConfirmPassword('');
                setIsLoading(false);
                return; // Sort de la fonction après l'inscription
            } else {
                // Requête de connexion (vers /login)
                response = await fetch('http://localhost:5000//api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                data = await response.json();

                if (!response.ok) {
                    setError(data.error || 'Identifiants incorrects.');
                    return;
                }

                const { access_token, user_id, email: userEmail } = data;

                localStorage.setItem('authToken', access_token);
                
                onLogin({
                    id: user_id,
                    email: userEmail,
                    token: access_token
                });
                
                setEmail('');
                setPassword('');
                setConfirmPassword('');
                setError('');
                onClose();
            }
        } catch (err) {
            console.error('Network or server error:', err);
            setError('Erreur de connexion au serveur. Veuillez réessayer plus tard.');
        } finally {
            setIsLoading(false);
        }
    };

    const switchMode = () => {
        setIsSignUp(!isSignUp);
        setError('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
    };

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
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            className="w-full p-4 bg-slate-800/50 border border-slate-600/50 rounded-xl text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            required
                            autoComplete={isSignUp ? "new-email" : "username"}
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
                            autoComplete={isSignUp ? "new-password" : "current-password"}
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
                                autoComplete="new-password"
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
}

export default LoginModal;