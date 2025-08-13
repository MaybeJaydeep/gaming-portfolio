describe('Simple App Test', () => {
  it('should load the simple version successfully', () => {
    cy.visit('/');
    cy.wait(2000);

    // Check if the page loads
    cy.get('body').should('be.visible');

    // Check for the debug header
    cy.contains('Gaming Portfolio - Debug Mode').should('be.visible');

    // Check for sections
    cy.contains('Hero Section').should('be.visible');
    cy.contains('About Section').should('be.visible');
    cy.contains('Skills Section').should('be.visible');
    cy.contains('Projects Section').should('be.visible');
    cy.contains('Contact Section').should('be.visible');

    // Check for basic styling
    cy.get('body').should('have.class', 'bg-gray-900');
  });
});
