import React, { useState } from "react";


export default function InscriptionPage() {
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState(""); // "success" | "error"

    const gererInscription = async (e) => {
        e.preventDefault();

        const form = e.target;
        const userData = {
            nom: form.nom.value,
            prenom: form.prenom.value,
            email: form.email.value,
            password: form.motdepasse.value,
            /*adresse: form.adresse.value,*/
            ville: form.ville.value,
            pays: form.pays.value,
        };

        try {
            localStorage.setItem("kopylotUser", JSON.stringify(userData));
            setMessage("Compte créé avec succès !");
            setMessageType("success");
            setTimeout(() => {
                window.location.href = "/connexion";
            }, 2000);
        } catch (erreur) {
            setMessage("Erreur lors de la création du compte.");
            setMessageType("error");
        }
    };

    return (
        <div className="signup-page">
            <div className="back-home">
                <a href="/connexion" className="back-link">← Retour à la connexion</a>
            </div>

            <div className="signup-box">
                <h1>CRÉATION DE NOUVEAU CLIENT</h1>

                {message && (
                    <div className={`message-box ${messageType}`}>
                        {message}
                    </div>
                )}

                <form className="signup-form" onSubmit={gererInscription}>
                    <input type="text" name="nom" placeholder="Nom" required />
                    <input type="text" name="prenom" placeholder="Prénom" required />
                    <input type="email" name="email" placeholder="Email" required />
                    <input type="password" name="motdepasse" placeholder="Mot de passe" required />
                    <input type="text" name="ville" placeholder="Ville" />
                    <select name="pays" required>
                        <option value="">Pays</option>
                        <option>France</option>
                        <option>Belgique</option>
                        <option>Sénégal</option>
                        <option>Côte d'Ivoire</option>
                        <option>Canada</option>
                    </select>
                    <button type="submit">Créer un compte</button>
                </form>
            </div>
        </div>
    );
}

// bar de navigation
InscriptionPage.noNavbar = true;