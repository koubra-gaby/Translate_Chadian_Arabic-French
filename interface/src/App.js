// src/App.js
import { useState, useEffect } from 'react';
import Header from './components/Header';
import TranslationPanel from './components/TranslationPanel';
import LoginModal from './components/LoginModal';

function App() {
    const [user, setUser] = useState(null);
    const [showLoginModal, setShowLoginModal] = useState(false);

    const [theme, setTheme] = useState(() => {
        // Lire le thème préféré du système si disponible
        const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
        // Lire le thème sauvegardé en dernier
        const savedTheme = localStorage.getItem('theme');

        if (savedTheme) {
            return savedTheme;
        } else if (prefersLight) {
            return 'light'; // Utiliser le thème clair si le système le préfère et aucun n'est sauvegardé
        }
        return 'dark'; // Par défaut au mode sombre si rien n'est préféré ou sauvegardé
    });

    useEffect(() => {
        const root = window.document.documentElement; // Ceci est l'élément <html>

        // Supprime les deux classes pour éviter les conflits
        root.classList.remove('dark', 'light');

        // Applique la classe 'light' si le thème est 'light'
        if (theme === 'light') {
            root.classList.add('light');
        }
        // Si le thème est 'dark', aucune classe n'est ajoutée, les styles par défaut (sombres) s'appliquent.

        localStorage.setItem('theme', theme);
    }, [theme]);

    const handleLogin = (userData) => {
        setUser(userData);
        localStorage.setItem('translatorUser', JSON.stringify(userData));
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('translatorUser');
    };

    useEffect(() => {
        const savedUser = localStorage.getItem('translatorUser');
        if (savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch (error) {
                console.error('Error parsing saved user data from localStorage:', error);
                localStorage.removeItem('translatorUser');
            }
        }
    }, []);

    return (
        <div data-name="app" data-file="app.js" className="min-h-screen">
            <Header
                user={user}
                onLoginClick={() => setShowLoginModal(true)}
                onLogout={handleLogout}
                onToggleTheme={() => setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'))}
                currentTheme={theme}
            />
            <main className="py-12">
                <TranslationPanel user={user} /> {/* Plus besoin de passer les props de thème ici, le panneau utilise le thème global de HTML */}
            </main>
            
            <LoginModal
                isVisible={showLoginModal}
                onClose={() => setShowLoginModal(false)}
                onLogin={handleLogin}
            />
        </div>
    );
}

export default App;