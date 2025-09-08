import { useState, useEffect, useRef } from "react";
import Number from "./Number";
import ProgressBarr from "./ProgressBarr";

export default function Main() {
    const dicesNumber = 12;
    const [dices, setDices] = useState(() => randomDices());
    const [win, setWin] = useState(false);
    const [wins, setWins] = useState(0);
    const [rolls, setRolls] = useState(0);
    const intervaloRef = useRef(null);

    var correctPorcent = 0;

    //console.log(dices)

    if (
        !win &&
        dices.every((dice) => dice.active) &&
        dices.every((dice) => dice.value === dices[0].value)
    ) {
        setWin(true);
        setWins((prev) => prev + 1);
    }

    const conteo = {};
    let maxRepeticiones = 0;
    for (const dice of dices) {
        if (!dice.active) continue;
        conteo[dice.value] = (conteo[dice.value] || 0) + 1;
    }

    if (Object.keys(conteo).length > 0) {
        maxRepeticiones = Math.max(...Object.values(conteo));
    } else {
        maxRepeticiones = 0;
    }

    const valorMasComun = Object.keys(conteo).find(
        (key) => conteo[key] === maxRepeticiones
    );

    correctPorcent = Math.floor((maxRepeticiones * 100) / dicesNumber);

    //console.log(correctPorcent);
    //console.log(equalDices);

    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        intervaloRef.current = setInterval(() => {
            setSeconds((prev) => prev + 1);
        }, 1000);

        return () => clearInterval(intervaloRef.current); // Limpieza
    }, []);

    //console.log(`Tiempo: ${seconds} segundos`);

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
            for (var i = 0; i < dicesNumber; i++) {
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
        setRolls((prev) => prev + 1);
    }

    function newGame() {
        maxRepeticiones = 0;
        setWin(false);
        setRolls(0);
        setSeconds(0);
        setDices(undefined);
        setDices(randomDices);
    }

    return (
        <main className="app-main">
            <ProgressBarr porcent={correctPorcent} />
            {win && (
                <p className="congrats-text">Congratulations, you win!!!</p>
            )}
            <div className="main-numbers">{setButtons()}</div>
            <div className="scores">
                <p>Games Won: {wins}</p>
                <p>Rolls: {rolls}</p>
                <p>Time: {seconds}s</p>
            </div>

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
