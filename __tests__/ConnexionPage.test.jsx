import { render, screen } from '@testing-library/react';
import ConnexionPage from '../pages/connexion';

/* simulation du routeur pour jest*/
jest.mock('next/router', () => ({
    useRouter: () => ({
        push: jest.fn(),
    }),
}));

describe('ConnexionPage', () => {
    it('affiche le formulaire de connexion', () => {
        render(<ConnexionPage />);
        expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Mot de passe')).toBeInTheDocument();
        expect(screen.getByText('Se connecter')).toBeInTheDocument();
    });
});
