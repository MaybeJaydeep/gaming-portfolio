// Utility functions to handle styling issues and ensure proper CSS application

/**
 * Force browser to recalculate styles - useful for fixing CSS loading issues
 */
export const forceStyleRecalculation = () => {
  const body = document.body;
  const originalDisplay = body.style.display;

  body.style.display = 'none';
  // eslint-disable-next-line no-unused-expressions
  body.offsetHeight; // Trigger reflow
  body.style.display = originalDisplay || '';
};

/**
 * Ensure Tailwind classes are properly applied by checking computed styles
 */
export const validateTailwindStyles = (element, expectedClasses) => {
  if (!element) return false;

  const computedStyle = window.getComputedStyle(element);
  const issues = [];

  // Check for common Tailwind class issues
  expectedClasses.forEach(className => {
    switch (className) {
      case 'text-cyan-400':
        if (computedStyle.color !== 'rgb(34, 211, 238)') {
          issues.push(`Expected cyan-400 color, got ${computedStyle.color}`);
        }
        break;
      case 'bg-gray-900':
        if (computedStyle.backgroundColor !== 'rgb(17, 24, 39)') {
          issues.push(
            `Expected gray-900 background, got ${computedStyle.backgroundColor}`
          );
        }
        break;
      case 'border-neon-cyan':
        if (computedStyle.borderColor !== 'rgb(0, 255, 255)') {
          issues.push(
            `Expected neon-cyan border, got ${computedStyle.borderColor}`
          );
        }
        break;
      default:
        // Generic check for class presence
        if (!element.classList.contains(className)) {
          issues.push(`Missing class: ${className}`);
        }
    }
  });

  if (issues.length > 0) {
    console.warn('Style validation issues:', issues);
    return false;
  }

  return true;
};

/**
 * Apply emergency styles if Tailwind fails to load
 */
export const applyEmergencyStyles = () => {
  const emergencyCSS = `
    .emergency-styles {
      background-color: #0a0a0a !important;
      color: #e0e0e0 !important;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif !important;
    }

    .emergency-cyan {
      color: #00ffff !important;
    }

    .emergency-green {
      color: #00ff00 !important;
    }

    .emergency-purple {
      color: #8a2be2 !important;
    }

    .emergency-bg-dark {
      background-color: #1a1a1a !important;
    }

    .emergency-border {
      border: 2px solid #00ffff !important;
    }

    .emergency-padding {
      padding: 1rem !important;
    }

    .emergency-margin {
      margin: 1rem !important;
    }

    .emergency-flex {
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
    }

    .emergency-grid {
      display: grid !important;
      gap: 1rem !important;
    }

    .emergency-text-center {
      text-align: center !important;
    }

    .emergency-rounded {
      border-radius: 0.5rem !important;
    }

    .emergency-shadow {
      box-shadow: 0 0 20px rgba(0, 255, 255, 0.3) !important;
    }
  `;

  const styleElement = document.createElement('style');
  styleElement.textContent = emergencyCSS;
  styleElement.id = 'emergency-styles';

  // Remove existing emergency styles if present
  const existingStyles = document.getElementById('emergency-styles');
  if (existingStyles) {
    existingStyles.remove();
  }

  document.head.appendChild(styleElement);

  // Apply emergency class to body
  document.body.classList.add('emergency-styles');
};

/**
 * Check if Tailwind CSS is properly loaded
 */
export const isTailwindLoaded = () => {
  // Create a test element with Tailwind classes
  const testElement = document.createElement('div');
  testElement.className = 'text-cyan-400 bg-gray-900 p-4';
  testElement.style.position = 'absolute';
  testElement.style.visibility = 'hidden';
  testElement.style.pointerEvents = 'none';

  document.body.appendChild(testElement);

  const computedStyle = window.getComputedStyle(testElement);
  const isLoaded =
    computedStyle.color === 'rgb(34, 211, 238)' && // text-cyan-400
    computedStyle.backgroundColor === 'rgb(17, 24, 39)' && // bg-gray-900
    computedStyle.padding === '16px'; // p-4

  document.body.removeChild(testElement);

  return isLoaded;
};

/**
 * Monitor and fix styling issues
 */
export const initStyleMonitoring = () => {
  let retryCount = 0;
  const maxRetries = 5;

  const checkAndFixStyles = () => {
    if (!isTailwindLoaded() && retryCount < maxRetries) {
      console.warn(
        `Tailwind CSS not properly loaded, attempt ${
          retryCount + 1
        }/${maxRetries}`
      );

      // Try to force style recalculation
      forceStyleRecalculation();

      retryCount++;

      // If still not loaded after max retries, apply emergency styles
      if (retryCount >= maxRetries) {
        console.error(
          'Tailwind CSS failed to load properly, applying emergency styles'
        );
        applyEmergencyStyles();
      } else {
        // Retry after a delay
        setTimeout(checkAndFixStyles, 500);
      }
    } else if (isTailwindLoaded()) {
      console.log('Tailwind CSS loaded successfully');
      // Remove emergency styles if they were applied
      const emergencyStyles = document.getElementById('emergency-styles');
      if (emergencyStyles) {
        emergencyStyles.remove();
        document.body.classList.remove('emergency-styles');
      }
    }
  };

  // Initial check
  setTimeout(checkAndFixStyles, 100);

  // Also check when DOM content is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkAndFixStyles);
  }

  // Check when all resources are loaded
  if (document.readyState !== 'complete') {
    window.addEventListener('load', checkAndFixStyles);
  }
};

/**
 * Refresh component styles - useful for fixing component-specific styling issues
 */
export const refreshComponentStyles = componentRef => {
  if (!componentRef || !componentRef.current) return;

  const element = componentRef.current;

  // Force style recalculation for the component
  const originalDisplay = element.style.display;
  element.style.display = 'none';
  // eslint-disable-next-line no-unused-expressions
  element.offsetHeight; // Trigger reflow
  element.style.display = originalDisplay || '';

  // Re-apply classes to ensure they're processed
  const classes = Array.from(element.classList);
  element.className = '';
  // eslint-disable-next-line no-unused-expressions
  element.offsetHeight; // Trigger reflow
  element.className = classes.join(' ');
};

/**
 * Debug styling issues by logging computed styles
 */
export const debugElementStyles = (element, label = 'Element') => {
  if (!element) {
    console.warn(`${label}: Element not found`);
    return;
  }

  const computedStyle = window.getComputedStyle(element);
  const relevantStyles = {
    display: computedStyle.display,
    position: computedStyle.position,
    width: computedStyle.width,
    height: computedStyle.height,
    color: computedStyle.color,
    backgroundColor: computedStyle.backgroundColor,
    border: computedStyle.border,
    padding: computedStyle.padding,
    margin: computedStyle.margin,
    fontSize: computedStyle.fontSize,
    fontFamily: computedStyle.fontFamily,
    visibility: computedStyle.visibility,
    opacity: computedStyle.opacity,
    zIndex: computedStyle.zIndex,
  };

  console.group(`${label} Styles Debug`);
  console.log('Element:', element);
  console.log('Classes:', Array.from(element.classList));
  console.log('Computed Styles:', relevantStyles);
  console.log('Inline Styles:', element.style.cssText);
  console.groupEnd();
};
