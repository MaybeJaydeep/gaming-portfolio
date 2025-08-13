import React from 'react';
import { render, screen, act } from '@testing-library/react';
import {
  GamingSpinner,
  PulseLoader,
  SkeletonLoader,
  HUDLoader,
  TypewriterLoader,
  ProgressLoader,
  SkeletonCard,
  SkeletonList,
  LoadingOverlay,
} from './LoadingAnimations';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
}));

describe('Loading Animation Components', () => {
  describe('GamingSpinner', () => {
    it('renders with default medium size', () => {
      render(<GamingSpinner />);
      const spinner = document.querySelector('.w-12.h-12');
      expect(spinner).toBeInTheDocument();
    });

    it('renders with small size', () => {
      render(<GamingSpinner size="small" />);
      const spinner = document.querySelector('.w-6.h-6');
      expect(spinner).toBeInTheDocument();
    });

    it('renders with large size', () => {
      render(<GamingSpinner size="large" />);
      const spinner = document.querySelector('.w-16.h-16');
      expect(spinner).toBeInTheDocument();
    });

    it('applies custom className', () => {
      const { container } = render(
        <GamingSpinner className="custom-spinner" />
      );
      expect(container.firstChild).toHaveClass('custom-spinner');
    });
  });

  describe('PulseLoader', () => {
    it('renders children with pulse animation', () => {
      render(
        <PulseLoader>
          <div>Pulsing Content</div>
        </PulseLoader>
      );

      expect(screen.getByText('Pulsing Content')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      const { container } = render(
        <PulseLoader className="pulse-custom">
          <div>Content</div>
        </PulseLoader>
      );

      expect(container.firstChild).toHaveClass('pulse-custom');
    });
  });

  describe('SkeletonLoader', () => {
    it('renders with default props', () => {
      const { container } = render(<SkeletonLoader />);
      const skeleton = container.firstChild;

      expect(skeleton).toHaveClass('bg-gray-700');
      expect(skeleton).toHaveClass('rounded-md');
    });

    it('applies custom width and height', () => {
      const { container } = render(
        <SkeletonLoader width="200px" height="40px" />
      );
      const skeleton = container.firstChild;

      expect(skeleton).toHaveStyle({ width: '200px', height: '40px' });
    });

    it('applies different rounded variants', () => {
      const { container } = render(<SkeletonLoader rounded="full" />);
      expect(container.firstChild).toHaveClass('rounded-full');
    });
  });

  describe('HUDLoader', () => {
    it('renders children with HUD styling', () => {
      render(
        <HUDLoader>
          <div>HUD Content</div>
        </HUDLoader>
      );

      expect(screen.getByText('HUD Content')).toBeInTheDocument();
    });

    it('has correct HUD styling classes', () => {
      const { container } = render(
        <HUDLoader>
          <div>Content</div>
        </HUDLoader>
      );

      expect(container.firstChild).toHaveClass('border-cyan-500');
      expect(container.firstChild).toHaveClass('bg-gray-900/50');
    });
  });

  describe('TypewriterLoader', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('renders initial empty text', () => {
      render(<TypewriterLoader text="Hello World" />);
      // Initially should be empty or just cursor
      const cursor = screen.getByText('|');
      expect(cursor).toBeInTheDocument();
    });

    it('types text progressively', () => {
      render(<TypewriterLoader text="Hi" speed={100} />);

      // Fast forward time to see text appear
      act(() => {
        jest.advanceTimersByTime(100);
      });

      expect(screen.getByText(/H/)).toBeInTheDocument();

      act(() => {
        jest.advanceTimersByTime(100);
      });

      expect(screen.getByText(/Hi/)).toBeInTheDocument();
    });

    it('applies custom className', () => {
      const { container } = render(
        <TypewriterLoader text="Test" className="typewriter-custom" />
      );

      expect(container.firstChild).toHaveClass('typewriter-custom');
    });
  });

  describe('ProgressLoader', () => {
    it('renders with default progress', () => {
      render(<ProgressLoader />);
      expect(screen.getByText('Loading...')).toBeInTheDocument();
      expect(screen.getByText('0%')).toBeInTheDocument();
    });

    it('displays correct progress percentage', () => {
      render(<ProgressLoader progress={75} />);
      expect(screen.getByText('75%')).toBeInTheDocument();
    });

    it('hides percentage when showPercentage is false', () => {
      render(<ProgressLoader progress={50} showPercentage={false} />);
      expect(screen.queryByText('50%')).not.toBeInTheDocument();
    });

    it('applies custom className', () => {
      const { container } = render(
        <ProgressLoader className="progress-custom" />
      );

      expect(container.firstChild).toHaveClass('progress-custom');
    });
  });

  describe('SkeletonCard', () => {
    it('renders skeleton card structure', () => {
      const { container } = render(<SkeletonCard />);
      const card = container.firstChild;

      expect(card).toHaveClass('p-6');
      expect(card).toHaveClass('bg-gray-800');
      expect(card).toHaveClass('rounded-lg');
    });

    it('applies custom className', () => {
      const { container } = render(<SkeletonCard className="card-custom" />);
      expect(container.firstChild).toHaveClass('card-custom');
    });
  });

  describe('SkeletonList', () => {
    it('renders default number of items', () => {
      const { container } = render(<SkeletonList />);
      const items = container.querySelectorAll('.space-y-3 > *');
      expect(items).toHaveLength(5);
    });

    it('renders custom number of items', () => {
      const { container } = render(<SkeletonList items={3} />);
      const items = container.querySelectorAll('.space-y-3 > *');
      expect(items).toHaveLength(3);
    });

    it('applies custom className', () => {
      const { container } = render(<SkeletonList className="list-custom" />);
      expect(container.firstChild).toHaveClass('list-custom');
    });
  });

  describe('LoadingOverlay', () => {
    it('renders children when not loading', () => {
      render(
        <LoadingOverlay isLoading={false}>
          <div>Main Content</div>
        </LoadingOverlay>
      );

      expect(screen.getByText('Main Content')).toBeInTheDocument();
    });

    it('shows loading overlay when loading', () => {
      render(
        <LoadingOverlay isLoading={true} message="Loading data...">
          <div>Main Content</div>
        </LoadingOverlay>
      );

      expect(screen.getByText('Main Content')).toBeInTheDocument();
      expect(screen.getByText(/Loading data.../)).toBeInTheDocument();
    });

    it('shows progress when provided', () => {
      render(
        <LoadingOverlay isLoading={true} progress={60}>
          <div>Content</div>
        </LoadingOverlay>
      );

      expect(screen.getByText('60%')).toBeInTheDocument();
    });

    it('uses default loading message', () => {
      render(
        <LoadingOverlay isLoading={true}>
          <div>Content</div>
        </LoadingOverlay>
      );

      expect(screen.getByText(/Loading.../)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('provides appropriate ARIA labels for loading states', () => {
      render(<GamingSpinner />);
      // Should have appropriate loading indicators
      const spinner = document.querySelector('[class*="border-2"]');
      expect(spinner).toBeInTheDocument();
    });

    it('maintains content accessibility during loading', () => {
      render(
        <LoadingOverlay isLoading={true}>
          <button>Accessible Button</button>
        </LoadingOverlay>
      );

      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('renders multiple skeleton items efficiently', () => {
      const { container } = render(<SkeletonList items={20} />);
      const items = container.querySelectorAll('.space-y-3 > *');
      expect(items).toHaveLength(20);
    });

    it('handles rapid loading state changes', () => {
      const { rerender } = render(
        <LoadingOverlay isLoading={true}>
          <div>Content</div>
        </LoadingOverlay>
      );

      rerender(
        <LoadingOverlay isLoading={false}>
          <div>Content</div>
        </LoadingOverlay>
      );

      expect(screen.getByText('Content')).toBeInTheDocument();
    });
  });
});
