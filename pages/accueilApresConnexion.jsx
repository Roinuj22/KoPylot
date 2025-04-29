import React, { useEffect, useState } from "react";

export default function AccueilApresConnexion() {
    const [prenom, setPrenom] = useState("Utilisateur");
    const [isClient, setIsClient] = useState(false); //  Pour différencier client/serveur

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

        window.addEventListener("scroll", handleScroll);
        handleScroll();

        return () => window.removeEventListener("scroll", handleScroll);
    }, [isClient]); //  Dépend de isClient

    const features = [
        {
            title: "Rappels d'entretien",
            description: "Ne ratez plus aucune révision ou contrôle technique. On vous alerte au bon moment, sans stress.",
            image: "/image/Rappel.jpg",
        },
        {
            title: "Checklist",
            description: "Inspectez facilement votre véhicule avec notre checklist guidée. Parfait avant un long trajet ou un contrôle mensuel.",
            image: "/image/Checklist.jpg",
        },
        {
            title: "Suivi des dépenses",
            description: "Gardez un œil sur vos frais auto. Saisissez ou scannez vos factures et suivez vos dépenses avec des stats claires et utiles.",
            image: "/image/depense.png",
        },
        {
            title: "Documents",
            description: "Regroupez tous vos papiers auto au même endroit. Vos factures, assurances ou carte grise sont accessibles en un clic.",
            image: "/image/Document.jpg",
        },
        {
            title: "Rapports véhicule",
            description: "Générez un rapport complet de votre véhicule en quelques secondes. Parfait pour une vente ou un échange avec un pro.",
            image: "/image/Rapport .jpg",
        },
    ];

    if (!isClient) {
        return null; // Ne rien afficher tant que pas chargé côté client
    }

    return (
        <div className="page-connectee">
            {/* === NAVBAR CONNECTÉE === */}
            <nav className="navbar-connectee">
                <div className="nav-left">
                    <a href="/MesVehicules">Mes véhicules</a>
                    <a href="/rappels">Rappels</a>
                    <a href="/cheecklist">Checklist</a>
                    <a href="#">Suivi des dépenses</a>
                    <a href="#">Rapport véhicule</a>
                </div>
                <div className="nav-center logo">KoPylot</div>
                <div className="nav-right">
                    <a href="/profil" className="profile-icon" style={{ textDecoration: "none", fontSize: "1.8rem", color: "#0557d5" }}>
                        👤
                    </a>
                </div>
            </nav>

            {/* === DASHBOARD === */}
            <div className="dashboard-contenu">
                <section className="section-dashboard scroll-fade-up" style={{ marginTop: '2rem', fontSize: '2.8rem' }}>
                    <h1>Bienvenue {prenom} 👋</h1>
                    <img src="/image/voiture.png" alt="voiture animée" className="car-animation" />
                    <h2 style={{ marginTop: '2rem', fontSize: '1.8rem' }}>Tableau de bord</h2>
                    <img src="/image/tableau-de-bord.jpg" alt="tableau de bord" className="dashboard-img" />
                </section>

                {/* === FEATURES === */}
                <section className="features-stacked">
                    {features.map((feature, index) => (
                        <div className={`feature-row ${index % 2 === 0 ? 'row-left' : 'row-right'} scroll-fade-up`} key={index}>
                            <img src={feature.image} alt={feature.title} />
                            <div className="feature-text">
                                <h3>
                                    <a href="#" style={{ textDecoration: "none", color: "inherit" }}>
                                        {feature.title}
                                    </a>
                                </h3>
                                <p>{feature.description}</p>
                            </div>
                        </div>
                    ))}
                </section>

                {/* === CONTACT === */}
                <section className="contact-section scroll-fade-up">
                    <h2>Contact</h2>
                    <div className="contact-content">
                        <form className="contact-form">
                            <input type="text" placeholder="Nom" required />
                            <input type="email" placeholder="Email" required />
                            <textarea placeholder="Message" rows={4} required></textarea>
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