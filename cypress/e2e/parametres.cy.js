describe('Page Paramètres', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000/parametre');
        cy.window().then(win => {
            win.localStorage.clear();
        });
    });

    it('Affiche les titres et sections', () => {
        cy.contains('Paramètres').should('exist');
        cy.contains('Comment souhaitez-vous être notifié ?').should('exist');
        cy.contains('Langue').should('exist');
        cy.contains('Thème').should('exist');
    });

    it('Active et sauvegarde les notifications', () => {
        // Clic visible sur les labels
        cy.get('[data-testid="notif-sms-label"]').click();
        cy.get('[data-testid="notif-email-label"]').click();

        // Vérifie que localStorage a été mis à jour
        cy.window().should((win) => {
            const v = JSON.parse(win.localStorage.getItem('notifications'));
            expect(v).to.not.be.null;
            expect(v.sms).to.be.true;
            expect(v.email).to.be.true;
        });

        // Recharge la page
        cy.reload();

        // Vérifie que les cases restent cochées
        cy.get('[data-testid="notif-sms"]').should('be.checked');
        cy.get('[data-testid="notif-email"]').should('be.checked');
    });

    it('Change la langue et la conserve', () => {
        cy.get('select').select('English');
        cy.get('select').should('have.value', 'en');

        cy.reload();

        cy.get('select').should('have.value', 'en');
    });

    it('Bascule le thème en cliquant', () => {
        cy.get('.theme-toggle').click();

        cy.get('body').should(($body) => {
            const classes = $body.attr('class');
            expect(classes).to.match(/dark|light/);
        });
    });
});