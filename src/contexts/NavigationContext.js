import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  smoothScrollTo,
  getCurrentSection,
  throttle,
} from '../utils/smoothScroll';

const NavigationContext = createContext();

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

export const NavigationProvider = ({ children }) => {
  const [activeSection, setActiveSection] = useState('hero');
  const [isNavigating, setIsNavigating] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  // Navigation items configuration
  const navItems = [
    { id: 'hero', label: 'Home', icon: '🏠', shortcut: 'H' },
    { id: 'about', label: 'About', icon: '👤', shortcut: 'A' },
    { id: 'skills', label: 'Skills', icon: '⚡', shortcut: 'S' },
    { id: 'projects', label: 'Projects', icon: '🚀', shortcut: 'P' },
    { id: 'gaming', label: 'Gaming', icon: '🎮', shortcut: 'G' },
    { id: 'contact', label: 'Contact', icon: '📧', shortcut: 'C' },
  ];

  // Update active section based on hash changes
  useEffect(() => {
    if (location.hash) {
      const sectionId = location.hash.substring(1);
      if (navItems.find(item => item.id === sectionId)) {
        setActiveSection(sectionId);
      }
    } else {
      setActiveSection('hero');
    }
  }, [location.hash]);

  // Track scroll progress and active section
  useEffect(() => {
    const handleScroll = throttle(() => {
      const scrollPosition = window.scrollY;
      const documentHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min((scrollPosition / documentHeight) * 100, 100);
      setScrollProgress(progress);

      // Update active section using utility function
      if (!isNavigating) {
        const sectionIds = navItems.map(item => item.id);
        const currentSection = getCurrentSection(sectionIds, 100);

        if (currentSection && currentSection !== activeSection) {
          setActiveSection(currentSection);
          // Update URL hash without triggering navigation
          if (location.hash !== `#${currentSection}`) {
            window.history.replaceState(null, null, `#${currentSection}`);
          }
        }
      }
    }, 16); // ~60fps throttling

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSection, isNavigating, location.hash, navItems]);

  // Navigate to section with smooth scrolling
  const navigateToSection = (sectionId, options = {}) => {
    const {
      duration = 1000,
      easing = 'easeInOutCubic',
      offset = -80, // Account for fixed header
      updateHash = true,
      callback = null,
    } = options;

    const element = document.getElementById(sectionId);
    if (!element) {
      console.warn(`Section not found: ${sectionId}`);
      return Promise.reject(new Error('Section not found'));
    }

    setIsNavigating(true);

    // Update hash in URL
    if (updateHash) {
      navigate(`#${sectionId}`, { replace: false });
    }

    // Use smooth scroll utility
    return smoothScrollTo(element, {
      duration,
      easing,
      offset,
      callback: () => {
        setIsNavigating(false);
        if (callback) callback();
      },
    }).catch(error => {
      console.error('Navigation error:', error);
      setIsNavigating(false);
    });
  };

  // Get next/previous section
  const getAdjacentSection = direction => {
    const currentIndex = navItems.findIndex(item => item.id === activeSection);
    if (currentIndex === -1) return null;

    const nextIndex =
      direction === 'next'
        ? Math.min(currentIndex + 1, navItems.length - 1)
        : Math.max(currentIndex - 1, 0);

    return navItems[nextIndex];
  };

  // Navigate to next section
  const navigateToNext = () => {
    const nextSection = getAdjacentSection('next');
    if (nextSection && nextSection.id !== activeSection) {
      navigateToSection(nextSection.id);
    }
  };

  // Navigate to previous section
  const navigateToPrevious = () => {
    const prevSection = getAdjacentSection('previous');
    if (prevSection && prevSection.id !== activeSection) {
      navigateToSection(prevSection.id);
    }
  };

  // Get section info
  const getSectionInfo = sectionId => {
    return navItems.find(item => item.id === sectionId);
  };

  // Check if section exists
  const sectionExists = sectionId => {
    return navItems.some(item => item.id === sectionId);
  };

  const value = {
    // State
    activeSection,
    isNavigating,
    scrollProgress,
    navItems,

    // Actions
    navigateToSection,
    navigateToNext,
    navigateToPrevious,

    // Utilities
    getSectionInfo,
    sectionExists,
    getAdjacentSection,
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};
