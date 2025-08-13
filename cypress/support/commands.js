// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Gaming Portfolio specific commands

// Command to navigate to specific sections
Cypress.Commands.add('navigateToSection', sectionName => {
  cy.get(`[data-testid="nav-${sectionName}"]`).click();
  cy.waitForAnimations();
  cy.get(`[data-testid="section-${sectionName}"]`).should('be.visible');
});

// Command to test smooth scrolling
Cypress.Commands.add('testSmoothScroll', targetSection => {
  cy.get(`[data-testid="nav-${targetSection}"]`).click();
  cy.wait(1000); // Allow time for smooth scroll animation
  cy.get(`[data-testid="section-${targetSection}"]`).should('be.inViewport');
});

// Command to test interactive elements
Cypress.Commands.add('testInteractiveElement', selector => {
  cy.get(selector)
    .should('be.visible')
    .trigger('mouseover')
    .should('have.class', 'hover') // Assuming hover class is added
    .click()
    .should('have.class', 'active'); // Assuming active class is added
});

// Command to test form submission
Cypress.Commands.add('fillContactForm', formData => {
  cy.get('[data-testid="contact-name"]').type(formData.name);
  cy.get('[data-testid="contact-email"]').type(formData.email);
  cy.get('[data-testid="contact-message"]').type(formData.message);
  cy.get('[data-testid="contact-submit"]').click();
});

// Command to test particle background performance
Cypress.Commands.add('testParticlePerformance', () => {
  cy.get('[data-testid="particle-background"]').should('be.visible');

  // Check that particles are animating (canvas should be updating)
  cy.get('canvas').should('exist');

  // Test performance by checking frame rate doesn't drop significantly
  cy.window().then(win => {
    let frameCount = 0;
    const startTime = Date.now();

    const countFrames = () => {
      frameCount++;
      if (Date.now() - startTime < 1000) {
        win.requestAnimationFrame(countFrames);
      } else {
        // Should maintain at least 30 FPS
        expect(frameCount).to.be.greaterThan(30);
      }
    };

    win.requestAnimationFrame(countFrames);
  });
});

// Command to test sound toggle functionality
Cypress.Commands.add('testSoundToggle', () => {
  cy.get('[data-testid="sound-toggle"]').click();
  cy.get('[data-testid="sound-toggle"]').should(
    'have.attr',
    'aria-pressed',
    'true'
  );

  cy.get('[data-testid="sound-toggle"]').click();
  cy.get('[data-testid="sound-toggle"]').should(
    'have.attr',
    'aria-pressed',
    'false'
  );
});

// Command to check if element is in viewport
Cypress.Commands.add('isInViewport', { prevSubject: true }, subject => {
  cy.wrap(subject).then($el => {
    const rect = $el[0].getBoundingClientRect();
    const isVisible =
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= Cypress.config().viewportHeight &&
      rect.right <= Cypress.config().viewportWidth;
    expect(isVisible).to.be.true;
  });
});

// Command to test loading states
Cypress.Commands.add('testLoadingStates', () => {
  // Intercept any API calls and add delay to test loading states
  cy.intercept('GET', '**/api/**', { delay: 1000 }).as('apiCall');

  // Check for loading indicators
  cy.get('[data-testid="loading-indicator"]').should('be.visible');

  // Wait for loading to complete
  cy.get('[data-testid="loading-indicator"]').should('not.exist');
});
