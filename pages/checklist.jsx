import React, { useState } from "react";
import { AlertTriangle } from 'lucide-react';

const CarDisplay = () => {
    const [isPaused, setIsPaused] = useState(false);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [popupType, setPopupType] = useState(null);

    const handleMouseEnter = () => {
        setIsPaused(true);
    };

    const handleMouseLeave = () => {
        setIsPaused(false);
    };

    return (
        <div className="cheeklist-page">
            <h1 className="page-title">Checklist de contrôle de véhicule</h1>

            <div className="car-container">
                <div
                    className={`car-rotation-wrapper ${isPaused ? "paused" : ""}`}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <img src="/image/Give.png" alt="Voiture" className="rotating-car" />

                    {/* Hotspots */}
                    <button className="hotspot" style={{ top: "28%", left: "17%" }} onClick={() => { setPopupType('eclairage'); setIsPopupOpen(true); }}>+</button>
                    <button className="hotspot" style={{ top: "24%", left: "32%" }} onClick={() => { setPopupType('moteur'); setIsPopupOpen(true); }}>+</button>
                    <button className="hotspot" style={{ top: "20%", left: "50%" }} onClick={() => { setPopupType('securite'); setIsPopupOpen(true); }}>+</button>
                    <button className="hotspot" style={{ top: "35%", left: "65%" }} onClick={() => { setPopupType('exterieur'); setIsPopupOpen(true); }}>+</button>
                    <button className="hotspot" style={{ top: "42%", left: "83%" }} onClick={() => { setPopupType('pneumatiques'); setIsPopupOpen(true); }}>+</button>
                </div>
            </div>

            <div className="recap-card">
                <div className="recap-header">
                    <h2>RECAPITULATIF</h2>
                    <label htmlFor="file-upload" className="export-btn">Exporter PDF</label>
                    <input id="file-upload" type="file" accept="application/pdf" style={{ display: 'none' }} onChange={(e) => console.log(e.target.files[0])} />
                </div>
                <hr className="separator" />
                <ul className="recap-list">
                    <li><span className="label"><strong>Extérieur du véhicule</strong> <em>01/02/2025</em></span></li>
                    <li className="with-warning"><span className="label"><strong>Éclairage et signalisation</strong> <em>02/02/2025</em></span><AlertTriangle className="warning-icon" /></li>
                    <li><span className="label"><strong>Pneumatiques</strong> <em>03/03/2025</em></span></li>
                    <li><span className="label"><strong>Moteur & compartiment avant</strong> <em>25/02/2025</em></span></li>
                    <li className="with-warning"><span className="label"><strong>Sécurité & documents à bord</strong> <em>25/02/2025</em></span><AlertTriangle className="warning-icon" /></li>
                </ul>
            </div>

            {isPopupOpen && (
                popupType === 'pneumatiques' ? (
                    <PneumatiquesSection onClose={() => setIsPopupOpen(false)} />
                ) : (
                    <div className="popup-overlay">
                        <div className="popup-content">
                            <button className="close-btn" onClick={() => setIsPopupOpen(false)}>×</button>
                            <h2 className="popup-title">
                                {popupType === 'eclairage' && 'Éclairage et signalisation'}
                                {popupType === 'moteur' && 'Moteur & compartiment avant'}
                                {popupType === 'exterieur' && 'Extérieur du véhicule'}
                                {popupType === 'securite' && 'Éléments de sécurité & documents à bord'}
                            </h2>

                            <div className="popup-body">
                                <div className="popup-left">
                                    {popupType === 'eclairage' && (
                                        <>
                                            <label><input type="checkbox" /> Feux de croisement</label>
                                            <label><input type="checkbox" /> Feux de route <span className="popup-note">(phares)</span></label>
                                            <label><input type="checkbox" /> Clignotants <span className="popup-note">(avant/arrière, gauche/droite)</span></label>
                                            <label><input type="checkbox" /> Feux stop</label>
                                            <label><input type="checkbox" /> Feux de recul</label>
                                        </>
                                    )}
                                    {popupType === 'moteur' && (
                                        <>
                                            <label><input type="checkbox" /> Niveau d’huile moteur <span className="popup-note">(à froid, véhicule à plat)</span></label>
                                            <label><input type="checkbox" /> Liquide de refroidissement</label>
                                            <label><input type="checkbox" /> Liquide de frein</label>
                                            <label><input type="checkbox" /> Liquide lave-glace <span className="popup-note">(activer le lave glace pour vérifier)</span></label>
                                            <label><input type="checkbox" /> Voyants d’alerte allumés</label>
                                        </>
                                    )}
                                    {popupType === 'exterieur' && (
                                        <>
                                            <label><input type="checkbox" /> Propreté générale de la carrosserie <span className="popup-note">(pas de salissures bloquant les phares ou plaques)</span></label>
                                            <label><input type="checkbox" /> État de la carrosserie <span className="popup-note">(bosses, rayures, rouille, fissures)</span></label>
                                            <label><input type="checkbox" /> Capot et coffre se ferment correctement</label>
                                            <label><input type="checkbox" /> Balais d’essuie-glace fonctionnels <span className="popup-note">(avant & arrière)</span></label>
                                        </>
                                    )}
                                    {popupType === 'securite' && (
                                        <>
                                            <label><input type="checkbox" /> Gilet jaune</label>
                                            <label><input type="checkbox" /> Triangle de signalisation</label>
                                            <label><input type="checkbox" /> Carte grise <span className="popup-note">(copie ou originale)</span></label>
                                            <label><input type="checkbox" /> Attestation d’assurance</label>
                                            <label><input type="checkbox" /> Contrôle technique à jour</label>
                                            <label><input type="checkbox" /> Permis de conduire <span className="popup-note">(conducteur désigné)</span></label>
                                        </>
                                    )}
                                </div>

                                <div className="popup-right">
                                    <div className="popup-links">
                                        <a href="#">Voir tutoriel</a>
                                        <a href="#">Voir explication</a>
                                    </div>
                                    <div className="popup-video">
                                        <div className="video-player">
                                            <div className="play-button"></div>
                                        </div>
                                    </div>
                                    <div className="popup-footer">
                                        <button className="save-btn" onClick={() => setIsPopupOpen(false)}>Enregistrer</button>
                                    </div>
                                </div>
                            </div>


                        </div>
                    </div>
                )
            )}
        </div>
    );
};

