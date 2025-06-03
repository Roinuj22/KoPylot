describe('Page Mes Véhicules', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000/MesVehicules');
        cy.window().then((win) => {
            win.localStorage.removeItem('kopylotVehicule');
        });
    });

    it('Ajoute un véhicule complet via le formulaire', () => {
        cy.get('.ajouter-vehicule').click();

        // ÉTAPE 1
        cy.get('input[name="immatriculation"]').type('AB123CD');
        cy.get('select[name="marque"]').select('Peugeot');
        cy.get('select[name="modele"]').select('208');
        cy.get('select[name="carburant"]').select('Essence');
        cy.get('input[name="puissance"]').type('120');
        cy.get('select[name="boite"]').select('Manuelle');
        cy.get('input[name="cylindree"]').type('1600');
        cy.get('input[name="dateCirculation"]').type('2020-05-01');
        cy.get('select[name="places"]').select('5');
        cy.get('input[name="numeroSerie"]').type('VF3ABC12345678901');

        // CHAMPS SUPPLÉMENTAIRES
        cy.get('input[name="finition"]').type('GT Line');
        cy.get('input[name="kilometreActuel"]').type('45000');
        cy.get('input[name="dateAchat"]').type('2021-06-01');
        cy.get('input[name="nbProprietaires"]').type('1');

        cy.contains('Suivant').click();

        // ÉTAPE 2
        cy.get('select[name="typeCarrosserie"]').select('SUV');
        cy.get('select[name="categorie"]').select('Familiale');
        cy.get('select[name="label"]').select('Occasion');
        cy.get('select[name="couleur"]').select('Noir');
        cy.get('select[name="utilisationPrincipale"]').select('Personnel');
        cy.get('select[name="assurance"]').select('Tous risques');

        cy.contains('Suivant').click();

        // ÉTAPE 3
        cy.get('select[name="climatisation"]').select('Oui');
        cy.get('select[name="essuieGlaceArriere"]').select('Oui');
        cy.get('select[name="transmission"]').select('Oui');
        cy.get('select[name="freinArriere"]').select('Oui');
        cy.get('select[name="courroieMoteur"]').select('Oui');

        cy.contains('Ajouter').click();
        cy.get('form.formulaire-vehicule').submit();
        cy.wait(500);

        cy.window().then((win) => {
            const v = JSON.parse(win.localStorage.getItem('kopylotVehicule'));
            console.log('🚗 Véhicule enregistré :', v);
            expect(v).to.not.be.null;
            expect(v.marque).to.equal('Peugeot');
        });

        // vérifier localStorage
        cy.window().then((win) => {
            const v = JSON.parse(win.localStorage.getItem('kopylotVehicule'));
            console.log('🚗 Véhicule enregistré :', v);
            expect(v).to.not.be.null;
            expect(v.marque).to.equal('Peugeot');
        });

        // Vérifie affichage de la carte
        cy.contains('Marque', { timeout: 10000 }).should('exist');
        cy.contains('Peugeot').should('exist');
        cy.get('.carte-vehicule').should('exist');
    });

    it('Supprime un véhicule existant', () => {
        const fakeVehicule = {
            marque: 'Renault',
            modele: 'Clio',
            dateCirculation: '2021-01-01',
        };

        cy.visit('http://localhost:3000/MesVehicules');
        cy.window().then((win) => {
            win.localStorage.setItem('kopylotVehicule', JSON.stringify(fakeVehicule));
        });
        cy.reload();

        cy.contains('Renault', { timeout: 10000 }).should('exist');
        cy.contains('Marque').should('exist');

        cy.get('button').contains('⋮').click();
        cy.contains('Supprimer').click();

        cy.get('.carte-vehicule').should('not.exist');
    });
});