import { useState } from "react";
import { useSound } from 'use-sound';

export default function Number({ num, active, index, setActive, isRolling, diceSkin = 'numbers', volume = 0.5 }) {
    const [actualState, setActualState] = useState(active);
    const [classname, setClassname] = useState(setState());

    // Sound effect for freezing dice
    const [playFreezeSound] = useSound('/freeze-sound.mp3', { volume });

    function setState() {
        if (actualState == false) {
            return "number-button";
        } else {
            return "number-button active";
        }
    }

    if (actualState != active) {
        setActualState(active);
        if (actualState == true) {
            setClassname("number-button");
        } else {
            setClassname("number-button active");
        }
    }

    function changeState() {
        setActive((prev) => {
            return prev.map((dice) => {
                if (dice.index == index) {
                    return { ...dice, active: !actualState };
                } else return dice;
            });
        });
        playFreezeSound();
    }

    function handleKeyDown(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            changeState();
        }
    }

    function renderDiceContent() {
        if (diceSkin === 'emojis') {
            const diceEmojis = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
            if (num >= 1 && num <= 6) {
                return diceEmojis[num - 1];
            } else {
                return num.toString();
            }
        } else if (diceSkin === 'dots') {
            if (num >= 1 && num <= 6) {
                return <div className="dice-dots">{renderDots(num)}</div>;
            } else {
                return num.toString();
            }
        } else {
            // numbers
            return num.toString();
        }
    }

    function renderDots(count) {
        const dotPatterns = {
            1: [{ top: '50%', left: '50%' }],
            2: [{ top: '25%', left: '25%' }, { top: '75%', left: '75%' }],
            3: [{ top: '25%', left: '25%' }, { top: '50%', left: '50%' }, { top: '75%', left: '75%' }],
            4: [{ top: '25%', left: '25%' }, { top: '25%', left: '75%' }, { top: '75%', left: '25%' }, { top: '75%', left: '75%' }],
            5: [{ top: '25%', left: '25%' }, { top: '25%', left: '75%' }, { top: '50%', left: '50%' }, { top: '75%', left: '25%' }, { top: '75%', left: '75%' }],
            6: [{ top: '25%', left: '25%' }, { top: '25%', left: '50%' }, { top: '25%', left: '75%' }, { top: '75%', left: '25%' }, { top: '75%', left: '50%' }, { top: '75%', left: '75%' }]
        };

        const positions = dotPatterns[count] || [];
        return positions.map((pos, i) => (
            <span
                key={i}
                className="dot"
                style={{ top: pos.top, left: pos.left }}
            ></span>
        ));
    }

    return (
        <button
            onClick={changeState}
            onKeyDown={handleKeyDown}
            className={`${classname} ${isRolling && !active ? 'rolling' : ''}`}
            aria-label={`Dice ${index + 1}, value ${num}, ${active ? 'frozen' : 'unfrozen'}`}
        >
            {renderDiceContent()}
        </button>
    );
}