//  Pneumatiques Section
const PneumatiquesSection = ({ onClose }) => {
    const [active, setActive] = useState(null);

    const toggle = (section) => {
        setActive(prev => (prev === section ? null : section));
    };

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <button className="close-btn" onClick={onClose}>×</button>
                <h2 className="popup-title">Pneumatiques</h2>

                <div className="popup-body">
                    <div className="popup-left">
                        <div className="checkbox-group">
                            <p><label>
                                <input type="checkbox" onChange={() => toggle('pneus')} />
                                Pneus visiblement en bon état
                            </label> </p>
                            {active === 'pneus' && (
                                <div className="subsection sleek-sub">
                                    <div className="sub-row">
                                        <span>Crevaison ?</span>
                                        <label><input type="checkbox" /> Oui</label>
                                        <label><input type="checkbox" /> Non</label>
                                    </div>
                                    <div className="sub-row">
                                        <span>Déformation ?</span>
                                        <label><input type="checkbox" /> Oui</label>
                                        <label><input type="checkbox" /> Non</label>
                                    </div>
                                    <div className="description-block">
                                        <label>Ajouter une description</label>
                                        <textarea placeholder="Décrivez ici..." />
                                        <button className="upload-btn">Ajouter photo</button>
                                    </div>
                                </div>
                            )}

                            <p><label>
                                <input type="checkbox" onChange={() => toggle('pression')} />
                                Vérification de la pression des pneus
                            </label></p>
                            {active === 'pression' && (
                                <div className="subsection sleek-sub">
                                    <div className="sub-row">
                                        <span>Témoin allumé ?</span>
                                        <label><input type="checkbox" /> Oui</label>
                                        <label><input type="checkbox" /> Non</label>
                                    </div>
                                    <div className="description-block">
                                        <label>Ajouter une description</label>
                                        <textarea placeholder="Décrivez ici..." />
                                        <button className="upload-btn">Ajouter photo</button>
                                    </div>
                                </div>
                            )}

                           <p><label>
                               <input type="checkbox" onChange={() => toggle('roue')} />
                               Vérification de la roue de secours
                           </label></p>
                            {active === 'roue' && (
                                <div className="subsection sleek-sub">
                                    <div className="sub-row">
                                        <span>Présente ?</span>
                                        <label><input type="checkbox" /> Oui</label>
                                        <label><input type="checkbox" /> Non</label>
                                    </div>
                                    <div className="description-block">
                                        <label>Ajouter une description</label>
                                        <textarea placeholder="Décrivez ici..." />
                                        <button className="upload-btn">Ajouter photo</button>
                                    </div>
                                </div>
                            )}

                            <p><label>
                                <input type="checkbox" onChange={() => toggle('kit')} />
                                Présence du kit de réparation / cric / clé démonte-roue
                            </label></p>
                            {active === 'kit' && (
                                <div className="subsection sleek-sub">
                                    <div className="sub-row">
                                        <span>Kit réparation ?</span>
                                        <label><input type="checkbox" /> Oui</label>
                                        <label><input type="checkbox" /> Non</label>
                                    </div>
                                    <div className="sub-row">
                                        <span>Cric ?</span>
                                        <label><input type="checkbox" /> Oui</label>
                                        <label><input type="checkbox" /> Non</label>
                                    </div>
                                    <div className="sub-row">
                                        <span>Clé démonte-roue ?</span>
                                        <label><input type="checkbox" /> Oui</label>
                                        <label><input type="checkbox" /> Non</label>
                                    </div>
                                    <div className="description-block">
                                        <label>Ajouter une description</label>
                                        <textarea placeholder="Décrivez ici..." />
                                        <button className="upload-btn">Ajouter photo</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="popup-right">
                        <div className="popup-links">
                            <a href="#">Voir tutoriel</a>
                            <a href="#">Voir explication</a>
                        </div>
                        <div className="popup-video">
                            <div className="video-player">
                                <div className="play-button"></div>
                            </div>
                        </div>

                        <div className="popup-footer">
                            <button className="save-btn" onClick={onClose}>Enregistrer</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

};

export default CarDisplay;