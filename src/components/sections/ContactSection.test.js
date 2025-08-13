import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ContactSection from './ContactSection';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    section: ({ children, ...props }) => (
      <section {...props}>{children}</section>
    ),
    a: ({ children, href, ...props }) => (
      <a href={href} {...props}>
        {children}
      </a>
    ),
    span: ({ children, ...props }) => <span {...props}>{children}</span>,
  },
  useInView: () => true,
}));

// Mock the UI components
jest.mock('../ui', () => ({
  GlitchText: ({ children, className }) => (
    <div className={className}>{children}</div>
  ),
  NeonButton: ({ children, onClick, type, variant, className, disabled }) => (
    <button
      onClick={onClick}
      type={type}
      className={`${variant} ${className}`}
      disabled={disabled}
      data-testid="neon-button"
    >
      {children}
    </button>
  ),
}));

// Mock the layout components
jest.mock('../layout', () => ({
  TerminalWindow: ({ children, title, className }) => (
    <div className={className} data-testid="terminal-window" data-title={title}>
      {children}
    </div>
  ),
}));

describe('ContactSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test('renders contact section with correct title', () => {
    render(<ContactSection />);

    expect(screen.getByText('ESTABLISH CONNECTION')).toBeInTheDocument();
    expect(
      screen.getByText(
        "Ready to team up? Send a message and let's start the conversation!"
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Response time: Usually within 24 hours • All inquiries welcome'
      )
    ).toBeInTheDocument();
  });

  test('displays contact form section', () => {
    render(<ContactSection />);

    expect(screen.getByText('Send Message')).toBeInTheDocument();
  });

  test('displays contact form with all fields', () => {
    render(<ContactSection />);

    expect(screen.getByLabelText('Sender ID *')).toBeInTheDocument();
    expect(
      screen.getByLabelText('Communication Channel *')
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Transmission Subject *')).toBeInTheDocument();
    expect(screen.getByLabelText('Message Payload *')).toBeInTheDocument();
    expect(screen.getByText('Mission Type')).toBeInTheDocument();
  });

  test('displays alternative communication channels', () => {
    render(<ContactSection />);

    expect(screen.getByText('Connect With Me')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('LinkedIn')).toBeInTheDocument();
    expect(screen.getByText('GitHub')).toBeInTheDocument();
    expect(screen.getByText('Twitter')).toBeInTheDocument();
    expect(screen.getByText('Discord')).toBeInTheDocument();
  });

  test('displays mission type selection', () => {
    render(<ContactSection />);

    expect(screen.getByText('Mission Type')).toBeInTheDocument();
    expect(screen.getByText('General Inquiry')).toBeInTheDocument();
    expect(screen.getByText('Collaboration')).toBeInTheDocument();
    expect(screen.getByText('Job Opportunity')).toBeInTheDocument();
    expect(screen.getByText('Gaming Partnership')).toBeInTheDocument();
  });

  test('handles form input changes', () => {
    render(<ContactSection />);

    const nameInput = screen.getByLabelText('Sender ID *');
    const emailInput = screen.getByLabelText('Communication Channel *');
    const subjectInput = screen.getByLabelText('Transmission Subject *');
    const messageInput = screen.getByLabelText('Message Payload *');

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(subjectInput, { target: { value: 'Test Subject' } });
    fireEvent.change(messageInput, {
      target: { value: 'Test message content' },
    });

    expect(nameInput.value).toBe('John Doe');
    expect(emailInput.value).toBe('john@example.com');
    expect(subjectInput.value).toBe('Test Subject');
    expect(messageInput.value).toBe('Test message content');
  });

  test('validates form and shows errors for empty fields', async () => {
    render(<ContactSection />);

    const submitButton = screen.getByTestId('neon-button');
    fireEvent.click(submitButton);

    // Fast-forward through validation messages
    jest.advanceTimersByTime(3000);

    await waitFor(() => {
      expect(screen.getByText('Player name is required')).toBeInTheDocument();
      expect(screen.getByText('Email address is required')).toBeInTheDocument();
      expect(screen.getByText('Subject is required')).toBeInTheDocument();
      expect(screen.getByText('Message is required')).toBeInTheDocument();
    });
  });

  test('validates email format', async () => {
    render(<ContactSection />);

    const nameInput = screen.getByLabelText('Sender ID *');
    const emailInput = screen.getByLabelText('Communication Channel *');
    const subjectInput = screen.getByLabelText('Transmission Subject *');
    const messageInput = screen.getByLabelText('Message Payload *');

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.change(subjectInput, { target: { value: 'Test Subject' } });
    fireEvent.change(messageInput, {
      target: { value: 'Test message content' },
    });

    const submitButton = screen.getByTestId('neon-button');
    fireEvent.click(submitButton);

    // Fast-forward through validation messages
    jest.advanceTimersByTime(2000);

    await waitFor(() => {
      expect(
        screen.getByText(/ERROR: Invalid email format detected/)
      ).toBeInTheDocument();
    });
  });

  test('validates minimum message length', async () => {
    render(<ContactSection />);

    const nameInput = screen.getByLabelText('Sender ID *');
    const emailInput = screen.getByLabelText('Communication Channel *');
    const subjectInput = screen.getByLabelText('Transmission Subject *');
    const messageInput = screen.getByLabelText('Message Payload *');

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(subjectInput, { target: { value: 'Test Subject' } });
    fireEvent.change(messageInput, { target: { value: 'Short' } });

    const submitButton = screen.getByTestId('neon-button');
    fireEvent.click(submitButton);

    // Fast-forward through validation messages
    jest.advanceTimersByTime(2000);

    await waitFor(() => {
      expect(screen.getByText(/ERROR: Message too short/)).toBeInTheDocument();
    });
  });

  test('submits form successfully with valid data', async () => {
    render(<ContactSection />);

    const nameInput = screen.getByLabelText('Sender ID *');
    const emailInput = screen.getByLabelText('Communication Channel *');
    const subjectInput = screen.getByLabelText('Transmission Subject *');
    const messageInput = screen.getByLabelText('Message Payload *');

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(subjectInput, { target: { value: 'Test Subject' } });
    fireEvent.change(messageInput, {
      target: { value: 'This is a valid test message with enough characters' },
    });

    const submitButton = screen.getByTestId('neon-button');
    fireEvent.click(submitButton);

    // Fast-forward through the submission process
    jest.advanceTimersByTime(6000);

    await waitFor(() => {
      expect(screen.getByText(/Transmission successful!/)).toBeInTheDocument();
      expect(
        screen.getByText(/Message delivered to target recipient/)
      ).toBeInTheDocument();
    });
  });

  test('displays status indicators', () => {
    render(<ContactSection />);

    expect(screen.getByText('Ready')).toBeInTheDocument();
    expect(screen.getByText('Secure Channel Active')).toBeInTheDocument();
  });

  test('disables form fields during submission', async () => {
    render(<ContactSection />);

    const nameInput = screen.getByLabelText('Sender ID *');
    const emailInput = screen.getByLabelText('Communication Channel *');
    const subjectInput = screen.getByLabelText('Transmission Subject *');
    const messageInput = screen.getByLabelText('Message Payload *');

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(subjectInput, { target: { value: 'Test Subject' } });
    fireEvent.change(messageInput, {
      target: { value: 'This is a valid test message' },
    });

    const submitButton = screen.getByTestId('neon-button');
    fireEvent.click(submitButton);

    // Check that fields are disabled during submission
    expect(nameInput).toBeDisabled();
    expect(emailInput).toBeDisabled();
    expect(subjectInput).toBeDisabled();
    expect(messageInput).toBeDisabled();
    expect(submitButton).toBeDisabled();
  });

  test('resets form after successful submission', async () => {
    render(<ContactSection />);

    const nameInput = screen.getByLabelText('Sender ID *');
    const emailInput = screen.getByLabelText('Communication Channel *');
    const subjectInput = screen.getByLabelText('Transmission Subject *');
    const messageInput = screen.getByLabelText('Message Payload *');

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(subjectInput, { target: { value: 'Test Subject' } });
    fireEvent.change(messageInput, {
      target: { value: 'This is a valid test message' },
    });

    const submitButton = screen.getByTestId('neon-button');
    fireEvent.click(submitButton);

    // Fast-forward through the entire submission and reset process
    jest.advanceTimersByTime(10000);

    await waitFor(() => {
      expect(nameInput.value).toBe('');
      expect(emailInput.value).toBe('');
      expect(subjectInput.value).toBe('');
      expect(messageInput.value).toBe('');
    });
  });

  test('applies correct CSS classes', () => {
    render(<ContactSection className="test-class" />);

    const section = document.querySelector('section');
    expect(section).toHaveClass('test-class');
  });

  test('renders with TerminalWindow component', () => {
    render(<ContactSection />);

    const terminalWindow = screen.getByTestId('terminal-window');
    expect(terminalWindow).toBeInTheDocument();
    expect(terminalWindow).toHaveAttribute(
      'data-title',
      'communication_terminal.exe'
    );
  });

  test('displays contact method links with correct attributes', () => {
    render(<ContactSection />);

    const emailLink = screen.getByText('Email').closest('a');
    const linkedinLink = screen.getByText('LinkedIn').closest('a');
    const githubLink = screen.getByText('GitHub').closest('a');
    const twitterLink = screen.getByText('Twitter').closest('a');

    expect(emailLink).toHaveAttribute('href', 'mailto:developer@example.com');
    expect(linkedinLink).toHaveAttribute(
      'href',
      'https://linkedin.com/in/developer'
    );
    expect(githubLink).toHaveAttribute('href', 'https://github.com/developer');
    expect(twitterLink).toHaveAttribute(
      'href',
      'https://twitter.com/developer'
    );

    // Check that external links have proper attributes
    expect(linkedinLink).toHaveAttribute('target', '_blank');
    expect(linkedinLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  test('shows processing indicator during form submission', async () => {
    render(<ContactSection />);

    const nameInput = screen.getByLabelText('Sender ID *');
    const emailInput = screen.getByLabelText('Communication Channel *');
    const subjectInput = screen.getByLabelText('Transmission Subject *');
    const messageInput = screen.getByLabelText('Message Payload *');

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(subjectInput, { target: { value: 'Test Subject' } });
    fireEvent.change(messageInput, {
      target: { value: 'This is a valid test message' },
    });

    const submitButton = screen.getByTestId('neon-button');
    fireEvent.click(submitButton);

    // Fast-forward to show processing messages
    jest.advanceTimersByTime(4000);

    await waitFor(() => {
      expect(screen.getAllByText(/Encrypting message/).length).toBeGreaterThan(
        0
      );
      expect(
        screen.getByText(/Establishing secure connection/)
      ).toBeInTheDocument();
      expect(screen.getByText(/Transmitting data/)).toBeInTheDocument();
    });
  });
});
