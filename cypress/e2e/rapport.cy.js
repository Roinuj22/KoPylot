describe('Page Rapport Véhicule', () => {
    beforeEach(() => {
        const vehicule = {
            marque: 'Renault',
            modele: 'Clio',
            immatriculation: 'AB123CD',
            numeroSerie: 'VF1XYZ123456789',
            dateCirculation: '2021-04-01',
            carburant: 'Essence',
            finition: 'Zen',
        };

        const depenses = [
            { id: 1, titre: 'Essence', montant: '50', categorie: 'Carburant/Recharge électrique', date: '2025-04-01' },
            { id: 2, titre: 'Assurance', montant: '80', categorie: 'Assurance', date: '2024-12-01' },
        ];

        localStorage.setItem('kopylotVehicule', JSON.stringify(vehicule));
        localStorage.setItem('depenses', JSON.stringify(depenses));
        cy.visit('http://localhost:3000/rapportVehicule');
    });

    it('Affiche les infos du véhicule', () => {
        cy.contains('Renault Clio').should('exist');
        cy.contains('AB123CD').should('exist');
        cy.contains('Essence').should('exist');
    });

    it('Affiche le total des dépenses', () => {
        cy.contains('Total cumulé').parent().contains('130,00 €').should('exist');
    });

    it('Affiche le graphique des dépenses', () => {
        cy.get('svg').should('exist'); // vérifie que le graphique apparaît
    });

    it('Affiche l’historique des entretiens', () => {
        cy.contains('Historique des entretiens').should('exist');
        cy.contains('Vidange + filtre huile').should('exist');
    });

    it('Affiche le bloc état du véhicule', () => {
        cy.contains('Etat du véhicule').should('exist');
        cy.contains('Voyant moteur allumé').should('exist');
    });

    it('Ouvre et ferme la modale de partage (fallback)', () => {
        // Désactiver le Web Share API AVANT que la page charge
        cy.visit('http://localhost:3000/rapportVehicule', {
            onBeforeLoad(win) {
                win.navigator.share = undefined;
            }
        });

        // Cliquer sur le bouton de partage (icône Share2)
        cy.get('[data-testid="open-share-modal"]').should('exist').click();

        // Vérifier que la modale apparaît avec les options de partage
        cy.contains('Partager via').should('exist');
        cy.contains('WhatsApp').should('exist');
        cy.contains('Email').should('exist');
        cy.contains('Facebook').should('exist');
        cy.contains('Telegram').should('exist');

        // Fermer la modale en cliquant sur la croix
        cy.get('.close-modal').click();

        // Vérifier que la modale a disparu
        cy.contains('Partager via').should('not.exist');
    });
});