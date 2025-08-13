describe('Gaming Portfolio - Responsive Design Testing', () => {
  const viewports = [
    { name: 'mobile', width: 375, height: 667 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1280, height: 720 },
    { name: 'large-desktop', width: 1920, height: 1080 },
  ];

  viewports.forEach(viewport => {
    describe(`${viewport.name} viewport (${viewport.width}x${viewport.height})`, () => {
      beforeEach(() => {
        cy.viewport(viewport.width, viewport.height);
        cy.visit('/');
        cy.waitForAnimations();
      });

      it('should display all sections properly on different screen sizes', () => {
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

          cy.get(`[data-testid="section-${section}"]`)
            .should('be.visible')
            .should('not.have.css', 'overflow', 'hidden'); // Ensure no content is cut off
        });
      });

      it('should maintain navigation functionality across viewports', () => {
        // Test navigation menu
        if (viewport.width < 768) {
          // Mobile: Test hamburger menu
          cy.get('[data-testid="mobile-menu-toggle"]')
            .should('be.visible')
            .click();
          cy.get('[data-testid="mobile-menu"]').should('be.visible');
        } else {
          // Desktop: Test regular navigation
          cy.get('[data-testid="desktop-nav"]').should('be.visible');
        }

        // Test navigation to different sections
        cy.navigateToSection('about');
        cy.navigateToSection('skills');
        cy.navigateToSection('contact');
      });

      it('should ensure no content overlap or layout issues', () => {
        // Check that components don't overlap
        cy.get('[data-testid="game-hud"]').should('be.visible');
        cy.get('[data-testid="particle-background"]').should('be.visible');

        // Ensure text is readable and not cut off
        cy.get('h1, h2, h3, p').each($el => {
          cy.wrap($el).should('be.visible');

          // Check that text doesn't overflow its container
          cy.wrap($el).then($element => {
            const element = $element[0];
            expect(element.scrollWidth).to.be.at.most(element.clientWidth + 5); // Allow 5px tolerance
          });
        });
      });

      it('should test touch interactions on mobile devices', () => {
        if (viewport.width < 768) {
          // Test touch interactions for mobile
          cy.get('[data-testid="skill-card"]').first().trigger('touchstart');
          cy.get('[data-testid="skill-card"]').first().trigger('touchend');

          // Test swipe gestures if implemented
          cy.get('[data-testid="project-carousel"]').then($carousel => {
            if ($carousel.length > 0) {
              cy.wrap($carousel)
                .trigger('touchstart', {
                  touches: [{ clientX: 200, clientY: 200 }],
                })
                .trigger('touchmove', {
                  touches: [{ clientX: 100, clientY: 200 }],
                })
                .trigger('touchend');
            }
          });
        }
      });

      it('should maintain performance across different viewport sizes', () => {
        cy.checkPerformance();

        // Test that animations still work smoothly
        cy.get('[data-testid="particle-background"]').should('be.visible');

        // Check that images are properly sized
        cy.get('img').each($img => {
          cy.wrap($img).should('be.visible');
          cy.wrap($img).then($image => {
            const img = $image[0];
            expect(img.naturalWidth).to.be.greaterThan(0);
            expect(img.naturalHeight).to.be.greaterThan(0);
          });
        });
      });
    });
  });

  it('should test responsive image loading', () => {
    viewports.forEach(viewport => {
      cy.viewport(viewport.width, viewport.height);
      cy.visit('/');

      // Check that appropriate image sizes are loaded
      cy.get('img[srcset]').each($img => {
        cy.wrap($img).should('have.attr', 'srcset');
        cy.wrap($img).should('be.visible');
      });
    });
  });

  it('should test responsive typography scaling', () => {
    viewports.forEach(viewport => {
      cy.viewport(viewport.width, viewport.height);
      cy.visit('/');

      // Check that text scales appropriately
      cy.get('h1').then($h1 => {
        const fontSize = parseFloat(window.getComputedStyle($h1[0]).fontSize);

        if (viewport.width < 768) {
          expect(fontSize).to.be.lessThan(48); // Mobile should have smaller text
        } else {
          expect(fontSize).to.be.greaterThan(32); // Desktop should have larger text
        }
      });
    });
  });
});
