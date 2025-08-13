import React from 'react';
import { motion } from 'framer-motion';
import { useScrollAnimations } from '../../hooks/useScrollAnimations';

/**
 * ScrollReveal component for scroll-triggered animations
 */
const ScrollReveal = ({
  children,
  animation = 'fadeInUp',
  delay = 0,
  duration = 0.6,
  threshold = 0.1,
  triggerOnce = true,
  className = '',
  ...props
}) => {
  const { elementRef, isVisible } = useScrollAnimations({
    threshold,
    triggerOnce,
    delay: delay * 1000, // Convert to milliseconds
  });

  // Animation variants
  const animations = {
    fadeIn: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    },
    fadeInUp: {
      hidden: { opacity: 0, y: 60 },
      visible: { opacity: 1, y: 0 },
    },
    fadeInDown: {
      hidden: { opacity: 0, y: -60 },
      visible: { opacity: 1, y: 0 },
    },
    fadeInLeft: {
      hidden: { opacity: 0, x: -60 },
      visible: { opacity: 1, x: 0 },
    },
    fadeInRight: {
      hidden: { opacity: 0, x: 60 },
      visible: { opacity: 1, x: 0 },
    },
    scaleIn: {
      hidden: { opacity: 0, scale: 0.8 },
      visible: { opacity: 1, scale: 1 },
    },
    slideInUp: {
      hidden: { y: 100, opacity: 0 },
      visible: { y: 0, opacity: 1 },
    },
    slideInDown: {
      hidden: { y: -100, opacity: 0 },
      visible: { y: 0, opacity: 1 },
    },
    rotateIn: {
      hidden: { opacity: 0, rotate: -180, scale: 0.5 },
      visible: { opacity: 1, rotate: 0, scale: 1 },
    },
    flipIn: {
      hidden: { opacity: 0, rotateY: -90 },
      visible: { opacity: 1, rotateY: 0 },
    },
    bounceIn: {
      hidden: { opacity: 0, scale: 0.3 },
      visible: {
        opacity: 1,
        scale: 1,
        transition: {
          type: 'spring',
          damping: 10,
          stiffness: 100,
        },
      },
    },
    glitchIn: {
      hidden: {
        opacity: 0,
        x: -10,
        filter: 'blur(4px)',
      },
      visible: {
        opacity: 1,
        x: 0,
        filter: 'blur(0px)',
        transition: {
          duration: duration,
          ease: [0.25, 0.46, 0.45, 0.94],
        },
      },
    },
  };

  const selectedAnimation = animations[animation] || animations.fadeInUp;

  return (
    <motion.div
      ref={elementRef}
      className={className}
      initial="hidden"
      animate={isVisible ? 'visible' : 'hidden'}
      variants={selectedAnimation}
      transition={{
        duration,
        ease: 'easeOut',
        delay: delay,
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

/**
 * ScrollRevealContainer for staggered animations
 */
export const ScrollRevealContainer = ({
  children,
  stagger = 0.1,
  animation = 'fadeInUp',
  threshold = 0.1,
  className = '',
  ...props
}) => {
  const { elementRef, isVisible } = useScrollAnimations({ threshold });

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  return (
    <motion.div
      ref={elementRef}
      className={className}
      initial="hidden"
      animate={isVisible ? 'visible' : 'hidden'}
      variants={containerVariants}
      {...props}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div key={index} variants={itemVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

/**
 * ScrollRevealText for character-by-character text animations
 */
export const ScrollRevealText = ({
  text,
  delay = 0,
  stagger = 0.03,
  className = '',
  ...props
}) => {
  const { elementRef, isVisible } = useScrollAnimations({ threshold: 0.1 });

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  const charVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      rotateX: -90,
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration: 0.4,
        ease: 'easeOut',
      },
    },
  };

  return (
    <motion.div
      ref={elementRef}
      className={className}
      initial="hidden"
      animate={isVisible ? 'visible' : 'hidden'}
      variants={containerVariants}
      {...props}
    >
      {text.split('').map((char, index) => (
        <motion.span
          key={index}
          variants={charVariants}
          style={{ display: 'inline-block' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </motion.div>
  );
};

export default ScrollReveal;
