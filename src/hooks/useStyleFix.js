import { useEffect, useRef } from 'react';
import {
  refreshComponentStyles,
  debugElementStyles,
  validateTailwindStyles,
} from '../utils/styleUtils';

/**
 * Hook to fix styling issues in components
 * @param {Array} expectedClasses - Array of Tailwind classes that should be applied
 * @param {Object} options - Configuration options
 */
export const useStyleFix = (expectedClasses = [], options = {}) => {
  const elementRef = useRef(null);
  const {
    debug = false,
    autoFix = true,
    retryCount = 3,
    retryDelay = 500,
  } = options;

  useEffect(() => {
    if (!elementRef.current || expectedClasses.length === 0) return;

    let attempts = 0;

    const validateAndFix = () => {
      const element = elementRef.current;
      if (!element) return;

      const isValid = validateTailwindStyles(element, expectedClasses);

      if (debug) {
        debugElementStyles(element, 'useStyleFix');
      }

      if (!isValid && autoFix && attempts < retryCount) {
        attempts++;

        if (debug) {
          console.log(`Style fix attempt ${attempts}/${retryCount}`);
        }

        // Try to refresh component styles
        refreshComponentStyles(elementRef);

        // Retry after delay
        setTimeout(validateAndFix, retryDelay);
      }
    };

    // Initial validation
    const timer = setTimeout(validateAndFix, 100);

    return () => clearTimeout(timer);
  }, [expectedClasses, debug, autoFix, retryCount, retryDelay]);

  return elementRef;
};

/**
 * Hook to ensure gaming theme styles are properly applied
 */
export const useGamingTheme = (options = {}) => {
  const gamingClasses = [
    'text-cyan-400',
    'bg-gray-900',
    'border-neon-cyan',
    'font-gaming',
  ];

  return useStyleFix(gamingClasses, {
    debug: process.env.NODE_ENV === 'development',
    ...options,
  });
};

/**
 * Hook to fix common Tailwind CSS issues
 */
export const useTailwindFix = () => {
  useEffect(() => {
    // Common fixes for Tailwind CSS issues
    const fixes = [
      // Fix for custom color variables not being applied
      () => {
        const root = document.documentElement;
        root.style.setProperty('--neon-cyan', '#00FFFF');
        root.style.setProperty('--electric-purple', '#8A2BE2');
        root.style.setProperty('--deep-dark', '#0A0A0A');
        root.style.setProperty('--dark-surface', '#1A1A1A');
        root.style.setProperty('--light-text', '#E0E0E0');
        root.style.setProperty('--neon-green', '#00FF00');
        root.style.setProperty('--warning-orange', '#FF8C00');
      },

      // Fix for font loading issues
      () => {
        const fonts = ['Orbitron', 'JetBrains Mono'];

        fonts.forEach(font => {
          if (document.fonts && document.fonts.check) {
            if (!document.fonts.check(`16px ${font}`)) {
              console.warn(`Font ${font} not loaded properly`);
            }
          }
        });
      },

      // Fix for animation issues
      () => {
        const prefersReducedMotion = window.matchMedia(
          '(prefers-reduced-motion: reduce)'
        ).matches;
        if (prefersReducedMotion) {
          document.documentElement.classList.add('reduce-motion');
        }
      },
    ];

    // Apply all fixes
    fixes.forEach(fix => {
      try {
        fix();
      } catch (error) {
        console.warn('Style fix failed:', error);
      }
    });
  }, []);
};

/**
 * Hook to monitor and report styling issues
 */
export const useStyleMonitor = componentName => {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    const checkStyles = () => {
      const issues = [];

      // Check for common issues
      const elements = document.querySelectorAll(
        '[class*="text-cyan"], [class*="bg-gray"], [class*="border-neon"]'
      );

      elements.forEach((element, index) => {
        const computedStyle = window.getComputedStyle(element);

        // Check if colors are being applied correctly
        if (
          element.classList.contains('text-cyan-400') &&
          computedStyle.color !== 'rgb(34, 211, 238)'
        ) {
          issues.push(`Element ${index}: text-cyan-400 not applied correctly`);
        }

        if (
          element.classList.contains('bg-gray-900') &&
          computedStyle.backgroundColor !== 'rgb(17, 24, 39)'
        ) {
          issues.push(`Element ${index}: bg-gray-900 not applied correctly`);
        }

        if (
          element.classList.contains('border-neon-cyan') &&
          computedStyle.borderColor !== 'rgb(0, 255, 255)'
        ) {
          issues.push(
            `Element ${index}: border-neon-cyan not applied correctly`
          );
        }
      });

      if (issues.length > 0) {
        console.group(`${componentName} Style Issues`);
        issues.forEach(issue => console.warn(issue));
        console.groupEnd();
      }
    };

    // Check styles after component mounts
    const timer = setTimeout(checkStyles, 1000);

    return () => clearTimeout(timer);
  }, [componentName]);
};
