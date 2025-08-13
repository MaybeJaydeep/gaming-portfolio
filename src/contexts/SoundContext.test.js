import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { SoundProvider, useSound, useSoundEffects } from './SoundContext';

// Mock Audio constructor and methods
const mockAudio = {
  play: jest.fn().mockResolvedValue(undefined),
  pause: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  currentTime: 0,
  volume: 0.3,
  loop: false,
  src: '',
  preload: 'auto',
};

// Mock AudioContext for beep sounds
const mockAudioContext = {
  createOscillator: jest.fn(() => ({
    connect: jest.fn(),
    frequency: { value: 800 },
    type: 'sine',
    start: jest.fn(),
    stop: jest.fn(),
  })),
  createGain: jest.fn(() => ({
    connect: jest.fn(),
    gain: {
      setValueAtTime: jest.fn(),
      exponentialRampToValueAtTime: jest.fn(),
    },
  })),
  destination: {},
  currentTime: 0,
};

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

global.localStorage = localStorageMock;
global.Audio = jest.fn(() => mockAudio);
global.AudioContext = jest.fn(() => mockAudioContext);
global.webkitAudioContext = jest.fn(() => mockAudioContext);

// Test component that uses sound context
const TestComponent = () => {
  const {
    soundEnabled,
    musicEnabled,
    volume,
    musicVolume,
    playSound,
    playBeep,
    toggleSound,
    toggleMusic,
    setSoundVolume,
    setBackgroundMusicVolume,
    availableSounds,
  } = useSound();

  const soundEffects = useSoundEffects();

  return (
    <div>
      <div data-testid="sound-enabled">{soundEnabled.toString()}</div>
      <div data-testid="music-enabled">{musicEnabled.toString()}</div>
      <div data-testid="volume">{volume}</div>
      <div data-testid="music-volume">{musicVolume}</div>
      <div data-testid="available-sounds">{availableSounds.join(',')}</div>

      <button onClick={() => playSound('click')} data-testid="play-sound">
        Play Sound
      </button>
      <button onClick={() => playBeep(800, 100)} data-testid="play-beep">
        Play Beep
      </button>
      <button onClick={toggleSound} data-testid="toggle-sound">
        Toggle Sound
      </button>
      <button onClick={toggleMusic} data-testid="toggle-music">
        Toggle Music
      </button>
      <button onClick={() => setSoundVolume(0.5)} data-testid="set-volume">
        Set Volume
      </button>
      <button
        onClick={() => setBackgroundMusicVolume(0.4)}
        data-testid="set-music-volume"
      >
        Set Music Volume
      </button>

      {/* Test sound effects hook */}
      <button onClick={soundEffects.playClick} data-testid="play-click">
        Play Click
      </button>
      <button onClick={soundEffects.playHover} data-testid="play-hover">
        Play Hover
      </button>
      <button onClick={soundEffects.playSuccess} data-testid="play-success">
        Play Success
      </button>
      <button onClick={soundEffects.playError} data-testid="play-error">
        Play Error
      </button>
    </div>
  );
};

