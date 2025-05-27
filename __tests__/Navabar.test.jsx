import { render, screen, fireEvent, within } from '@testing-library/react';
import Navbar from '@/components/Navbar';
import { useRouter } from 'next/router';

jest.mock('next/router', () => ({
    useRouter: jest.fn(),
}));

beforeEach(() => {
    useRouter.mockReturnValue({
        pathname: '/',
        push: jest.fn(),
    });
});

describe('Navbar', () => {
    it('affiche les liens principaux', () => {
        render(<Navbar />);
        expect(screen.getByText('Mes véhicules')).toBeInTheDocument();
        expect(screen.getByText('Rappels')).toBeInTheDocument();
        expect(screen.getByText('Checklist')).toBeInTheDocument();
        expect(screen.getByText('Suivi de dépenses')).toBeInTheDocument();
        expect(screen.getByText('Rapport')).toBeInTheDocument();
    });

    it('affiche le menu utilisateur au clic (desktop)', () => {
        render(<Navbar />);

        const profileButton = screen.getByLabelText('Menu utilisateur desktop');
        fireEvent.click(profileButton);

        const profilePopup = document.querySelector('.profile-popup');
        const { getByText } = within(profilePopup);

        expect(getByText('Mon profil')).toBeInTheDocument();
        expect(getByText('Documents')).toBeInTheDocument();
        expect(getByText('Paramètres')).toBeInTheDocument();
        expect(getByText('Se déconnecter')).toBeInTheDocument();
    });
});