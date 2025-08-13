import React, { createContext, useContext } from 'react';
import { useAccessibility } from '../hooks/useAccessibility';

const AccessibilityContext = createContext();

export const AccessibilityProvider = ({ children }) => {
  const accessibility = useAccessibility();

  return (
    <AccessibilityContext.Provider value={accessibility}>
      {children}

      {/* Screen reader announcements */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {accessibility.announcements
          .filter(a => a.priority === 'polite')
          .map(a => (
            <div key={a.id}>{a.message}</div>
          ))}
      </div>

      <div className="sr-only" aria-live="assertive" aria-atomic="true">
        {accessibility.announcements
          .filter(a => a.priority === 'assertive')
          .map(a => (
            <div key={a.id}>{a.message}</div>
          ))}
      </div>
    </AccessibilityContext.Provider>
  );
};

export const useAccessibilityContext = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error(
      'useAccessibilityContext must be used within an AccessibilityProvider'
    );
  }
  return context;
};

export default AccessibilityContext;