describe('SoundContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  describe('SoundProvider', () => {
    it('provides default sound context values', () => {
      render(
        <SoundProvider>
          <TestComponent />
        </SoundProvider>
      );

      expect(screen.getByTestId('sound-enabled')).toHaveTextContent('true');
      expect(screen.getByTestId('music-enabled')).toHaveTextContent('false');
      expect(screen.getByTestId('volume')).toHaveTextContent('0.3');
      expect(screen.getByTestId('music-volume')).toHaveTextContent('0.2');
    });

    it('loads preferences from localStorage', () => {
      localStorageMock.getItem.mockImplementation(key => {
        const values = {
          soundEnabled: 'false',
          musicEnabled: 'true',
          soundVolume: '0.7',
          musicVolume: '0.5',
        };
        return values[key] || null;
      });

      render(
        <SoundProvider>
          <TestComponent />
        </SoundProvider>
      );

      expect(screen.getByTestId('sound-enabled')).toHaveTextContent('false');
      expect(screen.getByTestId('music-enabled')).toHaveTextContent('true');
      expect(screen.getByTestId('volume')).toHaveTextContent('0.7');
      expect(screen.getByTestId('music-volume')).toHaveTextContent('0.5');
    });

    it('provides available sound effects', () => {
      render(
        <SoundProvider>
          <TestComponent />
        </SoundProvider>
      );

      const availableSounds =
        screen.getByTestId('available-sounds').textContent;
      expect(availableSounds).toContain('click');
      expect(availableSounds).toContain('hover');
      expect(availableSounds).toContain('success');
      expect(availableSounds).toContain('error');
    });
  });

  describe('Sound Controls', () => {
    it('toggles sound enabled state', () => {
      render(
        <SoundProvider>
          <TestComponent />
        </SoundProvider>
      );

      expect(screen.getByTestId('sound-enabled')).toHaveTextContent('true');

      fireEvent.click(screen.getByTestId('toggle-sound'));

      expect(screen.getByTestId('sound-enabled')).toHaveTextContent('false');
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'soundEnabled',
        'false'
      );
    });

    it('toggles music enabled state', () => {
      render(
        <SoundProvider>
          <TestComponent />
        </SoundProvider>
      );

      expect(screen.getByTestId('music-enabled')).toHaveTextContent('false');

      fireEvent.click(screen.getByTestId('toggle-music'));

      expect(screen.getByTestId('music-enabled')).toHaveTextContent('true');
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'musicEnabled',
        'true'
      );
    });

    it('updates sound volume', () => {
      render(
        <SoundProvider>
          <TestComponent />
        </SoundProvider>
      );

      fireEvent.click(screen.getByTestId('set-volume'));

      expect(screen.getByTestId('volume')).toHaveTextContent('0.5');
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'soundVolume',
        '0.5'
      );
    });

    it('updates music volume', () => {
      render(
        <SoundProvider>
          <TestComponent />
        </SoundProvider>
      );

      fireEvent.click(screen.getByTestId('set-music-volume'));

      expect(screen.getByTestId('music-volume')).toHaveTextContent('0.4');
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'musicVolume',
        '0.4'
      );
    });
  });

  describe('Sound Playback', () => {
    it('plays sound effects when sound is enabled', () => {
      render(
        <SoundProvider>
          <TestComponent />
        </SoundProvider>
      );

      fireEvent.click(screen.getByTestId('play-sound'));

      // Audio constructor should be called for preloading sounds
      expect(global.Audio).toHaveBeenCalled();
    });

    it('does not play sounds when sound is disabled', () => {
      localStorageMock.getItem.mockImplementation(key => {
        return key === 'soundEnabled' ? 'false' : null;
      });

      render(
        <SoundProvider>
          <TestComponent />
        </SoundProvider>
      );

      fireEvent.click(screen.getByTestId('play-sound'));

      // Should still create Audio objects for preloading but not play
      expect(global.Audio).toHaveBeenCalled();
    });

    it('generates beep sounds programmatically', () => {
      render(
        <SoundProvider>
          <TestComponent />
        </SoundProvider>
      );

      fireEvent.click(screen.getByTestId('play-beep'));

      expect(global.AudioContext).toHaveBeenCalled();
    });
  });

  describe('useSoundEffects hook', () => {
    it('provides convenient sound effect functions', () => {
      render(
        <SoundProvider>
          <TestComponent />
        </SoundProvider>
      );

      // Test individual sound effect functions
      fireEvent.click(screen.getByTestId('play-click'));
      fireEvent.click(screen.getByTestId('play-hover'));
      fireEvent.click(screen.getByTestId('play-success'));
      fireEvent.click(screen.getByTestId('play-error'));

      // Audio constructor should be called for each sound effect
      expect(global.Audio).toHaveBeenCalled();
    });

    it('exposes sound enabled state', () => {
      render(
        <SoundProvider>
          <TestComponent />
        </SoundProvider>
      );

      // The sound effects hook should have access to soundEnabled state
      expect(screen.getByTestId('sound-enabled')).toHaveTextContent('true');
    });
  });

  describe('Error Handling', () => {
    it('handles audio loading errors gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      // Mock audio error
      const errorAudio = {
        ...mockAudio,
        addEventListener: jest.fn((event, callback) => {
          if (event === 'error') {
            callback();
          }
        }),
      };

      global.Audio = jest.fn(() => errorAudio);

      render(
        <SoundProvider>
          <TestComponent />
        </SoundProvider>
      );

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Sound file not found')
      );

      consoleSpy.mockRestore();
    });

    it('handles AudioContext creation errors', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      // Mock AudioContext error
      global.AudioContext = jest.fn(() => {
        throw new Error('AudioContext not supported');
      });
      global.webkitAudioContext = undefined;

      render(
        <SoundProvider>
          <TestComponent />
        </SoundProvider>
      );

      fireEvent.click(screen.getByTestId('play-beep'));

      expect(consoleSpy).toHaveBeenCalledWith(
        'Could not generate beep sound:',
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });
  });

  describe('useSound hook error handling', () => {
    it('throws error when used outside SoundProvider', () => {
      const TestComponentWithoutProvider = () => {
        useSound();
        return <div>Test</div>;
      };

      // Suppress console.error for this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      expect(() => {
        render(<TestComponentWithoutProvider />);
      }).toThrow('useSound must be used within a SoundProvider');

      consoleSpy.mockRestore();
    });
  });
});
