describe('Page Documents', () => {
    beforeEach(() => {
        localStorage.removeItem('documents');
        cy.visit('http://localhost:3000/document');
    });

    it('Affiche le titre et les boutons principaux', () => {
        cy.contains('Documents').should('exist');
        cy.contains('Ajouter un document').should('exist');
    });

    it('Ajoute un document fictif', () => {
        cy.contains('Ajouter un document').click();
        cy.get('input[type="text"]').type('Carte grise');
        cy.get('select').select('Document administratif');

        // Simule un fichier PDF (base64 )
        const fileContent = 'Hello world';
        const fileName = 'carte.pdf';
        cy.get('input[type="file"]').selectFile({
            contents: Cypress.Blob.base64StringToBlob(btoa(fileContent), 'application/pdf'),
            fileName,
            mimeType: 'application/pdf',
            lastModified: Date.now(),
        });

        cy.contains('Enregistrer').click();

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
});