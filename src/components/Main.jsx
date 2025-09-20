import { useState, useEffect, useRef } from "react";
import Number from "./Number";
import ProgressBarr from "./ProgressBarr";
import VictoryModal from "./VictoryModal";
import ThemeSelector from "./ThemeSelector";
import DiceSkinSelector from "./DiceSkinSelector";

export default function Main({ diceCount = 12, gameMode = 'classic', onReturnToMenu, theme, onThemeChange, diceSkin, onDiceSkinChange }) {
    const dicesNumber = diceCount;
    
    // localStorage utility functions
    const getRecordsKey = () => {
        return `tenziesRecords_${gameMode}_${diceCount}`;
    };

    const getWinsKey = () => {
        return `tenziesWins_${gameMode}_${diceCount}`;
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

    // Initialize records from localStorage
    useEffect(() => {
        const loadedRecords = loadRecords();
        setRecords(loadedRecords);
    }, [gameMode, diceCount]);

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
        }, 800); // Animation duration
    }

    function newGame() {
        setWin(false);
        setRolls(0);
        setSeconds(0);
        setDices(undefined);
        setDices(randomDices);
        setShowVictoryModal(false);
        setNewRecords({});
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
                <DiceSkinSelector diceSkin={diceSkin} onDiceSkinChange={onDiceSkinChange} />
                <ThemeSelector theme={theme} onThemeChange={onThemeChange} />
            </div>
            <ProgressBarr porcent={correctPorcent} />
            <div className="game-mode-display">
                <p>Current Mode: <strong>{gameMode.charAt(0).toUpperCase() + gameMode.slice(1)}</strong></p>
            </div>
            <div className="main-numbers">{setButtons()}</div>
            <div className="scores">
                <p>Games Won: {wins}</p>
                <p>Rolls: {rolls}</p>
                <p>Time: {seconds}s</p>
            </div>
            
            {showRecords && (
                <div className="records">
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
            )}

            {win ? (
                <button onClick={newGame} className="roll-button">
                    New Game
                </button>
            ) : (
                <button onClick={rollDices} className="roll-button">
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
