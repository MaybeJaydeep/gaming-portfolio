import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { jest } from '@jest/globals';
import NeonButton from '../NeonButton';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    button: ({ children, className, onClick, disabled, type, whileHover, whileTap, initial, animate, transition, ...props }) => (
      <button
        className={className}
        onClick={onClick}
        disabled={disabled}
        type={type}
        {...props}
      >
        {children}
      </button>
    ),
    div: ({ children, className, whileHover, whileTap, initial, animate, transition, ...props }) => (
      <div className={className} {...props}>
        {children}
      </div>
    )
  }
}));

describe('NeonButton Component', () => {
  test('renders children correctly', () => {
    render(<NeonButton>Click Me</NeonButton>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  test('applies default variant (primary) styling', () => {
    render(<NeonButton>Primary Button</NeonButton>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('border-cyan-400', 'text-cyan-400');
  });

  test('applies secondary variant styling', () => {
    render(<NeonButton variant="secondary">Secondary Button</NeonButton>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('border-purple-400', 'text-purple-400');
  });

  test('applies danger variant styling', () => {
    render(<NeonButton variant="danger">Danger Button</NeonButton>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('border-red-400', 'text-red-400');
  });

  test('applies default size (medium) styling', () => {
    render(<NeonButton>Medium Button</NeonButton>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('px-6', 'py-2.5', 'text-base');
  });

  test('applies small size styling', () => {
    render(<NeonButton size="small">Small Button</NeonButton>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('px-3', 'py-1.5', 'text-sm');
  });

  test('applies large size styling', () => {
    render(<NeonButton size="large">Large Button</NeonButton>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('px-8', 'py-3.5', 'text-lg');
  });

  test('handles click events', () => {
    const handleClick = jest.fn();
    render(<NeonButton onClick={handleClick}>Clickable Button</NeonButton>);

    const button = screen.getByText('Clickable Button');
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('does not trigger click when disabled', () => {
    const handleClick = jest.fn();
    render(
      <NeonButton onClick={handleClick} disabled>
        Disabled Button
      </NeonButton>
    );

    const button = screen.getByText('Disabled Button');
    fireEvent.click(button);

    expect(handleClick).not.toHaveBeenCalled();
  });

  test('applies disabled styling', () => {
    render(<NeonButton disabled>Disabled Button</NeonButton>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('opacity-50', 'cursor-not-allowed');
    expect(button).toBeDisabled();
  });

  test('applies custom className', () => {
    render(<NeonButton className="custom-class">Custom Button</NeonButton>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });

  test('sets correct button type', () => {
    render(<NeonButton type="submit">Submit Button</NeonButton>);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'submit');
  });

  test('defaults to button type', () => {
    render(<NeonButton>Default Type</NeonButton>);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'button');
  });

  test('passes through additional props', () => {
    render(
      <NeonButton data-testid="neon-button" aria-label="Test Button">
        Props Button
      </NeonButton>
    );
    const button = screen.getByTestId('neon-button');
    expect(button).toHaveAttribute('aria-label', 'Test Button');
  });

  test('handles invalid variant gracefully', () => {
    render(<NeonButton variant="invalid">Invalid Variant</NeonButton>);
    const button = screen.getByRole('button');
    // Should fallback to primary variant
    expect(button).toHaveClass('border-cyan-400', 'text-cyan-400');
  });

  test('handles invalid size gracefully', () => {
    render(<NeonButton size="invalid">Invalid Size</NeonButton>);
    const button = screen.getByRole('button');
    // Should fallback to medium size
    expect(button).toHaveClass('px-6', 'py-2.5', 'text-base');
  });

  test('applies base styling classes', () => {
    render(<NeonButton>Base Styling</NeonButton>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass(
      'relative',
      'font-medium',
      'tracking-wider',
      'uppercase',
      'rounded-lg',
      'transition-all',
      'duration-300'
    );
  });

  test('includes focus styling for accessibility', () => {
    render(<NeonButton>Focus Test</NeonButton>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass(
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-offset-2',
      'focus:ring-offset-black'
    );
  });

  test('renders with complex children', () => {
    render(
      <NeonButton>
        <span>Icon</span>
        <span>Text</span>
      </NeonButton>
    );
    expect(screen.getByText('Icon')).toBeInTheDocument();
    expect(screen.getByText('Text')).toBeInTheDocument();
  });

  test('handles onClick with event parameter', () => {
    const handleClick = jest.fn();
    render(<NeonButton onClick={handleClick}>Event Test</NeonButton>);

    const button = screen.getByText('Event Test');
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledWith(expect.any(Object));
  });

  test('does not call onClick when onClick is not provided', () => {
    // Should not throw error
    render(<NeonButton>No Click Handler</NeonButton>);
    const button = screen.getByText('No Click Handler');
    fireEvent.click(button);
    // Test passes if no error is thrown
  });
});
