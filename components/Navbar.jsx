import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import {
    BellRing,
    FolderOpen,
    CarFront,
    Euro,
    ClipboardCheck,
    User,
    FileText
} from "lucide-react";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const router = useRouter();
    const path = router.pathname;
    const isActive = (route) => path === route;

    return (
        <>
            {/* ======= Desktop Navbar ======= */}
            <nav className="navbar">
                <div className="nav-left">
                    <Link href="/rappels">Rappels</Link>
                    <Link href="/checklist">Checklist</Link>
                    <Link href="/Depenses">Suivi de dépenses</Link>
                    <Link href="/rapportVehicule">Rapport</Link>
                </div>

                <div className="nav-logo">
                    <Link href="/">
                        <Image
                            src="/image/Logo.png"
                            alt="Logo KoPylot"
                            width={170}
                            height={60}
                            className="logo-image"
                            priority
                        />
                    </Link>
                </div>

                <div className="nav-right">
                    <Link href="/MesVehicules">Mes véhicules</Link>
                    <button className="profile-button" onClick={toggleMenu} aria-label="Menu utilisateur desktop">
                        <User size={40} color="black" />
                    </button>
                    {isMenuOpen && (
                        <div className="profile-popup">
                            <Link href="/profil">Mon profil</Link>
                            <Link href="/document">Documents</Link>
                            <Link href="/parametre">Paramètres</Link>
                            <Link href="/" className="logout">Se déconnecter</Link>
                        </div>
                    )}
                </div>
            </nav>

            {/* ======= Mobile Header ======= */}
            <header className="mobile-header">
                <Link href="/">
                    <Image src="/image/Logo.png" alt="Logo" width={130} height={45} priority />
                </Link>
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="user-icon" aria-label="Menu utilisateur mobile">
                    <User size={32} />
                </button>
                {isMenuOpen && (
                    <div className="profile-popup mobile">
                        <Link href="/profil">Mon profil</Link>
                        <Link href="/document">Documents</Link>
                        <Link href="/parametre">Paramètres</Link>
                        <Link href="/" className="logout">Se déconnecter</Link>
                    </div>
                )}
            </header>

            {/* ======= Mobile Bottom Nav ======= */}
            <nav className="mobile-nav">
                <Link href="/rappels" className={isActive("/rappels") ? "active" : ""}><BellRing size={24} /></Link>
                <Link href="/checklist" className={isActive("/checklist") ? "active" : ""}><ClipboardCheck size={24} /></Link>
                <Link href="/MesVehicules" className={isActive("/MesVehicules") ? "active" : ""}><CarFront size={28} /></Link>
                <Link href="/Depenses" className={isActive("/Depenses") ? "active" : ""}><Euro size={24} /></Link>
                <Link href="/rapportVehicule" className={isActive("/rapportVehicule") ? "active" : ""}><FileText size={24} /></Link>
            </nav>
        </>
    );
}