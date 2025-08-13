import { useCallback } from 'react';
import { useSoundEffects } from '../contexts/SoundContext';

/**
 * Hook for adding sound effects to component interactions
 */
export const useSoundInteractions = () => {
  const {
    playClick,
    playHover,
    playSuccess,
    playError,
    playNotification,
    playTyping,
    playGlitch,
    playPowerUp,
    playTransition,
    playBeep,
    soundEnabled,
  } = useSoundEffects();

  // Enhanced event handlers with sound effects
  const withClickSound = useCallback(
    (handler, soundType = 'click') => {
      return event => {
        if (soundEnabled) {
          switch (soundType) {
            case 'click':
              playClick();
              break;
            case 'success':
              playSuccess();
              break;
            case 'error':
              playError();
              break;
            case 'powerUp':
              playPowerUp();
              break;
            default:
              playClick();
          }
        }

        if (handler) {
          handler(event);
        }
      };
    },
    [soundEnabled, playClick, playSuccess, playError, playPowerUp]
  );

  const withHoverSound = useCallback(
    handler => {
      return event => {
        if (soundEnabled) {
          playHover();
        }

        if (handler) {
          handler(event);
        }
      };
    },
    [soundEnabled, playHover]
  );

  const withTypingSound = useCallback(
    handler => {
      return event => {
        if (soundEnabled) {
          playTyping();
        }

        if (handler) {
          handler(event);
        }
      };
    },
    [soundEnabled, playTyping]
  );

  // Specialized sound effects for different UI interactions
  const navigationSound = useCallback(() => {
    if (soundEnabled) {
      playTransition();
    }
  }, [soundEnabled, playTransition]);

  const formSubmitSound = useCallback(
    (isSuccess = true) => {
      if (soundEnabled) {
        if (isSuccess) {
          playSuccess();
        } else {
          playError();
        }
      }
    },
    [soundEnabled, playSuccess, playError]
  );

  const notificationSound = useCallback(() => {
    if (soundEnabled) {
      playNotification();
    }
  }, [soundEnabled, playNotification]);

  const glitchSound = useCallback(() => {
    if (soundEnabled) {
      playGlitch();
    }
  }, [soundEnabled, playGlitch]);

  const achievementSound = useCallback(() => {
    if (soundEnabled) {
      playPowerUp();
    }
  }, [soundEnabled, playPowerUp]);

  // Beep variations for different UI states
  const successBeep = useCallback(() => {
    if (soundEnabled) {
      playBeep(800, 150); // Higher pitch, longer duration
    }
  }, [soundEnabled, playBeep]);

  const errorBeep = useCallback(() => {
    if (soundEnabled) {
      playBeep(400, 300); // Lower pitch, longer duration
    }
  }, [soundEnabled, playBeep]);

  const warningBeep = useCallback(() => {
    if (soundEnabled) {
      playBeep(600, 100); // Medium pitch, short duration
    }
  }, [soundEnabled, playBeep]);

  // Gaming-specific sound patterns
  const levelUpSound = useCallback(() => {
    if (soundEnabled) {
      // Play a sequence of ascending beeps
      playBeep(523, 100); // C5
      setTimeout(() => playBeep(659, 100), 100); // E5
      setTimeout(() => playBeep(784, 200), 200); // G5
    }
  }, [soundEnabled, playBeep]);

  const gameOverSound = useCallback(() => {
    if (soundEnabled) {
      // Play a descending sequence
      playBeep(400, 150);
      setTimeout(() => playBeep(350, 150), 150);
      setTimeout(() => playBeep(300, 300), 300);
    }
  }, [soundEnabled, playBeep]);

  const coinSound = useCallback(() => {
    if (soundEnabled) {
      playBeep(1000, 50);
      setTimeout(() => playBeep(1200, 50), 50);
    }
  }, [soundEnabled, playBeep]);

  return {
    // Enhanced event handlers
    withClickSound,
    withHoverSound,
    withTypingSound,

    // Specialized sounds
    navigationSound,
    formSubmitSound,
    notificationSound,
    glitchSound,
    achievementSound,

    // Beep variations
    successBeep,
    errorBeep,
    warningBeep,

    // Gaming sounds
    levelUpSound,
    gameOverSound,
    coinSound,

    // Direct access to sound effects
    playClick,
    playHover,
    playSuccess,
    playError,
    playNotification,
    playTyping,
    playGlitch,
    playPowerUp,
    playTransition,
    playBeep,

    // State
    soundEnabled,
  };
};

/**
 * Hook for form interactions with sound feedback
 */
export const useSoundForm = () => {
  const { formSubmitSound, withTypingSound, errorBeep, successBeep } =
    useSoundInteractions();

  const handleFormSubmit = useCallback(
    (handler, isAsync = false) => {
      return async event => {
        try {
          let result;
          if (isAsync) {
            result = await handler(event);
          } else {
            result = handler(event);
          }

          // Assume success if no error thrown
          formSubmitSound(true);
          return result;
        } catch (error) {
          formSubmitSound(false);
          throw error;
        }
      };
    },
    [formSubmitSound]
  );

  const handleFieldValidation = useCallback(
    isValid => {
      if (isValid) {
        successBeep();
      } else {
        errorBeep();
      }
    },
    [successBeep, errorBeep]
  );

  return {
    handleFormSubmit,
    handleFieldValidation,
    withTypingSound,
  };
};

/**
 * Hook for navigation interactions with sound feedback
 */
export const useSoundNavigation = () => {
  const { navigationSound, withClickSound } = useSoundInteractions();

  const handleNavigation = useCallback(
    handler => {
      return event => {
        navigationSound();
        if (handler) {
          handler(event);
        }
      };
    },
    [navigationSound]
  );

  const handleMenuClick = useCallback(
    handler => {
      return withClickSound(handler, 'click');
    },
    [withClickSound]
  );

  return {
    handleNavigation,
    handleMenuClick,
    navigationSound,
  };
};

export default useSoundInteractions;
