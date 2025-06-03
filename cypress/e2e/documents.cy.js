describe('Page Documents', () => {
    beforeEach(() => {
        localStorage.removeItem('documents');
        cy.visit('http://localhost:3000/document');
    });

    it('Affiche le titre et les boutons principaux', () => {
        cy.contains('Documents').should('exist');
        cy.contains('Ajouter un document').should('exist');
    });

    it('Affiche un document PDF existant', () => {
        const testDocs = [
            {
                id: 1,
                name: 'Carte grise',
                category: 'Document administratif',
                fileBase64: 'data:application/pdf;base64,SGVsbG8gd29ybGQ=',
                type: 'application/pdf',
            },
        ];
        localStorage.setItem('documents', JSON.stringify(testDocs));
        cy.reload();

        cy.contains('Carte grise').should('exist');
        cy.contains('📄 PDF').should('exist');
    });

    it('Prévisualise et supprime un document', () => {
        const testDocs = [
            {
                id: 1,
                name: 'Assurance',
                category: 'Document financier',
                fileBase64: 'data:application/pdf;base64,SGVsbG8gd29ybGQ=',
                type: 'application/pdf',
            },
        ];
        localStorage.setItem('documents', JSON.stringify(testDocs));
        cy.reload();

        cy.contains('Assurance').should('exist');
        cy.get('.preview-icon').click();
        cy.get('.replace-button').should('exist');
        cy.get('.delete-button').click();
        cy.contains('Assurance').should('not.exist');
    });
    it('Ajoute un document via le formulaire', () => {
        cy.contains('Ajouter un document').click();
        cy.get('input[type="text"]').type('Permis');
        cy.get('select').select('Document financier');

        const fileName = 'test.pdf';
        cy.get('input[type="file"]').selectFile('cypress/fixtures/' + fileName, { force: true });
        cy.contains('Enregistrer').click();

        cy.contains('Permis').should('exist');
    });
    it('Affiche un état vide si aucun document', () => {
        localStorage.setItem('documents', JSON.stringify([]));
        cy.reload();
        cy.contains('Documents').should('exist');
        cy.get('.document-card').should('have.length', 0);
    });
});