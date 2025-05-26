describe('Test de la page de connexion', () => {
    beforeEach(() => {
        // Simule un utilisateur en localStorage
        const user = { email: 'test@mail.com', password: '123456' };
        window.localStorage.setItem('kopylotUser', JSON.stringify(user));
        cy.visit('http://localhost:3000/connexion');
    });

    it('Connexion réussie avec bon identifiant', () => {
        cy.get('input[name="email"]').type('test@mail.com');
        cy.get('input[name="password"]').type('123456');
        cy.get('button[type="submit"]').click();
        cy.contains('Connexion réussie !').should('exist');
    });

    it('Affiche une erreur si mot de passe est incorrect', () => {
        cy.get('input[name="email"]').type('test@mail.com');
        cy.get('input[name="password"]').type('wrongpass');
        cy.get('button[type="submit"]').click();
        cy.contains('Email ou mot de passe incorrect.').should('exist');
    });

    it('Redirige vers inscription', () => {
        cy.get('a[href="/inscription"]').click();
        cy.url().should('include', '/inscription');
    });
});