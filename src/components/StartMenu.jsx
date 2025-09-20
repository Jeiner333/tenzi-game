import { useState } from "react";
import github_icon from "/public/assets/github-logo.png";
import ThemeSelector from "./ThemeSelector";

export default function StartMenu({ onStartGame, theme, onThemeChange }) {
    const [diceCount, setDiceCount] = useState(12);
    const [gameMode, setGameMode] = useState('classic');

    const handleStartGame = () => {
        onStartGame(diceCount, gameMode);
    };

    return (
        <div className="start-menu">
            <div className="theme-selector-container">
                <ThemeSelector theme={theme} onThemeChange={onThemeChange} />
            </div>
            <div className="start-menu-content">
                <h1 className="game-title">Tenzies</h1>
                <p className="game-description">
                    Roll until all dice are the same. Click each die to freeze it at its current value between rolls.
                </p>
                
                <div className="game-mode-selection">
                    <h3>Choose Game Mode:</h3>
                    <div className="mode-options">
                        <button
                            className={`mode-option ${gameMode === 'classic' ? 'selected' : ''}`}
                            onClick={() => setGameMode('classic')}
                            aria-label="Select Classic mode: All dice must be equal"
                        >
                            <div className="mode-title">Classic</div>
                            <div className="mode-description">All dice must be equal</div>
                        </button>
                        <button
                            className={`mode-option ${gameMode === 'pairs' ? 'selected' : ''}`}
                            onClick={() => setGameMode('pairs')}
                            aria-label="Select Pairs mode: All dice must be pairs"
                        >
                            <div className="mode-title">Pairs</div>
                            <div className="mode-description">All dice must be pairs</div>
                        </button>
                        <button
                            className={`mode-option ${gameMode === 'straight' ? 'selected' : ''}`}
                            onClick={() => setGameMode('straight')}
                            aria-label={`Select Straight mode: Sequence from 0 to ${diceCount - 1}`}
                        >
                            <div className="mode-title">Straight</div>
                            <div className="mode-description">Sequence from 0 to {diceCount - 1}</div>
                        </button>
                    </div>
                </div>

                <div className="dice-selection">
                    <h3>Choose Number of Dice:</h3>
                    <div className="dice-options">
                        <button
                            className={`dice-option ${diceCount === 6 ? 'selected' : ''}`}
                            onClick={() => setDiceCount(6)}
                            aria-label="Select 6 dice"
                        >
                            6 Dice
                        </button>
                        <button
                            className={`dice-option ${diceCount === 10 ? 'selected' : ''}`}
                            onClick={() => setDiceCount(10)}
                            aria-label="Select 10 dice"
                        >
                            10 Dice
                        </button>
                        <button
                            className={`dice-option ${diceCount === 12 ? 'selected' : ''}`}
                            onClick={() => setDiceCount(12)}
                            aria-label="Select 12 dice"
                        >
                            12 Dice
                        </button>
                        <button
                            className={`dice-option ${diceCount === 20 ? 'selected' : ''}`}
                            onClick={() => setDiceCount(20)}
                            aria-label="Select 20 dice"
                        >
                            20 Dice
                        </button>
                    </div>
                </div>

                <button
                    onClick={handleStartGame}
                    className="start-game-button"
                    aria-label="Start game with selected settings"
                >
                    Start Game
                </button>
                
                <div className="github-section">
                    <h3>By Miguelangel Dev. MIT Licence</h3>
                    <a 
                        className="repo-link repo-div" 
                        href="https://github.com/Jeiner333/tenzi-game" 
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <img
                            className="github-logo"
                            src={github_icon}
                            alt="github logo"
                        />
                        <span>Repositorio</span>
                    </a>
                </div>
            </div>
        </div>
    );
}
