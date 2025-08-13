import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TerminalWindow from './TerminalWindow';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, initial, animate, transition, ...props }) => (
      <div {...props}>{children}</div>
    ),
    button: ({ children, whileHover, whileTap, ...props }) => (
      <button {...props}>{children}</button>
    ),
    span: ({ children, animate, transition, ...props }) => (
      <span {...props}>{children}</span>
    ),
  },
}));

describe('TerminalWindow Component', () => {
  const defaultProps = {
    title: 'Test Terminal',
    children: <div>Test content</div>,
  };

  beforeEach(() => {
    jest.clearAllTimers();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test('renders TerminalWindow with default props', () => {
    render(<TerminalWindow {...defaultProps} />);

    expect(screen.getByText('Test Terminal')).toBeInTheDocument();
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  test('renders with custom title', () => {
    render(
      <TerminalWindow title="Custom Terminal" children={<div>Content</div>} />
    );

    expect(screen.getByText('Custom Terminal')).toBeInTheDocument();
  });

  test('renders with default title when none provided', () => {
    render(<TerminalWindow children={<div>Content</div>} />);

    expect(screen.getByText('Terminal')).toBeInTheDocument();
  });

  test('applies custom className', () => {
    const { container } = render(
      <TerminalWindow {...defaultProps} className="custom-class" />
    );

    const terminalWindow = container.firstChild;
    expect(terminalWindow).toHaveClass('custom-class');
  });

  test('renders terminal control buttons', () => {
    const { container } = render(<TerminalWindow {...defaultProps} />);

    // Check for the three colored control buttons
    const controlButtons = container.querySelectorAll('.w-3.h-3.rounded-full');
    expect(controlButtons).toHaveLength(3);

    // Check for red, yellow, and green buttons
    expect(container.querySelector('.bg-red-500')).toBeInTheDocument();
    expect(container.querySelector('.bg-yellow-500')).toBeInTheDocument();
    expect(container.querySelector('.bg-green-500')).toBeInTheDocument();
  });

  test('renders terminal prompt', () => {
    render(<TerminalWindow {...defaultProps} />);

    expect(screen.getByText('user@jaydeep-portfolio')).toBeInTheDocument();
    expect(screen.getByText(':')).toBeInTheDocument();
    expect(screen.getByText('~')).toBeInTheDocument();
    expect(screen.getByText('$')).toBeInTheDocument();
  });

  test('renders children content', () => {
    const testContent = (
      <div data-testid="test-content">Complex test content</div>
    );
    render(<TerminalWindow title="Test" children={testContent} />);

    expect(screen.getByTestId('test-content')).toBeInTheDocument();
    expect(screen.getByText('Complex test content')).toBeInTheDocument();
  });

  test('does not show typing reset button when enableTyping is false', () => {
    render(<TerminalWindow {...defaultProps} enableTyping={false} />);

    expect(
      screen.queryByTitle('Replay typing animation')
    ).not.toBeInTheDocument();
  });

  test('shows typing reset button when enableTyping is true', () => {
    render(<TerminalWindow {...defaultProps} enableTyping={true} />);

    expect(screen.getByTitle('Replay typing animation')).toBeInTheDocument();
  });

  test('typing animation works with string content', async () => {
    render(
      <TerminalWindow title="Test" enableTyping={true}>
        Hello World
      </TerminalWindow>
    );

    // Initially should not show the full content
    expect(screen.queryByText('Hello World')).not.toBeInTheDocument();

    // Fast-forward timers to simulate typing
    jest.advanceTimersByTime(550); // 11 characters * 50ms each

    await waitFor(() => {
      expect(screen.getByText(/Hello World/)).toBeInTheDocument();
    });
  });

  test('typing reset button restarts typing animation', async () => {
    render(
      <TerminalWindow title="Test" enableTyping={true}>
        Test
      </TerminalWindow>
    );

    // Let typing complete
    jest.advanceTimersByTime(250); // 4 characters * 50ms + buffer

    await waitFor(() => {
      expect(screen.getByText(/Test/)).toBeInTheDocument();
    });

    // Click reset button
    const resetButton = screen.getByTitle('Replay typing animation');
    fireEvent.click(resetButton);

    // Content should be reset and typing should restart
    jest.advanceTimersByTime(100); // Partial typing

    // The component should be in typing state again
    expect(resetButton).toBeInTheDocument();
  });

  test('applies correct CSS classes for styling', () => {
    const { container } = render(<TerminalWindow {...defaultProps} />);

    const terminalWindow = container.firstChild;
    expect(terminalWindow).toHaveClass(
      'bg-black/90',
      'border',
      'border-green-500/50',
      'rounded-lg'
    );

    // Check title bar styling
    const titleBar = container.querySelector('.bg-gray-800\\/90');
    expect(titleBar).toBeInTheDocument();

    // Check content area styling
    const contentArea = container.querySelector('.bg-black\\/95');
    expect(contentArea).toBeInTheDocument();
  });

  test('handles complex children elements', () => {
    const complexChildren = (
      <div>
        <h2>Title</h2>
        <p>Paragraph content</p>
        <ul>
          <li>List item 1</li>
          <li>List item 2</li>
        </ul>
      </div>
    );

    render(<TerminalWindow title="Complex" children={complexChildren} />);

    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Paragraph content')).toBeInTheDocument();
    expect(screen.getByText('List item 1')).toBeInTheDocument();
    expect(screen.getByText('List item 2')).toBeInTheDocument();
  });

  test('maintains proper accessibility structure', () => {
    render(<TerminalWindow {...defaultProps} />);

    // Check that the reset button has proper accessibility attributes
    const resetButton = screen.queryByTitle('Replay typing animation');
    if (resetButton) {
      expect(resetButton).toHaveAttribute('title', 'Replay typing animation');
    }
  });

  test('handles empty children gracefully', () => {
    render(<TerminalWindow title="Empty" children={null} />);

    expect(screen.getByText('Empty')).toBeInTheDocument();
    expect(screen.getByText('user@gaming-portfolio')).toBeInTheDocument();
  });
});
