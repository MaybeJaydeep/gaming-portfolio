import React from 'react';
import { motion } from 'framer-motion';

/**
 * Gaming-themed typography component with consistent styling
 */
const Typography = ({
  variant = 'body',
  size = 'base',
  color = 'default',
  weight = 'normal',
  spacing = 'normal',
  glow = false,
  outline = false,
  className = '',
  children,
  animate = false,
  delay = 0,
  ...props
}) => {
  // Variant mappings
  const variants = {
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    h4: 'h4',
    h5: 'h5',
    h6: 'h6',
    body: 'p',
    span: 'span',
    div: 'div',
    code: 'code',
    pre: 'pre',
  };

  // Size mappings
  const sizes = {
    xs: 'text-gaming-xs',
    sm: 'text-gaming-sm',
    base: 'text-gaming-base',
    lg: 'text-gaming-lg',
    xl: 'text-gaming-xl',
    '2xl': 'text-gaming-2xl',
    '3xl': 'text-gaming-3xl',
    '4xl': 'text-gaming-4xl',
    '5xl': 'text-gaming-5xl',
    '6xl': 'text-gaming-6xl',
  };

  // Color mappings
  const colors = {
    default: 'text-light-text',
    white: 'text-white',
    cyan: 'text-neon-cyan',
    green: 'text-neon-green',
    purple: 'text-electric-purple',
    orange: 'text-warning-orange',
    gray: 'text-gray-400',
    'gray-light': 'text-gray-300',
    'gray-dark': 'text-gray-500',
    red: 'text-red-400',
    blue: 'text-blue-400',
    yellow: 'text-yellow-400',
  };

  // Weight mappings
  const weights = {
    light: 'font-gaming-light',
    normal: 'font-gaming',
    bold: 'font-gaming-bold',
    black: 'font-gaming-black',
    mono: 'font-mono-gaming',
  };

  // Spacing mappings
  const spacings = {
    tight: 'text-readable-tight',
    normal: 'text-readable',
    loose: 'text-readable-loose',
  };

  // Build className
  const baseClasses = [
    sizes[size] || sizes.base,
    colors[color] || colors.default,
    weights[weight] || weights.normal,
    spacings[spacing] || spacings.normal,
  ];

  // Add effect classes
  if (glow === true) {
    baseClasses.push('text-glow');
  } else if (glow === 'strong') {
    baseClasses.push('text-glow-strong');
  }

  if (outline) {
    baseClasses.push('text-outline');
  }

  // Add custom className
  if (className) {
    baseClasses.push(className);
  }

  const finalClassName = baseClasses.join(' ');
  const Component = variants[variant] || 'p';

  // Animation variants
  const animationVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay,
        ease: 'easeOut',
      },
    },
  };

  if (animate) {
    return (
      <motion.div
        variants={animationVariants}
        initial="hidden"
        animate="visible"
      >
        <Component className={finalClassName} {...props}>
          {children}
        </Component>
      </motion.div>
    );
  }

  return (
    <Component className={finalClassName} {...props}>
      {children}
    </Component>
  );
};

/**
 * Pre-configured typography components for common use cases
 */
export const GamingHeading = ({ level = 1, children, ...props }) => (
  <Typography
    variant={`h${level}`}
    size={
      level === 1 ? '5xl' : level === 2 ? '4xl' : level === 3 ? '3xl' : '2xl'
    }
    color="cyan"
    weight="bold"
    glow="strong"
    animate
    {...props}
  >
    {children}
  </Typography>
);

export const GamingSubheading = ({ children, ...props }) => (
  <Typography
    variant="h3"
    size="xl"
    color="green"
    weight="normal"
    animate
    {...props}
  >
    {children}
  </Typography>
);

export const GamingText = ({ children, ...props }) => (
  <Typography
    variant="body"
    size="base"
    color="default"
    weight="normal"
    spacing="normal"
    {...props}
  >
    {children}
  </Typography>
);

export const GamingCode = ({ children, ...props }) => (
  <Typography
    variant="code"
    size="sm"
    color="cyan"
    weight="mono"
    className="bg-gray-800/50 px-2 py-1 rounded border border-cyan-500/30"
    {...props}
  >
    {children}
  </Typography>
);

export const GamingLabel = ({ children, ...props }) => (
  <Typography
    variant="span"
    size="sm"
    color="gray-light"
    weight="normal"
    className="uppercase tracking-wider"
    {...props}
  >
    {children}
  </Typography>
);

export const GamingCaption = ({ children, ...props }) => (
  <Typography variant="span" size="xs" color="gray" weight="normal" {...props}>
    {children}
  </Typography>
);

export const GamingHighlight = ({ children, ...props }) => (
  <Typography variant="span" color="cyan" weight="bold" glow {...props}>
    {children}
  </Typography>
);

export const GamingError = ({ children, ...props }) => (
  <Typography
    variant="span"
    color="red"
    weight="bold"
    className="bg-red-500/10 px-2 py-1 rounded border border-red-500/30"
    {...props}
  >
    {children}
  </Typography>
);

export const GamingSuccess = ({ children, ...props }) => (
  <Typography
    variant="span"
    color="green"
    weight="bold"
    className="bg-green-500/10 px-2 py-1 rounded border border-green-500/30"
    {...props}
  >
    {children}
  </Typography>
);

export const GamingWarning = ({ children, ...props }) => (
  <Typography
    variant="span"
    color="orange"
    weight="bold"
    className="bg-orange-500/10 px-2 py-1 rounded border border-orange-500/30"
    {...props}
  >
    {children}
  </Typography>
);

export default Typography;
