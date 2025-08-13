import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ParticleBackground from './ParticleBackground';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, initial, animate, transition, ...props }) => (
      <div {...props}>{children}</div>
    ),
  },
}));

// Mock canvas context
const mockContext = {
  clearRect: jest.fn(),
  save: jest.fn(),
  restore: jest.fn(),
  beginPath: jest.fn(),
  arc: jest.fn(),
  fill: jest.fn(),
  stroke: jest.fn(),
  moveTo: jest.fn(),
  lineTo: jest.fn(),
  createRadialGradient: jest.fn(() => ({
    addColorStop: jest.fn(),
  })),
  scale: jest.fn(),
  set fillStyle(value) {},
  set strokeStyle(value) {},
  set globalAlpha(value) {},
  set lineWidth(value) {},
};

// Mock canvas
const mockCanvas = {
  getContext: jest.fn(() => mockContext),
  width: 800,
  height: 600,
  getBoundingClientRect: jest.fn(() => ({
    width: 800,
    height: 600,
  })),
};

// Mock HTMLCanvasElement
Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  value: jest.fn(() => mockContext),
});

Object.defineProperty(HTMLCanvasElement.prototype, 'getBoundingClientRect', {
  value: jest.fn(() => ({
    width: 800,
    height: 600,
  })),
});

// Mock window.devicePixelRatio
Object.defineProperty(window, 'devicePixelRatio', {
  value: 1,
  writable: true,
});

// Mock requestAnimationFrame and cancelAnimationFrame
global.requestAnimationFrame = jest.fn(cb => setTimeout(cb, 16));
global.cancelAnimationFrame = jest.fn(id => clearTimeout(id));

// Mock matchMedia for reduced motion
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

describe('ParticleBackground Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset requestAnimationFrame mock
    global.requestAnimationFrame.mockClear();
    global.cancelAnimationFrame.mockClear();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  test('renders ParticleBackground with default props', () => {
    const { container } = render(<ParticleBackground />);

    const canvas = container.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
    expect(canvas).toHaveClass('w-full', 'h-full');
  });

  test('applies custom className', () => {
    const { container } = render(
      <ParticleBackground className="custom-class" />
    );

    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('custom-class');
  });

  test('renders canvas with correct styling', () => {
    const { container } = render(<ParticleBackground />);

    const canvas = container.querySelector('canvas');
    expect(canvas).toHaveStyle({ background: 'transparent' });
  });

  test('initializes canvas context and starts animation', () => {
    render(<ParticleBackground />);

    expect(mockContext.scale).toHaveBeenCalledWith(1, 1);
    expect(global.requestAnimationFrame).toHaveBeenCalled();
  });

  test('handles custom particle count', () => {
    render(<ParticleBackground particleCount={25} />);

    const canvas =
      screen.getByRole('img', { hidden: true }) ||
      document.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
  });

  test('respects reduced motion preference when enabled', () => {
    // Mock reduced motion preference
    window.matchMedia.mockImplementation(query => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    render(<ParticleBackground respectReducedMotion={true} />);

    expect(
      screen.getByText(
        'Particle animation disabled due to reduced motion preference'
      )
    ).toBeInTheDocument();
  });

  test('does not show reduced motion message when preference is not set', () => {
    window.matchMedia.mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    render(<ParticleBackground respectReducedMotion={true} />);

    expect(
      screen.queryByText(
        'Particle animation disabled due to reduced motion preference'
      )
    ).not.toBeInTheDocument();
  });

  test('ignores reduced motion when respectReducedMotion is false', () => {
    window.matchMedia.mockImplementation(query => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    render(<ParticleBackground respectReducedMotion={false} />);

    expect(
      screen.queryByText(
        'Particle animation disabled due to reduced motion preference'
      )
    ).not.toBeInTheDocument();
  });

  test('handles window resize events', () => {
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

    const { unmount } = render(<ParticleBackground />);

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'resize',
      expect.any(Function)
    );

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'resize',
      expect.any(Function)
    );

    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
  });

  test('cleans up animation frame on unmount', () => {
    const { unmount } = render(<ParticleBackground />);

    unmount();

    expect(global.cancelAnimationFrame).toHaveBeenCalled();
  });

  test('applies correct CSS classes for positioning and layering', () => {
    const { container } = render(<ParticleBackground />);

    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass(
      'fixed',
      'inset-0',
      'pointer-events-none',
      'z-0'
    );
  });

  test('canvas context methods are called during animation', done => {
    render(<ParticleBackground />);

    // Wait for animation frame to be called
    setTimeout(() => {
      expect(mockContext.clearRect).toHaveBeenCalled();
      expect(mockContext.createRadialGradient).toHaveBeenCalled();
      done();
    }, 50);
  });

  test('handles device pixel ratio scaling', () => {
    // Mock higher device pixel ratio
    Object.defineProperty(window, 'devicePixelRatio', {
      value: 2,
      writable: true,
    });

    render(<ParticleBackground />);

    expect(mockContext.scale).toHaveBeenCalledWith(2, 2);

    // Reset device pixel ratio
    Object.defineProperty(window, 'devicePixelRatio', {
      value: 1,
      writable: true,
    });
  });

  test('accessibility features are properly implemented', () => {
    window.matchMedia.mockImplementation(query => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    render(<ParticleBackground respectReducedMotion={true} />);

    const accessibilityMessage = screen.getByText(
      'Particle animation disabled due to reduced motion preference'
    );
    expect(accessibilityMessage).toHaveClass('sr-only');
  });

  test('component handles missing canvas gracefully', () => {
    // Mock a scenario where canvas ref is null
    const originalGetContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = null;

    expect(() => {
      render(<ParticleBackground />);
    }).not.toThrow();

    // Restore original method
    HTMLCanvasElement.prototype.getContext = originalGetContext;
  });
});
