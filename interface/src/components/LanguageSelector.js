function LanguageSelector({ value, onChange, languages, placeholder }) {
    try {
        return (
            <div data-name="language-selector" data-file="components/LanguageSelector.js" className="relative">
                <select 
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="appearance-none bg-slate-800/50 border border-slate-600/50 text-sm font-medium text-blue-400 hover:bg-slate-700/50 px-4 py-3 rounded-xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                >
                    <option value="" className="bg-slate-800 text-slate-300">{placeholder}</option>
                    {languages.map(lang => (
                        <option key={lang.code} value={lang.code} className="bg-slate-800 text-slate-300">
                            {lang.name}
                        </option>
                    ))}
                </select>
                <i className="fas fa-chevron-down absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400 pointer-events-none"></i>
            </div>
        );
    } catch (error) {
        console.error('LanguageSelector component error:', error);
        reportError(error);
    }
}

export default LanguageSelector;