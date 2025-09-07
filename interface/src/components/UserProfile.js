import React from 'react';

function UserProfile({ user, onLogout }) {
    try {
        const [isOpen, setIsOpen] = React.useState(false);

        return (
            <div data-name="user-profile" data-file="components/UserProfile.js" className="relative">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center space-x-3 p-3 hover:bg-slate-700/50 rounded-xl transition-all duration-200"
                >
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                        {user.email.charAt(0).toUpperCase()}
                    </div>
                    <i className="fas fa-chevron-down text-slate-400 text-sm"></i>
                </button>

                {isOpen && (
                    <div
                        className="absolute right-0 mt-2 w-72 glass-card z-50" // <-- MODIFICATION ICI : z-10 devient z-50
                    >
                        <div className="p-4 border-b border-slate-700/50">
                            <div className="text-sm font-medium text-slate-100">{user.email}</div>
                            <div className="text-xs text-slate-400 mt-1">
                                Connecté 
                            </div>
                        </div>
                        <div className="p-2">
                            <button
                                onClick={() => {
                                    onLogout();
                                    setIsOpen(false);
                                }}
                                className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-all duration-200"
                            >
                                <i className="fas fa-sign-out-alt mr-3"></i>
                                Se déconnecter
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    } catch (error) {
        console.error('UserProfile component error:', error);
        // Assurez-vous que `reportError` est défini globalement ou importé si vous le décommentez
        // reportError(error);
    }
}

export default UserProfile;