import { useState, useEffect } from "react";
import Header from "./components/Header";
import Main from "./components/Main";
import Footer from "./components/Footer";
import StartMenu from "./components/StartMenu";

export default function App() {
    const [gameStarted, setGameStarted] = useState(false);
    const [diceCount, setDiceCount] = useState(12);
    const [gameMode, setGameMode] = useState('classic');
    const [theme, setTheme] = useState(() => {
        // Load theme from localStorage or default to 'light'
        return localStorage.getItem('tenzies-theme') || 'light';
    });

    const [diceSkin, setDiceSkin] = useState(() => {
        // Load dice skin from localStorage or default to 'numbers'
        return localStorage.getItem('tenzies-dice-skin') || 'numbers';
    });

    const [volume, setVolume] = useState(() => {
        // Load volume from localStorage or default to 0.5
        const savedVolume = localStorage.getItem('tenzies-volume');
        return savedVolume ? parseFloat(savedVolume) : 0.5;
    });

    const handleStartGame = (selectedDiceCount, selectedGameMode) => {
        setDiceCount(selectedDiceCount);
        setGameMode(selectedGameMode);
        setGameStarted(true);
    };

    const handleReturnToMenu = () => {
        setGameStarted(false);
    };

    const changeTheme = (newTheme) => {
        setTheme(newTheme);
        localStorage.setItem('tenzies-theme', newTheme);
    };

    const changeDiceSkin = (newSkin) => {
        setDiceSkin(newSkin);
        localStorage.setItem('tenzies-dice-skin', newSkin);
    };

    const changeVolume = (newVolume) => {
        setVolume(newVolume);
        localStorage.setItem('tenzies-volume', newVolume.toString());
    };

    // Apply theme to document body
    useEffect(() => {
        // Remove all theme classes
        document.body.classList.remove('theme-light', 'theme-dark', 'theme-blue', 'theme-green');
        // Add the current theme class
        document.body.classList.add(`theme-${theme}`);
    }, [theme]);

    return (
        <main className="app">
            {!gameStarted ? (
                <StartMenu
                    onStartGame={handleStartGame}
                    theme={theme}
                    onThemeChange={changeTheme}
                    volume={volume}
                    onVolumeChange={changeVolume}
                />
            ) : (
                <>
                    <Main
                        diceCount={diceCount}
                        gameMode={gameMode}
                        onReturnToMenu={handleReturnToMenu}
                        theme={theme}
                        onThemeChange={changeTheme}
                        diceSkin={diceSkin}
                        onDiceSkinChange={changeDiceSkin}
                        volume={volume}
                    />
                    <Footer />
                </>
            )}
        </main>
    );
}
