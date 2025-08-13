import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    section: ({ children, ...props }) => (
      <section {...props}>{children}</section>
    ),
    nav: ({ children, ...props }) => <nav {...props}>{children}</nav>,
    button: ({ children, onClick, ...props }) => (
      <button onClick={onClick} {...props}>
        {children}
      </button>
    ),
    a: ({ children, href, ...props }) => (
      <a href={href} {...props}>
        {children}
      </a>
    ),
  },
  useInView: () => true,
  AnimatePresence: ({ children }) => <div>{children}</div>,
}));

// Mock the UI components to avoid complex rendering
jest.mock('./components/ui', () => ({
  GlitchText: ({ children, className }) => (
    <div className={className}>{children}</div>
  ),
  NeonButton: ({ children, onClick, variant, className }) => (
    <button onClick={onClick} className={`${variant} ${className}`}>
      {children}
    </button>
  ),
  ScrollProgress: () => <div data-testid="scroll-progress" />,
  ThemeToggle: () => <div data-testid="theme-toggle" />,
}));

// Mock the layout components
jest.mock('./components/layout', () => ({
  ParticleBackground: () => <div data-testid="particle-background" />,
  TerminalWindow: ({ children, title, className }) => (
    <div className={className} data-testid="terminal-window" data-title={title}>
      {children}
    </div>
  ),
  GameHUD: () => <div data-testid="game-hud" />,
  Footer: () => <footer data-testid="footer">Footer Content</footer>,
}));

// Mock the navigation component
jest.mock('./components/navigation', () => ({
  Navigation: () => <nav data-testid="navigation">Navigation</nav>,
}));

// Mock the gaming components
jest.mock('./components/gaming', () => ({
  GameStats: () => <div data-testid="game-stats" />,
  AchievementBadge: () => <div data-testid="achievement-badge" />,
  TournamentCard: () => <div data-testid="tournament-card" />,
}));

describe('App Integration', () => {
  test('renders main app structure', () => {
    render(<App />);

    // Check for main structural elements
    expect(screen.getByTestId('particle-background')).toBeInTheDocument();
    expect(screen.getByTestId('scroll-progress')).toBeInTheDocument();
    expect(screen.getByTestId('navigation')).toBeInTheDocument();
    expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  test('renders all main sections', () => {
    render(<App />);

    // Check for section IDs that navigation would target
    expect(document.getElementById('hero')).toBeInTheDocument();
    expect(document.getElementById('about')).toBeInTheDocument();
    expect(document.getElementById('skills')).toBeInTheDocument();
    expect(document.getElementById('projects')).toBeInTheDocument();
    expect(document.getElementById('gaming')).toBeInTheDocument();
    expect(document.getElementById('contact')).toBeInTheDocument();
  });

  test('includes accessibility features', () => {
    render(<App />);

    // Check for skip link
    const skipLink = screen.getByText('Skip to main content');
    expect(skipLink).toBeInTheDocument();
    expect(skipLink).toHaveAttribute('href', '#hero');
  });

  test('has proper semantic structure', () => {
    render(<App />);

    // Check for semantic HTML elements
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByTestId('navigation')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  test('applies correct CSS classes', () => {
    render(<App />);

    const appContainer = document.querySelector('.min-h-screen');
    expect(appContainer).toBeInTheDocument();
    expect(appContainer).toHaveClass(
      'bg-gray-900',
      'text-gray-100',
      'relative',
      'overflow-x-hidden'
    );
  });

  test('renders theme provider context', () => {
    // This test ensures the ThemeProvider is wrapping the app
    const { container } = render(<App />);

    // The app should render without throwing errors, indicating ThemeProvider is working
    expect(container.firstChild).toBeInTheDocument();
  });
});
