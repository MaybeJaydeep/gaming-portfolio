describe('Gaming Portfolio - Complete User Journey', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.waitForAnimations();
  });

  it('should complete the full user journey through all sections', () => {
    // Test Hero Section
    cy.get('[data-testid="hero-section"]').should('be.visible');
    cy.get('[data-testid="hero-title"]').should('contain.text', 'Welcome');
    cy.checkGamingTheme();

    // Navigate to About Section
    cy.navigateToSection('about');
    cy.get('[data-testid="about-stats"]').should('be.visible');
    cy.get('[data-testid="certification-ibm"]').should('be.visible');
    cy.get('[data-testid="degree-cs"]').should('be.visible');

    // Navigate to Skills Section
    cy.navigateToSection('skills');
    cy.get('[data-testid="skill-tree"]').should('be.visible');
    cy.get('[data-testid="skill-mern"]').should('be.visible');
    cy.get('[data-testid="skill-php"]').should('be.visible');
    cy.get('[data-testid="skill-ml"]').should('be.visible');

    // Test skill interaction
    cy.get('[data-testid="skill-mern"]').click();
    cy.get('[data-testid="skill-details"]').should('be.visible');

    // Navigate to Gaming Section
    cy.navigateToSection('gaming');
    cy.get('[data-testid="tournament-history"]').should('be.visible');
    cy.get('[data-testid="gaming-achievements"]').should('be.visible');

    // Navigate to Projects Section
    cy.navigateToSection('projects');
    cy.get('[data-testid="project-cards"]').should('be.visible');
    cy.get('[data-testid="project-card"]').should('have.length.greaterThan', 0);

    // Test project interaction
    cy.get('[data-testid="project-card"]').first().click();
    cy.get('[data-testid="project-modal"]').should('be.visible');
    cy.get('[data-testid="project-close"]').click();
    cy.get('[data-testid="project-modal"]').should('not.exist');

    // Navigate to Contact Section
    cy.navigateToSection('contact');
    cy.get('[data-testid="contact-form"]').should('be.visible');

    // Test contact form
    cy.fillContactForm({
      name: 'Test User',
      email: 'test@example.com',
      message: 'This is a test message for the gaming portfolio.',
    });

    // Verify form submission feedback
    cy.get('[data-testid="form-success"]').should('be.visible');
  });

  it('should maintain gaming theme consistency across all sections', () => {
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

      // Check for consistent gaming theme elements
      cy.get(`[data-testid="section-${section}"]`)
        .should('have.class', 'gaming-theme')
        .should('be.visible');

      // Check for neon effects and dark theme
      cy.get('body').should('have.class', 'dark');
    });
  });

  it('should handle smooth scrolling and navigation', () => {
    // Test scroll progress indicator
    cy.get('[data-testid="scroll-progress"]').should('be.visible');

    // Test smooth scrolling to each section
    cy.testSmoothScroll('about');
    cy.testSmoothScroll('skills');
    cy.testSmoothScroll('gaming');
    cy.testSmoothScroll('projects');
    cy.testSmoothScroll('contact');

    // Test scroll progress updates
    cy.get('[data-testid="scroll-progress"]')
      .should('have.attr', 'style')
      .and('include', 'width');
  });

  it('should test interactive elements and animations', () => {
    // Test particle background
    cy.testParticlePerformance();

    // Test interactive buttons
    cy.get('[data-testid="neon-button"]').each($button => {
      cy.wrap($button).trigger('mouseover').should('have.class', 'glow-effect');
    });

    // Test glitch text animations
    cy.get('[data-testid="glitch-text"]').should('be.visible');

    // Test sound toggle if present
    cy.get('body').then($body => {
      if ($body.find('[data-testid="sound-toggle"]').length > 0) {
        cy.testSoundToggle();
      }
    });
  });
});
