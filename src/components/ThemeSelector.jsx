import { useState } from "react";

export default function ThemeSelector({ theme, onThemeChange }) {
    const [isOpen, setIsOpen] = useState(false);

    const themes = [
        { id: 'light', name: 'Light', color: '#667eea' },
        { id: 'dark', name: 'Dark', color: '#1a1a2e' },
        { id: 'blue', name: 'Blue', color: '#0f4c75' },
        { id: 'green', name: 'Green', color: '#0d4f3c' }
    ];

    const currentTheme = themes.find(t => t.id === theme) || themes[0];

    const handleThemeSelect = (themeId) => {
        onThemeChange(themeId);
        setIsOpen(false);
    };

    return (
        <div className="theme-selector">
            <button
                className="theme-selector-button"
                onClick={() => setIsOpen(!isOpen)}
                title="Change Theme"
            >
                <div
                    className="theme-color-preview"
                    style={{ backgroundColor: currentTheme.color }}
                ></div>
                <span className="theme-name">{currentTheme.name}</span>
                <span className="dropdown-arrow">{isOpen ? '▲' : '▼'}</span>
            </button>

            {isOpen && (
                <div className="theme-dropdown">
                    {themes.map((themeOption) => (
                        <button
                            key={themeOption.id}
                            className={`theme-option ${theme === themeOption.id ? 'active' : ''}`}
                            onClick={() => handleThemeSelect(themeOption.id)}
                        >
                            <div
                                className="theme-color-preview"
                                style={{ backgroundColor: themeOption.color }}
                            ></div>
                            <span className="theme-name">{themeOption.name}</span>
                            {theme === themeOption.id && <span className="checkmark">✓</span>}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}