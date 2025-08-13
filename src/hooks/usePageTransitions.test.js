import { renderHook, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import {
  usePageTransitions,
  useScrollAnimations,
  useAnimationPreferences,
  useStaggerAnimation,
} from './usePageTransitions';

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
});
window.IntersectionObserver = mockIntersectionObserver;

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock navigator properties
Object.defineProperty(navigator, 'hardwareConcurrency', {
  writable: true,
  value: 4,
});

Object.defineProperty(navigator, 'deviceMemory', {
  writable: true,
  value: 8,
});

describe('usePageTransitions', () => {
  const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('initializes with default values', () => {
    const { result } = renderHook(() => usePageTransitions(), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.loadingProgress).toBe(0);
    expect(result.current.currentSection).toBe('hero');
  });

  it('simulates loading progress', () => {
    const { result } = renderHook(() => usePageTransitions(), { wrapper });

    act(() => {
      result.current.simulateLoading(1000);
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.loadingProgress).toBe(0);

    // Fast forward time
    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(result.current.loadingProgress).toBeGreaterThan(0);

    // Complete loading
    act(() => {
      jest.advanceTimersByTime(1500);
    });

    expect(result.current.loadingProgress).toBe(100);
  });

  it('provides setIsLoading function', () => {
    const { result } = renderHook(() => usePageTransitions(), { wrapper });

    act(() => {
      result.current.setIsLoading(true);
    });

    expect(result.current.isLoading).toBe(true);
  });
});

describe('useScrollAnimations', () => {
  beforeEach(() => {
    // Mock window.scrollY
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      value: 0,
    });
  });

  it('initializes with default scroll values', () => {
    const { result } = renderHook(() => useScrollAnimations());

    expect(result.current.scrollY).toBe(0);
    expect(result.current.scrollDirection).toBe('down');
    expect(result.current.isScrolling).toBe(false);
  });

  it('updates scroll values on scroll event', () => {
    const { result } = renderHook(() => useScrollAnimations());

    // Simulate scroll event
    act(() => {
      Object.defineProperty(window, 'scrollY', { value: 100 });
      window.dispatchEvent(new Event('scroll'));
    });

    expect(result.current.scrollY).toBe(100);
    expect(result.current.isScrolling).toBe(true);
  });

  it('detects scroll direction', () => {
    const { result } = renderHook(() => useScrollAnimations());

    // Scroll down
    act(() => {
      Object.defineProperty(window, 'scrollY', { value: 100 });
      window.dispatchEvent(new Event('scroll'));
    });

    expect(result.current.scrollDirection).toBe('down');

    // Scroll up
    act(() => {
      Object.defineProperty(window, 'scrollY', { value: 50 });
      window.dispatchEvent(new Event('scroll'));
    });

    expect(result.current.scrollDirection).toBe('up');
  });
});

describe('useAnimationPreferences', () => {
  it('initializes with default animation preferences', () => {
    const { result } = renderHook(() => useAnimationPreferences());

    expect(result.current.prefersReducedMotion).toBe(false);
    expect(result.current.animationsEnabled).toBe(true);
    expect(typeof result.current.toggleAnimations).toBe('function');
  });

  it('detects reduced motion preference', () => {
    // Mock reduced motion preference
    window.matchMedia = jest.fn().mockImplementation(query => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }));

    const { result } = renderHook(() => useAnimationPreferences());

    expect(result.current.prefersReducedMotion).toBe(true);
  });

  it('toggles animations', () => {
    const { result } = renderHook(() => useAnimationPreferences());

    act(() => {
      result.current.toggleAnimations();
    });

    expect(result.current.animationsEnabled).toBe(false);

    act(() => {
      result.current.toggleAnimations();
    });

    expect(result.current.animationsEnabled).toBe(true);
  });

  it('disables animations on low-end devices', () => {
    // Mock low-end device
    Object.defineProperty(navigator, 'hardwareConcurrency', {
      writable: true,
      value: 2,
    });
    Object.defineProperty(navigator, 'deviceMemory', {
      writable: true,
      value: 1,
    });

    const { result } = renderHook(() => useAnimationPreferences());

    // Should disable animations on low-end device
    expect(result.current.animationsEnabled).toBe(false);
  });
});

describe('useStaggerAnimation', () => {
  it('calculates stagger delays correctly', () => {
    const { result } = renderHook(() => useStaggerAnimation(5, 0.2));

    expect(result.current.getStaggerDelay(0)).toBe(0);
    expect(result.current.getStaggerDelay(1)).toBe(0.2);
    expect(result.current.getStaggerDelay(2)).toBe(0.4);
  });

  it('provides stagger configuration', () => {
    const { result } = renderHook(() => useStaggerAnimation(3, 0.15));

    const config = result.current.getStaggerConfig();
    expect(config.staggerChildren).toBe(0.15);
    expect(config.delayChildren).toBe(0.075);
  });

  it('calculates total duration', () => {
    const { result } = renderHook(() => useStaggerAnimation(4, 0.1));

    expect(result.current.totalDuration).toBe(0.4);
  });

  it('handles different base delays', () => {
    const { result } = renderHook(() => useStaggerAnimation(3, 0.3));

    expect(result.current.getStaggerDelay(1)).toBe(0.3);
    expect(result.current.totalDuration).toBe(0.9);
  });
});

describe('Hook Integration', () => {
  it('works together for complete animation system', () => {
    const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;

    const { result: pageResult } = renderHook(() => usePageTransitions(), {
      wrapper,
    });
    const { result: scrollResult } = renderHook(() => useScrollAnimations());
    const { result: prefResult } = renderHook(() => useAnimationPreferences());
    const { result: staggerResult } = renderHook(() => useStaggerAnimation(5));

    // All hooks should initialize properly
    expect(pageResult.current.currentSection).toBe('hero');
    expect(scrollResult.current.scrollY).toBe(0);
    expect(prefResult.current.animationsEnabled).toBe(true);
    expect(staggerResult.current.totalDuration).toBe(0.5);
  });
});

describe('Performance and Cleanup', () => {
  it('cleans up event listeners properly', () => {
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

    const { unmount } = renderHook(() => useScrollAnimations());

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'scroll',
      expect.any(Function)
    );
  });

  it('cleans up intersection observers', () => {
    const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;

    const { unmount } = renderHook(() => usePageTransitions(), { wrapper });

    unmount();

    // Should have called unobserve for cleanup
    expect(mockIntersectionObserver).toHaveBeenCalled();
  });
});
