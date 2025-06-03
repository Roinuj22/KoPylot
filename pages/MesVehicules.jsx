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
    const [isClient, setIsClient] = useState(false); //  Sécurité Next.js

    useEffect(() => {
        setIsClient(true);
    }, []);

    // test sans appelle à l'API mettre en Cm et faire appelle à l'API
    const simulateFetchVehiculeInfo = (plaque) => {
        if (plaque === "AB123CD") {
            const fakeData = {
                marque: "Peugeot",
                modele: "308",
                carburant: "Essence",
                puissance: "130",
                boite: "Manuelle",
                cylindree: "1199",
                dateCirculation: "2020-06-01",
                places: "5",
                numeroSerie: "VF3ABC12345678901",
                immatriculation: "AB123CD",
            };
            setFormData(fakeData);
        }
    };


    useEffect(() => {

        const isTesting = typeof window !== 'undefined' && window.Cypress;
        if (!isClient && !isTesting) return;   //  Cypress OK et Empêche erreurs Vercel

        const saved = JSON.parse(localStorage.getItem("kopylotVehicule"));
        if (saved) setVehicule(saved);
    }, [isClient]);

    /*Appelle de l'API */
    const fetchVehiculeInfo = async (plaque) => {
        try {
            const response = await fetch(`/api/vehicule?plaque=${plaque}&mileage=50000&age=48&mode=top3`);
            const data = await response.json();
            console.log("API response:", data); // ← pour confirmer que l'appel fonctionne

            if (data?.car_identification?.brand) {
                remplirFormulaireDepuisAPI(data.car_identification);
            }
        } catch (error) {
            console.error("Erreur API:", error);
        }
    };

    const remplirFormulaireDepuisAPI = (data) => {
        console.log("🔍 Données API reçues :", data);

        setFormData((prev) => ({
            ...prev,
            marque: data.brand || "",
            modele: data.model_name || data.model_base || "",
            carburant: data.energy_name || "",
            puissance: data.real_power || "",
            boite: data.gearbox_name || "",
            cylindree: data.engine_size || "",
            dateCirculation: data.date_pme || "",
            places: data.nb_seats?.toString() || "",
            numeroSerie: data.vin || "",
            immatriculation: data.reg_plate || "",
        }));
    };

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

        console.log("SUBMIT appelé avec :", formData);

        localStorage.setItem("kopylotVehicule", JSON.stringify(formData));
        setVehicule(formData);
        setShowForm(false);
        setFormStep(1);
    };

    const toggleEtat = (etat) => {
        setDropdownVisible(false);
        if (etatVehicule === etat) {
            setEtatVehicule("");
        } else {
            setEtatVehicule(etat);
        }
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

    if (!isClient) return null; //  Ne rien afficher tant que ce n'est pas côté client

    return (
        <div className="mes-vehicules">
            {/* HEADER */}
            <div className="header">
                <h1 className="titre-vehicules">Mes véhicules</h1>
                <span className="ajouter-vehicule" onClick={handleAddClick}>
                    Ajouter véhicule
                </span>
            </div>

            {/* Message Pro */}
            {messagePro && <p className="message-pro">{messagePro}</p>}

            {/* FORMULAIRE AJOUT */}
            {showForm && (
                <form onSubmit={handleSubmit} className="formulaire-vehicule">
                    {formStep === 1 && (
                        <>
                            <h2>Informations techniques</h2>
                            <input
                                name="immatriculation"
                                placeholder="Immatriculation"
                                value={formData.immatriculation || ""}
                                onChange={(e) => {
                                    const val = e.target.value.toUpperCase();

                                    // Met à jour l'état dès maintenant
                                    setFormData((prev) => ({ ...prev, immatriculation: val }));

                                    // Si format FR plausible, appelle l’API
                                    if (/^[A-Z0-9]{6,10}$/.test(val)) {
                                        /*fetchVehiculeInfo(val);*/
                                        simulateFetchVehiculeInfo(val);
                                    }
                                }}
                                required
                            />

                            {/* Selects avec valeur dynamique */}
                            <select
                                name="marque"
                                value={formData.marque || ""}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Marque</option>
                                {formData.marque && !suggestions.marque.includes(formData.marque) && (
                                    <option value={formData.marque}>{formData.marque}</option>
                                )}
                                {suggestions.marque.map((m) => (
                                    <option key={m} value={m}>{m}</option>
                                ))}
                            </select>

                            <select
                                name="modele"
                                value={formData.modele || ""}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Modèle</option>
                                {formData.modele && !suggestions.modele.includes(formData.modele) && (
                                    <option value={formData.modele}>{formData.modele}</option>
                                )}
                                {suggestions.modele.map((m) => (
                                    <option key={m} value={m}>{m}</option>
                                ))}
                            </select>

                            <select
                                name="carburant"
                                value={formData.carburant || ""}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Type de carburant</option>
                                {formData.carburant && !suggestions.carburant.includes(formData.carburant) && (
                                    <option value={formData.carburant}>{formData.carburant}</option>
                                )}
                                {suggestions.carburant.map((c) => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>

                            <input
                                name="puissance"
                                placeholder="Puissance (ch)"
                                value={formData.puissance || ""}
                                onChange={handleChange}
                                required
                            />

                            <select
                                name="boite"
                                value={formData.boite || ""}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Boîte de vitesse</option>
                                {formData.boite && !suggestions.boite.includes(formData.boite) && (
                                    <option value={formData.boite}>{formData.boite}</option>
                                )}
                                {suggestions.boite.map((b) => (
                                    <option key={b} value={b}>{b}</option>
                                ))}
                            </select>

                            <input
                                name="cylindree"
                                placeholder="Cylindrée (cm3)"
                                value={formData.cylindree || ""}
                                onChange={handleChange}
                                required
                            />

                            <label>Date de 1ère mise en circulation</label>
                            <input
                                type="date"
                                name="dateCirculation"
                                value={formData.dateCirculation || ""}
                                onChange={handleChange}
                                required
                            />

                            <select
                                name="places"
                                value={formData.places || ""}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Nombre de places</option>
                                {formData.places && !suggestions.places.includes(formData.places) && (
                                    <option value={formData.places}>{formData.places}</option>
                                )}
                                {suggestions.places.map((p) => (
                                    <option key={p} value={p}>{p}</option>
                                ))}
                            </select>

                            <input
                                name="numeroSerie"
                                placeholder="Numéro de série"
                                value={formData.numeroSerie || ""}
                                onChange={handleChange}
                                required
                            />
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

            {/* CARTE VEHICULE */}
            {vehicule && (
                <div className="carte-vehicule">
                    <div className="image-zone">
                        <img src="/image/Photo%20ID%20véhicule.png" alt="Véhicule" />
                    </div>
                    <div className="infos">
                        <label>Marque</label>
                        <h1>{vehicule.marque}</h1>
                        <label>Modèle</label>
                        <h1>{vehicule.modele}</h1>
                        <label>Date 1ère immatriculation</label>
                        <h1>{vehicule.dateCirculation}</h1>

                        {etatVehicule && (
                            <p className={`etat ${etatVehicule === "Hors service" ? "hors-service" : "vendu"}`}>
                                {etatVehicule}
                            </p>
                        )}
                    </div>
                    <div className={`actions ${dropdownVisible ? 'show' : ''}`}>
                        <button onClick={() => setDropdownVisible(prev => !prev)}>⋮</button>
                        {dropdownVisible && (
                            <div className="dropdown">
                                <ul>
                                    <li onClick={() => handleAction("modifier")}>Modifier</li>
                                    <li onClick={() => toggleEtat("vendu")}>Vendu</li>
                                    <li onClick={() => toggleEtat("hors service")}>Hors service</li>
                                    <li style={{ background: "red" }} onClick={() => handleAction("supprimer")}>Supprimer</li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}