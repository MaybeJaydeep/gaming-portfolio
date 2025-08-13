// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Add custom assertions
import 'cypress-axe';

// Handle uncaught exceptions from the application
Cypress.on('uncaught:exception', (err, runnable) => {
  // Returning false here prevents Cypress from failing the test
  // We'll handle specific errors we expect
  if (
    err.message.includes(
      'useAccessibilityContext must be used within an AccessibilityProvider'
    )
  ) {
    return false;
  }
  if (err.message.includes('Cannot read properties of undefined')) {
    return false;
  }
  // Let other errors fail the test
  return true;
});

// Global before hook for accessibility testing
beforeEach(() => {
  // Inject axe-core for accessibility testing only if the page loads successfully
  cy.window().then(win => {
    if (win.document.readyState === 'complete') {
      cy.injectAxe();
    }
  });
});

// Custom command to wait for animations to complete
Cypress.Commands.add('waitForAnimations', () => {
  cy.wait(500); // Wait for Framer Motion animations
});

// Custom command to test responsive design
Cypress.Commands.add(
  'testResponsive',
  (sizes = ['iphone-6', 'ipad-2', 'macbook-15']) => {
    sizes.forEach(size => {
      cy.viewport(size);
      cy.wait(500); // Allow time for responsive changes
    });
  }
);

// Custom command to check gaming theme elements
Cypress.Commands.add('checkGamingTheme', () => {
  // Check for dark theme
  cy.get('body').should('have.class', 'dark');

  // Check for gaming-style elements (neon colors, etc.)
  cy.get('[data-testid="game-hud"]').should('be.visible');
});

// Performance testing helpers
Cypress.Commands.add('checkPerformance', () => {
  cy.window().then(win => {
    const performance = win.performance;
    const navigationTiming = performance.getEntriesByType('navigation')[0];

    // Check that page loads within reasonable time (3 seconds)
    expect(
      navigationTiming.loadEventEnd - navigationTiming.navigationStart
    ).to.be.lessThan(3000);
  });
});
