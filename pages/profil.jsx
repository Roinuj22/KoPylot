import React, { useState } from "react";
import { useRouter } from "next/router"; //  Next.js utilise useRouter  et non useNavigate

export default function ProfilPage() {
    const [activeTab, setActiveTab] = useState("documents");
    const router = useRouter(); //  Correct

    const handleLogout = () => {
        localStorage.removeItem("connectedUser"); // Efface uniquement la session active
        localStorage.removeItem("isConnected");   //  Efface le statut connecté
        router.push("/connexion"); //  Redirection propre vers connexion
    };

    return (
        <div className="profil-page">
            <aside className="sidebar">
                <h2>Mon Profil</h2>
                <ul>
                    <li
                        className={activeTab === "documents" ? "active" : ""}
                        onClick={() => setActiveTab("documents")}
                    >
                        📄 Documents
                    </li>
                    <li
                        className={activeTab === "parametres" ? "active" : ""}
                        onClick={() => setActiveTab("parametres")}
                    >
                        ⚙️ Paramètres
                    </li>
                    <li
                        className={activeTab === "historique" ? "active" : ""}
                        onClick={() => setActiveTab("historique")}
                    >
                        📚 Historique
                    </li>
                    <li onClick={handleLogout}>👤 Se déconnecter</li>
                </ul>
            </aside>

            <main className="content">
                {activeTab === "documents" && (
                    <div className="documents-section">
                        <h1>Mes Documents</h1>
                        <button className="ajouter-btn">➕ Ajouter</button>
                    </div>
                )}

                {activeTab === "parametres" && (
                    <div className="parametres-section">
                        <h1>Paramètres</h1>
                        <h3>🔔 Préférences de notifications :</h3>
                        <ul>
                            <li>Email</li>
                            <li>Push</li>
                            <li>SMS</li>
                        </ul>
                        <h3>🌐 Langue / Thème :</h3>
                        <p>Mode sombre activé par défaut</p>
                        <h3>❌ Suppression de compte / véhicule</h3>
                        <h3>💾 Sauvegarde & restauration</h3>
                    </div>
                )}

                {activeTab === "historique" && (
                    <div className="historique-section">
                        <h1>Historique</h1>
                        <ul>
                            <li>🔧 Historique des entretiens réalisés</li>
                            <li>✅ Historique des contrôles checklist</li>
                            <li>💰 Historique des dépenses</li>
                            <li>📝 Filtrage par type, date, véhicule</li>
                            <li>🔍 Moteur de recherche interne</li>
                        </ul>
                    </div>
                )}
            </main>
        </div>
    );
}