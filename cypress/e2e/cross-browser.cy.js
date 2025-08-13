describe('Gaming Portfolio - Cross-Browser Compatibility', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.waitForAnimations();
  });

  it('should work consistently across different browsers', () => {
    // Test core functionality that should work in all browsers
    cy.get('[data-testid="hero-section"]').should('be.visible');
    cy.get('[data-testid="game-hud"]').should('be.visible');

    // Test navigation
    cy.navigateToSection('about');
    cy.navigateToSection('skills');
    cy.navigateToSection('contact');

    // Test form functionality
    cy.fillContactForm({
      name: 'Cross Browser Test',
      email: 'test@crossbrowser.com',
      message: 'Testing cross-browser compatibility',
    });
  });

  it('should handle CSS features gracefully across browsers', () => {
    // Test CSS Grid support
    cy.get('[data-testid="skills-grid"]').should('be.visible');
    cy.get('[data-testid="skills-grid"]')
      .should('have.css', 'display')
      .and('match', /grid|flex/);

    // Test CSS Custom Properties (CSS Variables)
    cy.get('[data-testid="neon-button"]').should('be.visible');
    cy.get('[data-testid="neon-button"]').then($button => {
      const styles = window.getComputedStyle($button[0]);
      // Should have some color applied (either from CSS variables or fallback)
      expect(styles.backgroundColor).to.not.equal('rgba(0, 0, 0, 0)');
    });

    // Test Flexbox layout
    cy.get('[data-testid="nav-menu"]').should('have.css', 'display', 'flex');
  });

  it('should handle JavaScript features with appropriate fallbacks', () => {
    // Test modern JavaScript features
    cy.window().then(win => {
      // Test if modern features are supported or have fallbacks
      expect(win.fetch).to.exist; // Fetch API
      expect(win.Promise).to.exist; // Promises
      expect(win.requestAnimationFrame).to.exist; // Animation API
    });

    // Test that animations work or degrade gracefully
    cy.get('[data-testid="particle-background"]').should('be.visible');
    cy.get('[data-testid="glitch-text"]').should('be.visible');
  });

  it('should test WebGL and Canvas support', () => {
    cy.window().then(win => {
      const canvas = win.document.createElement('canvas');
      const gl =
        canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

      if (gl) {
        // WebGL is supported - test advanced particle effects
        cy.get('[data-testid="particle-background"] canvas').should(
          'be.visible'
        );
      } else {
        // WebGL not supported - should fallback to CSS animations
        cy.get('[data-testid="particle-background"]').should(
          'have.class',
          'css-fallback'
        );
      }
    });
  });

  it('should handle different viewport and zoom levels', () => {
    // Test different zoom levels
    const zoomLevels = [0.5, 0.75, 1, 1.25, 1.5];

    zoomLevels.forEach(zoom => {
      cy.window().then(win => {
        // Simulate zoom by changing viewport and font size
        const baseWidth = 1280;
        const baseHeight = 720;
        cy.viewport(
          Math.round(baseWidth / zoom),
          Math.round(baseHeight / zoom)
        );
      });

      // Check that layout still works at different zoom levels
      cy.get('[data-testid="hero-section"]').should('be.visible');
      cy.get('[data-testid="game-hud"]').should('be.visible');

      // Check that text is still readable
      cy.get('h1').should('be.visible');
      cy.get('p').first().should('be.visible');
    });
  });

  it('should test font loading and fallbacks', () => {
    // Test that custom fonts load or fallback gracefully
    cy.get('h1')
      .should('be.visible')
      .then($h1 => {
        const computedStyle = window.getComputedStyle($h1[0]);
        const fontFamily = computedStyle.fontFamily;

        // Should have either custom font or system fallback
        expect(fontFamily).to.exist;
        expect(fontFamily.length).to.be.greaterThan(0);
      });

    // Test that text is readable even if custom fonts fail to load
    cy.get('body').should('have.css', 'font-family').and('not.be.empty');
  });

  it('should test touch and mouse interactions', () => {
    // Test mouse interactions
    cy.get('[data-testid="neon-button"]').first().trigger('mouseover');
    cy.get('[data-testid="neon-button"]').first().should('have.class', 'hover');

    // Test click interactions
    cy.get('[data-testid="nav-about"]').click();
    cy.get('[data-testid="section-about"]').should('be.visible');

    // Test keyboard interactions
    cy.get('[data-testid="nav-skills"]').focus().type('{enter}');
    cy.get('[data-testid="section-skills"]').should('be.visible');

    // Test touch interactions (simulated)
    cy.get('[data-testid="skill-card"]').first().trigger('touchstart');
    cy.get('[data-testid="skill-card"]').first().trigger('touchend');
  });

  it('should handle different color schemes and preferences', () => {
    // Test dark mode (default for gaming theme)
    cy.get('body').should('have.class', 'dark');

    // Test high contrast mode simulation
    cy.window().then(win => {
      // Simulate high contrast media query
      const mediaQuery = win.matchMedia('(prefers-contrast: high)');
      if (mediaQuery.matches) {
        cy.get('[data-testid="neon-button"]').should(
          'have.class',
          'high-contrast'
        );
      }
    });

    // Test reduced motion preferences
    cy.window().then(win => {
      const prefersReducedMotion = win.matchMedia(
        '(prefers-reduced-motion: reduce)'
      );
      if (prefersReducedMotion.matches) {
        cy.get('[data-testid="particle-background"]').should(
          'have.class',
          'reduced-motion'
        );
      }
    });
  });

  it('should test audio support and fallbacks', () => {
    cy.window().then(win => {
      // Test if Web Audio API is supported
      const AudioContext = win.AudioContext || win.webkitAudioContext;

      if (AudioContext) {
        // Audio is supported - test sound toggle
        cy.get('body').then($body => {
          if ($body.find('[data-testid="sound-toggle"]').length > 0) {
            cy.testSoundToggle();
          }
        });
      } else {
        // Audio not supported - should hide audio controls
        cy.get('[data-testid="sound-toggle"]').should('not.exist');
      }
    });
  });

  it('should test local storage and session storage', () => {
    cy.window().then(win => {
      // Test localStorage support
      if (win.localStorage) {
        // Test theme preference storage
        cy.get('[data-testid="sound-toggle"]').then($toggle => {
          if ($toggle.length > 0) {
            cy.wrap($toggle).click();

            // Check that preference is stored
            cy.window()
              .its('localStorage')
              .invoke('getItem', 'soundEnabled')
              .should('exist');
          }
        });
      }

      // Test sessionStorage for temporary data
      if (win.sessionStorage) {
        cy.navigateToSection('about');
        // Should store current section in session
        cy.window()
          .its('sessionStorage')
          .invoke('getItem', 'currentSection')
          .should('equal', 'about');
      }
    });
  });
});
