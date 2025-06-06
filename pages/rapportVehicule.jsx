import React, { useState, useEffect } from 'react';
import { RefreshCcw, Share2, X } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function RapportVehicule() {
    const [showShareModal, setShowShareModal] = useState(false);
    const [vehicule, setVehicule] = useState(null);
    const [depenses, setDepenses] = useState([]);

    const COLORS = ["#007BFF", "#339AF0", "#5C7CFA", "#4C6EF5", "#3B5BDB", "#3A86FF", "#2F80ED", "#1C7ED6", "#1864AB", "#0B5394"];
    const [isMobile, setIsMobile] = useState(false);
    const categories = [
        "Carburant/Recharge électrique",
        "Entretiens et Réparations",
        "Assurance",
        "Contrôle technique/Contrôle visite",
        "Péage/Stationnement",
        "Lavage/Nétoyage",
        "Equipement et accéssoire",
        "Pièces détachées",
        "Dépréciation ou frais exceptionnel",
        "Autre"
    ];
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const handleResize = () => setIsMobile(window.innerWidth < 768);
            handleResize(); // initial check
            window.addEventListener("resize", handleResize);
            return () => window.removeEventListener("resize", handleResize);
        }
    }, []);
    useEffect(() => {
        const savedVehicule = JSON.parse(localStorage.getItem("kopylotVehicule"));
        if (savedVehicule) setVehicule(savedVehicule);

        const savedDepenses = JSON.parse(localStorage.getItem("depenses")) || [];
        setDepenses(savedDepenses);
    }, []);

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

    const total = depenses.reduce((sum, d) => sum + parseFloat(d.montant || 0), 0);

    const last12Months = depenses.filter((d) => {
        const date = new Date(d.date);
        const now = new Date();
        return date >= new Date(now.getFullYear(), now.getMonth() - 11, 1);
    });
    const total12M = last12Months.reduce((sum, d) => sum + parseFloat(d.montant || 0), 0);

    const groupedData = categories.map((cat) => {
        const value = depenses
            .filter((d) => d.categorie === cat)
            .reduce((sum, d) => sum + parseFloat(d.montant || 0), 0);
        return { name: cat, value };
    }).filter(d => d.value > 0);

    return (
        <div className="mes-vehicules">
            <h1>Rapport véhicule</h1>

            <div className="top-buttons">
                <button className="update-button">
                    <RefreshCcw size={18} color="white" />
                    Mettre à jour
                </button>

                <button className="export-button" onClick={handleExportPDF}>Exporter PDF</button>

                <button
                    className="share-button"
                    data-testid="open-share-modal"
                    onClick={() => setShowShareModal(true)}
                >
                    <Share2 size={18} />
                </button>
            </div>

            {showShareModal && (
                <div className="share-modal">
                    <div className="share-modal-content">
                        <button
                            className="close-modal"
                            aria-label="Fermer la modale de partage"
                            onClick={() => setShowShareModal(false)}
                            style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                background: 'transparent',
                                border: 'none',
                                fontSize: '1.5rem',
                                cursor: 'pointer'
                            }}
                        >
                            ×
                        </button>

                        <h2>Partager via</h2>
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
                        {vehicule ? (
                            <>
                                <p><strong>Marque / Modèle</strong> <span className="link">{vehicule.marque} {vehicule.modele}</span></p>
                                <p><strong>Immatriculation</strong> {vehicule.immatriculation}</p>
                                <p><strong>VIN</strong> {vehicule.numeroSerie}</p>
                                <p><strong>Date de mise en circulation</strong> <span className="link">{vehicule.dateCirculation}</span></p>
                                <p><strong>Type de carburant</strong> <span className="link">{vehicule.carburant}</span></p>
                                <p><strong>Finition</strong> <span className="link">{vehicule.finition || "Non renseignée"}</span></p>
                                <p><strong>Contrôle technique</strong> <span className="link">OK 2024/2025 validé jusqu’au 29/02/2027</span></p>
                            </>
                        ) : (
                            <p>Aucune donnée disponible. Veuillez ajouter un véhicule.</p>
                        )}
                    </div>

                    <div className="card">
                        <h2>Suivi des dépenses</h2>
                        <p><strong>Total cumulé</strong> <span className="link">{total.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}</span></p>
                        <p><strong>Dépenses sur les 12 derniers mois</strong> <span className="link">{total12M.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}</span></p>
                        <h3>Répartition par type de dépenses</h3>

                        <div className="graph-container">
                            <ResponsiveContainer width="100%" height={isMobile ? 300 : 250}>
                                <PieChart>
                                    <Pie
                                        data={groupedData}
                                        dataKey="value"
                                        nameKey="name"
                                        outerRadius={isMobile ? 60 : 70}
                                        label={!isMobile}
                                    >
                                        {groupedData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => `${value.toFixed(2)} €`} />
                                    <Legend
                                        layout={isMobile ? "horizontal" : "vertical"}
                                        align={isMobile ? "center" : "right"}
                                        verticalAlign={isMobile ? "bottom" : "middle"}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
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
                    <p><span className="link">Voyant moteur allumé, coffre ne se ferme pas</span></p>
                </div>
            </div>
        </div>
    );
}