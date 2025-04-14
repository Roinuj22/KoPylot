import React from "react";


export default function AccueilApresConnexion() {
    return (
        <div className="page-connectee">
            <nav className="navbar-connectee">
                <div className="logo">KoPylot</div>
                <div className="liens">
                    <a href="/vehicules">Mes véhicules</a>
                    <a href="/rappels">Rappels</a>
                    <a href="/deconnexion">Se déconnecter</a>
                </div>
            </nav>

            <div className="dashboard-contenu">
                <div className="section-dashboard">
                    <h2>Bienvenue 👋</h2>
                    <p>Voici un aperçu de votre activité. Utilisez les accès rapides ci-dessous.</p>
                </div>

                <div className="section-dashboard">
                    <h3>Vos véhicules</h3>
                    <p>Nombre total : 3</p>
                </div>

                <div className="section-dashboard">
                    <h3>Rappels d'entretien</h3>
                    <p>2 à venir cette semaine</p>
                </div>
            </div>
        </div>
    );
}