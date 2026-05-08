function TranslateButton({ onClick, isLoading, disabled }) {
    try {
        return (
            <div data-name="translate-button" data-file="components/TranslateButton.js" className="flex justify-center my-8">
                <button
                    onClick={onClick}
                    disabled={disabled || isLoading}
                    className={`translate-btn px-10 py-4 text-white font-semibold text-lg ${
                        disabled || isLoading 
                            ? 'opacity-50 cursor-not-allowed' 
                            : 'hover:shadow-2xl transform hover:-translate-y-1'
                    } transition-all duration-300`}
                >
                    {isLoading ? (
                        <div className="flex items-center space-x-3">
                            <div className="loading-dots w-2 h-2 bg-white rounded-full"></div>
                            <div className="loading-dots w-2 h-2 bg-white rounded-full" style={{animationDelay: '0.2s'}}></div>
                            <div className="loading-dots w-2 h-2 bg-white rounded-full" style={{animationDelay: '0.4s'}}></div>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-3">
                            <i className="fas fa-exchange-alt"></i>
                            <span>Traduire</span>
                        </div>
                    )}
                </button>
            </div>
        );
    } catch (error) {
        console.error('TranslateButton component error:', error);
        reportError(error);
    }
}

export default TranslateButton;