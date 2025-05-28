import React from 'react';
import Link from 'next/link';
import Image from 'next/image';


export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-top">
                <Link href="#">A propos</Link>
                <Link href="#">Contact</Link>
                <Link href="#">Actualités</Link>
                <Link href="#">FAQ</Link>
                <Link href="#">Forum</Link>
                <Link href="#">Une idée?</Link>
            </div>

            <div className="footer-logo">
                <Image
                    src="/image/Logo.png"
                    alt="Logo KoPylot"
                    width={150}
                    height={50}
                    priority
                />
            </div>

            <hr className="footer-divider" />

            <div className="footer-socials">
                <a href="#"><i className="fab fa-facebook-f"></i></a>
                <a href="#"><i className="fab fa-linkedin-in"></i></a>
                <a href="#"><i className="fab fa-youtube"></i></a>
                <a href="#"><i className="fab fa-instagram"></i></a>
                <a href="#"><i className="fab fa-tiktok"></i></a>
            </div>

            <div className="footer-bottom">
                <p>© Junior KoPylot</p>
                <div className="footer-links">
                    <Link href="#">Privacy</Link>
                    <span>–</span>
                    <Link href="#">Terms</Link>
                </div>
            </div>
        </footer>
    );
}