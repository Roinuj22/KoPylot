import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AccueilApresConnexion from "./accueilApresConnexion";

export default function ConnexionPage() {
    const router = useRouter();
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState(""); // "success" | "error"
    const [isClient, setIsClient] = useState(false); //  pour savoir si côté client

    useEffect(() => {
        setIsClient(true); //  Activer une fois monté côté navigateur
    }, []);

    const handleLogin = (e) => {
        e.preventDefault();

        const form = e.target;
        const email = form.email.value;
        const password = form.password.value;

        if (!isClient) return; //  Empêcher l'accès server-side

        const user = JSON.parse(localStorage.getItem("kopylotUser"));

        if (!user) {
            setMessage("Aucun compte trouvé. Veuillez vous inscrire.");
            setMessageType("error");
            return;
        }

        if (email === user.email && password === user.password) {
            localStorage.setItem("connectedUser", JSON.stringify(user));
            localStorage.setItem("isConnected", "true");
            setMessage("Connexion réussie !");
            setMessageType("success");
            setTimeout(() => {
                router.push("/accueilApresConnexion");
            }, 2000);
        } else {
            setMessage("Email ou mot de passe incorrect.");
            setMessageType("error");
        }
    };

    if (!isClient) {
        return null; //  Ne rien afficher pendant le chargement serveur
    }

    return (
        <div style={{ position: "relative" }}>
            {/* Retour Accueil */}
            <div className="back-home">
                <a href="/" className="back-link">← Retour à l'accueil</a>
            </div>

            {/* Container global */}
            <div className="login-container">
                {/* Partie Connexion */}
                <div className="login-left">
                    <h1>Bienvenue sur <span className="kop-name">KoPylot</span></h1>

                    {message && (
                        <div className={`message-box ${messageType}`}>
                            {message}
                        </div>
                    )}

                    <form className="login-form" onSubmit={handleLogin}>
                        <input type="email" name="email" placeholder="Email" required />
                        <input type="password" name="password" placeholder="Mot de passe" required />
                        <button type="submit">Se connecter</button>
                    </form>
                </div>

                {/* Partie Inscription */}
                <div className="login-right">
                    <div className="signup-box-right">
                        <h2>
                            Nouveau chez <span className="kop-name-dark">KoPylot</span> ?
                        </h2>
                        <p>
                            KoPylot vous aide à gérer facilement vos véhicules, rappels d'entretien
                            et dépenses. Simplifiez votre quotidien !
                        </p>
                        <a href="/inscription" className="signup-link">Inscrivez-vous</a>
                    </div>
                </div>
            </div>
        </div>
    );
}

// bar de navigation
ConnexionPage.noNavbar = true;