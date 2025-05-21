import React, { useState, useEffect } from "react";
import { Pencil, Wrench, Settings, CheckSquare} from 'lucide-react';


export default function RappelsPage() {
    const [activeForm, setActiveForm] = useState(null);
    const [kilometrageEstime, setKilometrageEstime] = useState(null);
    const [popupData, setPopupData] = useState(null);
    const [popupType, setPopupType] = useState(null);
    const [rappelsActifs, setRappelsActifs] = useState([]);
    const [messageSucces, setMessageSucces] = useState(null);
    const [showAll, setShowAll] = useState(false);
    const [newDate, setNewDate] = useState("");
    // filtre
    const [showFiltrePopup, setShowFiltrePopup] = useState(false);
    const [filtreCategorie, setFiltreCategorie] = useState("Tous");
    const [filtreHistorique, setFiltreHistorique] = useState(false);
    const [filtrePeriode, setFiltrePeriode] = useState({ de: "", a: "" });

    const rappelsPredefinis = [
        { nom: "Vidange huile", date: "01/02/2025", urgent: true },
        { nom: "Changement des plaquettes de frein", date: "02/08/2025", urgent: false },
        { nom: "Expiration du document \"assurance\"", date: "04/09/2025", urgent: false }
    ];

    useEffect(() => {
        //  Message de succès
        const message = localStorage.getItem("messageSucces");
        if (message) {
            setMessageSucces(message);
            localStorage.removeItem("messageSucces");
            setTimeout(() => setMessageSucces(null), 3000);
        }

        // Kilométrage estimé
        const saved = localStorage.getItem("rappelKilometrage");
        if (saved) {
            const data = JSON.parse(saved);
            if (data.saisieManuelle) {
                setKilometrageEstime(data.saisieManuelle);
            } else if (data.totalKm) {
                setKilometrageEstime(data.totalKm);
            }
        }

        //  Rappels sélectionnés
        const selection = JSON.parse(localStorage.getItem("rappelSelection")) || {};
        const rappelsSelectionnes = Object.entries(selection.rappels || {})
            .filter(([nom, actif]) => actif)
            .map(([nom]) => ({
                nom,
                date: genererDateProchaine(),
                urgent: nom.toLowerCase().includes("vidange"),
                isNew:true
            }));

        //  Rappels déjà stockés
        const preexistants = JSON.parse(localStorage.getItem("rappelsActifs") || "[]");

        //  Fusion + suppression des doublons
        const fusion = [...preexistants, ...rappelsPredefinis, ...rappelsSelectionnes];
        const uniques = fusion.filter(
            (rappel, index, self) =>
                index === self.findIndex(r => r.nom === rappel.nom)
        );

        setRappelsActifs(uniques);
        localStorage.setItem("rappelsActifs", JSON.stringify(uniques));
    }, [activeForm]);

    const genererDateProchaine = () => {
        const d = new Date();
        d.setMonth(d.getMonth() + 1);
        return d.toLocaleDateString("fr-FR");
    };

    const handleClick = (formName) => setActiveForm(formName);

    const handleKilometrageSave = (km) => {
        setKilometrageEstime(km);
        setActiveForm(null);
    };

    const handlePopupSave = () => {
        if (popupType === "done") {
            const updated = rappelsActifs.filter(r => r.nom !== popupData.nom);
            setRappelsActifs(updated);
            localStorage.setItem("rappelsActifs", JSON.stringify(updated));
            //Supprime aussi du rappelSelection (localStorage)
            const selection = JSON.parse(localStorage.getItem("rappelSelection")) || {};
            if (selection.rappels && selection.rappels[popupData.nom]) {
                delete selection.rappels[popupData.nom];
                localStorage.setItem("rappelSelection", JSON.stringify(selection));
            }
            setMessageSucces("✅ Entretien enregistré avec succès !");
        } else if (popupType === "edit") {
            if (!newDate) return; // ne fait rien si aucune date saisie

            const updated = rappelsActifs.map(r =>
                r.nom === popupData.nom ? { ...r, date: new Date(newDate).toLocaleDateString("fr-FR") } : r
            );

            setRappelsActifs(updated);
            localStorage.setItem("rappelsActifs", JSON.stringify(updated));

            setMessageSucces(" Date modifiée avec succès !");
        }
        setTimeout(() => setMessageSucces(null), 3000);
        setPopupData(null);
    };

    return (
        <div className="rappels-page">
            {messageSucces && (
                <div className="notif-succes">{messageSucces}</div>
            )}

            {activeForm === null && (
                <>
                    <nav className="rappels-nav">
                        <div className="rappels-header">
                            <h1>
                                Rappels d'entretien
                                <span className="icon clickable" onClick={() => handleClick("parametres")}><Settings size={40} color="black" /></span>
                            </h1>
                            <div className="rappels-links">
                                <button onClick={() => handleClick("selection")}>Sélectionner Rappels</button>
                                <button onClick={() => handleClick("trajet")}>Déclarer un trajet inhabituel</button>
                            </div>
                        </div>
                    </nav>

                    <div className="kilometrage-section">
                        <p className="clickable" onClick={() => handleClick("kilometrage")}><CheckSquare size={25} color="green"/> <span className="text-blue underline">Estimer votre kilométrage</span></p>
                        <p>Votre kilométrage estimé est de {kilometrageEstime ? `${kilometrageEstime} km` : ".... km"} </p>
                    </div>

                    <div className="rappel-card">
                        <div className="card-header">
                            <h2>RAPPEL À VENIR</h2>
                            <button className="filter-btn" onClick={() => setShowFiltrePopup(true)}>Filtrer</button>
                        </div>

                        <div className="rappel-list">
                            {(showAll ? rappelsActifs : rappelsActifs.slice(0, 3)).map((rappel, index) => (
                                <div key={index} className={`rappel-item ${rappel.urgent ? "urgent" : ""}`}>
                                    <div className="info">
                                        <p className="rappel-title">{rappel.nom}
                                            {rappel.isNew && <span className="badge-nouveau">Nouveau</span>}
                                        </p>
                                        <p className="rappel-date">{rappel.date}</p>
                                    </div>
                                    <div className="rappel-actions">
                                        <Pencil size={20} color="#000" onClick={() => { setPopupData(rappel); setPopupType("edit"); }} />
                                        <Wrench size={20} color="#000" onClick={() => { setPopupData(rappel); setPopupType("done"); }} />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {rappelsActifs.length > 3 && (
                            <div className="voir-tout">
                                <button onClick={() => setShowAll(!showAll)}>
                                    {showAll ? "Réduire" : "Voir plus"}
                                </button>
                            </div>
                        )}
                    </div>

                    {popupData && (
                        <div className="popup-overlay">
                            <div className="popup-content">
                                <button className="close-btn" onClick={() => setPopupData(null)}>✖️</button>

                                {popupType === "done" && (
                                    <div className="popup-grid">
                                        <div className="facture-section">
                                            <p><strong>Facture</strong><br /><small>Les données seront rentrées automatiquement</small></p>

                                            {/* Input caché */}
                                            <input type="file" id="factureGenerique" onChange={(e) => handleFileUpload("filtres", e)} hidden />

                                            {/* Label qui déclenche le input */}
                                            <label htmlFor="factureGenerique" className="importer-btn">Importer</label>
                                        </div>
                                        <div className="form-section">
                                            <input type="date" placeholder="Date du dernier entretien" />
                                            <select>
                                                <option>Chez soi</option>
                                                <option>Garage</option>
                                            </select>
                                            <input type="text" placeholder="Coût (€)" />
                                        </div>
                                    </div>
                                )}

                                {popupType === "edit" && (
                                    <div className="form-section">
                                        <label>Modifier la date</label>
                                        <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} />
                                    </div>
                                )}

                                <button className="save-btn" onClick={handlePopupSave}>Enregistrer</button>
                            </div>
                        </div>
                    )}
                </>
            )}

            {activeForm === "kilometrage" && <FormulaireKilometrage onSave={handleKilometrageSave} onBack={() => setActiveForm(null)} />}
            {activeForm === "selection" && <SelectionnerRappels onBack={() => setActiveForm(null)} />}
            {activeForm === "trajet" && <FormulaireTrajet onBack={() => setActiveForm(null)} />}
            {activeForm === "parametres" && <FormulaireParametres onBack={() => setActiveForm(null)} />}

            {showFiltrePopup && (
                <div className="popup-overlay">
                    <div className="popup-content" style={{ maxWidth: "400px" }}>
                        <button className="close-btn" onClick={() => setShowFiltrePopup(false)}>✖️</button>

                        <h3>Filtres</h3>

                        {/* Tri - optionnel */}
                        <label htmlFor="tri">Trier par</label>
                        <select id="tri" className="form-select" disabled>
                            <option>Trier par</option>
                        </select>

                        {/* Période */}
                        <div className="periode-section" style={{ marginTop: "1rem" }}>
                            <label>Période</label>
                            <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.3rem" }}>
                                <input
                                    type="date"
                                    value={filtrePeriode.de}
                                    onChange={(e) => setFiltrePeriode(prev => ({ ...prev, de: e.target.value }))}
                                />
                                <input
                                    type="date"
                                    value={filtrePeriode.a}
                                    onChange={(e) => setFiltrePeriode(prev => ({ ...prev, a: e.target.value }))}
                                />
                            </div>
                        </div>

                        {/* Catégories */}
                        <div className="categories-section" style={{ marginTop: "1rem" }}>
                            <label>Catégories</label>
                            <div className="btn-group" style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.3rem" }}>
                                {["Tous", "Mécanique & Moteur", "Sécurité & Confort", "Conformité"].map(cat => (
                                    <button
                                        key={cat}
                                        className={filtreCategorie === cat ? "selected-cat" : ""}
                                        onClick={() => setFiltreCategorie(cat)}
                                        type="button"
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Historique */}
                        <div className="historique-section" style={{ marginTop: "1.5rem" }}>
                            <label style={{ fontWeight: "bold", display: "block", marginBottom: "0.3rem" }}>Historique</label>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={filtreHistorique}
                                    onChange={(e) => setFiltreHistorique(e.target.checked)}
                                />
                                <span style={{ marginLeft: "0.5rem" }}>Afficher uniquement les entretiens passés</span>
                            </label>
                        </div>

                        {/* Boutons bas */}
                        <div className="popup-actions" style={{ marginTop: "2rem", display: "flex", justifyContent: "space-between" }}>
                            <button
                                onClick={() => {
                                    setFiltreCategorie("Tous");
                                    setFiltreHistorique(false);
                                    setFiltrePeriode({ de: "", a: "" });
                                }}
                                style={{ color: "black", background: "none", border: "none", fontWeight: "bold", cursor: "pointer" }}
                            >
                                Réinitialiser
                            </button>

                            <button
                                className="save-btn"
                                onClick={() => setShowFiltrePopup(false)}
                            >
                                Appliquer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
/* === Formulaire Estimation Kilométrage === */
function FormulaireKilometrage({ onSave, onBack }) {
    const [reponses, setReponses] = useState({});

    const handleChange = (e) => {
        setReponses(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSave = () => {
        let finalKm = 0;

        if (reponses.estimation === "oui" && reponses.saisieManuelle) {
            finalKm = parseInt(reponses.saisieManuelle) || 0;

        } else if (reponses.estimation === "non") {
            if (reponses.trajetDifferencie === "oui") {
                const weekEndKm = (parseInt(reponses.trajetWeekEndJours) || 0) * (parseInt(reponses.trajetWeekEndKm) || 0);
                const semaineKm = (parseInt(reponses.trajetSemaineJours) || 0) * (parseInt(reponses.trajetSemaineKm) || 0);
                finalKm = weekEndKm + semaineKm;
            } else if (reponses.trajetDifferencie === "non") {
                finalKm = (parseInt(reponses.joursTrajet) || 0) * (parseInt(reponses.kmParJour) || 0);
            }
        }

        localStorage.setItem("rappelKilometrage", JSON.stringify({ ...reponses, totalKm: finalKm }));
        onSave(finalKm);
    };

    return (
        <div className="form-card">
            <div className="form-header">
                <button className="back-btn" onClick={onBack}>⬅️ Retour</button>
                <button className="close-btn" onClick={onBack}>✖️</button>
            </div>

            <h2>Estimation du kilométrage</h2>

            <label>Connaissez-vous votre kilométrage mensuel moyen ?</label>
            <select name="estimation" onChange={handleChange}>
                <option value="">-- Choisir --</option>
                <option value="oui">Oui</option>
                <option value="non">Non</option>
            </select>

            {reponses.estimation === "oui" && (
                <input
                    type="number"
                    name="saisieManuelle"
                    placeholder="Saisir votre estimation mensuelle (km)"
                    onChange={handleChange}
                />
            )}

            {reponses.estimation === "non" && (
                <>
                    <label>Vos trajets sont-ils différents entre semaine et week-end ?</label>
                    <select name="trajetDifferencie" onChange={handleChange}>
                        <option value="">-- Choisir --</option>
                        <option value="oui">Oui</option>
                        <option value="non">Non</option>
                    </select>

                    {reponses.trajetDifferencie === "oui" && (
                        <>
                            <label>Jours de trajet en semaine</label>
                            <select name="trajetSemaineJours" onChange={handleChange}>
                                <option value="">-- Choisir --</option>
                                {[...Array(6).keys()].map((n) => (
                                    <option key={n} value={n}>{n}</option>
                                ))}
                            </select>

                            <label>Km par jour en semaine</label>
                            <input type="number" name="trajetSemaineKm" onChange={handleChange} />

                            <label>Jours de trajet week-end</label>
                            <select name="trajetWeekEndJours" onChange={handleChange}>
                                <option value="">-- Choisir --</option>
                                {[...Array(3).keys()].map((n) => (
                                    <option key={n} value={n}>{n}</option>
                                ))}
                            </select>

                            <label>Km par jour week-end</label>
                            <input type="number" name="trajetWeekEndKm" onChange={handleChange} />
                        </>
                    )}

                    {reponses.trajetDifferencie === "non" && (
                        <>
                            <label>Nombre de jours de trajet par semaine</label>
                            <select name="joursTrajet" onChange={handleChange}>
                                <option value="">-- Choisir --</option>
                                {[...Array(8).keys()].map((n) => (
                                    <option key={n} value={n}>{n}</option>
                                ))}
                            </select>

                            <label>Distance moyenne par jour (km)</label>
                            <input type="number" name="kmParJour" onChange={handleChange} />
                        </>
                    )}
                </>
            )}

            <label>Quel est le type de vos trajets ?</label>
            <select name="typeTrajet" onChange={handleChange}>
                <option value="">-- Choisir --</option>
                <option value="urbain">Principalement urbain</option>
                <option value="routier">Principalement routier</option>
                <option value="mixte">Mixte</option>
            </select>

            <button onClick={handleSave} className="save-btn">Enregistrer</button>
        </div>
    );
}
/* === Formulaire Sélectionner Rappels === */
function SelectionnerRappels({ onBack }) {
    const [rappels, setRappels] = useState({});
    const [autreEntretien, setAutreEntretien] = useState("");

    // Pour les deux formulaires dynamiques
    const [popupForm, setPopupForm] = useState(null);

    const [detailsFiltres, setDetailsFiltres] = useState({
        facture: null,
        date: "",
        lieu: "",
        cout: ""
    });

    const [controleTechnique, setControleTechnique] = useState({
        facture: null,
        dateControle: "",
        resultat: ""
    });

    const handleToggle = (nom) => {
        setRappels(prev => ({ ...prev, [nom]: !prev[nom] }));

        if (nom === "Contrôle technique" && !rappels[nom]) {
            setPopupForm("controle");
        } else if (!rappels[nom]) {
            setPopupForm("filtres");
        }
    };

    const handleSave = () => {
        const data = {
            rappels,
            autreEntretien,
            remplacementFiltresDetails: rappels["Remplacement des filtres"] ? detailsFiltres : null,
            controleTechniqueDetails: rappels["Contrôle technique"] ? controleTechnique : null
        };
        localStorage.setItem("rappelSelection", JSON.stringify(data));

        //une notification visible sur la page d’accueil
        localStorage.setItem("messageSucces", "✅ Rappels enregistrés avec succès !");

        // Retour automatique
        onBack();
    };

    const handleFileUpload = (type, e) => {
        const file = e.target.files[0];
        if (type === "filtres" && file) {
            setDetailsFiltres(prev => ({ ...prev, facture: file.name }));
        }
        if (type === "controle" && file) {
            setControleTechnique(prev => ({ ...prev, facture: file.name }));
        }
    };

    const listeRappels = [
        { nom: "Vidange huile moteur" },
        { nom: "Remplacement des filtres" },
        { nom: "Freins", sous: "(plaquettes, disques)" },
        { nom: "Pneus", sous: "(usure, permutation)" },
        { nom: "Distribution", sous: "(courroie, chaîne)" },
        { nom: "Batterie" },
        { nom: "Climatisation" },
        { nom: "Liquide de refroidissement" },
        { nom: "Contrôle technique" },
        { nom: "Rappels constructeurs spécifiques", sous: "(sécurité, mise à jour)" }
    ];

    return (
        <div className="form-card">
            <div className="form-header">
                <button className="back-btn" onClick={onBack}>⬅️ Retour</button>
                <button className="close-btn" onClick={onBack}>✖️</button>
            </div>

            <h2>Sélectionner les entretiens</h2>

            <div className="selection-grid">
                {listeRappels.map(item => (
                    <div key={item.nom} className="selection-item">
                        <div className="text">
                            <span>{item.nom}</span>
                            {item.sous && <small>{item.sous}</small>}
                        </div>
                        <label className="switch">
                            <input type="checkbox" checked={rappels[item.nom] || false} onChange={() => handleToggle(item.nom)} />
                            <span className="slider"></span>
                        </label>
                    </div>
                ))}
            </div>

            <div className="autres-entretiens">
                <label>Autres entretiens</label>
                <input
                    type="text"
                    value={autreEntretien}
                    onChange={(e) => setAutreEntretien(e.target.value)}
                    placeholder="Ajouter un entretien"
                />
            </div>

            <button onClick={handleSave} className="save-btn">Enregistrer</button>

            {/* POPUP FORMULAIRES */}
            {popupForm && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <button className="close-popup" onClick={() => setPopupForm(null)}>✖️</button>

                        {/* Contenu du Popup en 2 colonnes */}
                        <div className="popup-grid">
                            {/* Partie Facture à gauche */}
                            <div className="popup-left">
                                <label>Facture</label>
                                <small>Les données seront rentrées automatiquement</small>

                                {popupForm === "filtres" && (
                                    <>
                                        <input type="file" id="factureFiltres" onChange={(e) => handleFileUpload("filtres", e)} hidden />
                                        <label htmlFor="factureFiltres" className="importer-btn">Importer</label>
                                        {detailsFiltres.facture && <p className="uploaded-file">{detailsFiltres.facture}</p>}
                                    </>
                                )}

                                {popupForm === "controle" && (
                                    <>
                                        <input type="file" id="factureControle" onChange={(e) => handleFileUpload("controle", e)} hidden />
                                        <label htmlFor="factureControle" className="importer-btn">Importer</label>
                                        {controleTechnique.facture && <p className="uploaded-file">{controleTechnique.facture}</p>}
                                    </>
                                )}
                            </div>

                            {/* Partie Formulaire à droite */}
                            <div className="popup-right">
                                {popupForm === "filtres" && (
                                    <>
                                        <input
                                            type="text"
                                            placeholder="Date du dernier entretien"
                                            value={detailsFiltres.date}
                                            onChange={(e) => setDetailsFiltres(prev => ({ ...prev, date: e.target.value }))}
                                        />
                                        <input
                                            type="text"
                                            placeholder="Lieu"
                                            value={detailsFiltres.lieu}
                                            onChange={(e) => setDetailsFiltres(prev => ({ ...prev, lieu: e.target.value }))}
                                        />
                                        <input
                                            type="text"
                                            placeholder="Coût"
                                            value={detailsFiltres.cout}
                                            onChange={(e) => setDetailsFiltres(prev => ({ ...prev, cout: e.target.value }))}
                                        />
                                    </>
                                )}

                                {popupForm === "controle" && (
                                    <>
                                        <input
                                            type="text"
                                            placeholder="Date du dernier contrôle technique"
                                            value={controleTechnique.dateControle}
                                            onChange={(e) => setControleTechnique(prev => ({ ...prev, dateControle: e.target.value }))}
                                        />
                                        <label> <strong> Résultat du dernier contrôle technique </strong> </label>
                                        <div className="radio-group">
                                            <label><input type="radio" name="resultat" value="valide" onChange={(e) => setControleTechnique(prev => ({ ...prev, resultat: e.target.value }))} /> Validé sans défaut</label>
                                            <label><input type="radio" name="resultat" value="defauts_mineurs" onChange={(e) => setControleTechnique(prev => ({ ...prev, resultat: e.target.value }))} /> Validé avec défaut(s) mineur(s)</label>
                                            <label><input type="radio" name="resultat" value="defauts_majeurs" onChange={(e) => setControleTechnique(prev => ({ ...prev, resultat: e.target.value }))} /> Défaut(s) majeur(s) ou critique(s) nécessitant contre-visite</label>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Bouton enregistrer en bas */}
                        <button className="save-btn" onClick={() => setPopupForm(null)}>Enregistrer</button>
                    </div>
                </div>
            )}
        </div>
    );
}
/* === Formulaire Déclarer Trajet === */
function FormulaireTrajet({ onBack }) {
    const [trajet, setTrajet] = useState({});

    const handleChange = (e) => {
        setTrajet(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSave = () => {
        localStorage.setItem("rappelTrajet", JSON.stringify(trajet));
        alert("Trajet enregistré !");
        onBack();
    };

    return (
        <div className="form-card">
            <div className="form-header">
                <button className="back-btn" onClick={onBack}>⬅️ Retour</button>
                <button className="close-btn" onClick={onBack}>✖️</button>
            </div>

            <h2>Déclarer un trajet inhabituel</h2>

            <label>Type de trajet (vacances, travail...)</label>
            <input name="typeTrajet" onChange={handleChange} />

            <label>Période concernée</label>
            <input name="periode" onChange={handleChange} />

            <label>Kilométrage supplémentaire</label>
            <input name="kmSupp" onChange={handleChange} />

            <button onClick={handleSave} className="save-btn">Enregistrer</button>
        </div>
    );
}
/*formulaire Parametre*/
function FormulaireParametres({ onBack }) {
    const [rappelMoment, setRappelMoment] = useState("");
    const [notificationType, setNotificationType] = useState("");

    const handleSave = () => {
        const parametres = {
            rappelMoment,
            notificationType
        };
        localStorage.setItem("parametresRappel", JSON.stringify(parametres));
        alert("Paramètres enregistrés !");
        onBack();
    };

    return (
        <div className="form-card">
            <div className="form-header">
                <button className="back-btn" onClick={onBack}>⬅️ Retour</button>
                <button className="close-btn" onClick={onBack}>✖️</button>
            </div>

            <h2>Paramètres de notification</h2>

            <label>À quel moment souhaitez-vous recevoir votre rappel ?</label>
            <select value={rappelMoment} onChange={(e) => setRappelMoment(e.target.value)}>
                <option value="">-- Choisir --</option>
                <option value="1semaine">1 semaine avant</option>
                <option value="2semaines">2 semaines avant</option>
                <option value="1mois">1 mois avant (recommandé)</option>
                <option value="2mois">2 mois avant</option>
                <option value="programmer">Programmer soi-même</option>
            </select>

            {rappelMoment === "programmer" && (
                <input type="datetime-local" onChange={(e) => setRappelMoment(e.target.value)} />
            )}

            <label>Comment souhaitez-vous être notifié ?</label>
            <select value={notificationType} onChange={(e) => setNotificationType(e.target.value)}>
                <option value="">-- Choisir --</option>
                <option value="sms">SMS</option>
                <option value="email">Email</option>
                <option value="push">Notification push via l'application</option>
            </select>

            <button onClick={handleSave} className="save-btn">Enregistrer</button>
        </div>
    );
}