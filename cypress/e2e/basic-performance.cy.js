describe('Gaming Portfolio - Basic Performance Tests', () => {
  it('should load within acceptable time', () => {
    const startTime = Date.now();

    cy.visit('/').then(() => {
      const loadTime = Date.now() - startTime;
      expect(loadTime).to.be.lessThan(5000); // 5 seconds max
    });
  });

  it('should have reasonable bundle size', () => {
    cy.visit('/');

    cy.window().then(win => {
      const navigationEntries = win.performance.getEntriesByType('navigation');
      if (navigationEntries.length > 0) {
        const entry = navigationEntries[0];

        // Check that transfer size is reasonable (less than 5MB)
        if (entry.transferSize) {
          expect(entry.transferSize).to.be.lessThan(5 * 1024 * 1024);
        }

        // Check that DOM content loads quickly
        if (entry.domContentLoadedEventEnd && entry.navigationStart) {
          const domLoadTime =
            entry.domContentLoadedEventEnd - entry.navigationStart;
          expect(domLoadTime).to.be.lessThan(3000);
        }
      }
    });
  });

  it('should not have memory leaks during basic navigation', () => {
    cy.visit('/');

    cy.window().then(win => {
      if (win.performance.memory) {
        const initialMemory = win.performance.memory.usedJSHeapSize;

        // Perform some basic interactions
        cy.get('body').click();
        cy.wait(1000);
        cy.reload();
        cy.wait(2000);

        cy.window().then(finalWin => {
          if (finalWin.performance.memory) {
            const finalMemory = finalWin.performance.memory.usedJSHeapSize;
            const memoryIncrease = finalMemory - initialMemory;

            // Memory increase should be reasonable (less than 10MB)
            expect(memoryIncrease).to.be.lessThan(10 * 1024 * 1024);
          }
        });
      }
    });
  });

  it('should handle slow network conditions', () => {
    // Simulate slow network by adding delays
    cy.intercept('**/*', req => {
      req.reply(res => {
        // Add small delay to simulate slow network
        return new Promise(resolve => {
          setTimeout(() => resolve(res.send()), 100);
        });
      });
    });

    cy.visit('/');

    // Should still load within reasonable time even with network delay
    cy.get('body', { timeout: 10000 }).should('be.visible');
  });

  it('should maintain performance across viewport changes', () => {
    cy.visit('/');

    const viewports = [
      [375, 667], // Mobile
      [768, 1024], // Tablet
      [1280, 720], // Desktop
      [1920, 1080], // Large desktop
    ];

    viewports.forEach(([width, height]) => {
      const startTime = Date.now();

      cy.viewport(width, height);
      cy.wait(500);

      const resizeTime = Date.now() - startTime;
      expect(resizeTime).to.be.lessThan(1000); // Resize should be quick

      // Check that content is still visible
      cy.get('body').should('be.visible');
    });
  });
});
