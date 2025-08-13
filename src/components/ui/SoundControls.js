import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSound } from '../../contexts/SoundContext';

/**
 * Sound Controls Component - Gaming-themed audio controls
 */
const SoundControls = ({ className = '', showLabels = true }) => {
  const {
    soundEnabled,
    musicEnabled,
    volume,
    musicVolume,
    toggleSound,
    toggleMusic,
    setSoundVolume,
    setBackgroundMusicVolume,
  } = useSound();

  const [showPanel, setShowPanel] = useState(false);

  const handleSoundToggle = () => {
    toggleSound();
  };

  const handleMusicToggle = () => {
    toggleMusic();
  };

  const handleVolumeChange = e => {
    setSoundVolume(parseFloat(e.target.value));
  };

  const handleMusicVolumeChange = e => {
    setBackgroundMusicVolume(parseFloat(e.target.value));
  };

  return (
    <div className={`relative ${className}`}>
      {/* Main Control Button */}
      <motion.button
        onClick={() => setShowPanel(!showPanel)}
        className="p-3 bg-gray-800 border border-cyan-500 rounded-lg text-cyan-400 hover:bg-gray-700 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title="Audio Controls"
        aria-label="Toggle audio controls panel"
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">
            {soundEnabled || musicEnabled ? '🔊' : '🔇'}
          </span>
          {showLabels && <span className="text-sm font-medium">Audio</span>}
        </div>
      </motion.button>

      {/* Control Panel */}
      <AnimatePresence>
        {showPanel && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-2 p-4 bg-gray-800 border border-cyan-500/30 rounded-lg shadow-lg min-w-64 z-50"
          >
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h3 className="text-cyan-400 font-bold text-sm">
                  AUDIO CONTROLS
                </h3>
                <button
                  onClick={() => setShowPanel(false)}
                  className="text-gray-400 hover:text-white text-sm"
                  aria-label="Close audio controls"
                >
                  ✕
                </button>
              </div>

              {/* Sound Effects Toggle */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-gray-300 text-sm font-medium">
                    Sound Effects
                  </label>
                  <motion.button
                    onClick={handleSoundToggle}
                    className={`
                      relative w-12 h-6 rounded-full transition-colors duration-200
                      ${soundEnabled ? 'bg-cyan-500' : 'bg-gray-600'}
                    `}
                    whileTap={{ scale: 0.95 }}
                    aria-label={`${
                      soundEnabled ? 'Disable' : 'Enable'
                    } sound effects`}
                  >
                    <motion.div
                      className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md"
                      animate={{
                        x: soundEnabled ? 26 : 2,
                      }}
                      transition={{
                        type: 'spring',
                        stiffness: 500,
                        damping: 30,
                      }}
                    />
                  </motion.button>
                </div>

                {/* Sound Volume Slider */}
                {soundEnabled && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-1"
                  >
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>Volume</span>
                      <span>{Math.round(volume * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={volume}
                      onChange={handleVolumeChange}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-cyan"
                      aria-label="Sound effects volume"
                    />
                  </motion.div>
                )}
              </div>

              {/* Background Music Toggle */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-gray-300 text-sm font-medium">
                    Background Music
                  </label>
                  <motion.button
                    onClick={handleMusicToggle}
                    className={`
                      relative w-12 h-6 rounded-full transition-colors duration-200
                      ${musicEnabled ? 'bg-purple-500' : 'bg-gray-600'}
                    `}
                    whileTap={{ scale: 0.95 }}
                    aria-label={`${
                      musicEnabled ? 'Disable' : 'Enable'
                    } background music`}
                  >
                    <motion.div
                      className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md"
                      animate={{
                        x: musicEnabled ? 26 : 2,
                      }}
                      transition={{
                        type: 'spring',
                        stiffness: 500,
                        damping: 30,
                      }}
                    />
                  </motion.button>
                </div>

                {/* Music Volume Slider */}
                {musicEnabled && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-1"
                  >
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>Volume</span>
                      <span>{Math.round(musicVolume * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={musicVolume}
                      onChange={handleMusicVolumeChange}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-purple"
                      aria-label="Background music volume"
                    />
                  </motion.div>
                )}
              </div>

              {/* Status Indicators */}
              <div className="pt-2 border-t border-gray-700">
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>Status:</span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`flex items-center gap-1 ${
                        soundEnabled ? 'text-cyan-400' : 'text-gray-500'
                      }`}
                    >
                      🔊 SFX
                    </span>
                    <span
                      className={`flex items-center gap-1 ${
                        musicEnabled ? 'text-purple-400' : 'text-gray-500'
                      }`}
                    >
                      🎵 Music
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Slider Styles */}
      <style jsx>{`
        .slider-cyan::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #00ffff;
          cursor: pointer;
          box-shadow: 0 0 8px rgba(0, 255, 255, 0.5);
        }

        .slider-cyan::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #00ffff;
          cursor: pointer;
          border: none;
          box-shadow: 0 0 8px rgba(0, 255, 255, 0.5);
        }

        .slider-purple::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #a855f7;
          cursor: pointer;
          box-shadow: 0 0 8px rgba(168, 85, 247, 0.5);
        }

        .slider-purple::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #a855f7;
          cursor: pointer;
          border: none;
          box-shadow: 0 0 8px rgba(168, 85, 247, 0.5);
        }
      `}</style>
    </div>
  );
};

/**
 * Simple Sound Toggle Button
 */
export const SoundToggle = ({ className = '' }) => {
  const { soundEnabled, toggleSound } = useSound();

  return (
    <motion.button
      onClick={toggleSound}
      className={`p-2 bg-gray-800 border border-cyan-500 rounded-lg text-cyan-400 hover:bg-gray-700 transition-colors ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      title={`${soundEnabled ? 'Disable' : 'Enable'} sound effects`}
      aria-label={`${soundEnabled ? 'Disable' : 'Enable'} sound effects`}
    >
      <span className="text-lg">{soundEnabled ? '🔊' : '🔇'}</span>
    </motion.button>
  );
};

/**
 * Music Toggle Button
 */
export const MusicToggle = ({ className = '' }) => {
  const { musicEnabled, toggleMusic } = useSound();

  return (
    <motion.button
      onClick={toggleMusic}
      className={`p-2 bg-gray-800 border border-purple-500 rounded-lg text-purple-400 hover:bg-gray-700 transition-colors ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      title={`${musicEnabled ? 'Disable' : 'Enable'} background music`}
      aria-label={`${musicEnabled ? 'Disable' : 'Enable'} background music`}
    >
      <span className="text-lg">{musicEnabled ? '🎵' : '🎵'}</span>
    </motion.button>
  );
};

export default SoundControls;
