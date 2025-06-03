import React, { useEffect, useState } from "react";

export default function AccueilApresConnexion() {
    const [prenom, setPrenom] = useState("Utilisateur");
    const [isClient, setIsClient] = useState(false); //  Pour différencier client/serveur
    const [derniereDepense, setDerniereDepense] = useState(null);


    useEffect(() => {
        setIsClient(true); //  Quand la page est bien montée côté client
    }, []);

    useEffect(() => {
        if (!isClient) return;

        const isConnected = localStorage.getItem("isConnected");
        if (!isConnected) {
            window.location.href = "/connexion";
            return;
        }

        const userData = JSON.parse(localStorage.getItem("connectedUser"));
        if (userData && userData.prenom) {
            setPrenom(userData.prenom);
        }

        const revealElements = document.querySelectorAll(".scroll-fade-up");

        const handleScroll = () => {
            revealElements.forEach((el) => {
                const rect = el.getBoundingClientRect();
                const windowHeight = window.innerHeight;

                if (rect.top < windowHeight) {
                    const progress = 1 - rect.top / windowHeight;
                    el.style.opacity = Math.min(progress * 1.5, 1);
                    el.style.transform = `translateY(${40 * (1 - progress)}px)`;
                }
            });
        };

        const depensesData = JSON.parse(localStorage.getItem("depenses")) || [];
        if (depensesData.length > 0) {
            const sorted = [...depensesData].sort((a, b) => new Date(b.date) - new Date(a.date));
            setDerniereDepense(sorted[0]);
        }

        window.addEventListener("scroll", handleScroll);
        handleScroll();

        return () => window.removeEventListener("scroll", handleScroll);
    }, [isClient]); //  Dépend de isClient



    if (!isClient) {
        return null; // Ne rien afficher tant que pas chargé côté client
    }

    return (
         <div className="page-connectee">


            {/* === DASHBOARD === */}
             <div className="dashboard-contenu">
                 <section className="section-dashboard scroll-fade-up" style={{ marginTop: '2rem', fontSize: '2.8rem' }}>
                     <h1>Bienvenue {prenom}</h1>
                     <img src="/image/Give.png" alt="voiture animée" className="car-animation" />
                     <h2 style={{ marginTop: '2rem', fontSize: '1.8rem' }}>Tableau de bord</h2>

                     <div className="carte-scrollable">
                         <div className="scroll-content">
                             <div className="carte-item urgent">
                                 <h3>Rappel manqué</h3>
                                 <p>Vidange huile  10/02/2025</p>
                             </div>
                             <div className="carte-item">
                                 <h3>Prochain rappel</h3>
                                 <p>Changement des plaquettes de freins</p>
                             </div>
                             <div className="carte-item">
                                 <h3>Dernière dépense</h3>
                                 {derniereDepense ? (
                                     <p>{derniereDepense.titre} : {parseFloat(derniereDepense.montant).toFixed(2)} € le {derniereDepense.date}</p>
                                 ) : (
                                     <p>Aucune dépense enregistrée</p>
                                 )}
                             </div>
                             <div className="carte-item">
                                 <h3>Dernière checklist</h3>
                                 <p>Éclairage et signalisation 02/04/2025</p>
                             </div>
                             <div className="carte-item">
                                 <h3>Dernier rapport</h3>
                                 <p>Rapport créé le 12/12/2025.</p>
                             </div>

                         </div>
                     </div>
                 </section>




                {/* === CONTACT === */}
                 <section className="contact-section scroll-fade-up">
                     <h2 style={{ textAlign: "left" }}>Contactez nous</h2>
                     <div className="contact-content">
                         <form className="contact-form">
                             <div className="name-row">
                                 <input type="text" placeholder="Prénom" required />
                                 <input type="text" placeholder="Nom" required />
                             </div>
                             <input type="email" placeholder="Adresse mail" required />
                             <textarea placeholder="Votre message" rows={4} required></textarea>
                             <button type="submit">Envoyer</button>
                         </form>
                         <div className="contact-image">
                             <img src="/image/Bas.jpg" alt="voiture contact" />
                         </div>
                     </div>
                 </section>
            </div>
        </div>
    );
}

