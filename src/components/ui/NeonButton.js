import React from 'react';
import { motion } from 'framer-motion';
import { useSoundInteractions } from '../../hooks/useSoundInteractions';
import { useResponsive } from '../../hooks/useResponsive';
import { useAccessibilityContext } from '../../contexts/AccessibilityContext';

const NeonButton = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  onClick,
  className = '',
  type = 'button',
  enableSounds = true,
  ariaLabel,
  ariaDescribedBy,
  ...props
}) => {
  const { withClickSound, withHoverSound } = useSoundInteractions();
  const { isTouchDevice, prefersReducedMotion } = useResponsive();
  const { getAriaProps } = useAccessibilityContext();
  // Variant configurations
  const variants = {
    primary: {
      base: 'bg-transparent border-2 border-cyan-400 text-cyan-400',
      hover: 'bg-cyan-400/10 text-cyan-300 border-cyan-300',
      active: 'bg-cyan-400/20 text-cyan-200 border-cyan-200',
      glow: 'shadow-lg shadow-cyan-400/50',
      hoverGlow: 'shadow-xl shadow-cyan-400/70',
    },
    secondary: {
      base: 'bg-transparent border-2 border-purple-400 text-purple-400',
      hover: 'bg-purple-400/10 text-purple-300 border-purple-300',
      active: 'bg-purple-400/20 text-purple-200 border-purple-200',
      glow: 'shadow-lg shadow-purple-400/50',
      hoverGlow: 'shadow-xl shadow-purple-400/70',
    },
    danger: {
      base: 'bg-transparent border-2 border-red-400 text-red-400',
      hover: 'bg-red-400/10 text-red-300 border-red-300',
      active: 'bg-red-400/20 text-red-200 border-red-200',
      glow: 'shadow-lg shadow-red-400/50',
      hoverGlow: 'shadow-xl shadow-red-400/70',
    },
  };

  // Size configurations with touch-friendly sizing
  const sizes = {
    small: 'px-3 py-2 text-sm min-h-[40px]',
    medium: 'px-6 py-3 text-base min-h-[44px]',
    large: 'px-8 py-4 text-lg min-h-[48px]',
  };

  const variantConfig = variants[variant] || variants.primary;
  const sizeConfig = sizes[size] || sizes.medium;

  // Disabled styles
  const disabledStyles = disabled
    ? 'opacity-50 cursor-not-allowed border-gray-500 text-gray-500'
    : '';

  const baseClasses = `
    relative font-medium tracking-wider uppercase
    rounded-lg transition-all duration-300 touch-manipulation
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black
    focus:ring-cyan-400 active:scale-95 select-none
    ${sizeConfig}
    ${disabled ? disabledStyles : variantConfig.base}
    ${className}
  `.trim();

  // Accessibility props
  const accessibilityProps = getAriaProps({
    label: ariaLabel,
    describedBy: ariaDescribedBy,
    disabled: disabled,
  });

  const handleClick = enableSounds
    ? withClickSound(e => {
        if (disabled || !onClick) return;
        onClick(e);
      })
    : e => {
        if (disabled || !onClick) return;
        onClick(e);
      };

  const handleMouseEnter = enableSounds ? withHoverSound() : undefined;

  return (
    <motion.button
      type={type}
      className={baseClasses}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      disabled={disabled}
      whileHover={
        disabled || isTouchDevice || prefersReducedMotion
          ? {}
          : {
              scale: 1.02,
              transition: { duration: 0.2 },
            }
      }
      whileTap={
        disabled
          ? {}
          : {
              scale: 0.95,
              transition: { duration: 0.1 },
            }
      }
      initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: prefersReducedMotion ? 0.1 : 0.3 }}
      {...accessibilityProps}
      {...props}
    >
      {/* Background glow effect */}
      {!disabled && !prefersReducedMotion && (
        <motion.div
          className={`absolute inset-0 rounded-lg ${variantConfig.glow} opacity-0`}
          whileHover={
            !isTouchDevice
              ? {
                  opacity: 1,
                  className: `absolute inset-0 rounded-lg ${variantConfig.hoverGlow}`,
                }
              : {}
          }
          transition={{ duration: 0.3 }}
          aria-hidden="true"
        />
      )}

      {/* Animated border effect */}
      {!disabled && !prefersReducedMotion && (
        <motion.div
          className="absolute inset-0 rounded-lg border-2 border-transparent"
          whileHover={
            !isTouchDevice
              ? {
                  borderColor:
                    variant === 'primary'
                      ? '#00FFFF'
                      : variant === 'secondary'
                      ? '#A855F7'
                      : '#EF4444',
                  boxShadow: `0 0 20px ${
                    variant === 'primary'
                      ? 'rgba(0, 255, 255, 0.5)'
                      : variant === 'secondary'
                      ? 'rgba(168, 85, 247, 0.5)'
                      : 'rgba(239, 68, 68, 0.5)'
                  }`,
                }
              : {}
          }
          transition={{ duration: 0.3 }}
          aria-hidden="true"
        />
      )}

      {/* Button content */}
      <span className="relative z-10 flex items-center justify-center space-x-2">
        {children}
      </span>

      {/* Pulse effect on click */}
      <motion.div
        className="absolute inset-0 rounded-lg bg-current opacity-0"
        whileTap={
          disabled
            ? {}
            : {
                opacity: [0, 0.1, 0],
                scale: [1, 1.05, 1],
                transition: { duration: 0.2 },
              }
        }
        aria-hidden="true"
      />
    </motion.button>
  );
};

export default NeonButton;
