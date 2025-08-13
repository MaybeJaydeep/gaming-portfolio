import {
  smoothScrollTo,
  scrollToTop,
  getScrollProgress,
  getCurrentSection,
  easingFunctions,
  throttle,
  debounce,
} from './smoothScroll';

// Mock DOM methods
Object.defineProperty(window, 'pageYOffset', {
  value: 0,
  writable: true,
});

Object.defineProperty(window, 'innerHeight', {
  value: 1000,
  writable: true,
});

Object.defineProperty(document.documentElement, 'scrollHeight', {
  value: 2000,
  writable: true,
});

// Mock scrollTo
window.scrollTo = jest.fn();

// Mock requestAnimationFrame
global.requestAnimationFrame = jest.fn(cb => setTimeout(cb, 16));
global.performance = { now: jest.fn(() => Date.now()) };

describe('smoothScroll utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.pageYOffset = 0;
  });

  describe('easingFunctions', () => {
    test('easeInOutCubic returns correct values', () => {
      expect(easingFunctions.easeInOutCubic(0)).toBe(0);
      expect(easingFunctions.easeInOutCubic(0.5)).toBe(0.5);
      expect(easingFunctions.easeInOutCubic(1)).toBe(1);
    });

    test('easeOutQuart returns correct values', () => {
      expect(easingFunctions.easeOutQuart(0)).toBe(0);
      expect(easingFunctions.easeOutQuart(1)).toBe(1);
    });
  });

  describe('getScrollProgress', () => {
    test('returns 0 when at top', () => {
      window.pageYOffset = 0;
      expect(getScrollProgress()).toBe(0);
    });

    test('returns 100 when at bottom', () => {
      window.pageYOffset = 1000; // scrollHeight - innerHeight
      expect(getScrollProgress()).toBe(100);
    });

    test('returns correct percentage for middle position', () => {
      window.pageYOffset = 500;
      expect(getScrollProgress()).toBe(50);
    });
  });

  describe('getCurrentSection', () => {
    beforeEach(() => {
      // Mock DOM elements
      const mockElements = {
        section1: {
          getBoundingClientRect: () => ({ top: 0, height: 500 }),
          id: 'section1',
        },
        section2: {
          getBoundingClientRect: () => ({ top: 500, height: 500 }),
          id: 'section2',
        },
      };

      document.getElementById = jest.fn(id => mockElements[id]);
    });

    test('returns correct section based on scroll position', () => {
      window.pageYOffset = 250;
      const result = getCurrentSection(['section1', 'section2'], 100);
      expect(result).toBe('section1');
    });

    test('returns null when no sections provided', () => {
      const result = getCurrentSection([], 100);
      expect(result).toBeNull();
    });

    test('handles missing elements gracefully', () => {
      document.getElementById = jest.fn(() => null);
      const result = getCurrentSection(['nonexistent'], 100);
      expect(result).toBeNull();
    });
  });

  describe('smoothScrollTo', () => {
    test('rejects when element not found', async () => {
      document.getElementById = jest.fn(() => null);

      await expect(smoothScrollTo('nonexistent')).rejects.toThrow(
        'Target element not found'
      );
    });

    test('scrolls to element when found', async () => {
      const mockElement = {
        getBoundingClientRect: () => ({ top: 500 }),
        scrollIntoView: jest.fn(),
      };

      document.getElementById = jest.fn(() => mockElement);

      // Mock native smooth scrolling support
      Object.defineProperty(document.documentElement.style, 'scrollBehavior', {
        value: 'smooth',
        writable: true,
      });

      await smoothScrollTo('test-element');

      expect(mockElement.scrollIntoView).toHaveBeenCalledWith({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest',
      });
    });

    test('uses custom animation when native smooth scroll not available', async () => {
      const mockElement = {
        getBoundingClientRect: () => ({ top: 500 }),
        scrollIntoView: jest.fn(),
      };

      document.getElementById = jest.fn(() => mockElement);

      // Remove native smooth scrolling support
      delete document.documentElement.style.scrollBehavior;

      const promise = smoothScrollTo('test-element', { duration: 100 });

      // Fast-forward time to complete animation
      jest.advanceTimersByTime(200);

      await promise;

      expect(window.scrollTo).toHaveBeenCalled();
    });
  });

  describe('scrollToTop', () => {
    test('scrolls to top of page', async () => {
      const mockBody = {
        getBoundingClientRect: () => ({ top: -500 }),
        scrollIntoView: jest.fn(),
      };

      document.body = mockBody;

      Object.defineProperty(document.documentElement.style, 'scrollBehavior', {
        value: 'smooth',
        writable: true,
      });

      await scrollToTop();

      expect(mockBody.scrollIntoView).toHaveBeenCalled();
    });
  });

  describe('throttle', () => {
    test('limits function calls', () => {
      const mockFn = jest.fn();
      const throttledFn = throttle(mockFn, 100);

      throttledFn();
      throttledFn();
      throttledFn();

      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    test('allows function call after delay', () => {
      const mockFn = jest.fn();
      const throttledFn = throttle(mockFn, 100);

      throttledFn();
      expect(mockFn).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(150);
      throttledFn();
      expect(mockFn).toHaveBeenCalledTimes(2);
    });
  });

  describe('debounce', () => {
    test('delays function execution', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn();
      expect(mockFn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(150);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    test('cancels previous calls', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn();
      debouncedFn();
      debouncedFn();

      jest.advanceTimersByTime(150);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });
  });
});
