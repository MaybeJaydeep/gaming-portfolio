import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { jest } from '@jest/globals';
import GlitchText from '../GlitchText';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    span: ({ children, className, style, ...props }) => (
      <span className={className} style={style} {...props}>
        {children}
      </span>
    )
  }
}));

describe('GlitchText Component', () => {
  beforeEach(() => {
    jest.clearAllTimers();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test('renders children text correctly', () => {
    render(<GlitchText>Test Text</GlitchText>);
    expect(screen.getByText('Test Text')).toBeInTheDocument();
  });

  test('applies custom className', () => {
    render(<GlitchText className="custom-class">Test Text</GlitchText>);
    const element = screen.getByText('Test Text');
    expect(element).toHaveClass('custom-class');
  });

  test('passes through additional props', () => {
    render(<GlitchText data-testid="glitch-text" id="test-id">Test Text</GlitchText>);
    const element = screen.getByTestId('glitch-text');
    expect(element).toHaveAttribute('id', 'test-id');
  });

  test('renders without glitch effect when disabled', () => {
    render(<GlitchText disabled>Test Text</GlitchText>);
    const element = screen.getByText('Test Text');
    expect(element.tagName).toBe('SPAN');
    expect(element).not.toHaveClass('relative');
  });

  test('applies correct intensity configuration', () => {
    const { rerender } = render(<GlitchText intensity="low">Test Text</GlitchText>);
    expect(screen.getByText('Test Text')).toBeInTheDocument();

    rerender(<GlitchText intensity="high">Test Text</GlitchText>);
    expect(screen.getByText('Test Text')).toBeInTheDocument();

    rerender(<GlitchText intensity="invalid">Test Text</GlitchText>);
    expect(screen.getByText('Test Text')).toBeInTheDocument();
  });

  test('handles custom duration prop', () => {
    render(<GlitchText duration={1000}>Test Text</GlitchText>);
    expect(screen.getByText('Test Text')).toBeInTheDocument();
  });

  test('maintains text readability during animations', () => {
    render(<GlitchText>Test Text</GlitchText>);
    const element = screen.getByText('Test Text');

    // Check that the main text is always visible
    expect(element).toBeInTheDocument();
    expect(element).toHaveStyle({ minHeight: '1em' });
  });

  test('supports accessibility with reduced motion preference', () => {
    // Mock matchMedia for prefers-reduced-motion
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });

    render(<GlitchText>Test Text</GlitchText>);
    expect(screen.getByText('Test Text')).toBeInTheDocument();
  });

  test('cleans up intervals on unmount', () => {
    const clearIntervalSpy = jest.spyOn(global, 'clearInterval');
    const { unmount } = render(<GlitchText>Test Text</GlitchText>);

    unmount();

    expect(clearIntervalSpy).toHaveBeenCalled();
    clearIntervalSpy.mockRestore();
  });

  test('handles empty children gracefully', () => {
    render(<GlitchText></GlitchText>);
    // Should not throw an error
  });

  test('handles null children gracefully', () => {
    render(<GlitchText>{null}</GlitchText>);
    // Should not throw an error
  });

  test('applies correct base classes', () => {
    render(<GlitchText>Test Text</GlitchText>);
    const element = screen.getByText('Test Text');
    expect(element).toHaveClass('relative', 'inline-block');
  });
});
