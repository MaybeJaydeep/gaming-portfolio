import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import GameHUD from './GameHUD';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    nav: ({ children, initial, animate, transition, ...props }) => <nav {...props}>{children}</nav>,
    div: ({ children, initial, animate, transition, whileHover, layoutId, ...props }) => <div {...props}>{children}</div>,
    button: ({ children, whileHover, whileTap, ...props }) => <button {...props}>{children}</button>,
    span: ({ children, animate, ...props }) => <span {...props}>{children}</span>,
  },
}));

describe('GameHUD Component', () => {
  const mockOnSectionChange = jest.fn();
  const defaultProps = {
    currentSection: 'hero',
    onSectionChange: mockOnSectionChange,
  };

  beforeEach(() => {
    mockOnSectionChange.mockClear();
  });

  test('renders GameHUD with brand logo and title', () => {
    render(<GameHUD {...defaultProps} />);

    expect(screen.getByText('GP')).toBeInTheDocument();
    expect(screen.getByText('GAMING PORTFOLIO')).toBeInTheDocument();
  });

  test('renders all navigation items', () => {
    render(<GameHUD {...defaultProps} />);

    const expectedItems = ['HOME', 'STATS', 'SKILLS', 'GAMING', 'MISSIONS', 'CONTACT'];
    expectedItems.forEach(item => {
      expect(screen.getAllByText(item)).toHaveLength(2); // Desktop and mobile versions
    });
  });

  test('highlights current section', () => {
    render(<GameHUD {...defaultProps} currentSection="about" />);

    const statsButtons = screen.getAllByText('STATS');
    // Check that at least one STATS button has the active styling
    const activeButton = statsButtons.find(button =>
      button.closest('button')?.className.includes('bg-cyan-400')
    );
    expect(activeButton).toBeTruthy();
  });

  test('calls onSectionChange when navigation item is clicked', () => {
    render(<GameHUD {...defaultProps} />);

    const skillsButtons = screen.getAllByText('SKILLS');
    fireEvent.click(skillsButtons[0]); // Click desktop version

    expect(mockOnSectionChange).toHaveBeenCalledWith('skills');
  });

  test('toggles mobile menu when hamburger button is clicked', async () => {
    render(<GameHUD {...defaultProps} />);

    // Find the mobile menu button by its aria-label
    const mobileMenuButton = screen.getByLabelText('Toggle mobile menu');

    expect(mobileMenuButton).toBeInTheDocument();
    fireEvent.click(mobileMenuButton);

    // The mobile menu should be visible after clicking
    await waitFor(() => {
      const mobileMenu = document.querySelector('.md\\:hidden .py-4');
      expect(mobileMenu).toBeInTheDocument();
    });
  });

  test('closes mobile menu when navigation item is clicked', async () => {
    render(<GameHUD {...defaultProps} />);

    // Open mobile menu first
    const mobileMenuButton = document.querySelector('.md\\:hidden button');
    fireEvent.click(mobileMenuButton);

    // Click on a mobile navigation item
    await waitFor(() => {
      const mobileNavItems = screen.getAllByText('GAMING');
      const mobileGamingButton = mobileNavItems.find(item =>
        item.closest('button')?.className.includes('w-full')
      );
      if (mobileGamingButton) {
        fireEvent.click(mobileGamingButton);
      }
    });

    expect(mockOnSectionChange).toHaveBeenCalledWith('gaming');
  });

  test('renders with correct accessibility attributes', () => {
    render(<GameHUD {...defaultProps} />);

    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();

    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  test('applies correct styling classes', () => {
    render(<GameHUD {...defaultProps} />);

    const nav = screen.getByRole('navigation');
    expect(nav).toHaveClass('fixed', 'top-0', 'left-0', 'right-0', 'z-50');
  });

  test('handles navigation with different currentSection props', () => {
    const { rerender } = render(<GameHUD {...defaultProps} currentSection="hero" />);

    let homeButtons = screen.getAllByText('HOME');
    let activeHomeButton = homeButtons.find(button =>
      button.closest('button')?.className.includes('bg-cyan-400')
    );
    expect(activeHomeButton).toBeTruthy();

    // Change current section
    rerender(<GameHUD {...defaultProps} currentSection="projects" />);

    let missionButtons = screen.getAllByText('MISSIONS');
    let activeMissionButton = missionButtons.find(button =>
      button.closest('button')?.className.includes('bg-cyan-400')
    );
    expect(activeMissionButton).toBeTruthy();
  });
});
