import React from "react";

export default function ConnexionPage() {
    return (
        <div style={{ position: "relative" }}>
            {/* Bouton retour accueil */}
            <div className="back-home">
                <a href="/" className="back-link">← Retour à l'accueil</a>
            </div>

            {/* Connexion / Inscription */}
            <div className="login-container">
                {/* Connexion */}
                <div className="login-left">
                    <h1>Bienvenue sur <span className="kop-name">KoPylot</span></h1>
                    <form className="login-form">
                        <input type="email" placeholder="Email" required />
                        <input type="password" placeholder="Mot de passe" required />
                        <button>Se connecter</button>
                    </form>
                </div>

                {/* Inscription */}
                <div className="login-right">
                    <h2>Nouveau chez <span className="kop-name-dark">KoPylot</span> ?</h2>
                    <p>KoPylot vous aide à gérer facilement vos véhicules, vos rappels d'entretien et vos dépenses. Simplifiez votre quotidien.</p>
                    <a href="/signup" className="signup-link">Inscrivez-vous maintenant</a>
                </div>
            </div>
        </div>
    );
}