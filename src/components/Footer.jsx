import github_icon from "/public/assets/github-logo.png";

export default function Footer() {
    return (
        <footer className="app-footer">
            <h3>By Miguelangel Dev. MIT Licence</h3>
            <div className="repo-div">
                <img
                    className="github-logo"
                    src={github_icon}
                    alt="github logo"
                />
                <span>
                    <a
                        className="repo-link"
                        href="https://github.com/Jeiner333/tenzi-game"
                    >
                        Repositorio
                    </a>
                </span>
            </div>
        </footer>
    );
}
