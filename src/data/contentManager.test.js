// Tests for content management system
import contentManager from './contentManager';
import { userProfile, skills, projectsData, gamingData } from './index';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

describe('ContentManager', () => {
  beforeEach(() => {
    // Clear localStorage mocks
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
    localStorageMock.clear.mockClear();

    // Clear cache
    contentManager.clearCache();
  });

  describe('Data Fetching', () => {
    test('getAllData returns complete data structure', () => {
      const data = contentManager.getAllData();

      expect(data).toHaveProperty('userProfile');
      expect(data).toHaveProperty('skills');
      expect(data).toHaveProperty('skillCategories');
      expect(data).toHaveProperty('projectsData');
      expect(data).toHaveProperty('gamingData');
      expect(data).toHaveProperty('lastUpdated');
      expect(typeof data.lastUpdated).toBe('string');
    });

    test('getAllData uses cache when enabled', () => {
      const data1 = contentManager.getAllData(true);
      const data2 = contentManager.getAllData(true);

      // Should return the same object reference when cached
      expect(data1).toBe(data2);
    });

    test('getAllData bypasses cache when disabled', () => {
      const data1 = contentManager.getAllData(false);
      const data2 = contentManager.getAllData(false);

      // Should return different object references when not cached
      expect(data1).not.toBe(data2);
      expect(data1.lastUpdated).not.toBe(data2.lastUpdated);
    });

    test('getUserProfile returns user profile data', () => {
      const profile = contentManager.getUserProfile();

      expect(profile).toEqual(userProfile);
      expect(profile).not.toBe(userProfile); // Should be a copy
    });
  });

  describe('Skills Filtering', () => {
    test('getSkills returns all skills without filters', () => {
      const result = contentManager.getSkills();

      expect(result).toHaveLength(skills.length);
      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('name');
      expect(result[0]).toHaveProperty('category');
    });

    test('getSkills filters by category', () => {
      const frontendSkills = contentManager.getSkills({ category: 'frontend' });

      expect(frontendSkills.length).toBeGreaterThan(0);
      frontendSkills.forEach(skill => {
        expect(skill.category).toBe('frontend');
      });
    });

    test('getSkills filters by minimum proficiency', () => {
      const highProficiencySkills = contentManager.getSkills({
        minProficiency: 90,
      });

      highProficiencySkills.forEach(skill => {
        expect(skill.proficiency).toBeGreaterThanOrEqual(90);
      });
    });

    test('getSkills filters by level', () => {
      const expertSkills = contentManager.getSkills({ level: 'Expert' });

      expertSkills.forEach(skill => {
        expect(skill.level).toBe('Expert');
      });
    });

    test('getSkills filters by unlocked status', () => {
      const unlockedSkills = contentManager.getSkills({ unlocked: true });

      unlockedSkills.forEach(skill => {
        expect(skill.unlocked).toBe(true);
      });
    });

    test('getSkills searches by name and description', () => {
      const reactSkills = contentManager.getSkills({ search: 'react' });

      expect(reactSkills.length).toBeGreaterThan(0);
      reactSkills.forEach(skill => {
        const searchTerm = 'react';
        const matchesName = skill.name.toLowerCase().includes(searchTerm);
        const matchesDescription =
          skill.description &&
          skill.description.toLowerCase().includes(searchTerm);
        expect(matchesName || matchesDescription).toBe(true);
      });
    });

    test('getSkills combines multiple filters', () => {
      const filteredSkills = contentManager.getSkills({
        category: 'frontend',
        minProficiency: 80,
        unlocked: true,
      });

      filteredSkills.forEach(skill => {
        expect(skill.category).toBe('frontend');
        expect(skill.proficiency).toBeGreaterThanOrEqual(80);
        expect(skill.unlocked).toBe(true);
      });
    });
  });

  describe('Projects Filtering and Sorting', () => {
    test('getProjects returns all projects without filters', () => {
      const result = contentManager.getProjects();

      expect(result).toHaveLength(projectsData.projects.length);
      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('title');
      expect(result[0]).toHaveProperty('category');
    });

    test('getProjects filters by category', () => {
      const webProjects = contentManager.getProjects({
        category: 'web-development',
      });

      webProjects.forEach(project => {
        expect(project.category).toBe('web-development');
      });
    });

    test('getProjects filters by status', () => {
      const completedProjects = contentManager.getProjects({
        status: 'completed',
      });

      completedProjects.forEach(project => {
        expect(project.status).toBe('completed');
      });
    });

    test('getProjects filters by difficulty', () => {
      const epicProjects = contentManager.getProjects({ difficulty: 'Epic' });

      epicProjects.forEach(project => {
        expect(project.difficulty).toBe('Epic');
      });
    });

    test('getProjects filters by technology', () => {
      const reactProjects = contentManager.getProjects({ technology: 'React' });

      reactProjects.forEach(project => {
        expect(
          project.technologies.some(tech =>
            tech.toLowerCase().includes('react')
          )
        ).toBe(true);
      });
    });

    test('getProjects searches by title and description', () => {
      const searchResults = contentManager.getProjects({ search: 'platform' });

      searchResults.forEach(project => {
        const searchTerm = 'platform';
        const matchesTitle = project.title.toLowerCase().includes(searchTerm);
        const matchesDescription = project.description
          .toLowerCase()
          .includes(searchTerm);
        const matchesLongDescription = project.longDescription
          .toLowerCase()
          .includes(searchTerm);
        expect(
          matchesTitle || matchesDescription || matchesLongDescription
        ).toBe(true);
      });
    });

    test('getProjects limits results', () => {
      const limitedResults = contentManager.getProjects({ limit: 2 });

      expect(limitedResults).toHaveLength(2);
    });

    test('getProjects sorts by title', () => {
      const sortedProjects = contentManager.getProjects({
        sortBy: 'title',
        sortOrder: 'asc',
      });

      for (let i = 1; i < sortedProjects.length; i++) {
        expect(sortedProjects[i].title.toLowerCase()).toBeGreaterThanOrEqual(
          sortedProjects[i - 1].title.toLowerCase()
        );
      }
    });

    test('getProjects sorts by XP', () => {
      const sortedProjects = contentManager.getProjects({
        sortBy: 'xp',
        sortOrder: 'desc',
      });

      for (let i = 1; i < sortedProjects.length; i++) {
        const currentXP = sortedProjects[i].rewards?.xp || 0;
        const previousXP = sortedProjects[i - 1].rewards?.xp || 0;
        expect(currentXP).toBeLessThanOrEqual(previousXP);
      }
    });
  });

  describe('Gaming Data Filtering', () => {
    test('getGamingData returns complete gaming data', () => {
      const data = contentManager.getGamingData();

      expect(data).toHaveProperty('gamingProfile');
      expect(data).toHaveProperty('tournaments');
      expect(data).toHaveProperty('achievements');
      expect(data).toHaveProperty('interests');
    });

    test('getGamingData filters tournaments by achievement', () => {
      const goldTournaments = contentManager.getGamingData({
        achievement: 'gold',
      });

      goldTournaments.tournaments.forEach(tournament => {
        expect(tournament.achievement).toBe('gold');
      });
    });

    test('getGamingData filters tournaments by game', () => {
      const csgoTournaments = contentManager.getGamingData({
        game: 'Counter-Strike',
      });

      csgoTournaments.tournaments.forEach(tournament => {
        expect(tournament.game.toLowerCase()).toContain('counter-strike');
      });
    });

    test('getGamingData filters tournaments by date range', () => {
      const recentTournaments = contentManager.getGamingData({
        dateFrom: '2023-01-01',
        dateTo: '2023-12-31',
      });

      recentTournaments.tournaments.forEach(tournament => {
        const tournamentDate = new Date(tournament.date);
        expect(tournamentDate.getFullYear()).toBe(2023);
      });
    });
  });

  describe('Sorting Utilities', () => {
    test('sortSkills sorts by name', () => {
      const testSkills = skills.slice(0, 5);
      const sorted = contentManager.sortSkills(testSkills, 'name', 'asc');

      for (let i = 1; i < sorted.length; i++) {
        expect(sorted[i].name.toLowerCase()).toBeGreaterThanOrEqual(
          sorted[i - 1].name.toLowerCase()
        );
      }
    });

    test('sortSkills sorts by proficiency', () => {
      const testSkills = skills.slice(0, 5);
      const sorted = contentManager.sortSkills(
        testSkills,
        'proficiency',
        'desc'
      );

      for (let i = 1; i < sorted.length; i++) {
        expect(sorted[i].proficiency).toBeLessThanOrEqual(
          sorted[i - 1].proficiency
        );
      }
    });

    test('sortProjects sorts by difficulty', () => {
      const testProjects = projectsData.projects.slice(0, 3);
      const sorted = contentManager.sortProjects(
        testProjects,
        'difficulty',
        'asc'
      );

      const difficultyOrder = { Common: 1, Rare: 2, Epic: 3, Legendary: 4 };
      for (let i = 1; i < sorted.length; i++) {
        const currentDifficulty = difficultyOrder[sorted[i].difficulty] || 0;
        const previousDifficulty =
          difficultyOrder[sorted[i - 1].difficulty] || 0;
        expect(currentDifficulty).toBeGreaterThanOrEqual(previousDifficulty);
      }
    });
  });

  describe('User Preferences', () => {
    test('loadPreferences returns default preferences when localStorage is empty', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const preferences = contentManager.loadPreferences();
      const defaults = contentManager.getDefaultPreferences();

      expect(preferences).toEqual(defaults);
    });

    test('loadPreferences loads stored preferences', () => {
      const storedPreferences = { theme: 'light', soundEnabled: false };
      localStorageMock.getItem.mockReturnValue(
        JSON.stringify(storedPreferences)
      );

      const preferences = contentManager.loadPreferences();

      expect(preferences.theme).toBe('light');
      expect(preferences.soundEnabled).toBe(false);
    });

    test('savePreferences stores preferences in localStorage', () => {
      const preferences = { theme: 'light', soundEnabled: false };

      contentManager.savePreferences(preferences);

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'jaydeep-portfolio-preferences',
        JSON.stringify(preferences)
      );
    });

    test('updatePreference updates and saves single preference', () => {
      contentManager.updatePreference('theme', 'light');

      expect(contentManager.getPreference('theme')).toBe('light');
      expect(localStorageMock.setItem).toHaveBeenCalled();
    });

    test('getPreference returns preference value', () => {
      contentManager.updatePreference('soundEnabled', false);

      expect(contentManager.getPreference('soundEnabled')).toBe(false);
    });

    test('getPreference returns default value for non-existent key', () => {
      const defaultValue = 'default';
      const result = contentManager.getPreference(
        'nonExistentKey',
        defaultValue
      );

      expect(result).toBe(defaultValue);
    });

    test('resetPreferences restores default preferences', () => {
      contentManager.updatePreference('theme', 'light');
      contentManager.resetPreferences();

      const defaults = contentManager.getDefaultPreferences();
      expect(contentManager.getPreference('theme')).toBe(defaults.theme);
    });
  });

  describe('Global Search', () => {
    test('globalSearch returns results from all categories', () => {
      const results = contentManager.globalSearch('react');

      expect(results).toHaveProperty('skills');
      expect(results).toHaveProperty('projects');
      expect(results).toHaveProperty('tournaments');
      expect(results).toHaveProperty('achievements');
    });

    test('globalSearch returns empty results for empty query', () => {
      const results = contentManager.globalSearch('');

      expect(results.skills).toHaveLength(0);
      expect(results.projects).toHaveLength(0);
      expect(results.tournaments).toHaveLength(0);
      expect(results.achievements).toHaveLength(0);
    });

    test('globalSearch excludes categories when specified', () => {
      const results = contentManager.globalSearch('test', {
        excludeSkills: true,
        excludeProjects: true,
      });

      expect(results.skills).toHaveLength(0);
      expect(results.projects).toHaveLength(0);
      expect(Array.isArray(results.tournaments)).toBe(true);
      expect(Array.isArray(results.achievements)).toBe(true);
    });
  });

  describe('Content Statistics', () => {
    test('getContentStats returns comprehensive statistics', () => {
      const stats = contentManager.getContentStats();

      expect(stats).toHaveProperty('totalSkills');
      expect(stats).toHaveProperty('unlockedSkills');
      expect(stats).toHaveProperty('totalProjects');
      expect(stats).toHaveProperty('completedProjects');
      expect(stats).toHaveProperty('inProgressProjects');
      expect(stats).toHaveProperty('totalTournaments');
      expect(stats).toHaveProperty('totalAchievements');
      expect(stats).toHaveProperty('unlockedAchievements');
      expect(stats).toHaveProperty('skillCategories');
      expect(stats).toHaveProperty('projectCategories');
      expect(stats).toHaveProperty('totalXP');
      expect(stats).toHaveProperty('averageSkillProficiency');

      expect(typeof stats.totalSkills).toBe('number');
      expect(typeof stats.averageSkillProficiency).toBe('number');
      expect(stats.totalSkills).toBeGreaterThan(0);
    });

    test('getContentStats calculates correct totals', () => {
      const stats = contentManager.getContentStats();

      expect(stats.totalSkills).toBe(skills.length);
      expect(stats.totalProjects).toBe(projectsData.projects.length);
      expect(stats.totalTournaments).toBe(gamingData.tournaments.length);
    });
  });

  describe('Cache Management', () => {
    test('clearCache removes all cached data', () => {
      // Add some data to cache
      contentManager.getAllData(true);

      contentManager.clearCache();
      const cacheStats = contentManager.getCacheStats();

      expect(cacheStats.size).toBe(0);
    });

    test('clearCacheEntry removes specific cache entry', () => {
      // Add data to cache
      contentManager.getAllData(true);

      contentManager.clearCacheEntry('all-data');
      const cacheStats = contentManager.getCacheStats();

      expect(cacheStats.keys).not.toContain('all-data');
    });

    test('getCacheStats returns cache information', () => {
      contentManager.getAllData(true);
      const stats = contentManager.getCacheStats();

      expect(stats).toHaveProperty('size');
      expect(stats).toHaveProperty('keys');
      expect(Array.isArray(stats.keys)).toBe(true);
      expect(stats.size).toBeGreaterThan(0);
    });
  });

  describe('Error Handling', () => {
    test('loadPreferences handles localStorage errors gracefully', () => {
      localStorageMock.getItem.mockImplementation(() => {
        throw new Error('localStorage error');
      });

      const preferences = contentManager.loadPreferences();
      const defaults = contentManager.getDefaultPreferences();

      expect(preferences).toEqual(defaults);
    });

    test('savePreferences handles localStorage errors gracefully', () => {
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('localStorage error');
      });

      // Should not throw an error
      expect(() => {
        contentManager.savePreferences({ theme: 'light' });
      }).not.toThrow();
    });

    test('loadPreferences handles invalid JSON gracefully', () => {
      localStorageMock.getItem.mockReturnValue('invalid json');

      const preferences = contentManager.loadPreferences();
      const defaults = contentManager.getDefaultPreferences();

      expect(preferences).toEqual(defaults);
    });
  });
});
