describe('Page Suivi des Dépenses', () => {
    beforeEach(() => {
        localStorage.removeItem('depenses');
        cy.visit('http://localhost:3000/Depenses');
    });

    it('Affiche le titre et les totaux', () => {
        cy.contains('Suivi des dépenses').should('exist');
        cy.contains('Dépenses totales').should('exist');
        cy.contains('Dépenses moyennes').should('exist');
    });

    it('Ajoute une dépense et l’affiche dans la liste', () => {
        cy.contains('Ajouter une opération').click();
        cy.get('input').first().type('Carburant');
        cy.get('select').select('Carburant/Recharge électrique');
        cy.get('input[type="number"]').type('50');
        cy.get('input[type="date"]').type('2025-05-20');
        cy.contains('Enregistrer').click();

        cy.contains('Carburant').should('exist');
        cy.contains('50.00 €').should('exist');
    });

    it('Active la sélection multiple et supprime une dépense', () => {
        // Préparer des données en localStorage
        const testDepenses = [
            { id: 1, titre: 'Assurance', categorie: 'Assurance', montant: '80', date: '2025-05-15' },
            { id: 2, titre: 'Lavage', categorie: 'Lavage/Nétoyage', montant: '20', date: '2025-05-16' },
        ];
        localStorage.setItem('depenses', JSON.stringify(testDepenses));
        cy.reload();

        cy.contains('Gérer les dépenses').click();
        cy.get('input[type="checkbox"]').first().check();
        cy.contains('Supprimer (1)').click();

        cy.contains('Assurance').should('not.exist');
    });

    it('Affiche le graphique des dépenses', () => {
        const testDepenses = [
            { id: 1, titre: 'Carburant', categorie: 'Carburant/Recharge électrique', montant: '60', date: '2025-05-01' },
            { id: 2, titre: 'Assurance', categorie: 'Assurance', montant: '90', date: '2025-05-02' },
        ];
        localStorage.setItem('depenses', JSON.stringify(testDepenses));
        cy.reload();

        cy.contains('Dépenses par catégories').should('exist');
        cy.get('svg').should('exist'); // vérifie que le graphique est visible
    });
    it('Déclenche l\'impression PDF', () => {
        cy.window().then((win) => {
            cy.stub(win, 'print').as('print');
        });
        cy.contains('Exporter PDF').click();
        cy.get('@print').should('have.been.calledOnce');
    });
    it('Affiche zéro quand aucune dépense n\'est présente', () => {
        localStorage.setItem('depenses', JSON.stringify([]));
        cy.reload();
        cy.contains('0,00 €').should('exist'); // total ou moyenne
    });
});