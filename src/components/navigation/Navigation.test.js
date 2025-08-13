import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { HashRouter } from 'react-router-dom';
import { NavigationProvider } from '../../contexts/NavigationContext';
import { ThemeProvider } from '../../contexts/ThemeContext';
import Navigation from './Navigation';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    nav: ({ children, ...props }) => <nav {...props}>{children}</nav>,
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
    span: ({ children, ...props }) => <span {...props}>{children}</span>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

// Test wrapper component
const TestWrapper = ({ children }) => (
  <ThemeProvider>
    <HashRouter>
      <NavigationProvider>{children}</NavigationProvider>
    </HashRouter>
  </ThemeProvider>
);

// Mock sections ftesting
const mockSections = [
  'hero',
  'about',
  'skills',
  'projects',
  'gaming',
  'contact',
];

beforeEach(() => {
  // Mock DOM elements for sections
  mockSections.forEach(sectionId => {
    const mockElement = document.createElement('div');
    mockElement.id = sectionId;
    mockElement.getBoundingClientRect = jest.fn(() => ({
      top: 0,
      bottom: 1000,
      left: 0,
      right: 1000,
      width: 1000,
      height: 1000,
    }));
    document.body.appendChild(mockElement);
  });

  // Mock window.scrollTo
  window.scrollTo = jest.fn();

  // Mock Element.scrollIntoView
  Element.prototype.scrollIntoView = jest.fn();
});

afterEach(() => {
  // Clean up mock elements
  mockSections.forEach(sectionId => {
    const element = document.getElementById(sectionId);
    if (element) {
      document.body.removeChild(element);
    }
  });

  jest.clearAllMocks();
});

describe('Navigation Component', () => {
  test('renders navigation with all menu items', () => {
    render(
      <TestWrapper>
        <Navigation />
      </TestWrapper>
    );

    // Check if all navigation items are present
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Skills')).toBeInTheDocument();
    expect(screen.getByText('Projects')).toBeInTheDocument();
    expect(screen.getByText('Gaming')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  test('renders brand logo and title', () => {
    render(
      <TestWrapper>
        <Navigation />
      </TestWrapper>
    );

    expect(screen.getByText('GP')).toBeInTheDocument();
    expect(screen.getByText('GamingPortfolio')).toBeInTheDocument();
    expect(screen.getByText('Level 99 Developer')).toBeInTheDocument();
  });

  test('shows keyboard shortcuts for navigation items', () => {
    render(
      <TestWrapper>
        <Navigation />
      </TestWrapper>
    );

    // Check if keyboard shortcuts are displayed
    expect(screen.getByText('H')).toBeInTheDocument(); // Home
    expect(screen.getByText('A')).toBeInTheDocument(); // About
    expect(screen.getByText('S')).toBeInTheDocument(); // Skills
    expect(screen.getByText('P')).toBeInTheDocument(); // Projects
    expect(screen.getByText('G')).toBeInTheDocument(); // Gaming
    expect(screen.getByText('C')).toBeInTheDocument(); // Contact
  });

  test('handles navigation item clicks', async () => {
    render(
      <TestWrapper>
        <Navigation />
      </TestWrapper>
    );

    const aboutButton = screen.getByText('About').closest('button');
    fireEvent.click(aboutButton);

    await waitFor(() => {
      expect(Element.prototype.scrollIntoView).toHaveBeenCalled();
    });
  });

  test('opens and closes mobile menu', () => {
    render(
      <TestWrapper>
        <Navigation />
      </TestWrapper>
    );

    const menuToggle = screen.getByLabelText('Toggle menu');

    // Open mobile menu
    fireEvent.click(menuToggle);

    expect(screen.getByText('Navigation Menu')).toBeInTheDocument();
    expect(screen.getByText('Choose your destination')).toBeInTheDocument();
  });

  test('handles keyboard navigation shortcuts', () => {
    render(
      <TestWrapper>
        <Navigation />
      </TestWrapper>
    );

    // Simulate Alt+A keypress for About section
    fireEvent.keyDown(window, {
      key: 'a',
      altKey: true,
    });

    expect(Element.prototype.scrollIntoView).toHaveBeenCalled();
  });

  test('brand logo navigates to hero section', async () => {
    render(
      <TestWrapper>
        <Navigation />
      </TestWrapper>
    );

    const brandLogo = screen.getByText('GP').closest('div');
    fireEvent.click(brandLogo);

    await waitFor(() => {
      expect(Element.prototype.scrollIntoView).toHaveBeenCalled();
    });
  });

  test('mobile menu closes when navigation item is clicked', async () => {
    render(
      <TestWrapper>
        <Navigation />
      </TestWrapper>
    );

    const menuToggle = screen.getByLabelText('Toggle menu');

    // Open mobile menu
    fireEvent.click(menuToggle);
    expect(screen.getByText('Navigation Menu')).toBeInTheDocument();

    // Click on a navigation item in mobile menu
    const mobileAboutButton = screen.getAllByText('About')[1]; // Second instance is in mobile menu
    fireEvent.click(mobileAboutButton.closest('button'));

    await waitFor(() => {
      expect(screen.queryByText('Navigation Menu')).not.toBeInTheDocument();
    });
  });

  test('applies correct styling when scrolled', () => {
    render(
      <TestWrapper>
        <Navigation />
      </TestWrapper>
    );

    // Simulate scroll event
    Object.defineProperty(window, 'scrollY', { value: 100, writable: true });
    fireEvent.scroll(window);

    // The navigation should have scrolled styling applied
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveClass('bg-gray-900/95');
  });

  test('displays accessibility features', () => {
    render(
      <TestWrapper>
        <Navigation />
      </TestWrapper>
    );

    // Check for keyboard shortcut hints in mobile menu
    const menuToggle = screen.getByLabelText('Toggle menu');
    fireEvent.click(menuToggle);

    expect(
      screen.getByText(/💡 Tip: Use Alt \+ H for quick navigation/)
    ).toBeInTheDocument();
  });

  test('handles invalid keyboard shortcuts gracefully', () => {
    render(
      <TestWrapper>
        <Navigation />
      </TestWrapper>
    );

    // Simulate invalid keyboard shortcut
    fireEvent.keyDown(window, {
      key: 'z',
      altKey: true,
    });

    // Should not cause any errors or navigation
    expect(Element.prototype.scrollIntoView).not.toHaveBeenCalled();
  });
});

describe('Navigation Context Integration', () => {
  test('navigation state updates correctly', async () => {
    render(
      <TestWrapper>
        <Navigation />
      </TestWrapper>
    );

    const skillsButton = screen.getByText('Skills').closest('button');
    fireEvent.click(skillsButton);

    await waitFor(() => {
      expect(Element.prototype.scrollIntoView).toHaveBeenCalled();
    });
  });

  test('handles hash-based navigation', () => {
    // Mock location hash
    delete window.location;
    window.location = { hash: '#about' };

    render(
      <TestWrapper>
        <Navigation />
      </TestWrapper>
    );

    // The about section should be marked as active
    const aboutButton = screen.getByText('About').closest('button');
    expect(aboutButton).toHaveClass('text-cyan-400');
  });
});
