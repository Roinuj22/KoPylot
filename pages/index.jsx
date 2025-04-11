import { useEffect, useState } from "react";

export default function HomePage() {
    const [isConnected, setIsConnected] = useState(true);

    return (
        <div>
            {/* Navbar */}
            <nav>
                <div className="left">LOGO</div>
                <div className="right">
                    <a href="#">Accueil</a>
                    <a href="/connexion" className="nav-button">👤 Connexion</a>
                </div>
            </nav>

            {/* Hero */}
            <section className="hero">
                <h1>Bienvenue chez KoPylot</h1>
                <img src="/image/voiture.png" alt="voiture" className="car-animation" />
            </section>

            {/* Sections */}
            <div className="container">
                <div className="section">
                    <h2>Rappels d'entretien</h2>
                </div>
                <div className="section">
                    <h2>Checklist</h2>
                </div>
                <div className="section">
                    <h2>Suivi des dépenses</h2>
                </div><div className="section">
                    <h2>Documents</h2>
                </div><div className="section">
                    <h2>Rapports véhicule</h2>
                </div>

                {/* Avis */}
                <div className="section">
                    <h2>Avis</h2>
                    <div className="avis-cards">
                        <div className="avis-card">“L’interface est géniale”</div>
                        <div className="avis-card">“Je l’utilise au quotidien”</div>
                        <div className="avis-card">“Super appli, planning visuel”</div>
                    </div>
                </div>

                {/* Contact */}
                <div className="section">
                    <h2>Contact</h2>
                    <form className="contact-form">
                        <input type="text" placeholder="Nom" />
                        <input type="email" placeholder="Email" />
                        <textarea placeholder="Message" rows={5}></textarea>
                        <button>Envoyer</button>
                    </form>
                </div>
            </div>
        </div>
    );
}