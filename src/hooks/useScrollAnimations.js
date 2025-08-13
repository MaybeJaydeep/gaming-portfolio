import { useEffect, useRef, useState } from 'react';
import { createScrollObserver, throttle } from '../utils/smoothScroll';

/**
 * Hook for managing scroll-triggered animations
 * @param {Object} options - Animation options
 * @returns {Object} Animation state and refs
 */
export const useScrollAnimations = (options = {}) => {
  const {
    threshold = 0.1,
    rootMargin = '0px 0px -10% 0px',
    triggerOnce = true,
    animationClass = 'animate-in',
    delay = 0,
  } = options;

  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleIntersection = entry => {
      if (entry.isIntersecting) {
        if (!hasAnimated || !triggerOnce) {
          setTimeout(() => {
            setIsVisible(true);
            setHasAnimated(true);
            element.classList.add(animationClass);
          }, delay);
        }
      } else if (!triggerOnce) {
        setIsVisible(false);
        element.classList.remove(animationClass);
      }
    };

    observerRef.current = createScrollObserver({
      threshold,
      rootMargin,
      callback: handleIntersection,
    });

    if (observerRef.current) {
      observerRef.current.observe(element);
    }

    return () => {
      if (observerRef.current && element) {
        observerRef.current.unobserve(element);
      }
    };
  }, [threshold, rootMargin, triggerOnce, animationClass, delay, hasAnimated]);

  return {
    elementRef,
    isVisible,
    hasAnimated,
  };
};

/**
 * Hook for parallax scrolling effects
 * @param {Object} options - Parallax options
 * @returns {Object} Parallax ref and transform value
 */
export const useParallax = (options = {}) => {
  const { speed = 0.5, direction = 'vertical' } = options;
  const [transform, setTransform] = useState('translateY(0px)');
  const elementRef = useRef(null);

  useEffect(() => {
    const handleScroll = throttle(() => {
      if (!elementRef.current) return;

      const scrolled = window.pageYOffset;
      const rate = scrolled * speed;

      const transformValue =
        direction === 'vertical'
          ? `translateY(${rate}px)`
          : `translateX(${rate}px)`;

      setTransform(transformValue);
      elementRef.current.style.transform = transformValue;
    }, 16); // ~60fps

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [speed, direction]);

  return {
    elementRef,
    transform,
  };
};

/**
 * Hook for scroll progress tracking
 * @param {Object} options - Progress options
 * @returns {Object} Progress state and utilities
 */
export const useScrollProgress = (options = {}) => {
  const { container = null, throttleMs = 16 } = options;

  const [progress, setProgress] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [scrollDirection, setScrollDirection] = useState('down');
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = throttle(() => {
      const currentScrollY = container
        ? container.scrollTop
        : window.pageYOffset;

      const maxScroll = container
        ? container.scrollHeight - container.clientHeight
        : document.documentElement.scrollHeight - window.innerHeight;

      const currentProgress = Math.min((currentScrollY / maxScroll) * 100, 100);

      setProgress(currentProgress);
      setScrollY(currentScrollY);

      // Determine scroll direction
      if (currentScrollY > lastScrollY.current) {
        setScrollDirection('down');
      } else if (currentScrollY < lastScrollY.current) {
        setScrollDirection('up');
      }

      lastScrollY.current = currentScrollY;
    }, throttleMs);

    const target = container || window;
    target.addEventListener('scroll', handleScroll, { passive: true });

    // Initial calculation
    handleScroll();

    return () => {
      target.removeEventListener('scroll', handleScroll);
    };
  }, [container, throttleMs]);

  return {
    progress,
    scrollY,
    scrollDirection,
    isScrollingDown: scrollDirection === 'down',
    isScrollingUp: scrollDirection === 'up',
  };
};

/**
 * Hook for managing section visibility and active states
 * @param {Array} sections - Array of section IDs
 * @param {Object} options - Visibility options
 * @returns {Object} Section visibility state
 */
export const useSectionVisibility = (sections = [], options = {}) => {
  const { threshold = 0.3, rootMargin = '0px 0px -20% 0px' } = options;

  const [visibleSections, setVisibleSections] = useState(new Set());
  const [activeSection, setActiveSection] = useState(sections[0] || null);
  const observerRef = useRef(null);

  useEffect(() => {
    const handleIntersection = entry => {
      const sectionId = entry.target.id;

      setVisibleSections(prev => {
        const newSet = new Set(prev);
        if (entry.isIntersecting) {
          newSet.add(sectionId);
        } else {
          newSet.delete(sectionId);
        }
        return newSet;
      });

      // Update active section based on intersection ratio
      if (entry.isIntersecting && entry.intersectionRatio >= threshold) {
        setActiveSection(sectionId);
      }
    };

    observerRef.current = createScrollObserver({
      threshold: [0, threshold, 0.5, 1],
      rootMargin,
      callback: handleIntersection,
    });

    if (observerRef.current) {
      sections.forEach(sectionId => {
        const element = document.getElementById(sectionId);
        if (element) {
          observerRef.current.observe(element);
        }
      });
    }

    return () => {
      if (observerRef.current) {
        sections.forEach(sectionId => {
          const element = document.getElementById(sectionId);
          if (element) {
            observerRef.current.unobserve(element);
          }
        });
      }
    };
  }, [sections, threshold, rootMargin]);

  return {
    visibleSections,
    activeSection,
    isVisible: sectionId => visibleSections.has(sectionId),
    isActive: sectionId => activeSection === sectionId,
  };
};
