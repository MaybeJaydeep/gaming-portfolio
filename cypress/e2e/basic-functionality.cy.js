describe('Gaming Portfolio - Basic Functionality Tests', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.wait(2000); // Wait for initial load
  });

  it('should load the homepage successfully', () => {
    // Check that the page loads without major errors
    cy.get('body').should('be.visible');
    cy.title().should('not.be.empty');

    // Check for basic structure
    cy.get('div').should('exist');
  });

  it('should have basic navigation elements', () => {
    // Look for any navigation-like elements
    cy.get('nav, [role="navigation"], .nav, .navigation').should('exist');
  });

  it('should display content sections', () => {
    // Check for main content areas
    cy.get('main, .main, section, .section').should('exist');
    cy.get('main, .main, section, .section').should('be.visible');
  });

  it('should be responsive on different viewport sizes', () => {
    const viewports = [
      [375, 667], // Mobile
      [768, 1024], // Tablet
      [1280, 720], // Desktop
    ];

    viewports.forEach(([width, height]) => {
      cy.viewport(width, height);
      cy.wait(500);

      // Check that content is still visible
      cy.get('body').should('be.visible');

      // Check that no horizontal scrollbar appears
      cy.window().then(win => {
        expect(win.document.body.scrollWidth).to.be.at.most(
          win.innerWidth + 20
        );
      });
    });
  });

  it('should handle basic interactions', () => {
    // Test clicking on any clickable elements
    cy.get('button, a, [role="button"]').then($elements => {
      if ($elements.length > 0) {
        cy.wrap($elements).first().click({ force: true });
      }
    });

    // Test keyboard navigation
    cy.get('body').tab();
  });

  it('should load CSS and JavaScript resources', () => {
    // Check that stylesheets are loaded
    cy.get('link[rel="stylesheet"], style').should('exist');

    // Check that JavaScript is working
    cy.window().should('have.property', 'React');
  });

  it('should have proper document structure', () => {
    // Check for basic HTML structure
    cy.get('html').should('have.attr', 'lang');
    cy.get('head').should('exist');
    cy.get('body').should('exist');

    // Check for meta tags
    cy.get('meta[charset]').should('exist');
    cy.get('meta[name="viewport"]').should('exist');
  });

  it('should handle page reload gracefully', () => {
    cy.reload();
    cy.wait(2000);

    // Check that page still loads after reload
    cy.get('body').should('be.visible');
  });
});
