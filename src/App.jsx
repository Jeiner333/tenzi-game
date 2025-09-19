import { useState } from "react";
import Header from "./components/Header";
import Main from "./components/Main";
import Footer from "./components/Footer";
import StartMenu from "./components/StartMenu";

export default function App() {
    const [gameStarted, setGameStarted] = useState(false);
    const [diceCount, setDiceCount] = useState(12);
    const [gameMode, setGameMode] = useState('classic');

    const handleStartGame = (selectedDiceCount, selectedGameMode) => {
        setDiceCount(selectedDiceCount);
        setGameMode(selectedGameMode);
        setGameStarted(true);
    };

    return (
        <main className="app">
            {!gameStarted ? (
                <StartMenu onStartGame={handleStartGame} />
            ) : (
                <>
                    <Main diceCount={diceCount} gameMode={gameMode} />
                    <Footer />
                </>
            )}
        </main>
    );
}
