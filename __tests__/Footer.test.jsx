import { render, screen } from '@testing-library/react';
import Footer from '@/components/Footer';

describe('Footer', () => {
    it('affiche les liens principaux', () => {
        render(<Footer />);

        expect(screen.getByText('Product')).toBeInTheDocument();
        expect(screen.getByText('Features')).toBeInTheDocument();
        expect(screen.getByText('Resources')).toBeInTheDocument();
        expect(screen.getByText('About')).toBeInTheDocument();
        expect(screen.getByText('Blog')).toBeInTheDocument();
        expect(screen.getByText('Support')).toBeInTheDocument();
    });

    it('affiche le logo KoPylot', () => {
        render(<Footer />);
        const image = screen.getByAltText('Logo KoPylot');
        expect(image).toBeInTheDocument();
    });

    it('affiche les liens de réseaux sociaux', () => {
        render(<Footer />);
        const links = screen.getAllByRole('link');
        expect(links.length).toBeGreaterThanOrEqual(8);
    });

    it('affiche les mentions légales', () => {
        render(<Footer />);
        expect(screen.getByText('Privacy')).toBeInTheDocument();
        expect(screen.getByText('Terms')).toBeInTheDocument();
        expect(screen.getByText(/© Junior KoPylot/i)).toBeInTheDocument();
    });
});