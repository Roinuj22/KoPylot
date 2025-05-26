describe('Page Plan d\'entretien', () => {
    beforeEach(() => {
        cy.intercept('GET', '/api/afteriize*', {
            statusCode: 200,
            body: {
                car_identification: {
                    brand: 'Peugeot',
                    model: '208',
                    version: '1.2 PureTech',
                    date_pme: '2021-06-01'
                },
                maintenance_intervals: {
                    previous: {
                        interval_kms: 30000,
                        interval_months: 12,
                        interval_operations: [
                            {
                                operation_description: 'Remplacement filtre à air',
                                operation_header: 'Moteur',
                                operation_action: 'Remplacer'
                            }
                        ]
                    },
                    current: {
                        interval_kms: 15000,
                        interval_months: 6,
                        interval_operations: [
                            {
                                operation_description: 'Vidange moteur',
                                operation_header: 'Huile',
                                operation_action: 'Vérifier'
                            }
                        ]
                    }
                }
            }
        });

        cy.visit('http://localhost:3000/PlanEntretien');
    });

    it('Affiche le formulaire et soumet une plaque', () => {
        cy.get('input[placeholder="Entrez votre plaque d\'immatriculation"]').type('AB123CD');
        cy.contains('Valider').click();

        cy.contains('Peugeot 208').should('exist');
        cy.contains('1.2 PureTech').should('exist');
        cy.contains('Opérations complémentaires').should('exist');
        cy.contains('Vidange moteur').should('exist');
    });
});