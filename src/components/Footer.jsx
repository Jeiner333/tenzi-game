import github_icon from "/public/assets/github-logo.png";

export default function Footer() {
    return (
        <footer className="app-footer">
            <h3>By Miguelangel Dev. MIT Licence</h3>
            <div>
                <a className="repo-link repo-div" href="https://github.com/Jeiner333/tenzi-game">
                    <img
                        className="github-logo"
                        src={github_icon}
                        alt="github logo"
                    />
                    <span>Repositorio</span>
                </a>
            </div>
        </footer>
    );
}
