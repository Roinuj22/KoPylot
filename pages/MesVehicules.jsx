import React, { useState, useEffect } from "react";

const suggestions = {
    marque: ["Peugeot", "Renault", "Toyota", "BMW", "Audi", "Mercedes"],
    modele: ["208", "Clio", "Yaris", "A3", "Classe C", "Corolla"],
    carburant: ["Essence", "Diesel", "Hybride", "Électrique"],
    boite: ["Manuelle", "Automatique"],
    places: ["2", "4", "5", "7"],
    type: ["Berline", "SUV", "Coupé", "Break", "Cabriolet"],
    categorie: ["Citadine", "Familiale", "Sportive", "Utilitaire"],
    label: ["Neuf", "Occasion", "Récent"],
    couleur: ["Blanc", "Noir", "Gris", "Bleu", "Rouge", "Vert"],
    utilisation: ["Personnel", "Professionnel", "Mixte"],
    assurance: ["Tous risques", "Tiers étendu", "Tiers simple"],
    maintenance: ["Oui", "Non"],
};

export default function MesVehicules() {
    const [vehicule, setVehicule] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [formStep, setFormStep] = useState(1);
    const [formData, setFormData] = useState({});
    const [etatVehicule, setEtatVehicule] = useState("");
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [messagePro, setMessagePro] = useState("");

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem("kopylotVehicule"));
        if (saved) setVehicule(saved);
    }, []);

    const handleAddClick = () => {
        if (vehicule) {
            setMessagePro("Vous devez souscrire à la version Pro pour ajouter un autre véhicule.");
        } else {
            setShowForm(true);
            setMessagePro("");
        }
    };

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        localStorage.setItem("kopylotVehicule", JSON.stringify(formData));
        setVehicule(formData);
        setShowForm(false);
        setFormStep(1);
    };

    const handleAction = (action) => {
        setDropdownVisible(false);
        if (action === "supprimer") {
            localStorage.removeItem("kopylotVehicule");
            setVehicule(null);
            setEtatVehicule("");
        } else if (action === "modifier") {
            setFormData(vehicule);
            setShowForm(true);
        } else if (action === "hors service") {
            setEtatVehicule("Hors service");
        } else if (action === "vendu") {
            setEtatVehicule("Vendu");
        }
    };

    return (
        <div className="mes-vehicules">
            <div className="header">
                <div className="logo-vehicules">KoPylot</div>
                <h1 style={{ fontSize: "2.8rem" }}>Mes véhicules</h1>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <button onClick={handleAddClick} className="ajouter-btn">➕</button>
                    <span className="ajouter-texte">Ajouter un véhicule</span>
                </div>
            </div>

            {messagePro && <p className="message-pro">{messagePro}</p>}

            {showForm && (
                <form onSubmit={handleSubmit} className="formulaire-vehicule">
                    {formStep === 1 && (
                        <>
                            <h2>Informations techniques</h2>
                            <input name="immatriculation" placeholder="Immatriculation" value={formData.immatriculation || ""} onChange={handleChange} required />
                            <select name="marque" value={formData.marque || ""} onChange={handleChange} required>
                                <option value="">Marque</option>
                                {suggestions.marque.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                            <select name="modele" value={formData.modele || ""} onChange={handleChange} required>
                                <option value="">Modèle</option>
                                {suggestions.modele.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                            <select name="carburant" value={formData.carburant || ""} onChange={handleChange} required>
                                <option value="">Type de carburant</option>
                                {suggestions.carburant.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            <input name="puissance" placeholder="Puissance (ch)" value={formData.puissance || ""} onChange={handleChange} required />
                            <select name="boite" value={formData.boite || ""} onChange={handleChange} required>
                                <option value="">Boîte de vitesse</option>
                                {suggestions.boite.map(b => <option key={b} value={b}>{b}</option>)}
                            </select>
                            <input name="cylindree" placeholder="Cylindrée (cm3)" value={formData.cylindree || ""} onChange={handleChange} required />
                            <label>Date de 1ère mise en circulation</label>
                            <input type="date" name="dateCirculation" value={formData.dateCirculation || ""} onChange={handleChange} required />
                            <select name="places" value={formData.places || ""} onChange={handleChange} required>
                                <option value="">Nombre de places</option>
                                {suggestions.places.map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                            <input name="numeroSerie" placeholder="Numéro de série" value={formData.numeroSerie || ""} onChange={handleChange} required />
                            <input name="finition" placeholder="Finition (optionnel)" value={formData.finition || ""} onChange={handleChange} />
                            <input name="kilometreActuel" placeholder="Kilométrage actuel" value={formData.kilometreActuel || ""} onChange={handleChange} />
                            <label>Date d'achat (optionnel)</label>
                            <input type="date" name="dateAchat" value={formData.dateAchat || ""} onChange={handleChange} />
                            <input name="nbProprietaires" placeholder="Nombre de propriétaires précédents" value={formData.nbProprietaires || ""} onChange={handleChange} />
                            <button type="button" onClick={() => setFormStep(2)}>Suivant</button>
                        </>
                    )}

                    {formStep === 2 && (
                        <>
                            <h2>Carrosserie</h2>
                            <select name="typeCarrosserie" value={formData.typeCarrosserie || ""} onChange={handleChange}>
                                <option value="">Type</option>
                                {suggestions.type.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                            <select name="categorie" value={formData.categorie || ""} onChange={handleChange}>
                                <option value="">Catégorie</option>
                                {suggestions.categorie.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            <select name="label" value={formData.label || ""} onChange={handleChange}>
                                <option value="">Label</option>
                                {suggestions.label.map(l => <option key={l} value={l}>{l}</option>)}
                            </select>
                            <select name="couleur" value={formData.couleur || ""} onChange={handleChange}>
                                <option value="">Couleur</option>
                                {suggestions.couleur.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            <h2>Utilisation et Assurance</h2>
                            <select name="utilisationPrincipale" value={formData.utilisationPrincipale || ""} onChange={handleChange}>
                                <option value="">Utilisation principale</option>
                                {suggestions.utilisation.map(u => <option key={u} value={u}>{u}</option>)}
                            </select>
                            <select name="assurance" value={formData.assurance || ""} onChange={handleChange}>
                                <option value="">Type d'assurance</option>
                                {suggestions.assurance.map(a => <option key={a} value={a}>{a}</option>)}
                            </select>
                            <button type="button" onClick={() => setFormStep(3)}>Suivant</button>
                        </>
                    )}

                    {formStep === 3 && (
                        <>
                            <h2>Maintenance</h2>
                            <select name="climatisation" value={formData.climatisation || ""} onChange={handleChange}>
                                <option value="">Climatisation</option>
                                {suggestions.maintenance.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                            <select name="essuieGlaceArriere" value={formData.essuieGlaceArriere || ""} onChange={handleChange}>
                                <option value="">Essuie-glace arrière</option>
                                {suggestions.maintenance.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                            <select name="transmission" value={formData.transmission || ""} onChange={handleChange}>
                                <option value="">Transmission</option>
                                {suggestions.maintenance.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                            <select name="freinArriere" value={formData.freinArriere || ""} onChange={handleChange}>
                                <option value="">Frein arrière</option>
                                {suggestions.maintenance.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                            <select name="courroieMoteur" value={formData.courroieMoteur || ""} onChange={handleChange}>
                                <option value="">Courroie moteur</option>
                                {suggestions.maintenance.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                            <button type="submit">Ajouter</button>
                        </>
                    )}
                </form>
            )}

            {vehicule && (
                <div className="carte-vehicule">
                    <div className="image-zone">
                        <img src="/image/vehicule.png" alt="Véhicule" />
                    </div>
                    <div className="infos">
                        <h3>{vehicule.marque}</h3>
                        <p>{vehicule.modele}</p>
                        <p>{vehicule.immatriculation}</p>
                        {etatVehicule && (
                            <p className={`etat ${etatVehicule === "Hors service" ? "hors-service" : "vendu"}`}>{etatVehicule}</p>
                        )}
                    </div>
                    <div className={`actions ${dropdownVisible ? 'show' : ''}`}>
                        <button onClick={() => setDropdownVisible(prev => !prev)}>⋮</button>
                        {dropdownVisible && (
                            <div className="dropdown">
                                <ul>
                                    <li onClick={() => handleAction("modifier")}>Modifier</li>
                                    <li onClick={() => handleAction("supprimer")}>Supprimer</li>
                                    <li onClick={() => handleAction("hors service")}>Hors service</li>
                                    <li onClick={() => handleAction("vendu")}>Vendu</li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}