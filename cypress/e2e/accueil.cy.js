describe('Accueil après connexion', () => {
    beforeEach(() => {
        const fakeUser = {
            nom: 'Doe',
            prenom: 'Jean',
            email: 'jean.doe@mail.com',
            password: '1234',
            ville: 'Paris',
            pays: 'France',
        };
        const fakeDepenses = [
            { titre: 'Carburant', montant: '60', date: '2025-04-01' },
        ];

        // Simuler un utilisateur connecté et une dépense
        window.localStorage.setItem('isConnected', 'true');
        window.localStorage.setItem('connectedUser', JSON.stringify(fakeUser));
        window.localStorage.setItem('depenses', JSON.stringify(fakeDepenses));

        cy.visit('http://localhost:3000/accueilApresConnexion');
    });

    it('Affiche le prénom de l\'utilisateur', () => {
        cy.contains('Bienvenue Jean').should('exist');
    });

    it('Affiche la dernière dépense', () => {
        cy.contains('Carburant : 60.00 € le 2025-04-01').should('exist');
    });

    it('Affiche la section contact', () => {
        cy.contains('Contact').should('exist');
        cy.get('form.contact-form').should('exist');
    });
});