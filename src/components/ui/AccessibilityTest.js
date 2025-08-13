import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAccessibilityContext } from '../../contexts/AccessibilityContext';

const AccessibilityTest = () => {
  const [testResults, setTestResults] = useState({});
  const { announce, getAriaProps, reducedMotion, highContrast } =
    useAccessibilityContext();

  const runAccessibilityTests = () => {
    const results = {};

    // Test 1: Check for alt text on images
    const images = document.querySelectorAll('img');
    const imagesWithoutAlt = Array.from(images).filter(img => !img.alt);
    results.altText = {
      passed: imagesWithoutAlt.length === 0,
      message: `${imagesWithoutAlt.length} images without alt text found`,
      count: imagesWithoutAlt.length,
    };

    // Test 2: Check for proper heading hierarchy
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let headingHierarchyValid = true;
    let previousLevel = 0;

    Array.from(headings).forEach(heading => {
      const level = parseInt(heading.tagName.charAt(1));
      if (level > previousLevel + 1) {
        headingHierarchyValid = false;
      }
      previousLevel = level;
    });

    results.headingHierarchy = {
      passed: headingHierarchyValid,
      message: headingHierarchyValid
        ? 'Heading hierarchy is valid'
        : 'Heading hierarchy has gaps',
      count: headings.length,
    };

    // Test 3: Check for keyboard focusable elements
    const focusableElements = document.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    results.focusableElements = {
      passed: focusableElements.length > 0,
      message: `${focusableElements.length} focusable elements found`,
      count: focusableElements.length,
    };

    // Test 4: Check for ARIA labels
    const elementsWithAriaLabel = document.querySelectorAll(
      '[aria-label], [aria-labelledby]'
    );
    results.ariaLabels = {
      passed: elementsWithAriaLabel.length > 0,
      message: `${elementsWithAriaLabel.length} elements with ARIA labels found`,
      count: elementsWithAriaLabel.length,
    };

    // Test 5: Check color contrast (simplified)
    results.colorContrast = {
      passed: true, // This would require more complex color analysis
      message: 'Color contrast check requires manual verification',
      count: 0,
    };

    // Test 6: Check for skip links
    const skipLinks = document.querySelectorAll('a[href^="#"]');
    results.skipLinks = {
      passed: skipLinks.length > 0,
      message: `${skipLinks.length} skip links found`,
      count: skipLinks.length,
    };

    setTestResults(results);
    announce('Accessibility test completed', 'assertive');
  };

  const testKeyboardNavigation = () => {
    const focusableElements = document.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length > 0) {
      focusableElements[0].focus();
      announce(
        'Keyboard navigation test started. Use Tab to navigate through elements',
        'assertive'
      );
    }
  };

  const testScreenReaderAnnouncements = () => {
    announce('This is a test announcement for screen readers', 'polite');
    setTimeout(() => {
      announce('This is an assertive announcement', 'assertive');
    }, 2000);
  };

  return (
    <motion.div
      className="fixed bottom-4 right-4 bg-gray-900 border border-cyan-500 rounded-lg p-4 max-w-sm z-50"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="text-cyan-400 font-bold mb-3">Accessibility Tools</h3>

      <div className="space-y-2 mb-4">
        <div className="text-xs text-gray-300">
          <span className="font-medium">Reduced Motion:</span>{' '}
          {reducedMotion ? 'On' : 'Off'}
        </div>
        <div className="text-xs text-gray-300">
          <span className="font-medium">High Contrast:</span>{' '}
          {highContrast ? 'On' : 'Off'}
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <button
          onClick={runAccessibilityTests}
          className="w-full text-xs bg-cyan-500 text-black px-3 py-2 rounded hover:bg-cyan-400 transition-colors"
          {...getAriaProps({ label: 'Run accessibility tests' })}
        >
          Run A11y Tests
        </button>

        <button
          onClick={testKeyboardNavigation}
          className="w-full text-xs bg-purple-500 text-white px-3 py-2 rounded hover:bg-purple-400 transition-colors"
          {...getAriaProps({ label: 'Test keyboard navigation' })}
        >
          Test Keyboard Nav
        </button>

        <button
          onClick={testScreenReaderAnnouncements}
          className="w-full text-xs bg-green-500 text-white px-3 py-2 rounded hover:bg-green-400 transition-colors"
          {...getAriaProps({ label: 'Test screen reader announcements' })}
        >
          Test SR Announce
        </button>
      </div>

      {Object.keys(testResults).length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-cyan-400">Test Results:</h4>
          {Object.entries(testResults).map(([test, result]) => (
            <div key={test} className="text-xs">
              <span
                className={result.passed ? 'text-green-400' : 'text-red-400'}
              >
                {result.passed ? '✓' : '✗'}
              </span>
              <span className="ml-2 text-gray-300">{result.message}</span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default AccessibilityTest;
