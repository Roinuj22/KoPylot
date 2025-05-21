import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { User } from "lucide-react";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="navbar">
            <div className="nav-left">
                <Image
                    src="/image/Logo.png"
                    alt="Logo KoPylot"
                    width={150}
                    height={50}
                    className="logo-image"
                    priority
                />
            </div>

            <div className="nav-center">
                <Link href="/MesVehicules">Mes véhicules</Link>
                <Link href="/rappels">Rappels</Link>
                <Link href="/checklist">Checklist</Link>
                <Link href="/Depenses">Suivi des dépenses</Link>
                <Link href="/rapportVehicule">Rapport véhicule</Link>
                <Link href="/PlanEntretien">Plan Entretien</Link>
            </div>

            <div className="nav-right">
                <button className="profile-button" onClick={toggleMenu}>
                    <User size={45} color="black" />
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
    );
}