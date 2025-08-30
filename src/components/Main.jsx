import { useState } from "react";
import Number from "./Number";

export default function Main() {
    const [dices, setDices] = useState(() => randomDices());
    const [win, setWin] = useState(false);
    const [wins, setWins] = useState(0);

    //console.log(dices)

    if (
        !win &&
        dices.every((dice) => dice.active) &&
        dices.every((dice) => dice.value === dices[0].value)
    ) {
        setWin(true);
        setWins(prev => prev + 1)
    }

    function randomDices(prev) {
        var values = [];

        if (prev != undefined) {
            prev.map((dice, index) => {
                if (!dice.active) {
                    values.push({
                        value: Math.floor(Math.random() * 11),
                        index: index,
                        active: false,
                    });
                } else values.push(dice);
            });
        } else {
            for (var i = 0; i < 12; i++) {
                values.push({
                    value: Math.floor(Math.random() * 11),
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
                />
            );
        });
    }

    function rollDices() {
        setDices((prev) => randomDices(prev));
    }

    function newGame() {
        setWin(false);
        setDices(undefined);
        setDices(randomDices);
    }

    return (
        <main className="app-main">
            {win && <p>Congratulations, you win!!!</p>}
            <div className="main-numbers">{setButtons()}</div>
            <p>Games Won: {wins}</p>
            {win ? (
                <button onClick={newGame} className="roll-button">
                    New Game
                </button>
            ) : (
                <button onClick={rollDices} className="roll-button">
                    Roll dices
                </button>
            )}
        </main>
    );
}
