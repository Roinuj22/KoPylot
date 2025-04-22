import React, { useState, useEffect } from "react";


export default function RappelsPage() {
    const [activeForm, setActiveForm] = useState(null);
    const [kilometrageEstime, setKilometrageEstime] = useState(null);

    useEffect(() => {
        const saved = localStorage.getItem("rappelKilometrage");
        if (saved) {
            const data = JSON.parse(saved);
            if (data.saisieManuelle) {
                setKilometrageEstime(data.saisieManuelle);
            } else if (data.totalKm) {
                setKilometrageEstime(data.totalKm);
            }
        }
    }, []);

    const handleClick = (formName) => {
        setActiveForm(formName);
    };

    const handleKilometrageSave = (km) => {
        setKilometrageEstime(km);
        setActiveForm(null);
    };

    return (
        <div className="rappels-page">
            {activeForm === null && (
                <>
                    {/* Navigation */}
                    <nav className="rappels-nav">
                        <h1>
                            Rappels d'entretien
                            <span className="icon clickable" onClick={() => handleClick("parametres")}>⚙️</span>
                        </h1>
                        <div className="rappels-links">
                            <button onClick={() => handleClick("selection")}>Sélectionner Rappels</button>
                            <button onClick={() => handleClick("trajet")}>Déclarer un trajet inhabituel</button>
                        </div>
                    </nav>

                    {/* Section Estimer kilométrage */}
                    <div className="kilometrage-section">
                        <p className="clickable" onClick={() => handleClick("kilometrage")}>
                            ✅ <span className="text-blue underline">Estimer votre kilométrage</span>
                        </p>
                        <p>
                            Votre kilométrage estimé est de {kilometrageEstime ? `${kilometrageEstime} km` : ".... km"} ✏️
                        </p>
                    </div>

                    {/* Carte Rappels */}
                    <div className="rappel-card">
                        <div className="card-header">
                            <h2>RAPPEL À VENIR</h2>
                            <button className="filter-btn">Filtrer</button>
                        </div>
                        <div className="rappel-list">
                            <div className="rappel-item urgent">
                                <div className="info">
                                    <p className="title">Vidange huile</p>
                                    <p className="date">01/02/2025</p>
                                </div>
                            </div>
                            <div className="rappel-item">
                                <div className="info">
                                    <p className="title">Changement des plaquettes de frein</p>
                                    <p className="date">02/08/2025</p>
                                </div>
                            </div>
                            <div className="rappel-item">
                                <div className="info">
                                    <p className="title">Expiration du document "assurance"</p>
                                    <p className="date">04/09/2025</p>
                                </div>
                            </div>
                        </div>
                        <div className="voir-tout">
                            <a href="#">Voir tout</a>
                        </div>
                    </div>
                </>
            )}

            {/* Formulaires dynamiques */}
            {activeForm === "kilometrage" && <FormulaireKilometrage onSave={handleKilometrageSave} onBack={() => setActiveForm(null)} />}
            {activeForm === "selection" && <SelectionnerRappels onBack={() => setActiveForm(null)} />}
            {activeForm === "trajet" && <FormulaireTrajet onBack={() => setActiveForm(null)} />}
            {activeForm === "parametres" && <FormulaireParametres onBack={() => setActiveForm(null)} />}
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
            finalKm = reponses.saisieManuelle;
        } else if (reponses.estimation === "non") {
            const weekEndKm = (parseInt(reponses.trajetWeekEndJours) || 0) * (parseInt(reponses.trajetWeekEndKm) || 0);
            const semaineKm = (parseInt(reponses.trajetSemaineJours) || 0) * (parseInt(reponses.trajetSemaineKm) || 0);
            finalKm = weekEndKm + semaineKm;
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

            <h2>Estimation kilométrage</h2>

            <select name="estimation" onChange={handleChange}>
                <option value="">-- Estimation mensuelle ? --</option>
                <option value="oui">Oui</option>
                <option value="non">Non</option>
            </select>

            {reponses.estimation === "oui" && (
                <input
                    type="number"
                    name="saisieManuelle"
                    placeholder="Saisir votre kilométrage mensuel"
                    onChange={handleChange}
                />
            )}

            {reponses.estimation === "non" && (
                <>
                    <input type="number" name="trajetWeekEndJours" placeholder="Jours trajet week-end" onChange={handleChange} />
                    <input type="number" name="trajetWeekEndKm" placeholder="Km par jour week-end" onChange={handleChange} />
                    <input type="number" name="trajetSemaineJours" placeholder="Jours trajet semaine" onChange={handleChange} />
                    <input type="number" name="trajetSemaineKm" placeholder="Km par jour semaine" onChange={handleChange} />
                </>
            )}

            <select name="typeTrajet" onChange={handleChange}>
                <option value="">-- Type de trajet --</option>
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

        if (nom === "Remplacement des filtres" && !rappels[nom]) {
            setPopupForm("filtres");
        }

        if (nom === "Contrôle technique" && !rappels[nom]) {
            setPopupForm("controle");
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
        alert("Rappels sélectionnés !");
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

            <select name="declarer" onChange={handleChange}>
                <option value="">-- Déclarer un trajet exceptionnel --</option>
                <option value="oui">Oui</option>
                <option value="non">Non</option>
            </select>

            {trajet.declarer === "oui" && (
                <>
                    <input name="typeTrajet" placeholder="Type de trajet (vacances, travail...)" onChange={handleChange} />
                    <input name="periode" placeholder="Période concernée" onChange={handleChange} />
                    <input name="kmSupp" placeholder="Kilométrage supplémentaire" onChange={handleChange} />
                </>
            )}

            <button onClick={handleSave} className="save-btn">Enregistrer</button>
        </div>
    );
}
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