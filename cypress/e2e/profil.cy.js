describe('Page Profil Utilisateur', () => {
    beforeEach(() => {
        const user = {
            nom: 'Doe',
            prenom: 'Jane',
            email: 'jane@doe.com',
            password: '123456',
            ville: 'Paris',
            pays: 'France',
            codePostal: '75000',
            naissance: '1995-01-01',
            telephone: '0600000000'
        };
        localStorage.setItem('kopylotUser', JSON.stringify(user));
        cy.visit('http://localhost:3000/profil');
    });

    it('Affiche les informations utilisateur', () => {
        cy.contains('Mon profil').should('exist');
        cy.get('input[type="text"]').should('have.value', 'Doe');
        cy.get('input[type="email"]').should('have.value', 'jane@doe.com');
    });

    it('Ouvre et ferme la popup de suppression', () => {
        cy.contains('Supprimer compte').click();
        cy.contains('Pourquoi voulez-vous supprimer').should('exist');
        cy.contains('Annuler').click();
        cy.contains('Pourquoi voulez-vous supprimer').should('not.exist');
    });

    it('Supprime le compte et redirige', () => {
        cy.contains('Supprimer compte').click();
        cy.get('textarea').type('Je ne souhaite plus utiliser le service');
        cy.contains('Confirmer').click();
        cy.contains('Compte supprimé avec succès ✅').should('exist');
    });

    it('Ouvre la popup de modification des infos', () => {
        cy.get('.profil-section').first().find('.edit-icon').click();
        cy.contains('Modifier les informations personnelles').should('exist');
        cy.get('input[placeholder="Nom"]').should('have.value', 'Doe');
    });
});