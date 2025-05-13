import '../styles/globals.css';


import '../styles/main.css';
import '../styles/connexion.css';
import '../styles/inscription.css';
import '../styles/accueilApresConnexion.css';
import '../styles/MesVehicules.css';
import '../styles/profil.css';
import '../styles/rappels.css';
import '../styles/checklist.css';
import '../styles/rapportVehicule.css';
import '../styles/navbar.css';
import '../styles/footer.css';
import '../styles/parametre.css';
import '../styles/globals.css';




import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '@fortawesome/fontawesome-free/css/all.min.css';

import { ThemeProvider } from '../components/ThemeContext';


export default function MyApp({ Component, pageProps }) {
    const showNavbar = !Component.noNavbar;

    return (
        <ThemeProvider>
            {showNavbar && <Navbar />}
            <Component {...pageProps} />
            <Footer />
        </ThemeProvider>
    );
}
