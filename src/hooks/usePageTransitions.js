import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Hook for managing page transitions and loading states
 */
export const usePageTransitions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState('hero');
  const location = useLocation();

  // Simulate loading progress
  const simulateLoading = useCallback((duration = 2000) => {
    setIsLoading(true);
    setLoadingProgress(0);

    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsLoading(false), 300);
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, duration / 20);

    return () => clearInterval(interval);
  }, []);

  // Handle section changes based on hash
  useEffect(() => {
    const hash = location.hash.replace('#', '') || 'hero';
    setCurrentSection(hash);
  }, [location.hash]);

  // Intersection Observer for section detection
  useEffect(() => {
    const sections = document.querySelectorAll('section[id]');
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            setCurrentSection(entry.target.id);
          }
        });
      },
      {
        threshold: [0.3, 0.5, 0.7],
        rootMargin: '-20% 0px -20% 0px',
      }
    );

    sections.forEach(section => observer.observe(section));

    return () => {
      sections.forEach(section => observer.unobserve(section));
    };
  }, []);

  return {
    isLoading,
    loadingProgress,
    currentSection,
    simulateLoading,
    setIsLoading,
  };
};

/**
 * Hook for managing scroll-based animations
 */
export const useScrollAnimations = () => {
  const [scrollY, setScrollY] = useState(0);
  const [scrollDirection, setScrollDirection] = useState('down');
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let scrollTimeout;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      setScrollY(currentScrollY);
      setScrollDirection(currentScrollY > lastScrollY ? 'down' : 'up');
      setIsScrolling(true);

      // Clear existing timeout
      clearTimeout(scrollTimeout);

      // Set scrolling to false after scroll stops
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
      }, 150);

      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  return {
    scrollY,
    scrollDirection,
    isScrolling,
  };
};

/**
 * Hook for managing animation preferences and performance
 */
export const useAnimationPreferences = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = e => {
      setPrefersReducedMotion(e.matches);
      if (e.matches) {
        setAnimationsEnabled(false);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Performance-based animation control
  useEffect(() => {
    const checkPerformance = () => {
      // Simple performance check based on device capabilities
      const isLowEndDevice =
        navigator.hardwareConcurrency <= 2 || navigator.deviceMemory <= 2;

      if (isLowEndDevice && !prefersReducedMotion) {
        // Reduce animations on low-end devices
        setAnimationsEnabled(false);
      }
    };

    checkPerformance();
  }, [prefersReducedMotion]);

  const toggleAnimations = useCallback(() => {
    setAnimationsEnabled(prev => !prev);
  }, []);

  return {
    prefersReducedMotion,
    animationsEnabled,
    toggleAnimations,
  };
};

/**
 * Hook for managing stagger animations timing
 */
export const useStaggerAnimation = (itemCount, baseDelay = 0.1) => {
  const getStaggerDelay = useCallback(
    index => {
      return baseDelay * index;
    },
    [baseDelay]
  );

  const getStaggerConfig = useCallback(() => {
    return {
      staggerChildren: baseDelay,
      delayChildren: baseDelay * 0.5,
    };
  }, [baseDelay]);

  return {
    getStaggerDelay,
    getStaggerConfig,
    totalDuration: itemCount * baseDelay,
  };
};
