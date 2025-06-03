describe('RappelsPage - Couverture complète', () => {
    beforeEach(() => {
        const rappelsActifs = [
            { nom: 'Vidange huile', date: '01/02/2025', urgent: true, isNew: true },
            { nom: 'Changement des plaquettes de frein', date: '02/08/2025', urgent: false },
            { nom: 'Expiration du document "assurance"', date: '04/09/2025', urgent: false }
        ];
        localStorage.setItem('rappelsActifs', JSON.stringify(rappelsActifs));
        localStorage.removeItem('rappelSelection');
        localStorage.removeItem('rappelKilometrage');
        localStorage.removeItem('messageSucces');
        cy.visit('http://localhost:3000/rappels');
    });

    it('affiche les rappels existants + badge "Nouveau"', () => {
        cy.contains('Vidange huile').should('exist');
        cy.contains('Changement des plaquettes').should('exist');
        cy.get('.badge-nouveau').should('exist');
    });

    it('affiche plus de 3 rappels avec "Voir plus" et réduit avec "Réduire"', () => {
        cy.contains('Voir plus').click();
        cy.get('.rappel-item').should('have.length.at.least', 3);
        cy.contains('Réduire').click();
        cy.get('.rappel-item').should('have.length.at.most', 3);
    });

    it('modifie la date d\'un rappel avec succès', () => {
        cy.get('.rappel-actions').first().find('svg').first().click();
        cy.get('input[type="date"]').type('2025-12-31');
        cy.contains('Enregistrer').click({ force: true });
        cy.contains('Date modifiée avec succès').should('exist');
    });

    it('tente de modifier un rappel sans date => rien ne se passe', () => {
        cy.get('.rappel-actions').first().find('svg').first().click();
        cy.contains('Enregistrer').click({ force: true });
        cy.contains('Date modifiée avec succès').should('not.exist');
    });

    it('marque un rappel comme effectué', () => {
        cy.get('.rappel-actions').first().find('svg').eq(1).click();
        cy.get('input[type="date"]').type('2025-11-01');
        cy.get('select').select('Garage');
        cy.get('input[placeholder="Coût (€)"]').type('90');
        cy.contains('Enregistrer').click({ force: true });
        cy.contains('Entretien enregistré avec succès').should('exist');
    });

    it('ouvre le formulaire de sélection de rappels, sélectionne un rappel, enregistre', () => {
        cy.contains('Sélectionner Rappels').click();
        cy.contains('Sélectionner les entretiens').should('exist');

        cy.contains('Vidange huile moteur')
            .closest('.selection-item')
            .find('input[type="checkbox"]')
            .check({ force: true });

        cy.get('[data-testid="enregistrer-rappels"]').click();
        cy.contains('Rappels enregistrés avec succès').should('exist');
    });

    it('applique un filtre de période', () => {
        cy.contains('Filtrer').click();
        cy.get('input[type="date"]').first().type('2025-01-01');
        cy.get('input[type="date"]').eq(1).type('2025-12-31');
        cy.contains('Appliquer').click();
    });

    it('estime le kilométrage - cas simple avec saisie manuelle', () => {
        cy.contains('Estimer votre kilométrage').click();
        cy.get('select[name="estimation"]').select('oui');
        cy.get('input[name="saisieManuelle"]').type('1500');
        cy.contains('Enregistrer').click();
        cy.contains('Votre kilométrage estimé est de 1500 km').should('exist');
    });

    it('estime le kilométrage - cas différencié semaine/weekend', () => {
        cy.contains('Estimer votre kilométrage').click();
        cy.get('select[name="estimation"]').select('non');
        cy.get('select[name="trajetDifferencie"]').select('oui');

        cy.get('select[name="trajetSemaineJours"]').select('5');
        cy.get('input[name="trajetSemaineKm"]').type('20');
        cy.get('select[name="trajetWeekEndJours"]').select('2');
        cy.get('input[name="trajetWeekEndKm"]').type('30');

        cy.contains('Enregistrer').click();
        cy.contains('Votre kilométrage estimé est de').should('exist');
    });

    it('déclare un trajet inhabituel', () => {
        cy.contains('Déclarer un trajet inhabituel').click();
        cy.get('input[name="typeTrajet"]').type('Vacances');
        cy.get('input[name="periode"]').type('Août 2025');
        cy.get('input[name="kmSupp"]').type('3000');
        cy.contains('Enregistrer').click();
        cy.contains('Rappels d\'entretien').should('exist');
    });

    it('modifie les paramètres de notification', () => {
        cy.get('span.icon.clickable').click();
        cy.get('select').first().select('1mois');
        cy.get('select').eq(1).select('email');
        cy.contains('Enregistrer').click();
        cy.contains('Rappels d\'entretien').should('exist');
    });
});