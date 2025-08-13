/**
 * Smooth scroll utilities for enhanced navigation experience
 */

// Easing functions for smooth animations
export const easingFunctions = {
  easeInOutCubic: t =>
    t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  easeOutQuart: t => 1 - --t * t * t * t,
  easeInOutQuart: t => (t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t),
  easeOutExpo: t => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
};

/**
 * Smooth scroll to element with custom easing and duration
 * @param {string|HTMLElement} target - Element ID or element reference
 * @param {Object} options - Scroll options
 */
export const smoothScrollTo = (target, options = {}) => {
  const {
    duration = 1000,
    easing = 'easeInOutCubic',
    offset = 0,
    callback = null,
    behavior = 'smooth',
  } = options;

  // Get target element
  const element =
    typeof target === 'string' ? document.getElementById(target) : target;

  if (!element) {
    console.warn(`Smooth scroll target not found: ${target}`);
    return Promise.reject(new Error('Target element not found'));
  }

  return new Promise(resolve => {
    const startPosition = window.pageYOffset;
    const targetPosition =
      element.getBoundingClientRect().top + startPosition + offset;
    const distance = targetPosition - startPosition;
    const startTime = performance.now();

    // Use native smooth scrolling if available and preferred
    if (
      behavior === 'smooth' &&
      'scrollBehavior' in document.documentElement.style
    ) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest',
      });

      // Estimate completion time for native smooth scroll
      setTimeout(() => {
        if (callback) callback();
        resolve();
      }, 800);
      return;
    }

    // Custom smooth scroll animation
    const easingFunction =
      easingFunctions[easing] || easingFunctions.easeInOutCubic;

    function animateScroll(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easingFunction(progress);

      const currentPosition = startPosition + distance * easedProgress;
      window.scrollTo(0, currentPosition);

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      } else {
        if (callback) callback();
        resolve();
      }
    }

    requestAnimationFrame(animateScroll);
  });
};

/**
 * Smooth scroll to top of page
 * @param {Object} options - Scroll options
 */
export const scrollToTop = (options = {}) => {
  const { duration = 800, easing = 'easeOutQuart' } = options;

  return smoothScrollTo(document.body, {
    duration,
    easing,
    offset: 0,
    ...options,
  });
};

/**
 * Get scroll progress as percentage
 * @returns {number} Scroll progress (0-100)
 */
export const getScrollProgress = () => {
  const scrollTop = window.pageYOffset;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  return Math.min((scrollTop / docHeight) * 100, 100);
};

/**
 * Get current section based on scroll position
 * @param {Array} sections - Array of section IDs
 * @param {number} offset - Offset for section detection
 * @returns {string|null} Current section ID
 */
export const getCurrentSection = (sections = [], offset = 100) => {
  const scrollPosition = window.pageYOffset + offset;

  let currentSection = null;
  let closestDistance = Infinity;

  sections.forEach(sectionId => {
    const element = document.getElementById(sectionId);
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const elementTop = rect.top + window.pageYOffset;
    const elementBottom = elementTop + rect.height;

    // Check if scroll position is within this section
    if (scrollPosition >= elementTop && scrollPosition <= elementBottom) {
      currentSection = sectionId;
      return;
    }

    // Find closest section if none contains the scroll position
    const distanceToTop = Math.abs(elementTop - scrollPosition);
    if (distanceToTop < closestDistance) {
      closestDistance = distanceToTop;
      currentSection = sectionId;
    }
  });

  return currentSection;
};

/**
 * Create intersection observer for scroll-triggered animations
 * @param {Object} options - Observer options
 * @returns {IntersectionObserver} Observer instance
 */
export const createScrollObserver = (options = {}) => {
  const {
    threshold = 0.1,
    rootMargin = '0px 0px -10% 0px',
    callback = () => {},
  } = options;

  if (!('IntersectionObserver' in window)) {
    console.warn('IntersectionObserver not supported');
    return null;
  }

  return new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        callback(entry);
      });
    },
    {
      threshold,
      rootMargin,
    }
  );
};

/**
 * Add parallax effect to elements
 * @param {string} selector - CSS selector for parallax elements
 * @param {number} speed - Parallax speed (0-1, where 0.5 is half speed)
 */
export const addParallaxEffect = (selector, speed = 0.5) => {
  const elements = document.querySelectorAll(selector);
  if (elements.length === 0) return;

  const handleScroll = () => {
    const scrolled = window.pageYOffset;

    elements.forEach(element => {
      const rate = scrolled * speed;
      element.style.transform = `translateY(${rate}px)`;
    });
  };

  // Use passive listener for better performance
  window.addEventListener('scroll', handleScroll, { passive: true });

  // Return cleanup function
  return () => {
    window.removeEventListener('scroll', handleScroll);
  };
};

/**
 * Throttle function for performance optimization
 * @param {Function} func - Function to throttle
 * @param {number} limit - Throttle limit in milliseconds
 * @returns {Function} Throttled function
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Debounce function for performance optimization
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
