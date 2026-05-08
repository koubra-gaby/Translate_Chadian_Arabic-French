import UserProfile from "./UserProfile"; // Assurez-vous que ce chemin est correct
function Header({ user, onLoginClick, onLogout }) {
    try {
        return (
            <header data-name="header" data-file="components/Header.js" className="glass-header shadow-xl">
                <div className="max-w-7xl mx-auto px-6 py-5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                                <i className="fas fa-language text-white text-xl"></i>
                            </div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                Traducteur
                            </h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            {user && (
                                <button className="p-3 hover:bg-slate-700/50 rounded-xl transition-all duration-200">
                                    <i className="fas fa-star text-yellow-400 text-lg"></i>
                                </button>
                            )}
                            {user ? (
                                <UserProfile user={user} onLogout={onLogout} />
                            ) : (
                                <button
                                    onClick={onLoginClick}
                                    className="flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-500 hover:to-purple-500 transition-all duration-200 shadow-lg hover:shadow-xl"
                                >
                                    <i className="fas fa-user"></i>
                                    <span className="font-medium">Connexion</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </header>
        );
    } catch (error) {
        console.error('Header component error:', error);
        reportError(error);
    }
}
export default Header;
