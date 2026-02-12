import { Link } from 'react-router-dom'
import './Layout.css'

export default function Layout({ children, progress }) {
    return (
        <div className="layout">
            <header className="header">
                <div className="header-inner container">
                    <Link to="/" className="logo">
                        <span className="logo-icon">🌴</span>
                        <span className="logo-text">Belajar!</span>
                    </Link>
                    <div className="header-stats">
                        <div className="stat" title="XP Points">
                            <span className="stat-icon">⚡</span>
                            <span className="stat-value">{progress.xp}</span>
                        </div>
                        <div className="stat" title="Day Streak">
                            <span className="stat-icon">🔥</span>
                            <span className="stat-value">{progress.streak}</span>
                        </div>
                    </div>
                </div>
            </header>
            <main className="main">
                {children}
            </main>
            <footer className="footer">
                <div className="container">
                    <p>Based on <em>Indonesian for Beginners</em> by Katherine Davidsen & Yusep Cuandani</p>
                </div>
            </footer>
        </div>
    )
}
