import React from 'react';

function TextArea({ value, onChange, placeholder, maxLength = 5000, isReadOnly = false }) {
    try {
        const [isFocused, setIsFocused] = React.useState(false);
        
        return (
            <div data-name="text-area" data-file="components/TextArea.js" 
                 className={`text-area-container relative ${isFocused ? 'ring-2 ring-blue-500' : ''}`}>
                <textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder={placeholder}
                    maxLength={maxLength}
                    readOnly={isReadOnly}
                    className={`w-full h-48 p-6 resize-none border-none outline-none text-lg bg-transparent ${
                        isReadOnly ? 'text-slate-300' : 'text-slate-100'
                    } placeholder-slate-500`}
                />
                <div className="absolute bottom-3 right-4 text-xs text-slate-500 font-medium">
                    {value.length}/{maxLength}
                </div>
                {value && !isReadOnly && (
                    <button
                        onClick={() => onChange('')}
                        className="absolute top-3 right-3 p-2 hover:bg-slate-700/50 rounded-lg transition-all duration-200"
                    >
                        <i className="fas fa-times text-slate-400 hover:text-slate-200"></i>
                    </button>
                )}
            </div>
        );
    } catch (error) {
        console.error('TextArea component error:', error);
        reportError(error);
    }
}

export default TextArea;