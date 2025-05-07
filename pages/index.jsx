import { useEffect } from 'react';

export default function HomePage() {
    //  Animation au scroll : fait monter le texte doucement pendant qu'on défile
    useEffect(() => {
        const revealElements = document.querySelectorAll('.scroll-fade-up');

        const handleScroll = () => {
            revealElements.forEach(el => {
                const rect = el.getBoundingClientRect();
                const windowHeight = window.innerHeight;

                if (rect.top < windowHeight) {
                    const progress = 1 - rect.top / windowHeight;
                    el.style.opacity = Math.min(progress * 1.5, 1);
                    el.style.transform = `translateY(${40 * (1 - progress)}px)`;
                }
            });
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // pour que ça marche dès le chargement

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);



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

    return (
        <div>
            {/* === NAVBAR === */}
            <nav>
                <div className="left">LOGO</div>
                <div className="right">
                    <a href="#">Accueil</a>
                    <a href="/connexion" className="nav-button">👤 Connexion</a>
                </div>
            </nav>

            {/* === HERO === */}
            <section className="hero white-bg scroll-fade-up">
                <h1>Bienvenue chez KoPylot</h1>
                <img src="/image/voiture.png" alt="voiture" className="car-animation" />
            </section>

            {/* === Partie avec dégradé après animation === */}
            <div className="gradient-bg">
                {/* === INTRO SERVICES === */}
                <section className="services-intro scroll-fade-up">
                    <h1>Nos Prestations</h1>
                    <p>
                        L'entretien de votre voiture devient simple et au juste prix !<br />
                        Chez <strong>KoPylot</strong>, retrouvez l'ensemble des interventions disponibles pour votre véhicule.
                    </p>
                </section>

                {/* === FONCTIONNALITÉS === */}
                <section className="features-stacked">
                    {features.map((feature, index) => (
                        <div
                            className={`feature-row ${index % 2 === 0 ? 'row-left' : 'row-right'} scroll-fade-up`}
                            key={index}
                        >
                            <img src={feature.image} alt={feature.title} />
                            <div className="feature-text">
                                <h3>{feature.title}</h3>
                                <p>{feature.description}</p>
                            </div>
                        </div>
                    ))}
                </section>

                {/* === AVIS === */}
                <section className="avis-section scroll-fade-up">
                    <h2>Ils utilisent KoPylot</h2>
                    <div className="avis-cards">
                        <div className="avis-card">“L’interface est super claire !”</div>
                        <div className="avis-card">“Je ne rate plus un seul entretien.”</div>
                        <div className="avis-card">“Simple, efficace, tout ce que j’aime.”</div>
                    </div>
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

// bar de navigation
HomePage.noNavbar = true;