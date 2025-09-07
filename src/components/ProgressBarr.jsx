export default function ProgressBarr({porcent}) {
    var porcentString = String(porcent) + "%"

    return (
        <div className="progress-barr">
            <div style={{width: porcentString}} className="barr-color"></div>
            <span>{porcent}%</span>
        </div>
    )
}