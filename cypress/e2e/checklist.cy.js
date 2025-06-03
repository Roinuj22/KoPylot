describe('Page Checklist de contrôle', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000/checklist');
    });

    it('Affiche le titre de la page', () => {
        cy.contains('Checklist de contrôle de véhicule').should('exist');
    });

    it('Affiche les hotspots sur l’image', () => {
        cy.get('.hotspot').should('have.length', 5);
    });

    it('Ouvre la popup Moteur & compartiment avant', () => {
        cy.get('.hotspot').eq(1).click();
        cy.contains('Moteur & compartiment avant').should('exist');
    });

    it('Ouvre la popup Pneumatiques et interagit avec les cases', () => {
        cy.get('.hotspot').eq(4).click(); // bouton "pneumatiques"
        cy.contains('Pneumatiques').should('exist');
        cy.contains('Pneus visiblement en bon état').click();
        cy.contains('Crevaison ?').should('exist');
        cy.contains('Ajouter une description').should('exist');
    });

    it('Affiche la section récapitulative', () => {
        cy.contains('RECAPITULATIF').should('exist');
        cy.contains('Éclairage et signalisation').should('exist');
        cy.get('.warning-icon').should('have.length.at.least', 1);
    });
    it('Ouvre les autres popups (sécurité, éclairage, extérieur)', () => {
        cy.get('.hotspot').eq(0).click(); // éclairage
        cy.contains('Éclairage et signalisation').should('exist');
        cy.get('.close-btn').click();

        cy.get('.hotspot').eq(2).click(); // sécurité
        cy.contains('Éléments de sécurité').should('exist');
        cy.get('.close-btn').click();

        cy.get('.hotspot').eq(3).click(); // extérieur
        cy.contains('Extérieur du véhicule').should('exist');
    });
    it('Déclenche le champ fichier PDF', () => {
        cy.get('label.export-btn').click();
        cy.get('input[type="file"]').should('exist');
    });
});