import { useState, useEffect, useRef } from "react";
import Number from "./Number";
import ProgressBarr from "./ProgressBarr";
import VictoryModal from "./VictoryModal";
import ThemeSelector from "./ThemeSelector";
import DiceSkinSelector from "./DiceSkinSelector";
import AchievementPanel from "./AchievementPanel";

export default function Main({ diceCount = 12, gameMode = 'classic', onReturnToMenu, theme, onThemeChange, diceSkin, onDiceSkinChange }) {
    const dicesNumber = diceCount;
    
    // localStorage utility functions
    const getRecordsKey = () => {
        return `tenziesRecords_${gameMode}_${diceCount}`;
    };

    const getWinsKey = () => {
        return `tenziesWins_${gameMode}_${diceCount}`;
    };

    const getAchievementsKey = () => {
        return `tenziesAchievements_${gameMode}_${diceCount}`;
    };

    const getConsecutiveWinsKey = () => {
        return `tenziesConsecutiveWins_${gameMode}_${diceCount}`;
    };

    const loadWins = () => {
        try {
            const winsKey = getWinsKey();
            const savedWins = localStorage.getItem(winsKey);
            return savedWins ? parseInt(savedWins, 10) : 0;
        } catch (error) {
            console.error('Error loading wins:', error);
            return 0;
        }
    };

    const saveWins = (winsCount) => {
        try {
            const winsKey = getWinsKey();
            localStorage.setItem(winsKey, winsCount.toString());
        } catch (error) {
            console.error('Error saving wins:', error);
        }
    };

    const loadAchievements = () => {
        try {
            const achievementsKey = getAchievementsKey();
            const savedAchievements = localStorage.getItem(achievementsKey);
            if (savedAchievements) {
                return JSON.parse(savedAchievements);
            }
        } catch (error) {
            console.error('Error loading achievements:', error);
        }
        // Return default achievements
        return getDefaultAchievements();
    };

    const saveAchievements = (achievements) => {
        try {
            const achievementsKey = getAchievementsKey();
            localStorage.setItem(achievementsKey, JSON.stringify(achievements));
        } catch (error) {
            console.error('Error saving achievements:', error);
        }
    };

    const loadConsecutiveWins = () => {
        try {
            const consecutiveKey = getConsecutiveWinsKey();
            const savedConsecutive = localStorage.getItem(consecutiveKey);
            return savedConsecutive ? parseInt(savedConsecutive, 10) : 0;
        } catch (error) {
            console.error('Error loading consecutive wins:', error);
            return 0;
        }
    };

    const saveConsecutiveWins = (consecutiveCount) => {
        try {
            const consecutiveKey = getConsecutiveWinsKey();
            localStorage.setItem(consecutiveKey, consecutiveCount.toString());
        } catch (error) {
            console.error('Error saving consecutive wins:', error);
        }
    };

    const getDefaultAchievements = () => {
        return [
            {
                id: 'speed_demon',
                name: 'Speed Demon',
                description: 'Win in less than 5 rolls',
                unlocked: false,
                criteria: { rolls: 5 }
            },
            {
                id: 'streak_master',
                name: 'Streak Master',
                description: 'Win 3 games in a row',
                unlocked: false,
                criteria: { streak: 3 }
            },
            {
                id: 'lightning_fast',
                name: 'Lightning Fast',
                description: 'Win in less than 30 seconds',
                unlocked: false,
                criteria: { seconds: 30 }
            },
            {
                id: 'perfect_first_try',
                name: 'Perfect First Try',
                description: 'Win with 0 rolls (perfect first try)',
                unlocked: false,
                criteria: { rolls: 0 }
            }
        ];
    };

    const [dices, setDices] = useState(() => randomDices());
    const [win, setWin] = useState(false);
    const [wins, setWins] = useState(() => loadWins());
    const [rolls, setRolls] = useState(0);
    const [isRolling, setIsRolling] = useState(false);
    const [showVictoryModal, setShowVictoryModal] = useState(false);
    const [newRecords, setNewRecords] = useState({});
    const intervaloRef = useRef(null);

    // Records state
    const [records, setRecords] = useState({
        minSpins: null,
        fastestTime: null,
        totalGames: 0
    });
    const [showRecords, setShowRecords] = useState(false);

    // Achievements state
    const [achievements, setAchievements] = useState(() => loadAchievements());
    const [consecutiveWins, setConsecutiveWins] = useState(() => loadConsecutiveWins());
    const [showAchievements, setShowAchievements] = useState(false);
    const [newAchievements, setNewAchievements] = useState([]);

    const loadRecords = () => {
        try {
            const recordsKey = getRecordsKey();
            const savedRecords = localStorage.getItem(recordsKey);
            if (savedRecords) {
                return JSON.parse(savedRecords);
            }
        } catch (error) {
            console.error('Error loading records:', error);
        }
        return { minSpins: null, fastestTime: null, totalGames: 0 };
    };

    const saveRecords = (newRecords) => {
        try {
            const recordsKey = getRecordsKey();
            localStorage.setItem(recordsKey, JSON.stringify(newRecords));
        } catch (error) {
            console.error('Error saving records:', error);
        }
    };

    // Initialize records and achievements from localStorage
    useEffect(() => {
        const loadedRecords = loadRecords();
        setRecords(loadedRecords);

        const loadedAchievements = loadAchievements();
        setAchievements(loadedAchievements);

        const loadedConsecutive = loadConsecutiveWins();
        setConsecutiveWins(loadedConsecutive);
    }, [gameMode, diceCount]);

    // Handle escape key for closing floating windows
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                if (showRecords) setShowRecords(false);
                if (showAchievements) setShowAchievements(false);
            }
        };

        if (showRecords || showAchievements) {
            document.addEventListener('keydown', handleEscape);
            return () => document.removeEventListener('keydown', handleEscape);
        }
    }, [showRecords, showAchievements]);

    const checkAchievements = (currentRolls, currentTime) => {
        const newlyUnlocked = [];

        setAchievements(prevAchievements => {
            const updatedAchievements = prevAchievements.map(achievement => {
                if (achievement.unlocked) return achievement;

                let shouldUnlock = false;

                switch (achievement.id) {
                    case 'speed_demon':
                        shouldUnlock = currentRolls < achievement.criteria.rolls;
                        break;
                    case 'streak_master':
                        shouldUnlock = consecutiveWins + 1 >= achievement.criteria.streak;
                        break;
                    case 'lightning_fast':
                        shouldUnlock = currentTime < achievement.criteria.seconds;
                        break;
                    case 'perfect_first_try':
                        shouldUnlock = currentRolls === achievement.criteria.rolls;
                        break;
                    default:
                        shouldUnlock = false;
                }

                if (shouldUnlock) {
                    newlyUnlocked.push(achievement);
                    return { ...achievement, unlocked: true };
                }

                return achievement;
            });

            // Save updated achievements
            saveAchievements(updatedAchievements);

            return updatedAchievements;
        });

        if (newlyUnlocked.length > 0) {
            setNewAchievements(newlyUnlocked);
        }

        return newlyUnlocked;
    };

    var correctPorcent = 0;

    //console.log(dices)

    // Check win condition based on game mode
    const checkWinCondition = () => {
        if (win || !dices.every((dice) => dice.active)) return false;
        
        const activeValues = dices.map(dice => dice.value);
        
        switch (gameMode) {
            case 'classic':
                return activeValues.every(value => value === activeValues[0]);
            
            case 'pairs':
                // Check if all values can be paired (even count of each value)
                const valueCounts = {};
                activeValues.forEach(value => {
                    valueCounts[value] = (valueCounts[value] || 0) + 1;
                });
                return Object.values(valueCounts).every(count => count === 2);
            
            case 'straight':
                // Check if we have a sequence from 0 to diceCount-1
                const sortedValues = [...activeValues].sort((a, b) => a - b);
                return sortedValues.every((value, index) => value === index);
            
            default:
                return false;
        }
    };

    if (checkWinCondition() && !win) {
        setWin(true);

        // Update wins and save to localStorage
        setWins((prev) => {
            const newWins = prev + 1;
            saveWins(newWins);
            return newWins;
        });

        // Update consecutive wins
        setConsecutiveWins((prev) => {
            const newConsecutive = prev + 1;
            saveConsecutiveWins(newConsecutive);
            return newConsecutive;
        });

        // Update records and track new records
        setRecords(prevRecords => {
            const newRecords = {
                minSpins: prevRecords.minSpins === null ? rolls : Math.min(prevRecords.minSpins, rolls),
                fastestTime: prevRecords.fastestTime === null ? seconds : Math.min(prevRecords.fastestTime, seconds),
                totalGames: prevRecords.totalGames + 1
            };

            // Track which records are new
            const newRecordFlags = {
                minSpins: prevRecords.minSpins === null || rolls < prevRecords.minSpins,
                fastestTime: prevRecords.fastestTime === null || seconds < prevRecords.fastestTime
            };
            setNewRecords(newRecordFlags);

            saveRecords(newRecords);
            return newRecords;
        });

        // Check for new achievements
        checkAchievements(rolls, seconds);

        // Show victory modal after a short delay
        setTimeout(() => {
            setShowVictoryModal(true);
        }, 500);
    }

    // Calculate progress based on game mode
    const calculateProgress = () => {
        const activeDices = dices.filter(dice => dice.active);
        if (activeDices.length === 0) return 0;
        
        const activeValues = activeDices.map(dice => dice.value);
        
        switch (gameMode) {
            case 'classic':
                // Progress based on most common value
                const conteo = {};
                activeValues.forEach(value => {
                    conteo[value] = (conteo[value] || 0) + 1;
                });
                const maxRepeticiones = Object.keys(conteo).length > 0 ? 
                    Math.max(...Object.values(conteo)) : 0;
                return Math.floor((maxRepeticiones * 100) / dicesNumber);
            
            case 'pairs':
                // Progress based on how many pairs we have
                const pairCounts = {};
                activeValues.forEach(value => {
                    pairCounts[value] = (pairCounts[value] || 0) + 1;
                });
                const pairs = Object.values(pairCounts).filter(count => count === 2).length;
                return Math.floor((pairs * 2 * 100) / dicesNumber);
            
            case 'straight':
                // Progress based on consecutive sequence length starting from 0
                const sortedValues = [...activeValues].sort((a, b) => a - b);
                let consecutiveCount = 0;
                for (let i = 0; i < sortedValues.length; i++) {
                    if (sortedValues[i] === i) {
                        consecutiveCount++;
                    } else {
                        break;
                    }
                }
                return Math.floor((consecutiveCount * 100) / dicesNumber);
            
            default:
                return 0;
        }
    };

    correctPorcent = calculateProgress();

    //console.log(correctPorcent);
    //console.log(equalDices);

    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        if (!win) {
            intervaloRef.current = setInterval(() => {
                setSeconds((prev) => prev + 1);
            }, 1000);
        } else {
            clearInterval(intervaloRef.current);
        }

        return () => clearInterval(intervaloRef.current); // Limpieza
    }, [win]);

    //console.log(`Tiempo: ${seconds} segundos`);

    function randomDices(prev) {
        var values = [];

        if (prev != undefined) {
            prev.map((dice, index) => {
                if (!dice.active) {
                    values.push({
                        value: Math.floor(Math.random() * dicesNumber),
                        index: index,
                        active: false,
                    });
                } else values.push(dice);
            });
        } else {
            for (var i = 0; i < dicesNumber; i++) {
                values.push({
                    value: Math.floor(Math.random() * dicesNumber),
                    index: i,
                    active: false,
                });
            }
        }

        //console.log(values)
        return values;
    }

    function setButtons() {
        return dices.map((dice, index) => {
            return (
                <Number
                    key={index}
                    num={dice.value}
                    active={dice.active}
                    index={index}
                    setActive={setDices}
                    isRolling={isRolling}
                    diceSkin={diceSkin}
                />
            );
        });
    }

    function rollDices() {
        setIsRolling(true);
        setRolls((prev) => prev + 1);

        // Delay the dice update to show animation
        setTimeout(() => {
            setDices((prev) => randomDices(prev));
            setIsRolling(false);

            // Focus management: focus on first unfrozen die after roll
            setTimeout(() => {
                const firstUnfrozenDie = document.querySelector('.number-button:not(.active)');
                if (firstUnfrozenDie) {
                    firstUnfrozenDie.focus();
                }
            }, 50); // Small delay to ensure DOM is updated
        }, 800); // Animation duration
    }

    function handleRollKeyDown(e) {
        if (e.key === ' ' && !win) {
            e.preventDefault();
            rollDices();
        }
    }

    function newGame() {
        // If starting new game without winning, reset consecutive wins
        if (!win) {
            setConsecutiveWins(0);
            saveConsecutiveWins(0);
        }

        setWin(false);
        setRolls(0);
        setSeconds(0);
        setDices(undefined);
        setDices(randomDices);
        setShowVictoryModal(false);
        setNewRecords({});
        setNewAchievements([]);
    }

    function handleCloseVictoryModal() {
        setShowVictoryModal(false);
    }

    return (
        <main className="app-main">
            <div className="top-controls">
                <button
                    onClick={onReturnToMenu}
                    className="menu-button"
                >
                    ← Main Menu
                </button>
                <button
                    onClick={() => setShowRecords(!showRecords)}
                    className="records-toggle-button"
                >
                    {showRecords ? 'Hide Records' : 'Show Records'}
                </button>
                <button
                    onClick={() => setShowAchievements(!showAchievements)}
                    className="achievements-toggle-button"
                >
                    {showAchievements ? 'Hide Achievements' : 'Show Achievements'}
                </button>
                <DiceSkinSelector diceSkin={diceSkin} onDiceSkinChange={onDiceSkinChange} />
                <ThemeSelector theme={theme} onThemeChange={onThemeChange} />
            </div>
            <ProgressBarr porcent={correctPorcent} />
            <div className="game-mode-display">
                <p>Current Mode: <strong>{gameMode.charAt(0).toUpperCase() + gameMode.slice(1)}</strong></p>
            </div>
            <div className="main-numbers">{setButtons()}</div>
            <div className="scores" aria-live="polite" aria-label="Game statistics">
                <p>Games Won: {wins}</p>
                <p>Rolls: {rolls}</p>
                <p>Time: {seconds}s</p>
            </div>
            
            {showRecords && (
                <div className="records-backdrop" onClick={() => setShowRecords(false)}>
                    <div className="records-container" onClick={(e) => e.stopPropagation()}>
                        <button
                            className="records-close-button"
                            onClick={() => setShowRecords(false)}
                            aria-label="Close records"
                        >
                            ×
                        </button>
                        <h3>Records - {gameMode.charAt(0).toUpperCase() + gameMode.slice(1)} Mode ({diceCount} dice)</h3>
                        <div className="records-grid">
                            <div className="record-item">
                                <span className="record-label">Min Spins:</span>
                                <span className="record-value">{records.minSpins !== null ? records.minSpins : 'N/A'}</span>
                            </div>
                            <div className="record-item">
                                <span className="record-label">Fastest Time:</span>
                                <span className="record-value">{records.fastestTime !== null ? `${records.fastestTime}s` : 'N/A'}</span>
                            </div>
                            <div className="record-item">
                                <span className="record-label">Total Games:</span>
                                <span className="record-value">{records.totalGames}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showAchievements && (
                <div className="achievements-backdrop" onClick={() => setShowAchievements(false)}>
                    <div className="achievements-container" onClick={(e) => e.stopPropagation()}>
                        <button
                            className="achievements-close-button"
                            onClick={() => setShowAchievements(false)}
                            aria-label="Close achievements"
                        >
                            ×
                        </button>
                        <AchievementPanel
                            achievements={achievements}
                            gameMode={gameMode}
                            diceCount={diceCount}
                        />
                    </div>
                </div>
            )}

            {win ? (
                <button
                    onClick={newGame}
                    className="roll-button"
                    aria-label="Start new game"
                >
                    New Game
                </button>
            ) : (
                <button
                    onClick={rollDices}
                    onKeyDown={handleRollKeyDown}
                    className="roll-button"
                    aria-label="Roll dice, press Space to roll"
                >
                    Roll dices
                </button>
            )}

            {/* Victory Modal */}
            <VictoryModal
                isOpen={showVictoryModal}
                onClose={handleCloseVictoryModal}
                stats={{
                    rolls: rolls,
                    time: seconds,
                    gamesWon: wins
                }}
                records={records}
                newRecords={newRecords}
                gameMode={gameMode}
                diceCount={diceCount}
            />
        </main>
    );
}
