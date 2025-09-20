import { useState, useEffect } from 'react';

export default function AchievementPanel({ achievements, gameMode, diceCount }) {
    const [unlockedAchievements, setUnlockedAchievements] = useState([]);

    useEffect(() => {
        // Filter achievements that are unlocked
        const unlocked = achievements.filter(achievement => achievement.unlocked);
        setUnlockedAchievements(unlocked);
    }, [achievements]);

    const formatAchievementDescription = (achievement) => {
        switch (achievement.id) {
            case 'speed_demon':
                return `Win in less than ${achievement.criteria.rolls} rolls`;
            case 'streak_master':
                return `Win ${achievement.criteria.streak} games in a row`;
            case 'lightning_fast':
                return `Win in less than ${achievement.criteria.seconds} seconds`;
            case 'perfect_first_try':
                return 'Win with 0 rolls (perfect first try)';
            default:
                return achievement.description;
        }
    };

    const getAchievementIcon = (achievement) => {
        switch (achievement.id) {
            case 'speed_demon':
                return '⚡';
            case 'streak_master':
                return '🔥';
            case 'lightning_fast':
                return '⚡';
            case 'perfect_first_try':
                return '💎';
            default:
                return '🏆';
        }
    };

    return (
        <div className="achievements">
            <h3>Achievements - {gameMode.charAt(0).toUpperCase() + gameMode.slice(1)} Mode ({diceCount} dice)</h3>
            {unlockedAchievements.length === 0 ? (
                <p className="no-achievements">No achievements unlocked yet. Keep playing to earn them!</p>
            ) : (
                <div className="achievements-grid">
                    {unlockedAchievements.map((achievement) => (
                        <div key={achievement.id} className="achievement-item unlocked">
                            <div className="achievement-icon">
                                {getAchievementIcon(achievement)}
                            </div>
                            <div className="achievement-content">
                                <div className="achievement-name">{achievement.name}</div>
                                <div className="achievement-description">
                                    {formatAchievementDescription(achievement)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <div className="achievements-summary">
                <p>{unlockedAchievements.length} / {achievements.length} achievements unlocked</p>
            </div>
        </div>
    );
}