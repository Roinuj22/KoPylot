import { render, screen } from '@testing-library/react';
import HomePage from '../pages/index';

describe('HomePage', () => {
    it('affiche le titre principal', () => {
        render(<HomePage />);
        expect(screen.getByText('Bienvenue chez KoPylot')).toBeInTheDocument();
    });

    it('affiche les prestations', () => {
        render(<HomePage />);
        expect(screen.getByText('Nos Prestations')).toBeInTheDocument();
    });

    it('affiche les avis utilisateurs', () => {
        render(<HomePage />);
        expect(screen.getByText('Ils utilisent KoPylot')).toBeInTheDocument();
    });

    it('affiche la section contact', () => {
        render(<HomePage />);
        expect(screen.getByText('Contact')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Nom')).toBeInTheDocument();
    });
});