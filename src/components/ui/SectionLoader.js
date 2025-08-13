import React from 'react';
import { motion } from 'framer-motion';
import LoadingSpinner from './LoadingSpinner';

const SectionLoader = ({
  loading,
  error,
  children,
  sectionName = 'Section',
  minHeight = 'min-h-[400px]',
  showRetry = true,
  onRetry = null,
}) => {
  if (loading) {
    return (
      <motion.div
        className={`${minHeight} flex items-center justify-center bg-gray-900/50 rounded-lg border border-gray-700`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <LoadingSpinner
          size="large"
          text={`Loading ${sectionName}...`}
          showText={true}
        />
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        className={`${minHeight} flex items-center justify-center bg-red-900/20 rounded-lg border border-red-500/30`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="text-center space-y-4">
          <div className="text-red-400 text-6xl">⚠️</div>
          <div className="text-red-400 text-lg font-semibold">
            Failed to load {sectionName}
          </div>
          <div className="text-red-300 text-sm max-w-md">
            {error.message || 'An unexpected error occurred'}
          </div>
          {showRetry && onRetry && (
            <motion.button
              onClick={onRetry}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-medium transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🔄 Retry
            </motion.button>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
};

export default SectionLoader;
