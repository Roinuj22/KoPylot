describe('RappelsPage E2E', () => {
    beforeEach(() => {
        const rappelsActifs = [
            { nom: 'Vidange huile', date: '01/02/2025', urgent: true },
            { nom: 'Changement des plaquettes de frein', date: '02/08/2025', urgent: false },
        ];
        localStorage.setItem('rappelsActifs', JSON.stringify(rappelsActifs));
        localStorage.removeItem('rappelSelection');
        localStorage.removeItem('rappelKilometrage');
        localStorage.removeItem('messageSucces');
        cy.visit('http://localhost:3000/rappels');
    });

    // Test affichage des rappels
    it('affiche les rappels existants', () => {
        cy.contains('Vidange huile').should('exist');
        cy.contains('Changement des plaquettes').should('exist');
    });

    // Modifier la date d’un rappel
    it('modifie la date d\'un rappel', () => {
        cy.get('.rappel-actions').first().find('svg').first().click();
        cy.get('input[type="date"]').type('2025-12-31');
        cy.contains('Enregistrer').click({ force: true });
        cy.contains('Date modifiée avec succès').should('exist');
    });

    //  Marquer un rappel comme effectué
    it('marque un rappel comme effectué', () => {
        cy.get('.rappel-actions').first().find('svg').eq(1).click();
        cy.get('input[type="date"]').type('2025-11-01');
        cy.get('select').select('Garage');
        cy.get('input[placeholder="Coût (€)"]').type('90');
        cy.contains('Enregistrer').click({ force: true });
        cy.contains('Entretien enregistré avec succès').should('exist');
    });

    // Sélectionner et enregistrer un nouveau rappel
    it('ouvre le formulaire de sélection de rappels', () => {
        cy.contains('Sélectionner Rappels').click();
        cy.contains('Sélectionner les entretiens').should('exist');

        cy.contains('Vidange huile moteur')
            .closest('.selection-item')
            .find('input[type="checkbox"]')
            .check({ force: true });

        cy.get('[data-testid="enregistrer-rappels"]').click();
        cy.contains('Rappels enregistrés avec succès').should('exist');
    });

    // Appliquer un filtre de période
    it('ouvre les filtres et applique une période', () => {
        cy.contains('Filtrer').click();
        cy.get('input[type="date"]').first().type('2025-01-01');
        cy.get('input[type="date"]').eq(1).type('2025-12-31');
        cy.contains('Appliquer').click();
    });

    // Estimer le kilométrage
    it('remplit le formulaire de kilométrage et enregistre', () => {
        cy.contains('Estimer votre kilométrage').click();
        cy.get('select[name="estimation"]').select('oui');
        cy.get('input[name="saisieManuelle"]').type('1500');
        cy.contains('Enregistrer').click();
        cy.contains('Votre kilométrage estimé est de 1500 km').should('exist');
    });

    //  Déclarer un trajet inhabituel
    it('remplit le formulaire de trajet inhabituel', () => {
        cy.contains('Déclarer un trajet inhabituel').click();
        cy.get('input[name="typeTrajet"]').type('Vacances');
        cy.get('input[name="periode"]').type('Août 2025');
        cy.get('input[name="kmSupp"]').type('3000');
        cy.contains('Enregistrer').click();
        cy.contains('Rappels d\'entretien').should('exist');
    });

    // Paramétrer les notifications
    it('remplit le formulaire de paramètres de notification', () => {
        cy.get('span.icon.clickable').click();
        cy.get('select').first().select('1mois');
        cy.get('select').eq(1).select('email');
        cy.contains('Enregistrer').click();
        cy.contains('Rappels d\'entretien').should('exist');
    });
});