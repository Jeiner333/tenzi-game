import { useState } from "react";

export default function DiceSkinSelector({ diceSkin, onDiceSkinChange }) {
    const [isOpen, setIsOpen] = useState(false);

    const skins = [
        { id: 'numbers', name: 'Numbers', icon: '1' },
        { id: 'emojis', name: 'Emojis', icon: '🎲' },
        { id: 'dots', name: 'Dots', icon: '●' }
    ];

    const currentSkin = skins.find(s => s.id === diceSkin) || skins[0];

    const handleSkinSelect = (skinId) => {
        onDiceSkinChange(skinId);
        setIsOpen(false);
    };

    return (
        <div className="dice-skin-selector">
            <button
                className="dice-skin-selector-button"
                onClick={() => setIsOpen(!isOpen)}
                title="Change Dice Skin"
            >
                <span className="skin-icon">{currentSkin.icon}</span>
                <span className="skin-name">{currentSkin.name}</span>
                <span className="dropdown-arrow">{isOpen ? '▲' : '▼'}</span>
            </button>

            {isOpen && (
                <div className="skin-dropdown">
                    {skins.map((skinOption) => (
                        <button
                            key={skinOption.id}
                            className={`skin-option ${diceSkin === skinOption.id ? 'active' : ''}`}
                            onClick={() => handleSkinSelect(skinOption.id)}
                        >
                            <span className="skin-icon">{skinOption.icon}</span>
                            <span className="skin-name">{skinOption.name}</span>
                            {diceSkin === skinOption.id && <span className="checkmark">✓</span>}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}