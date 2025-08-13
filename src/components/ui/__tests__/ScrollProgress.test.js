import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { jest } from '@jest/globals';
import ScrollProgress from '../ScrollProgress';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, style, onClick, animate, initial, transition, whileHover, whileTap, ...props }) => (
      <div
        className={className}
        style={style}
        onClick={onClick}
        {...props}
      >
        {children}
      </div>
    )
  }
}));

// Mock window scroll properties
Object.defineProperty(window, 'pageYOffset', {
  writable: true,
  value: 0
});

Object.defineProperty(window, 'innerHeight', {
  writable: true,
  value: 1000
});

Object.defineProperty(document.documentElement, 'scrollHeight', {
  writable: true,
  value: 2000
});

describe('ScrollProgress Component', () => {
  beforeEach(() => {
    // Reset scroll position
    window.pageYOffset = 0;

    // Mock addEventListener and removeEventListener
    window.addEventListener = jest.fn();
    window.removeEventListener = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders without sections', () => {
    render(<ScrollProgress />);

    // Should render the progress bar
    const progressContainer = document.querySelector('.fixed');
    expect(progressContainer).toBeInTheDocument();
  });

  test('renders with sections', () => {
    const sections = [
      { id: 'section1', label: 'Home' },
      { id: 'section2', label: 'About' },
      { id: 'section3', label: 'Contact' }
    ];

    render(<ScrollProgress sections={sections} />);

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  test('applies custom className', () => {
    render(<ScrollProgress className="custom-class" />);

    const container = document.querySelector('.custom-class');
    expect(container).toBeInTheDocument();
  });

  test('applies correct position classes', () => {
    const { rerender } = render(<ScrollProgress position="left" />);
    expect(document.querySelector('.left-4')).toBeInTheDocument();

    rerender(<ScrollProgress position="right" />);
    expect(document.querySelector('.right-4')).toBeInTheDocument();

    rerender(<ScrollProgress position="center" />);
    expect(document.querySelector('.left-1\\/2')).toBeInTheDocument();
  });

  test('defaults to right position', () => {
    render(<ScrollProgress />);
    expect(document.querySelector('.right-4')).toBeInTheDocument();
  });

  test('handles invalid position gracefully', () => {
    render(<ScrollProgress position="invalid" />);
    // Should fallback to right position
    expect(document.querySelector('.right-4')).toBeInTheDocument();
  });

  test('shows labels by default', () => {
    const sections = [{ id: 'section1', label: 'Home' }];
    render(<ScrollProgress sections={sections} />);

    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  test('hides labels when showLabels is false', () => {
    const sections = [{ id: 'section1', label: 'Home' }];
    render(<ScrollProgress sections={sections} showLabels={false} />);

    expect(screen.queryByText('Home')).not.toBeInTheDocument();
  });

  test('adds scroll event listener on mount', () => {
    render(<ScrollProgress />);

    expect(window.addEventListener).toHaveBeenCalledWith(
      'scroll',
      expect.any(Function),
      { passive: true }
    );
  });

  test('removes scroll event listener on unmount', () => {
    const { unmount } = render(<ScrollProgress />);

    unmount();

    expect(window.removeEventListener).toHaveBeenCalledWith(
      'scroll',
      expect.any(Function)
    );
  });

  test('displays progress percentage', () => {
    render(<ScrollProgress />);

    // Should show 0% initially
    expect(screen.getByText('0%')).toBeInTheDocument();
  });

  test('handles sections without labels', () => {
    const sections = [
      { id: 'section1' },
      { id: 'section2', label: 'About' }
    ];

    render(<ScrollProgress sections={sections} />);

    // Should not crash and should show the section with label
    expect(screen.getByText('About')).toBeInTheDocument();
  });

  test('handles sections without ids', () => {
    const sections = [
      { label: 'Home' },
      { label: 'About' }
    ];

    render(<ScrollProgress sections={sections} />);

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
  });

  test('handles click on section dot with id', () => {
    // Mock getElementById and scrollIntoView
    const mockElement = {
      scrollIntoView: jest.fn()
    };
    document.getElementById = jest.fn().mockReturnValue(mockElement);

    const sections = [{ id: 'section1', label: 'Home' }];
    render(<ScrollProgress sections={sections} />);

    const sectionDot = document.querySelector('.w-3.h-3');
    fireEvent.click(sectionDot);

    expect(document.getElementById).toHaveBeenCalledWith('section1');
    expect(mockElement.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
  });

  test('handles click on section dot without id', () => {
    const sections = [{ label: 'Home' }];
    render(<ScrollProgress sections={sections} />);

    const sectionDot = document.querySelector('.w-3.h-3');

    // Should not throw error when clicking
    expect(() => fireEvent.click(sectionDot)).not.toThrow();
  });

  test('handles click when element is not found', () => {
    document.getElementById = jest.fn().mockReturnValue(null);

    const sections = [{ id: 'section1', label: 'Home' }];
    render(<ScrollProgress sections={sections} />);

    const sectionDot = document.querySelector('.w-3.h-3');

    // Should not throw error when element is not found
    expect(() => fireEvent.click(sectionDot)).not.toThrow();
  });

  test('passes through additional props', () => {
    render(<ScrollProgress data-testid="scroll-progress" aria-label="Progress" />);

    const container = screen.getByTestId('scroll-progress');
    expect(container).toHaveAttribute('aria-label', 'Progress');
  });

  test('renders with empty sections array', () => {
    render(<ScrollProgress sections={[]} />);

    // Should render without crashing
    const container = document.querySelector('.fixed');
    expect(container).toBeInTheDocument();
  });

  test('applies correct styling classes', () => {
    render(<ScrollProgress />);

    const container = document.querySelector('.fixed');
    expect(container).toHaveClass(
      'fixed',
      'top-1/2',
      'transform',
      '-translate-y-1/2',
      'z-40'
    );
  });

  test('renders progress bar with correct structure', () => {
    render(<ScrollProgress />);

    // Check for background track
    const track = document.querySelector('.w-1.h-64.bg-gray-800');
    expect(track).toBeInTheDocument();

    // Check for progress fill
    const fill = document.querySelector('.bg-gradient-to-t.from-cyan-400.to-purple-400');
    expect(fill).toBeInTheDocument();
  });
});
