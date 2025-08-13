describe('Gaming Portfolio - Accessibility Testing', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.waitForAnimations();
  });

  it('should pass basic accessibility checks', () => {
    // Run axe accessibility tests on each section
    const sections = [
      'hero',
      'about',
      'skills',
      'gaming',
      'projects',
      'contact',
    ];

    sections.forEach(section => {
      if (section !== 'hero') {
        cy.navigateToSection(section);
      }

      cy.get(`[data-testid="section-${section}"]`).should('be.visible');
      cy.checkA11y(`[data-testid="section-${section}"]`, {
        rules: {
          'color-contrast': { enabled: true },
          'focus-order-semantics': { enabled: true },
          'keyboard-navigation': { enabled: true },
        },
      });
    });
  });

  it('should support keyboard navigation', () => {
    // Test tab navigation through interactive elements
    cy.get('body').tab();
    cy.focused().should('have.attr', 'data-testid').and('include', 'nav');

    // Navigate through all focusable elements
    const focusableElements = [
      '[data-testid="nav-about"]',
      '[data-testid="nav-skills"]',
      '[data-testid="nav-gaming"]',
      '[data-testid="nav-projects"]',
      '[data-testid="nav-contact"]',
    ];

    focusableElements.forEach(selector => {
      cy.get(selector).focus().should('be.focused');
      cy.focused().type('{enter}');
      cy.waitForAnimations();
    });
  });

  it('should have proper ARIA labels and semantic HTML', () => {
    // Check for proper heading hierarchy
    cy.get('h1').should('have.length', 1);
    cy.get('h2').should('have.length.greaterThan', 0);

    // Check for ARIA labels on interactive elements
    cy.get('[data-testid="nav-menu"]').should(
      'have.attr',
      'role',
      'navigation'
    );
    cy.get('[data-testid="contact-form"]').should('have.attr', 'role', 'form');

    // Check for alt text on images
    cy.get('img').each($img => {
      cy.wrap($img).should('have.attr', 'alt');
    });

    // Check for proper button labels
    cy.get('button').each($button => {
      cy.wrap($button).should('satisfy', $btn => {
        return $btn.attr('aria-label') || $btn.text().trim().length > 0;
      });
    });
  });

  it('should support screen reader navigation', () => {
    // Check for skip links
    cy.get('[data-testid="skip-to-content"]').should('exist');

    // Check for proper landmarks
    cy.get('main').should('exist');
    cy.get('nav').should('exist');
    cy.get('footer').should('exist');

    // Check for section headings
    cy.get('[data-testid="section-about"] h2').should('be.visible');
    cy.get('[data-testid="section-skills"] h2').should('be.visible');
    cy.get('[data-testid="section-projects"] h2').should('be.visible');
  });

  it('should handle reduced motion preferences', () => {
    // Test with reduced motion preference
    cy.visit('/', {
      onBeforeLoad: win => {
        Object.defineProperty(win.navigator, 'userAgent', {
          value: 'prefers-reduced-motion: reduce',
        });
      },
    });

    // Check that animations are disabled or reduced
    cy.get('[data-testid="particle-background"]').should(
      'have.class',
      'reduced-motion'
    );
    cy.get('[data-testid="glitch-text"]').should(
      'have.class',
      'reduced-motion'
    );
  });

  it('should maintain focus management during interactions', () => {
    // Test focus management in modals
    cy.navigateToSection('projects');
    cy.get('[data-testid="project-card"]').first().click();

    // Focus should be trapped in modal
    cy.get('[data-testid="project-modal"]').should('be.visible');
    cy.get('[data-testid="project-modal"] [tabindex="0"]')
      .first()
      .should('be.focused');

    // Test escape key to close modal
    cy.get('body').type('{esc}');
    cy.get('[data-testid="project-modal"]').should('not.exist');

    // Focus should return to trigger element
    cy.get('[data-testid="project-card"]').first().should('be.focused');
  });

  it('should provide proper form accessibility', () => {
    cy.navigateToSection('contact');

    // Check form labels
    cy.get('[data-testid="contact-name"]').should('have.attr', 'aria-label');
    cy.get('[data-testid="contact-email"]').should('have.attr', 'aria-label');
    cy.get('[data-testid="contact-message"]').should('have.attr', 'aria-label');

    // Test form validation messages
    cy.get('[data-testid="contact-submit"]').click();
    cy.get('[data-testid="error-message"]').should('be.visible');
    cy.get('[data-testid="error-message"]').should(
      'have.attr',
      'role',
      'alert'
    );

    // Test successful form submission
    cy.fillContactForm({
      name: 'Test User',
      email: 'test@example.com',
      message: 'Test message',
    });

    cy.get('[data-testid="form-success"]').should(
      'have.attr',
      'role',
      'status'
    );
  });

  it('should test color contrast ratios', () => {
    // Test that text has sufficient contrast against backgrounds
    cy.checkA11y(null, {
      rules: {
        'color-contrast': { enabled: true },
      },
    });

    // Specifically test gaming theme colors
    cy.get('[data-testid="neon-button"]').each($button => {
      cy.wrap($button).should('be.visible');
      // Custom contrast check for neon elements
      cy.wrap($button).then($btn => {
        const styles = window.getComputedStyle($btn[0]);
        const bgColor = styles.backgroundColor;
        const textColor = styles.color;

        // Ensure colors are defined (not transparent)
        expect(bgColor).to.not.equal('rgba(0, 0, 0, 0)');
        expect(textColor).to.not.equal('rgba(0, 0, 0, 0)');
      });
    });
  });
});
