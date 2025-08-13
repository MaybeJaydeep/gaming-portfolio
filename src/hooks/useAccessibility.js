import { useState, useEffect, useCallback } from 'react';

export const useAccessibility = () => {
  const [focusVisible, setFocusVisible] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Check for user preferences
  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handleChange = e => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);

    // Check for high contrast preference
    const contrastQuery = window.matchMedia('(prefers-contrast: high)');
    setHighContrast(contrastQuery.matches);

    const handleContrastChange = e => setHighContrast(e.matches);
    contrastQuery.addEventListener('change', handleContrastChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
      contrastQuery.removeEventListener('change', handleContrastChange);
    };
  }, []);

  // Focus management
  const handleFocusVisible = useCallback(() => {
    setFocusVisible(true);
  }, []);

  const handleFocusHidden = useCallback(() => {
    setFocusVisible(false);
  }, []);

  // Screen reader announcements
  const announce = useCallback((message, priority = 'polite') => {
    const id = Date.now();
    const announcement = { id, message, priority };

    setAnnouncements(prev => [...prev, announcement]);

    // Remove announcement after it's been read
    setTimeout(() => {
      setAnnouncements(prev => prev.filter(a => a.id !== id));
    }, 1000);
  }, []);

  // Skip link functionality
  const skipToContent = useCallback((targetId = 'main-content') => {
    const target = document.getElementById(targetId);
    if (target) {
      target.focus();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  // Keyboard navigation helpers
  const handleKeyboardNavigation = useCallback((event, actions) => {
    const { key } = event;

    if (actions[key]) {
      event.preventDefault();
      actions[key]();
    }
  }, []);

  // ARIA helpers
  const getAriaProps = useCallback((options = {}) => {
    const {
      label,
      labelledBy,
      describedBy,
      expanded,
      selected,
      disabled,
      required,
      invalid,
      live = 'off',
      atomic = false,
      relevant = 'additions text',
    } = options;

    const props = {};

    if (label) props['aria-label'] = label;
    if (labelledBy) props['aria-labelledby'] = labelledBy;
    if (describedBy) props['aria-describedby'] = describedBy;
    if (expanded !== undefined) props['aria-expanded'] = expanded;
    if (selected !== undefined) props['aria-selected'] = selected;
    if (disabled !== undefined) props['aria-disabled'] = disabled;
    if (required !== undefined) props['aria-required'] = required;
    if (invalid !== undefined) props['aria-invalid'] = invalid;
    if (live !== 'off') {
      props['aria-live'] = live;
      props['aria-atomic'] = atomic;
      props['aria-relevant'] = relevant;
    }

    return props;
  }, []);

  // Focus trap for modals
  const createFocusTrap = useCallback(containerRef => {
    if (!containerRef.current) return null;

    const focusableElements = containerRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = e => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    const handleEscapeKey = e => {
      if (e.key === 'Escape') {
        // Close modal or return focus
        const closeButton = containerRef.current.querySelector('[data-close]');
        if (closeButton) {
          closeButton.click();
        }
      }
    };

    document.addEventListener('keydown', handleTabKey);
    document.addEventListener('keydown', handleEscapeKey);

    // Focus first element
    if (firstElement) {
      firstElement.focus();
    }

    return () => {
      document.removeEventListener('keydown', handleTabKey);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, []);

  return {
    // State
    focusVisible,
    announcements,
    highContrast,
    reducedMotion,

    // Actions
    announce,
    skipToContent,
    handleKeyboardNavigation,
    handleFocusVisible,
    handleFocusHidden,

    // Helpers
    getAriaProps,
    createFocusTrap,
  };
};

export default useAccessibility;
