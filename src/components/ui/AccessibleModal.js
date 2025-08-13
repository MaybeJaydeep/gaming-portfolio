import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAccessibilityContext } from '../../contexts/AccessibilityContext';

const AccessibleModal = ({
  isOpen,
  onClose,
  title,
  children,
  className = '',
  closeOnEscape = true,
  closeOnOverlayClick = true,
  initialFocus = null,
  ...props
}) => {
  const modalRef = useRef(null);
  const previousFocusRef = useRef(null);
  const { createFocusTrap, announce, reducedMotion } =
    useAccessibilityContext();

  useEffect(() => {
    if (isOpen) {
      // Store the previously focused element
      previousFocusRef.current = document.activeElement;

      // Announce modal opening
      announce(`${title} dialog opened`, 'assertive');

      // Create focus trap
      const cleanup = createFocusTrap(modalRef);

      // Prevent body scroll
      document.body.style.overflow = 'hidden';

      return () => {
        if (cleanup) cleanup();
        document.body.style.overflow = '';
      };
    }
  }, [isOpen, createFocusTrap, announce, title]);

  useEffect(() => {
    if (!isOpen && previousFocusRef.current) {
      // Return focus to previously focused element
      previousFocusRef.current.focus();
      announce(`${title} dialog closed`, 'assertive');
    }
  }, [isOpen, announce, title]);

  useEffect(() => {
    const handleKeyDown = e => {
      if (!isOpen) return;

      if (e.key === 'Escape' && closeOnEscape) {
        e.preventDefault();
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeOnEscape, onClose]);

  const handleOverlayClick = e => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={reducedMotion ? { opacity: 0 } : { opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: reducedMotion ? 0.1 : 0.3 }}
        onClick={handleOverlayClick}
        aria-hidden="true"
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          initial={
            reducedMotion
              ? { opacity: 0 }
              : { opacity: 0, backdropFilter: 'blur(0px)' }
          }
          animate={{ opacity: 1, backdropFilter: 'blur(4px)' }}
          exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          transition={{ duration: reducedMotion ? 0.1 : 0.3 }}
        />

        {/* Modal */}
        <motion.div
          ref={modalRef}
          className={`
            relative bg-gray-900 border border-cyan-500 rounded-lg shadow-2xl
            max-w-4xl w-full max-h-[90vh] overflow-y-auto
            focus:outline-none
            ${className}
          `}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
          initial={
            reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: 20 }
          }
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={
            reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: 20 }
          }
          transition={{
            duration: reducedMotion ? 0.1 : 0.3,
            type: reducedMotion ? 'tween' : 'spring',
            stiffness: 300,
            damping: 30,
          }}
          {...props}
        >
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-700">
            <h2 id="modal-title" className="text-xl font-bold text-cyan-400">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="
                text-gray-400 hover:text-white transition-colors
                p-2 rounded-lg hover:bg-gray-800
                focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-gray-900
              "
              aria-label="Close dialog"
              data-close
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div id="modal-description" className="p-6">
            {children}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AccessibleModal;
