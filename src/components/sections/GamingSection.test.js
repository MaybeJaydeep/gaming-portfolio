import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import GamingSection from './GamingSection';
import { gamingData } from '../../data';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    section: ({ children, ...props }) => <section {...props}>{children}</section>,
  },
  useInView: () => true,
}));

// Mock the UI components
jest.mock('../ui', () => ({
  GlitchText: ({ children, className }) => <div className={className}>{children}</div>,
  NeonButton: ({ children, onClick, variant, className }) => (
    <button onClick={onClick} className={`${variant} ${className}`} data-testid={`neon-button-${children.toLowerCase().replace(/\s+/g, '-')}`}>
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

describe('GamingSection', () => {
  beforeEach(() => {
    // Reset any mocks before each test
    jest.clearAllMocks();
  });

  test('renders gaming section with correct title', () => {
    render(<GamingSection />);

    expect(screen.getByText('GAMING ACHIEVEMENTS')).toBeInTheDocument();
    expect(screen.getByText(`Gamertag: ${gamingData.gamingProfile.gamertag}`)).toBeInTheDocument();
  });

  test('displays gaming profile stats correctly', () => {
    render(<GamingSection />);

    // Check for stat values
    expect(screen.getByText(gamingData.tournaments.length.toString())).toBeInTheDocument();
    expect(screen.getByText(`${gamingData.gamingProfile.totalHours}+`)).toBeInTheDocument();
    expect(screen.getByText(gamingData.achievements.length.toString())).toBeInTheDocument();
  });

  test('renders tab navigation correctly', () => {
    render(<GamingSection />);

    // Check for tab buttons using test IDs
    expect(screen.getByTestId('neon-button-tournaments')).toBeInTheDocument();
    expect(screen.getByTestId('neon-button-achievements')).toBeInTheDocument();
    expect(screen.getByTestId('neon-button-gaming-interests')).toBeInTheDocument();
  });

  test('switches between tabs correctly', () => {
    render(<GamingSection />);

    // Initially should show tournaments
    expect(screen.getByText('🏆 COMPETITIVE TOURNAMENT HISTORY')).toBeInTheDocument();

    // Click on achievements tab
    const achievementsButton = screen.getByTestId('neon-button-achievements');
    fireEvent.click(achievementsButton);
    expect(screen.getByText('🏅 GAMING ACHIEVEMENTS UNLOCKED')).toBeInTheDocument();

    // Click on interests tab
    const interestsButton = screen.getByTestId('neon-button-gaming-interests');
    fireEvent.click(interestsButton);
    expect(screen.getByText('🎮 GAMING INTERESTS & SKILLS')).toBeInTheDocument();
  });

  test('displays tournament cards with correct information', () => {
    render(<GamingSection />);

    // Check for tournament information
    const firstTournament = gamingData.tournaments[0];
    expect(screen.getByText(firstTournament.name)).toBeInTheDocument();
    expect(screen.getByText(firstTournament.placement)).toBeInTheDocument();
    expect(screen.getByText(firstTournament.prize)).toBeInTheDocument();
    expect(screen.getByText(`Team: ${firstTournament.teamName}`)).toBeInTheDocument();
  });

  test('opens tournament modal when tournament card is clicked', async () => {
    render(<GamingSection />);

    const firstTournament = gamingData.tournaments[0];
    const tournamentCard = screen.getByText(firstTournament.name).closest('div');

    fireEvent.click(tournamentCard);

    await waitFor(() => {
      expect(screen.getByText('Description')).toBeInTheDocument();
      expect(screen.getByText('Skills Demonstrated')).toBeInTheDocument();
    });
  });

  test('closes tournament modal when close button is clicked', async () => {
    render(<GamingSection />);

    const firstTournament = gamingData.tournaments[0];
    const tournamentCard = screen.getByText(firstTournament.name).closest('div');

    fireEvent.click(tournamentCard);

    await waitFor(() => {
      const closeButton = screen.getByText('×');
      fireEvent.click(closeButton);
    });

    await waitFor(() => {
      expect(screen.queryByText('Description')).not.toBeInTheDocument();
    });
  });

  test('displays gaming achievements with correct information', () => {
    render(<GamingSection />);

    // Switch to achievements tab
    const achievementsButton = screen.getByTestId('neon-button-achievements');
    fireEvent.click(achievementsButton);

    // Check for achievement information
    const firstAchievement = gamingData.achievements[0];
    expect(screen.getByText(firstAchievement.name)).toBeInTheDocument();
    expect(screen.getByText(firstAchievement.description)).toBeInTheDocument();
    // Check for rarity using getAllByText since there might be multiple
    expect(screen.getAllByText(firstAchievement.rarity.toUpperCase()).length).toBeGreaterThan(0);
  });

  test('displays gaming interests and transferable skills', () => {
    render(<GamingSection />);

    // Switch to interests tab
    const interestsButton = screen.getByTestId('neon-button-gaming-interests');
    fireEvent.click(interestsButton);

    // Check for interests categories
    const firstCategory = gamingData.interests[0];
    expect(screen.getByText(firstCategory.category)).toBeInTheDocument();

    // Check for transferable skills section
    expect(screen.getByText('🧠 TRANSFERABLE SKILLS TO PROFESSIONAL WORK')).toBeInTheDocument();

    const firstSkill = gamingData.transferableSkills[0];
    expect(screen.getByText(firstSkill.skill)).toBeInTheDocument();
    expect(screen.getByText(firstSkill.description)).toBeInTheDocument();
  });

  test('displays game information correctly in interests section', () => {
    render(<GamingSection />);

    // Switch to interests tab
    const interestsButton = screen.getByTestId('neon-button-gaming-interests');
    fireEvent.click(interestsButton);

    // Check for game information
    const firstGame = gamingData.interests[0].games[0];
    expect(screen.getByText(firstGame.name)).toBeInTheDocument();
    expect(screen.getByText(firstGame.rank)).toBeInTheDocument();
    expect(screen.getByText(firstGame.role)).toBeInTheDocument();
  });

  test('applies correct CSS classes', () => {
    render(<GamingSection className="test-class" />);

    const section = document.querySelector('section');
    expect(section).toHaveClass('test-class');
  });

  test('renders with TerminalWindow component', () => {
    render(<GamingSection />);

    const terminalWindow = screen.getByTestId('terminal-window');
    expect(terminalWindow).toBeInTheDocument();
    expect(terminalWindow).toHaveAttribute('data-title', 'gaming_profile.exe');
  });

  test('calculates total prize money correctly', () => {
    render(<GamingSection />);

    const expectedTotal = gamingData.tournaments.reduce(
      (sum, tournament) => sum + parseInt(tournament.prize.replace(/[$,]/g, '')),
      0
    );

    expect(screen.getByText(`$${expectedTotal.toLocaleString()}`)).toBeInTheDocument();
  });

  test('displays achievement progress bars when applicable', () => {
    render(<GamingSection />);

    // Switch to achievements tab
    const achievementsButton = screen.getByTestId('neon-button-achievements');
    fireEvent.click(achievementsButton);

    // Look for achievements with progress
    const achievementWithProgress = gamingData.achievements.find(a => a.progress !== undefined);
    if (achievementWithProgress) {
      // Use getAllByText since there might be multiple progress indicators
      expect(screen.getAllByText('Progress').length).toBeGreaterThan(0);
      expect(screen.getByText(`${achievementWithProgress.progress}/${achievementWithProgress.maxProgress}`)).toBeInTheDocument();
    }
  });
});
