import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from 'react';

const SoundContext = createContext();

/**
 * Sound Context Provider for managing audio in the gaming portfolio
 */
export const SoundProvider = ({ children }) => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [musicVolume, setMusicVolume] = useState(0.2);

  // Audio references
  const audioRefs = useRef({});
  const musicRef = useRef(null);

  // Sound effects library
  const soundEffects = {
    click: '/sounds/click.mp3',
    hover: '/sounds/hover.mp3',
    success: '/sounds/success.mp3',
    error: '/sounds/error.mp3',
    notification: '/sounds/notification.mp3',
    typing: '/sounds/typing.mp3',
    glitch: '/sounds/glitch.mp3',
    powerUp: '/sounds/power-up.mp3',
    transition: '/sounds/transition.mp3',
  };

  // Background music tracks
  const musicTracks = {
    ambient: '/sounds/ambient-gaming.mp3',
    cyberpunk: '/sounds/cyberpunk-theme.mp3',
    synthwave: '/sounds/synthwave-bg.mp3',
  };

  // Load user preferences from localStorage
  useEffect(() => {
    const savedSoundEnabled = localStorage.getItem('soundEnabled');
    const savedMusicEnabled = localStorage.getItem('musicEnabled');
    const savedVolume = localStorage.getItem('soundVolume');
    const savedMusicVolume = localStorage.getItem('musicVolume');

    if (savedSoundEnabled !== null) {
      setSoundEnabled(JSON.parse(savedSoundEnabled));
    }
    if (savedMusicEnabled !== null) {
      setMusicEnabled(JSON.parse(savedMusicEnabled));
    }
    if (savedVolume !== null) {
      setVolume(parseFloat(savedVolume));
    }
    if (savedMusicVolume !== null) {
      setMusicVolume(parseFloat(savedMusicVolume));
    }
  }, []);

  // Save preferences to localStorage
  useEffect(() => {
    localStorage.setItem('soundEnabled', JSON.stringify(soundEnabled));
  }, [soundEnabled]);

  useEffect(() => {
    localStorage.setItem('musicEnabled', JSON.stringify(musicEnabled));
  }, [musicEnabled]);

  useEffect(() => {
    localStorage.setItem('soundVolume', volume.toString());
  }, [volume]);

  useEffect(() => {
    localStorage.setItem('musicVolume', musicVolume.toString());
  }, [musicVolume]);

  // Preload sound effects
  useEffect(() => {
    Object.entries(soundEffects).forEach(([key, src]) => {
      const audio = new Audio();
      audio.preload = 'none'; // Don't preload to avoid errors
      audio.volume = volume;

      // Test if file exists before setting src
      fetch(src, { method: 'HEAD' })
        .then(response => {
          if (response.ok) {
            audio.src = src;
            audio.preload = 'auto';
          }
        })
        .catch(() => {
          console.warn(`Sound file not found: ${src}`);
        });

      audio.addEventListener('error', () => {
        console.warn(`Sound file not found: ${src}`);
      });
      audioRefs.current[key] = audio;
    });

    return () => {
      // Cleanup audio references
      Object.values(audioRefs.current).forEach(audio => {
        if (audio) {
          audio.pause();
          audio.src = '';
        }
      });
    };
  }, [volume]);

  // Update volume for all sound effects
  useEffect(() => {
    Object.values(audioRefs.current).forEach(audio => {
      if (audio) {
        audio.volume = volume;
      }
    });
  }, [volume]);

  // Background music management
  useEffect(() => {
    if (musicEnabled && !musicRef.current) {
      const audio = new Audio();
      audio.src = musicTracks.ambient;
      audio.loop = true;
      audio.volume = musicVolume;
      audio.addEventListener('error', () => {
        console.warn('Background music file not found');
      });
      musicRef.current = audio;
    }

    if (musicRef.current) {
      musicRef.current.volume = musicVolume;

      if (musicEnabled) {
        musicRef.current.play().catch(error => {
          console.warn('Could not play background music:', error);
        });
      } else {
        musicRef.current.pause();
      }
    }

    return () => {
      if (musicRef.current) {
        musicRef.current.pause();
      }
    };
  }, [musicEnabled, musicVolume]);

  /**
   * Play a sound effect
   * @param {string} soundName - Name of the sound effect
   * @param {number} volumeOverride - Optional volume override (0-1)
   */
  const playSound = (soundName, volumeOverride = null) => {
    if (!soundEnabled) return;

    const audio = audioRefs.current[soundName];
    if (audio) {
      try {
        audio.currentTime = 0;
        if (volumeOverride !== null) {
          audio.volume = Math.min(1, Math.max(0, volumeOverride));
        }
        audio.play().catch(error => {
          console.warn(`Could not play sound ${soundName}:`, error);
        });
      } catch (error) {
        console.warn(`Error playing sound ${soundName}:`, error);
      }
    }
  };

  /**
   * Generate a simple beep sound programmatically
   * @param {number} frequency - Frequency in Hz
   * @param {number} duration - Duration in milliseconds
   */
  const playBeep = (frequency = 800, duration = 100) => {
    if (!soundEnabled) return;

    try {
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(volume * 0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + duration / 1000
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration / 1000);
    } catch (error) {
      console.warn('Could not generate beep sound:', error);
    }
  };

  /**
   * Toggle sound effects on/off
   */
  const toggleSound = () => {
    setSoundEnabled(prev => !prev);
  };

  /**
   * Toggle background music on/off
   */
  const toggleMusic = () => {
    setMusicEnabled(prev => !prev);
  };

  /**
   * Set sound effects volume
   * @param {number} newVolume - Volume level (0-1)
   */
  const setSoundVolume = newVolume => {
    const clampedVolume = Math.min(1, Math.max(0, newVolume));
    setVolume(clampedVolume);
  };

  /**
   * Set background music volume
   * @param {number} newVolume - Volume level (0-1)
   */
  const setBackgroundMusicVolume = newVolume => {
    const clampedVolume = Math.min(1, Math.max(0, newVolume));
    setMusicVolume(clampedVolume);
  };

  const contextValue = {
    // State
    soundEnabled,
    musicEnabled,
    volume,
    musicVolume,

    // Actions
    playSound,
    playBeep,
    toggleSound,
    toggleMusic,
    setSoundVolume,
    setBackgroundMusicVolume,

    // Sound effects available
    availableSounds: Object.keys(soundEffects),
  };

  return (
    <SoundContext.Provider value={contextValue}>
      {children}
    </SoundContext.Provider>
  );
};

/**
 * Hook to use sound context
 */
export const useSound = () => {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
};

/**
 * Hook for common sound interactions
 */
export const useSoundEffects = () => {
  const { playSound, playBeep, soundEnabled } = useSound();

  return {
    playClick: () => playSound('click'),
    playHover: () => playSound('hover'),
    playSuccess: () => playSound('success'),
    playError: () => playSound('error'),
    playNotification: () => playSound('notification'),
    playTyping: () => playSound('typing'),
    playGlitch: () => playSound('glitch'),
    playPowerUp: () => playSound('powerUp'),
    playTransition: () => playSound('transition'),
    playBeep: (frequency, duration) => playBeep(frequency, duration),
    soundEnabled,
  };
};
