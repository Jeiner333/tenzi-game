import { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import useSound from 'use-sound';

export default function VictoryModal({ 
    isOpen, 
    onClose, 
    stats, 
    records, 
    newRecords,
    gameMode, 
    diceCount 
}) {
    const [showConfetti, setShowConfetti] = useState(false);
    const [windowDimensions, setWindowDimensions] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    // Victory sound effect
    const [playVictorySound] = useSound('/victory.mp3', { 
        volume: 0.5,
        onend: () => {
            // Optional: Add any cleanup after sound ends
        }
    });

    // Update window dimensions for confetti
    useEffect(() => {
        const updateDimensions = () => {
            setWindowDimensions({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    // Trigger confetti and sound when modal opens
    useEffect(() => {
        if (isOpen) {
            setShowConfetti(true);
            playVictorySound();
            
            // Stop confetti after 5 seconds
            const confettiTimer = setTimeout(() => {
                setShowConfetti(false);
            }, 5000);

            return () => clearTimeout(confettiTimer);
        }
    }, [isOpen, playVictorySound]);

    // Handle escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            return () => document.removeEventListener('keydown', handleEscape);
        }
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return mins > 0 ? `${mins}:${secs.toString().padStart(2, '0')}` : `${secs}s`;
    };

    const isNewRecord = (recordType) => {
        return newRecords[recordType] || false;
    };

    return (
        <>
            {/* Confetti overlay */}
            {showConfetti && (
                <Confetti
                    width={windowDimensions.width}
                    height={windowDimensions.height}
                    recycle={false}
                    numberOfPieces={200}
                    gravity={0.3}
                    initialVelocityY={20}
                    colors={['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3']}
                />
            )}

            {/* Modal backdrop */}
            <div className="victory-modal-backdrop" onClick={onClose}>
                <div className="victory-modal-container" onClick={(e) => e.stopPropagation()}>
                    {/* Modal content */}
                    <div className="victory-modal-content">
                        {/* Header with celebration */}
                        <div className="victory-header">
                            <div className="victory-icon">🎉</div>
                            <h1 className="victory-title">Victory!</h1>
                            <div className="victory-subtitle">
                                You completed {gameMode.charAt(0).toUpperCase() + gameMode.slice(1)} mode with {diceCount} dice!
                            </div>
                            
                            {/* New Record Banner */}
                            {(isNewRecord('minSpins') || isNewRecord('fastestTime')) && (
                                <div className="new-record-banner">
                                    <div className="banner-icon">🏆</div>
                                    <div className="banner-text">
                                        <div className="banner-title">NEW RECORD!</div>
                                        <div className="banner-subtitle">
                                            {isNewRecord('minSpins') && isNewRecord('fastestTime') 
                                                ? 'Fastest time AND fewest rolls!' 
                                                : isNewRecord('minSpins') 
                                                    ? 'Fewest rolls!' 
                                                    : 'Fastest time!'
                                            }
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Stats section */}
                        <div className="victory-stats">
                            <h2 className="stats-title">Game Statistics</h2>
                            <div className="stats-grid">
                                <div className="stat-item">
                                    <div className="stat-label">Rolls Used</div>
                                    <div className={`stat-value ${isNewRecord('minSpins') ? 'new-record' : ''}`}>
                                        {stats.rolls}
                                        {isNewRecord('minSpins') && <span className="record-badge">NEW RECORD!</span>}
                                    </div>
                                </div>
                                <div className="stat-item">
                                    <div className="stat-label">Time</div>
                                    <div className={`stat-value ${isNewRecord('fastestTime') ? 'new-record' : ''}`}>
                                        {formatTime(stats.time)}
                                        {isNewRecord('fastestTime') && <span className="record-badge">NEW RECORD!</span>}
                                    </div>
                                </div>
                                <div className="stat-item">
                                    <div className="stat-label">Games Won</div>
                                    <div className="stat-value">{stats.gamesWon}</div>
                                </div>
                            </div>
                        </div>

                        {/* Records section */}
                        <div className="victory-records">
                            <h2 className="records-title">Current Records</h2>
                            <div className="records-grid">
                                <div className="record-item">
                                    <span className="record-label">Best Rolls:</span>
                                    <span className="record-value">
                                        {records.minSpins !== null ? records.minSpins : 'N/A'}
                                    </span>
                                </div>
                                <div className="record-item">
                                    <span className="record-label">Best Time:</span>
                                    <span className="record-value">
                                        {records.fastestTime !== null ? formatTime(records.fastestTime) : 'N/A'}
                                    </span>
                                </div>
                                <div className="record-item">
                                    <span className="record-label">Total Games:</span>
                                    <span className="record-value">{records.totalGames}</span>
                                </div>
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div className="victory-actions">
                            <button className="victory-button primary" onClick={onClose}>
                                Play Again
                            </button>
                            <button className="victory-button secondary" onClick={onClose}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
