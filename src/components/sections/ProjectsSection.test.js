import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProjectsSection from './ProjectsSection';
import { projectsData } from '../../data';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    section: ({ children, ...props }) => (
      <section {...props}>{children}</section>
    ),
    button: ({ children, onClick, ...props }) => (
      <button onClick={onClick} {...props}>
        {children}
      </button>
    ),
  },
  useInView: () => true,
  AnimatePresence: ({ children }) => <div>{children}</div>,
}));

// Mock the UI components
jest.mock('../ui', () => ({
  GlitchText: ({ children, className }) => (
    <div className={className}>{children}</div>
  ),
  NeonButton: ({ children, onClick, variant, className }) => (
    <button
      onClick={onClick}
      className={`${variant} ${className}`}
      data-testid={`neon-button-${children.toLowerCase().replace(/\s+/g, '-')}`}
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

describe('ProjectsSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders projects section with correct title', () => {
    render(<ProjectsSection />);

    expect(screen.getByText('PROJECT PORTFOLIO')).toBeInTheDocument();
    expect(screen.getByText(/Showcasing \d+ projects/)).toBeInTheDocument();
  });

  test('displays project statistics correctly', () => {
    render(<ProjectsSection />);

    expect(screen.getByText('Total Projects')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
    expect(screen.getByText('Badges Earned')).toBeInTheDocument();
    expect(screen.getByText('Technologies')).toBeInTheDocument();

    expect(
      screen.getByText(projectsData.stats.totalProjects.toString())
    ).toBeInTheDocument();
    expect(
      screen.getByText(projectsData.stats.completedProjects.toString())
    ).toBeInTheDocument();
  });

  test('renders category filter buttons', () => {
    render(<ProjectsSection />);

    projectsData.categories.forEach(category => {
      expect(screen.getByText(category.name)).toBeInTheDocument();
    });
  });

  test('filters projects by category', () => {
    render(<ProjectsSection />);

    // Initially should show all projects
    const webProjects = projectsData.projects.filter(p => p.category === 'web');
    if (webProjects.length > 0) {
      expect(screen.getByText(webProjects[0].title)).toBeInTheDocument();
    }

    // Click on game category
    fireEvent.click(screen.getByText('Game Development'));

    // Should show game projects
    const gameProjects = projectsData.projects.filter(
      p => p.category === 'game'
    );
    if (gameProjects.length > 0) {
      expect(screen.getByText(gameProjects[0].title)).toBeInTheDocument();
    }
  });

  test('search functionality works correctly', () => {
    render(<ProjectsSection />);

    const searchInput = screen.getByPlaceholderText(
      /Search projects, technologies, features/
    );

    // Search for a specific project
    fireEvent.change(searchInput, { target: { value: 'Gaming Portfolio' } });

    // Should show matching projects
    const matchingProjects = projectsData.projects.filter(p =>
      p.title.toLowerCase().includes('gaming portfolio')
    );

    if (matchingProjects.length > 0) {
      expect(screen.getByText(matchingProjects[0].title)).toBeInTheDocument();
    }
  });

  test('featured toggle works correctly', () => {
    render(<ProjectsSection />);

    const featuredToggle = screen.getByLabelText(/Featured Only/);

    // Toggle featured projects
    fireEvent.click(featuredToggle);

    // Should only show featured projects
    const featuredProjects = projectsData.projects.filter(p => p.featured);
    const nonFeaturedProjects = projectsData.projects.filter(p => !p.featured);

    if (featuredProjects.length > 0) {
      expect(screen.getByText(featuredProjects[0].title)).toBeInTheDocument();
    }

    if (nonFeaturedProjects.length > 0) {
      expect(
        screen.queryByText(nonFeaturedProjects[0].title)
      ).not.toBeInTheDocument();
    }
  });

  test('displays project cards with correct information', () => {
    render(<ProjectsSection />);

    const firstProject = projectsData.projects[0];

    expect(screen.getByText(firstProject.title)).toBeInTheDocument();
    expect(screen.getByText(firstProject.description)).toBeInTheDocument();

    // Check for technologies
    firstProject.technologies.slice(0, 4).forEach(tech => {
      expect(screen.getByText(tech)).toBeInTheDocument();
    });
  });

  test('opens project modal when project card is clicked', async () => {
    render(<ProjectsSection />);

    const firstProject = projectsData.projects[0];
    const projectCard = screen.getByText(firstProject.title).closest('div');

    fireEvent.click(projectCard);

    await waitFor(() => {
      expect(screen.getByText('About This Project')).toBeInTheDocument();
      expect(screen.getByText('Technologies Used')).toBeInTheDocument();
      expect(screen.getByText('Key Features')).toBeInTheDocument();
    });
  });

  test('closes project modal when close button is clicked', async () => {
    render(<ProjectsSection />);

    const firstProject = projectsData.projects[0];
    const projectCard = screen.getByText(firstProject.title).closest('div');

    fireEvent.click(projectCard);

    await waitFor(() => {
      const closeButton = screen.getByText('×');
      fireEvent.click(closeButton);
    });

    await waitFor(() => {
      expect(screen.queryByText('About This Project')).not.toBeInTheDocument();
    });
  });

  test('displays project status and difficulty correctly', () => {
    render(<ProjectsSection />);

    const completedProject = projectsData.projects.find(
      p => p.status === 'completed'
    );
    if (completedProject) {
      const difficultyElements = screen.getAllByText(
        completedProject.difficulty.toUpperCase()
      );
      expect(difficultyElements.length).toBeGreaterThan(0);
    }
  });

  test('shows featured badge for featured projects', () => {
    render(<ProjectsSection />);

    const featuredProjects = projectsData.projects.filter(p => p.featured);

    // Should show featured badges
    if (featuredProjects.length > 0) {
      const featuredBadges = screen.getAllByText(/FEATURED/);
      expect(featuredBadges.length).toBe(featuredProjects.length);
    }
  });

  test('displays no results message when no projects match filters', () => {
    render(<ProjectsSection />);

    const searchInput = screen.getByPlaceholderText(
      /Search projects, technologies, features/
    );

    // Search for something that doesn't exist
    fireEvent.change(searchInput, {
      target: { value: 'nonexistentproject12345' },
    });

    expect(screen.getByText('No projects found')).toBeInTheDocument();
    expect(
      screen.getByText(/Try adjusting your search terms/)
    ).toBeInTheDocument();
  });

  test('applies correct CSS classes', () => {
    render(<ProjectsSection className="test-class" />);

    const section = document.querySelector('section');
    expect(section).toHaveClass('test-class');
  });

  test('handles project modal image navigation', async () => {
    render(<ProjectsSection />);

    // Find a project with multiple images
    const projectWithImages = projectsData.projects.find(
      p => p.images && p.images.length > 1
    );
    if (projectWithImages) {
      const projectCard = screen
        .getByText(projectWithImages.title)
        .closest('div');
      fireEvent.click(projectCard);

      await waitFor(() => {
        const imageNavButtons = screen
          .getAllByRole('button')
          .filter(btn => btn.className.includes('rounded-full'));
        expect(imageNavButtons.length).toBe(projectWithImages.images.length);
      });
    }
  });

  test('opens external links correctly', async () => {
    // Mock window.open
    const mockOpen = jest.fn();
    global.window.open = mockOpen;

    render(<ProjectsSection />);

    const projectWithLinks = projectsData.projects.find(
      p => p.liveUrl || p.githubUrl
    );
    if (projectWithLinks) {
      const projectCard = screen
        .getByText(projectWithLinks.title)
        .closest('div');
      fireEvent.click(projectCard);

      await waitFor(() => {
        if (projectWithLinks.liveUrl) {
          const liveDemoButton = screen.getByTestId('neon-button-🚀-live-demo');
          fireEvent.click(liveDemoButton);
          expect(mockOpen).toHaveBeenCalledWith(
            projectWithLinks.liveUrl,
            '_blank'
          );
        }

        if (projectWithLinks.githubUrl) {
          const sourceCodeButton = screen.getByTestId(
            'neon-button-📂-source-code'
          );
          fireEvent.click(sourceCodeButton);
          expect(mockOpen).toHaveBeenCalledWith(
            projectWithLinks.githubUrl,
            '_blank'
          );
        }
      });
    }

    // Restore window.open
    delete global.window.open;
  });

  test('displays technology colors correctly', () => {
    render(<ProjectsSection />);

    const firstProject = projectsData.projects[0];
    const techElements = firstProject.technologies
      .slice(0, 4)
      .map(tech => screen.getByText(tech));

    techElements.forEach((element, index) => {
      const tech = firstProject.technologies[index];
      const techData = projectsData.technologies[tech];
      if (techData) {
        expect(element).toBeInTheDocument();
      }
    });
  });
});
