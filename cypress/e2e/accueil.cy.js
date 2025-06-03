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
    it('Redirige vers /connexion si non connecté', () => {
        localStorage.removeItem('isConnected');
        cy.visit('http://localhost:3000/accueilApresConnexion');
        cy.url().should('include', '/connexion');
    });

    it('Affiche un message si aucune dépense enregistrée', () => {
        localStorage.setItem('depenses', JSON.stringify([]));
        cy.visit('http://localhost:3000/accueilApresConnexion');
        cy.contains('Aucune dépense enregistrée').should('exist');
    });

    it('Soumet le formulaire de contact', () => {
        cy.get('input[placeholder="Prénom"]').type('Jean');
        cy.get('input[placeholder="Nom"]').type('Dupont');
        cy.get('input[placeholder="Adresse mail"]').type('jean@mail.com');
        cy.get('textarea').type('Bonjour, ceci est un test');
        cy.get('form.contact-form button[type="submit"]').click();
    });
});