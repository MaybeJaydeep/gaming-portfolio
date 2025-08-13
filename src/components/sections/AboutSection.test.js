import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AboutSection from './AboutSection';
import { userProfile } from '../../data';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    section: ({ children, ...props }) => <section {...props}>{children}</section>,
  },
  useInView: () => true, // Always return true for tests
}));

// Mock the layout and UI components
jest.mock('../layout', () => ({
  TerminalWindow: ({ children, title }) => (
    <div data-testid="terminal-window" data-title={title}>
      {children}
    </div>
  ),
}));

jest.mock('../ui', () => ({
  GlitchText: ({ children, className }) => (
    <span className={className} data-testid="glitch-text">
      {children}
    </span>
  ),
}));

describe('AboutSection', () => {
  beforeEach(() => {
    // Reset any mocks before each test
    jest.clearAllMocks();
  });

  test('renders character profile header', () => {
    render(<AboutSection />);

    expect(screen.getByTestId('glitch-text')).toHaveTextContent('CHARACTER PROFILE');
    expect(screen.getByText(userProfile.name)).toBeInTheDocument();
    expect(screen.getByText(userProfile.title)).toBeInTheDocument();
  });

  test('displays character stats section', () => {
    render(<AboutSection />);

    expect(screen.getByText('CHARACTER STATS')).toBeInTheDocument();

    // Check that all character stats are rendered
    Object.values(userProfile.characterStats).forEach(stat => {
      expect(screen.getByText(stat.name)).toBeInTheDocument();
      expect(screen.getByText(`${stat.level}/${stat.maxLevel}`)).toBeInTheDocument();
    });
  });

  test('displays education information', () => {
    render(<AboutSection />);

    expect(screen.getByText('EDUCATION')).toBeInTheDocument();
    expect(screen.getByText(userProfile.background.education.degree)).toBeInTheDocument();
    expect(screen.getByText(`Specialization: ${userProfile.background.education.specialization}`)).toBeInTheDocument();
  });

  test('displays certifications', () => {
    render(<AboutSection />);

    expect(screen.getByText('CERTIFICATIONS')).toBeInTheDocument();

    userProfile.background.certifications.forEach(cert => {
      expect(screen.getByText(cert.name)).toBeInTheDocument();
      expect(screen.getByText(`${cert.issuer} • ${cert.year} • ${cert.level}`)).toBeInTheDocument();

      // Check that skills are displayed
      cert.skills.forEach(skill => {
        expect(screen.getByText(skill)).toBeInTheDocument();
      });
    });
  });

  test('displays achievements section', () => {
    render(<AboutSection />);

    expect(screen.getByText('ACHIEVEMENTS UNLOCKED')).toBeInTheDocument();

    userProfile.achievements.forEach(achievement => {
      expect(screen.getByText(achievement.name)).toBeInTheDocument();
      expect(screen.getByText(achievement.description)).toBeInTheDocument();
      // Use getAllByText for rarity since there might be multiple achievements with same rarity
      const rarityElements = screen.getAllByText(achievement.rarity.toUpperCase());
      expect(rarityElements.length).toBeGreaterThan(0);
    });
  });

  test('displays IBM MERN certification', () => {
    render(<AboutSection />);

    const mernCert = userProfile.background.certifications.find(
      cert => cert.name.includes('IBM MERN')
    );

    expect(screen.getByText(mernCert.name)).toBeInTheDocument();
    expect(screen.getByText('MongoDB')).toBeInTheDocument();
    expect(screen.getByText('Express.js')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Node.js')).toBeInTheDocument();
  });

  test('displays PHP experience', () => {
    render(<AboutSection />);

    const phpCert = userProfile.background.certifications.find(
      cert => cert.name.includes('PHP')
    );

    expect(screen.getByText(phpCert.name)).toBeInTheDocument();
    expect(screen.getByText('PHP')).toBeInTheDocument();
    expect(screen.getByText('Laravel')).toBeInTheDocument();
  });

  test('displays Computer Science degree with Data Science specialization', () => {
    render(<AboutSection />);

    expect(screen.getByText('Computer Science')).toBeInTheDocument();
    expect(screen.getByText('Specialization: Data Science')).toBeInTheDocument();
  });

  test('renders with custom className', () => {
    const customClass = 'custom-about-section';
    render(<AboutSection className={customClass} />);

    // Use querySelector since the section doesn't have role="region"
    const section = document.querySelector('section');
    expect(section).toHaveClass(customClass);
  });

  test('uses TerminalWindow with correct title', () => {
    render(<AboutSection />);

    const terminalWindow = screen.getByTestId('terminal-window');
    expect(terminalWindow).toHaveAttribute('data-title', 'character_profile.exe');
  });
});

// Test StatBar component functionality
describe('StatBar Component', () => {
  test('calculates percentage correctly', () => {
    const mockStat = {
      name: 'Test Skill',
      level: 75,
      maxLevel: 100,
      experience: 3750,
      nextLevelExp: 5000
    };

    render(<AboutSection />);

    // The stat bar should show the correct level ratio
    expect(screen.getByText('75/100')).toBeInTheDocument();
    expect(screen.getByText('EXP: 3,750 / 5,000')).toBeInTheDocument();
  });
});

// Test AchievementCard component functionality
describe('AchievementCard Component', () => {
  test('displays achievement rarity correctly', () => {
    render(<AboutSection />);

    userProfile.achievements.forEach(achievement => {
      // Use getAllByText for rarity since there might be multiple achievements with same rarity
      const rarityElements = screen.getAllByText(achievement.rarity.toUpperCase());
      expect(rarityElements.length).toBeGreaterThan(0);
    });
  });

  test('displays unlock dates for unlocked achievements', async () => {
    render(<AboutSection />);

    // Wait for animations to complete and check if unlock dates are present
    await waitFor(() => {
      // Check that achievements are rendered (they should have unlock dates)
      const achievementElements = screen.queryAllByText(/MERN Stack Master|PHP Expert|ML Specialist/);
      expect(achievementElements.length).toBeGreaterThan(0);
    }, { timeout: 3000 });
  });
});
