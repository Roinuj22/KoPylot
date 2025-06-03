describe('Page d’accueil - KoPylot', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000');
    });

    it('Affiche le header principal', () => {
        cy.contains('LA NOUVELLE ÈRE DE LA').should('exist');
        cy.contains('Bienvenue chez KoPylot').should('exist');
        cy.get('img.car-animation').should('exist');
    });

    it('Affiche les éléments de navigation desktop', () => {
        cy.contains('À propos').should('exist');
        cy.contains('Pourquoi KoPylot').should('exist');
        cy.get('a.nav-button').contains('Se connecter').should('have.attr', 'href', '/connexion');
    });
    it('Ouvre le menu mobile', () => {
        cy.viewport('iphone-x');
        cy.get('.menu-toggle').click();
        cy.get('.mobile-menu-popup').should('be.visible');
        cy.get('.mobile-menu-popup a').contains('Pourquoi KoPylot').click();
    });

    it('Affiche la section "Nos solutions"', () => {
        cy.contains('Nos solutions').should('exist');
        cy.get('img.video-preview').should('exist');
    });

    it('Affiche les fonctionnalités dynamiques', () => {
        cy.get('.feature-row').should('have.length.at.least', 5);
    });

    it('Affiche les avis utilisateurs', () => {
        cy.contains('Ils utilisent KoPylot').should('exist');
        cy.get('.avis-card').should('have.length', 3);
    });

    it('Affiche le formulaire de contact', () => {
        cy.get('form.contact-form').within(() => {
            cy.get('input[placeholder="Prénom"]').should('exist');
            cy.get('input[placeholder="Nom"]').should('exist');
            cy.get('input[type="email"]').should('exist');
            cy.get('textarea').should('exist');
            cy.contains('Envoyer').should('exist');
        });
    });
});