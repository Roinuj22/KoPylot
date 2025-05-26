describe('Test de la page d\'inscription', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000/inscription');
    });

    it('Remplit le formulaire et crée un compte', () => {
        cy.get('input[name="nom"]').type('Doe');
        cy.get('input[name="prenom"]').type('John');
        cy.get('input[name="email"]').type('john.doe@mail.com');
        cy.get('input[name="motdepasse"]').type('secure123');
        cy.get('input[name="ville"]').type('Paris');
        cy.get('select[name="pays"]').select('France');

        cy.get('button[type="submit"]').click();

        // Vérifie le message de succès
        cy.contains('Compte créé avec succès !').should('exist');

        // Vérifie la redirection vers /connexion
        cy.url({ timeout: 3000 }).should('include', '/connexion');
    });
});