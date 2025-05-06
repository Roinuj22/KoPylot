
import React, { useState } from 'react';

import { RefreshCcw, Share2, X } from 'lucide-react';

export default function RapportVehicule() {
    const [showShareModal, setShowShareModal] = useState(false);

    const handleExportPDF = () => {
        window.print();
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Rapport Véhicule',
                    text: 'Voici le rapport de mon véhicule.',
                    url: window.location.href
                });
            } catch (err) {
                console.error('Erreur lors du partage :', err);
            }
        } else {
            setShowShareModal(true);
        }
    };

    return (
        <div className="mes-vehicules">
            <h1>Rapport véhicule</h1>
            <div className="top-buttons">
                <button className="update-button">
                    <RefreshCcw size={18} color="white" />
                    Mettre à jour
                </button>
                <button className="export-button" onClick={handleExportPDF}>Exporter PDF</button>
                <button className="share-button" onClick={handleShare}>
                    <Share2 size={18} />
                </button>
            </div>

            {showShareModal && (
                <div className="share-modal">
                    <div className="share-modal-content">
                        <button className="close-button" onClick={() => setShowShareModal(false)}>
                            <X size={18} />
                        </button>
                        <h3>Partager via :</h3>
                        <div className="share-options">
                            <a href={`https://wa.me/?text=Consultez%20le%20rapport%20de%20mon%20véhicule%20ici%20:%20${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer">WhatsApp</a>
                            <a href={`mailto:?subject=Rapport Véhicule&body=Consultez%20le%20rapport%20ici%20:%20${encodeURIComponent(window.location.href)}`}>Email</a>
                            <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer">Facebook</a>
                            <a href={`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=Consultez%20le%20rapport`} target="_blank" rel="noopener noreferrer">Telegram</a>
                        </div>
                    </div>
                </div>
            )}

    <div className="cards-container">
        <div className="top-row">
            <div className="card">
                <h2>Informations générales</h2>
                <p><strong>Marque / Modèle</strong> <span className="link">Peugeot 208</span></p>
                <p><strong>Immatriculation</strong></p>
                <p><strong>VIN</strong></p>
                <p><strong>Date de mise en circulation</strong> <span className="link">15/04/2021</span> </p>
                <p><strong>Type de carburant</strong> <span className="link">Essence</span></p>
                <p><strong>Finition</strong> <span className="link">Like</span></p>
                <p><strong>Contrôle technique</strong> <span className="link">OK 2024/2025 validé jusqu’au 29/02/2027</span> </p>
            </div>

            <div className="card">
                <h2>Suivi des dépenses</h2>
                <p><strong>Total cumulé</strong> <span className="link">1 579,00 €</span></p>
                <p><strong>Dépenses sur les 12 derniers mois</strong> <span className="link">383,00 €</span></p>
                <h3>Répartition par type de dépenses</h3>
                <div className="graph-and-text">
                    <div className="graph-placeholder">
                        <img src="/image/Graphique%20camembert.png" alt="Graphe" />
                    </div>
                    <div className="info-text">
                        Entretien 61%<br /> Pneumatiques 20%<br /> Carburant 15%
                    </div>
                </div>
            </div>
        </div>
        <div className="card">
            <h2>Historique des entretiens</h2>
            <div className="table-container">
                <table>
                    <thead>
                    <tr>
                        <th>Date</th>
                        <th>Type d'entretien</th>
                        <th>Lieu</th>
                        <th>Montant</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>10/03/2025</td>
                        <td>Vidange + filtre huile</td>
                        <td>Norauto</td>
                        <td>88,00 €</td>
                    </tr>
                    <tr>
                        <td>12/12/2024</td>
                        <td>Freins avant</td>
                        <td>Garage Renaud</td>
                        <td>135,00 €</td>
                    </tr>
                    <tr>
                        <td>08/03/2024</td>
                        <td>Pneus avant</td>
                        <td>AutoCenter</td>
                        <td>220,00 €</td>
                    </tr>
                    <tr>
                        <td>02/08/2024</td>
                        <td>Batterie remplacée</td>
                        <td>Fait maison</td>
                        <td>110,00 €</td>
                    </tr>
                    <tr>
                        <td>10/03/2023</td>
                        <td>Climatisation (nettoyage)</td>
                        <td>Norauto</td>
                        <td>49,00 €</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>


        <div className="card">
            <h2>Etat du véhicule</h2>
            <p><strong>Dernière inspection</strong> <span className="link">28/03/2025</span> </p>
            <p><strong>Résultat</strong></p>
            <p> <span className="link"> Voyant moteur allumé, coffre ne se ferme pas</span></p>
        </div>
    </div>
</div>

    );
}