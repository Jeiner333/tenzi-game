import { useState } from "react";

export default function Number({ num, active, index, setActive }) {
    const [actualState, setActualState] = useState(active);
    const [classname, setClassname] = useState(setState());

    function setState() {
        if (actualState == false) {
            return "number-button";
        } else {
            return "number-button active";
        }
    }

    if (actualState != active) {
        setActualState(active)
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
    }

    return (
        <button onClick={changeState} className={classname}>
            {num}
        </button>
    );
}
