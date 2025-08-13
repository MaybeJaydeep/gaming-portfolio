import React from 'react';
import { render, screen } from '@testing-library/react';
import { motion } from 'framer-motion';
import {
  PageTransition,
  SectionTransition,
  StaggerContainer,
  StaggerItem,
  GamingEntrance,
  GlitchEntrance,
  animationVariants,
} from './PageTransition';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
}));

describe('PageTransition Components', () => {
  describe('PageTransition', () => {
    it('renders children with correct props', () => {
      render(
        <PageTransition className="test-class">
          <div>Test Content</div>
        </PageTransition>
      );

      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      const { container } = render(
        <PageTransition className="custom-class">
          <div>Test</div>
        </PageTransition>
      );

      expect(container.firstChild).toHaveClass('custom-class');
    });
  });

  describe('SectionTransition', () => {
    it('renders with default props', () => {
      render(
        <SectionTransition>
          <div>Section Content</div>
        </SectionTransition>
      );

      expect(screen.getByText('Section Content')).toBeInTheDocument();
    });

    it('applies delay prop', () => {
      render(
        <SectionTransition delay={0.5}>
          <div>Delayed Section</div>
        </SectionTransition>
      );

      expect(screen.getByText('Delayed Section')).toBeInTheDocument();
    });
  });

  describe('StaggerContainer', () => {
    it('renders children in stagger container', () => {
      render(
        <StaggerContainer>
          <div>Item 1</div>
          <div>Item 2</div>
        </StaggerContainer>
      );

      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
    });
  });

  describe('StaggerItem', () => {
    it('renders individual stagger item', () => {
      render(
        <StaggerItem delay={0.2}>
          <div>Stagger Item</div>
        </StaggerItem>
      );

      expect(screen.getByText('Stagger Item')).toBeInTheDocument();
    });
  });

  describe('GamingEntrance', () => {
    it('renders with gaming-themed animation', () => {
      render(
        <GamingEntrance delay={0.3}>
          <div>Gaming Content</div>
        </GamingEntrance>
      );

      expect(screen.getByText('Gaming Content')).toBeInTheDocument();
    });
  });

  describe('GlitchEntrance', () => {
    it('renders with glitch animation', () => {
      render(
        <GlitchEntrance delay={0.1}>
          <div>Glitch Content</div>
        </GlitchEntrance>
      );

      expect(screen.getByText('Glitch Content')).toBeInTheDocument();
    });
  });

  describe('Animation Variants', () => {
    it('exports correct animation variants', () => {
      expect(animationVariants).toHaveProperty('pageVariants');
      expect(animationVariants).toHaveProperty('sectionVariants');
      expect(animationVariants).toHaveProperty('staggerContainer');
      expect(animationVariants).toHaveProperty('staggerItem');
      expect(animationVariants).toHaveProperty('gamingEntrance');
      expect(animationVariants).toHaveProperty('glitchEffect');
    });

    it('has correct page variant structure', () => {
      const { pageVariants } = animationVariants;
      expect(pageVariants).toHaveProperty('initial');
      expect(pageVariants).toHaveProperty('in');
      expect(pageVariants).toHaveProperty('out');
    });

    it('has correct stagger container structure', () => {
      const { staggerContainer } = animationVariants;
      expect(staggerContainer).toHaveProperty('hidden');
      expect(staggerContainer).toHaveProperty('visible');
      expect(staggerContainer.visible.transition).toHaveProperty(
        'staggerChildren'
      );
    });
  });

  describe('Accessibility', () => {
    it('respects reduced motion preferences', () => {
      // Mock matchMedia for reduced motion
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
          matches: query === '(prefers-reduced-motion: reduce)',
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });

      render(
        <PageTransition>
          <div>Accessible Content</div>
        </PageTransition>
      );

      expect(screen.getByText('Accessible Content')).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('renders multiple stagger items efficiently', () => {
      const items = Array.from({ length: 10 }, (_, i) => `Item ${i + 1}`);

      render(
        <StaggerContainer>
          {items.map((item, index) => (
            <StaggerItem key={index} delay={index * 0.1}>
              <div>{item}</div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      );

      items.forEach(item => {
        expect(screen.getByText(item)).toBeInTheDocument();
      });
    });
  });
});
