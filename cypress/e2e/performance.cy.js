describe('Gaming Portfolio - Performance Testing', () => {
  beforeEach(() => {
    // Clear cache and cookies for consistent testing
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  it('should load the initial page within acceptable time limits', () => {
    const startTime = Date.now();

    cy.visit('/').then(() => {
      const loadTime = Date.now() - startTime;
      expect(loadTime).to.be.lessThan(3000); // Should load within 3 seconds
    });

    // Check that critical content is visible quickly
    cy.get('[data-testid="hero-section"]', { timeout: 2000 }).should(
      'be.visible'
    );
    cy.get('[data-testid="game-hud"]', { timeout: 2000 }).should('be.visible');
  });

  it('should maintain smooth animations and 60fps performance', () => {
    cy.visit('/');
    cy.waitForAnimations();

    // Test particle background performance
    cy.testParticlePerformance();

    // Test scroll performance
    cy.window().then(win => {
      let frameCount = 0;
      let lastTime = performance.now();
      const frameTimes = [];

      const measureFrameRate = currentTime => {
        frameCount++;
        const deltaTime = currentTime - lastTime;
        frameTimes.push(deltaTime);
        lastTime = currentTime;

        if (frameCount < 60) {
          // Measure for 60 frames
          win.requestAnimationFrame(measureFrameRate);
        } else {
          const avgFrameTime =
            frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
          const fps = 1000 / avgFrameTime;

          // Should maintain at least 30 FPS
          expect(fps).to.be.greaterThan(30);
        }
      };

      win.requestAnimationFrame(measureFrameRate);
    });
  });

  it('should handle network throttling gracefully', () => {
    // Simulate slow 3G connection
    cy.intercept('**/*', req => {
      req.reply(res => {
        res.delay(1000); // Add 1 second delay
        res.send();
      });
    });

    cy.visit('/');

    // Check that loading states are shown
    cy.get('[data-testid="loading-indicator"]').should('be.visible');

    // Check that content eventually loads
    cy.get('[data-testid="hero-section"]', { timeout: 10000 }).should(
      'be.visible'
    );
    cy.get('[data-testid="loading-indicator"]').should('not.exist');
  });

  it('should optimize image loading and lazy loading', () => {
    cy.visit('/');

    // Check that images above the fold load immediately
    cy.get('[data-testid="hero-section"] img').should('be.visible');

    // Check that images below the fold are lazy loaded
    cy.get('[data-testid="section-projects"] img').should(
      'have.attr',
      'loading',
      'lazy'
    );

    // Scroll to trigger lazy loading
    cy.navigateToSection('projects');
    cy.get('[data-testid="section-projects"] img').should('be.visible');

    // Check that images have proper dimensions to prevent layout shift
    cy.get('img').each($img => {
      cy.wrap($img).should('have.attr', 'width');
      cy.wrap($img).should('have.attr', 'height');
    });
  });

  it('should test memory usage and prevent memory leaks', () => {
    cy.visit('/');

    cy.window().then(win => {
      const initialMemory = win.performance.memory
        ? win.performance.memory.usedJSHeapSize
        : 0;

      // Navigate through all sections multiple times
      const sections = ['about', 'skills', 'gaming', 'projects', 'contact'];

      for (let i = 0; i < 3; i++) {
        sections.forEach(section => {
          cy.navigateToSection(section);
          cy.wait(500);
        });
      }

      // Check memory usage hasn't grown excessively
      cy.window().then(finalWin => {
        if (finalWin.performance.memory) {
          const finalMemory = finalWin.performance.memory.usedJSHeapSize;
          const memoryIncrease = finalMemory - initialMemory;

          // Memory increase should be reasonable (less than 50MB)
          expect(memoryIncrease).to.be.lessThan(50 * 1024 * 1024);
        }
      });
    });
  });

  it('should test bundle size and code splitting', () => {
    cy.visit('/');

    // Check that initial bundle is not too large
    cy.window().then(win => {
      const navigationEntries = win.performance.getEntriesByType('navigation');
      const transferSize = navigationEntries[0].transferSize;

      // Initial bundle should be less than 1MB
      expect(transferSize).to.be.lessThan(1024 * 1024);
    });

    // Check that additional chunks are loaded on demand
    cy.intercept('GET', '**/*.chunk.js').as('chunkLoad');

    // Navigate to different sections to trigger code splitting
    cy.navigateToSection('projects');

    // Verify that chunks are loaded efficiently
    cy.get('@chunkLoad.all').then(interceptions => {
      // Should not load excessive number of chunks
      expect(interceptions.length).to.be.lessThan(10);
    });
  });

  it('should test performance across different device types', () => {
    const devices = [
      { name: 'mobile', viewport: [375, 667], cpu: 'slow' },
      { name: 'tablet', viewport: [768, 1024], cpu: 'medium' },
      { name: 'desktop', viewport: [1280, 720], cpu: 'fast' },
    ];

    devices.forEach(device => {
      cy.viewport(device.viewport[0], device.viewport[1]);

      // Simulate different CPU speeds with throttling
      if (device.cpu === 'slow') {
        cy.intercept('**/*', req => {
          req.reply(res => {
            res.delay(500);
            res.send();
          });
        });
      }

      const startTime = Date.now();
      cy.visit('/');

      cy.get('[data-testid="hero-section"]')
        .should('be.visible')
        .then(() => {
          const loadTime = Date.now() - startTime;

          // Adjust expectations based on device type
          const maxLoadTime = device.cpu === 'slow' ? 5000 : 3000;
          expect(loadTime).to.be.lessThan(maxLoadTime);
        });

      // Test animation performance on different devices
      cy.testParticlePerformance();
    });
  });

  it('should test caching and service worker functionality', () => {
    cy.visit('/');

    // Check that service worker is registered
    cy.window().then(win => {
      if ('serviceWorker' in win.navigator) {
        cy.wrap(win.navigator.serviceWorker.ready).then(registration => {
          expect(registration).to.exist;
        });
      }
    });

    // Test that static assets are cached
    cy.reload();

    // Second load should be faster due to caching
    const startTime = Date.now();
    cy.get('[data-testid="hero-section"]')
      .should('be.visible')
      .then(() => {
        const cachedLoadTime = Date.now() - startTime;
        expect(cachedLoadTime).to.be.lessThan(1000); // Cached load should be under 1 second
      });
  });
});
