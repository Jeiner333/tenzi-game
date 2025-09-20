import { useState } from "react";

export default function VolumeSelector({ volume, onVolumeChange }) {
    const [isOpen, setIsOpen] = useState(false);

    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value);
        onVolumeChange(newVolume);
    };

    const getVolumeIcon = () => {
        if (volume === 0) return '🔇';
        if (volume < 0.3) return '🔈';
        if (volume < 0.7) return '🔉';
        return '🔊';
    };

    const getVolumeLabel = () => {
        if (volume === 0) return 'Muted';
        if (volume < 0.3) return 'Low';
        if (volume < 0.7) return 'Medium';
        return 'High';
    };

    return (
        <div className="volume-selector">
            <button
                className="volume-selector-button"
                onClick={() => setIsOpen(!isOpen)}
                title="Adjust Volume"
            >
                <span className="volume-icon">{getVolumeIcon()}</span>
                <span className="volume-label">{getVolumeLabel()}</span>
                <span className="dropdown-arrow">{isOpen ? '▲' : '▼'}</span>
            </button>

            {isOpen && (
                <div className="volume-dropdown">
                    <div className="volume-slider-container">
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={volume}
                            onChange={handleVolumeChange}
                            className="volume-slider"
                        />
                        <div className="volume-value">{Math.round(volume * 100)}%</div>
                    </div>
                </div>
            )}
        </div>
    );
}