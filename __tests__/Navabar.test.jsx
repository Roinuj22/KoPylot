import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from '@/components/Navbar';

describe('Navbar', () => {
    it('affiche les liens principaux', () => {
        render(<Navbar />);

        expect(screen.getByText('Mes véhicules')).toBeInTheDocument();
        expect(screen.getByText('Rappels')).toBeInTheDocument();
        expect(screen.getByText('Checklist')).toBeInTheDocument();
        expect(screen.getByText('Suivi des dépenses')).toBeInTheDocument();
        expect(screen.getByText('Rapport véhicule')).toBeInTheDocument();
        expect(screen.getByText('Plan Entretien')).toBeInTheDocument();
    });

    it('affiche le menu utilisateur au clic', () => {
        render(<Navbar />);

        const profileButton = screen.getByRole('button');
        fireEvent.click(profileButton);

        expect(screen.getByText('Mon profil')).toBeInTheDocument();
        expect(screen.getByText('Documents')).toBeInTheDocument();
        expect(screen.getByText('Paramètres')).toBeInTheDocument();
        expect(screen.getByText('Se déconnecter')).toBeInTheDocument();
    });
});