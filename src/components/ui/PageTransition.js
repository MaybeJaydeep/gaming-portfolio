import React from 'react';
import { motion } from 'framer-motion';

// Page transition variants
const pageVariants = {
  initial: {
    opacity: 0,
    y: 50,
    scale: 0.95,
  },
  in: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
  out: {
    opacity: 0,
    y: -50,
    scale: 1.05,
  },
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.6,
};

// Section transition variants for smooth scrolling - Mobile optimized
const sectionVariants = {
  hidden: {
    opacity: 0,
    y: 30, // Reduced from 100 to prevent gaps on mobile
    scale: 0.98, // Less aggressive scaling for mobile
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6, // Faster animation for mobile
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
  exit: {
    opacity: 0,
    y: -20, // Reduced exit movement
    scale: 1.02,
    transition: {
      duration: 0.3,
      ease: 'easeInOut',
    },
  },
};

// Stagger container for list items
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

// Individual stagger item
const staggerItem = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

// Gaming-themed entrance animation
const gamingEntrance = {
  hidden: {
    opacity: 0,
    scale: 0,
    rotateY: -180,
  },
  visible: {
    opacity: 1,
    scale: 1,
    rotateY: 0,
    transition: {
      duration: 0.8,
      ease: 'backOut',
      scale: {
        type: 'spring',
        damping: 10,
        stiffness: 100,
      },
    },
  },
};

// Glitch effect animation
const glitchEffect = {
  hidden: {
    opacity: 0,
    x: -100,
    skewX: -10,
  },
  visible: {
    opacity: 1,
    x: 0,
    skewX: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

/**
 * PageTransition component for wrapping page content with animations
 */
export const PageTransition = ({ children, className = '' }) => {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/**
 * SectionTransition component for individual sections - Mobile optimized
 */
export const SectionTransition = ({
  children,
  className = '',
  variant = 'visible',
  delay = 0,
}) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      exit="exit"
      variants={sectionVariants}
      transition={{ ...sectionVariants.visible.transition, delay }}
      viewport={{
        once: true,
        amount: 0.1, // Reduced from 0.3 for better mobile triggering
        margin: '0px 0px -100px 0px', // Trigger earlier on mobile
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/**
 * StaggerContainer for animating lists with stagger effect
 */
export const StaggerContainer = ({ children, className = '' }) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      variants={staggerContainer}
      viewport={{ once: true, amount: 0.2 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/**
 * StaggerItem for individual items in a staggered list
 */
export const StaggerItem = ({ children, className = '', delay = 0 }) => {
  return (
    <motion.div
      variants={staggerItem}
      transition={{ ...staggerItem.visible.transition, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/**
 * GamingEntrance for special gaming-themed animations
 */
export const GamingEntrance = ({ children, className = '', delay = 0 }) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      variants={gamingEntrance}
      transition={{ ...gamingEntrance.visible.transition, delay }}
      viewport={{ once: true, amount: 0.5 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/**
 * GlitchEntrance for glitch-style animations
 */
export const GlitchEntrance = ({ children, className = '', delay = 0 }) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      variants={glitchEffect}
      transition={{ ...glitchEffect.visible.transition, delay }}
      viewport={{ once: true, amount: 0.3 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Export animation variants for custom use
export const animationVariants = {
  pageVariants,
  sectionVariants,
  staggerContainer,
  staggerItem,
  gamingEntrance,
  glitchEffect,
};

export const animationTransitions = {
  pageTransition,
};
