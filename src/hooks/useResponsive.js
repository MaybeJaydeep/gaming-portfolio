import { useState, useEffect } from 'react';

// Breakpoint values matching Tailwind CSS defaults + custom ones
const breakpoints = {
  xs: 475,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
  '3xl': 1600,
};

export const useResponsive = () => {
  const [screenSize, setScreenSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
  });

  const [currentBreakpoint, setCurrentBreakpoint] = useState('lg');

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      setScreenSize({ width, height });

      // Determine current breakpoint
      let breakpoint = 'xs';
      Object.entries(breakpoints).forEach(([key, value]) => {
        if (width >= value) {
          breakpoint = key;
        }
      });
      setCurrentBreakpoint(breakpoint);
    };

    // Set initial values
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Helper functions for responsive checks
  const isMobile = screenSize.width < breakpoints.md;
  const isTablet =
    screenSize.width >= breakpoints.md && screenSize.width < breakpoints.lg;
  const isDesktop = screenSize.width >= breakpoints.lg;
  const isLargeScreen = screenSize.width >= breakpoints.xl;
  const isExtraLarge = screenSize.width >= breakpoints['2xl'];

  // Check if screen is at or above a certain breakpoint
  const isAbove = breakpoint => screenSize.width >= breakpoints[breakpoint];
  const isBelow = breakpoint => screenSize.width < breakpoints[breakpoint];

  // Get responsive value based on current screen size
  const getResponsiveValue = values => {
    const sortedBreakpoints = Object.keys(breakpoints).sort(
      (a, b) => breakpoints[a] - breakpoints[b]
    );

    let selectedValue = values.default || values[sortedBreakpoints[0]];

    for (const bp of sortedBreakpoints) {
      if (screenSize.width >= breakpoints[bp] && values[bp] !== undefined) {
        selectedValue = values[bp];
      }
    }

    return selectedValue;
  };

  // Check if device supports touch
  const isTouchDevice =
    typeof window !== 'undefined' &&
    ('ontouchstart' in window || navigator.maxTouchPoints > 0);

  // Check if user prefers reduced motion
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return {
    screenSize,
    currentBreakpoint,
    isMobile,
    isTablet,
    isDesktop,
    isLargeScreen,
    isExtraLarge,
    isAbove,
    isBelow,
    getResponsiveValue,
    isTouchDevice,
    prefersReducedMotion,
    breakpoints,
  };
};

// Hook for responsive grid columns
export const useResponsiveGrid = config => {
  const { getResponsiveValue } = useResponsive();

  return getResponsiveValue(config);
};

// Hook for responsive spacing
export const useResponsiveSpacing = config => {
  const { getResponsiveValue } = useResponsive();

  return getResponsiveValue(config);
};

export default useResponsive;
