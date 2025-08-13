import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SkillsSection from './SkillsSection';
import { skillCategories, getSkillsByCategory } from '../../data';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
    section: ({ children, ...props }) => <section {...props}>{children}</section>
  },
  useInView: () => true,
}));

// Mock UI components
jest.mock('../layout', () => ({
  TerminalWindow: ({ children, title }) => (
    <div data-testid="terminal-window" title={title}>
      {children}
    </div>
  )
}));

jest.mock('../ui', () => ({
  GlitchText: ({ children, className }) => (
    <div className={className} data-testid="glitch-text">
      {children}
    </div>
  )
}));

// Mock data
jest.mock('../../data', () => ({
  skillCategories: {
    frontend: {
      name: 'Frontend Development',
      icon: '🎨',
      color: 'cyan',
      description: 'User interface technologies'
    },
    backend: {
      name: 'Backend Development',
      icon: '⚙️',
      color: 'green',
      description: 'Server-side technologies'
    }
  },
  getSkillsByCategory: () => ({
    frontend: [
      {
        id: 'react',
        name: 'React',
        category: 'frontend',
        proficiency: 95,
        yearsExperience: 4,
        level: 'Expert',
        certifications: ['IBM MERN Stack Certification'],
        projects: ['Portfolio Website'],
        description: 'Advanced React development'
      },
      {
        id: 'javascript',
        name: 'JavaScript',
        category: 'frontend',
        proficiency: 92,
        yearsExperience: 5,
        level: 'Expert',
        certifications: [],
        projects: ['Multiple web applications'],
        description: 'Modern ES6+ JavaScript'
      }
    ],
    backend: [
      {
        id: 'nodejs',
        name: 'Node.js',
        category: 'backend',
        proficiency: 90,
        yearsExperience: 4,
        level: 'Expert',
        certifications: ['IBM MERN Stack Certification'],
        projects: ['REST APIs'],
        description: 'Server-side JavaScript'
      }
    ]
  })
}));

describe('SkillsSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders skill tree header correctly', () => {
    render(<SkillsSection />);

    expect(screen.getByText('SKILL TREE')).toBeInTheDocument();
    expect(screen.getByText(/Hover over skills to view details/)).toBeInTheDocument();
  });

  test('renders category buttons with correct information', () => {
    render(<SkillsSection />);

    expect(screen.getByText('Frontend Development')).toBeInTheDocument();
    expect(screen.getByText('Backend Development')).toBeInTheDocument();
    expect(screen.getByText('2 skills')).toBeInTheDocument();
    expect(screen.getByText('1 skills')).toBeInTheDocument();
  });

  test('switches categories when category button is clicked', async () => {
    render(<SkillsSection />);

    // Initially should show frontend skills
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('JavaScript')).toBeInTheDocument();

    // Click backend category
    const backendButton = screen.getByText('Backend Development');
    fireEvent.click(backendButton);

    // Should now show backend skills
    await waitFor(() => {
      expect(screen.getByText('Node.js')).toBeInTheDocument();
    });
  });

  test('displays skill nodes with correct information', () => {
    render(<SkillsSection />);

    // Check React skill node
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('95%')).toBeInTheDocument();
    expect(screen.getByText('Expert')).toBeInTheDocument();
    expect(screen.getByText('4y exp')).toBeInTheDocument();
  });

  test('shows skill details panel on hover', async () => {
    render(<SkillsSection />);

    const reactSkill = screen.getByText('React');
    fireEvent.mouseEnter(reactSkill.closest('div'));

    await waitFor(() => {
      expect(screen.getByText('Advanced React development')).toBeInTheDocument();
      expect(screen.getByText('Proficiency:')).toBeInTheDocument();
      expect(screen.getByText('Experience:')).toBeInTheDocument();
      expect(screen.getByText('Certifications')).toBeInTheDocument();
      expect(screen.getByText('IBM MERN Stack Certification')).toBeInTheDocument();
    });
  });

  test('hides skill details panel on mouse leave', async () => {
    render(<SkillsSection />);

    const reactSkill = screen.getByText('React');
    const skillNode = reactSkill.closest('div');

    // Hover to show details
    fireEvent.mouseEnter(skillNode);
    await waitFor(() => {
      expect(screen.getByText('Advanced React development')).toBeInTheDocument();
    });

    // Leave to hide details
    fireEvent.mouseLeave(skillNode);
    await waitFor(() => {
      expect(screen.queryByText('Advanced React development')).not.toBeInTheDocument();
    });
  });

  test('displays overall stats correctly', () => {
    render(<SkillsSection />);

    expect(screen.getByText('Total Skills')).toBeInTheDocument();
    expect(screen.getByText('Avg Proficiency')).toBeInTheDocument();
    expect(screen.getByText('Years Experience')).toBeInTheDocument();

    // Check calculated values
    expect(screen.getByText('3')).toBeInTheDocument(); // Total skills
    expect(screen.getByText('92%')).toBeInTheDocument(); // Average proficiency
    expect(screen.getByText('5')).toBeInTheDocument(); // Max years experience
  });

  test('applies correct CSS classes for different proficiency levels', () => {
    render(<SkillsSection />);

    // Expert level (95%) should have yellow styling
    const expertSkill = screen.getByText('React').closest('div');
    expect(expertSkill).toHaveClass('text-yellow-400');
    expect(expertSkill).toHaveClass('border-yellow-500');
  });

  test('displays projects in skill details', async () => {
    render(<SkillsSection />);

    const reactSkill = screen.getByText('React');
    fireEvent.mouseEnter(reactSkill.closest('div'));

    await waitFor(() => {
      expect(screen.getByText('Projects')).toBeInTheDocument();
      expect(screen.getByText('• Portfolio Website')).toBeInTheDocument();
    });
  });

  test('handles skills without certifications gracefully', async () => {
    render(<SkillsSection />);

    const jsSkill = screen.getByText('JavaScript');
    fireEvent.mouseEnter(jsSkill.closest('div'));

    await waitFor(() => {
      expect(screen.getByText('Modern ES6+ JavaScript')).toBeInTheDocument();
      // Should not show certifications section for JavaScript
      expect(screen.queryByText('Certifications')).not.toBeInTheDocument();
    });
  });

  test('renders with custom className', () => {
    const { container } = render(<SkillsSection className="custom-class" />);
    const section = container.querySelector('section');
    expect(section).toHaveClass('custom-class');
  });

  test('category buttons have correct styling when selected', () => {
    render(<SkillsSection />);

    // Frontend should be selected by default
    const frontendButton = screen.getByText('Frontend Development').closest('button');
    expect(frontendButton).toHaveClass('border-cyan-500');
    expect(frontendButton).toHaveClass('text-cyan-400');

    // Backend should not be selected
    const backendButton = screen.getByText('Backend Development').closest('button');
    expect(backendButton).toHaveClass('border-gray-600');
    expect(backendButton).toHaveClass('text-gray-400');
  });

  test('skill nodes show correct proficiency levels', () => {
    render(<SkillsSection />);

    // React (95%) should be Expert
    const reactNode = screen.getByText('React').closest('div');
    expect(reactNode.querySelector('.text-yellow-400')).toBeInTheDocument();

    // JavaScript (92%) should be Expert
    const jsNode = screen.getByText('JavaScript').closest('div');
    expect(jsNode.querySelector('.text-yellow-400')).toBeInTheDocument();
  });
});
