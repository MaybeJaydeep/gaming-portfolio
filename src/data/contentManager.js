// Content management system for data fetching, processing, and user preferences

import {
  userProfile,
  skills,
  skillCategories,
  projectsData,
  gamingData,
} from './index';

/**
 * Content Manager class for handling data operations and user preferences
 */
class ContentManager {
  constructor() {
    this.cache = new Map();
    this.preferences = this.loadPreferences();
  }

  // ===== DATA FETCHING AND PROCESSING =====

  /**
   * Get all data with optional caching
   * @param {boolean} useCache - Whether to use cached data
   * @returns {Object} Complete data object
   */
  getAllData(useCache = true) {
    const cacheKey = 'all-data';

    if (useCache && this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const data = {
      userProfile,
      skills,
      skillCategories,
      projectsData,
      gamingData,
      lastUpdated: new Date().toISOString(),
    };

    if (useCache) {
      this.cache.set(cacheKey, data);
    }

    return data;
  }

  /**
   * Get user profile data
   * @returns {Object} User profile object
   */
  getUserProfile() {
    return { ...userProfile };
  }

  /**
   * Get skills data with optional filtering
   * @param {Object} filters - Filter options
   * @returns {Array} Filtered skills array
   */
  getSkills(filters = {}) {
    let filteredSkills = [...skills];

    // Filter by category
    if (filters.category) {
      filteredSkills = filteredSkills.filter(
        skill => skill.category === filters.category
      );
    }

    // Filter by proficiency level
    if (filters.minProficiency) {
      filteredSkills = filteredSkills.filter(
        skill => skill.proficiency >= filters.minProficiency
      );
    }

    // Filter by experience level
    if (filters.level) {
      filteredSkills = filteredSkills.filter(
        skill => skill.level === filters.level
      );
    }

    // Filterlocked status
    if (filters.unlocked !== undefined) {
      filteredSkills = filteredSkills.filter(
        skill => skill.unlocked === filters.unlocked
      );
    }

    // Search by name or description
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredSkills = filteredSkills.filter(
        skill =>
          skill.name.toLowerCase().includes(searchTerm) ||
          (skill.description &&
            skill.description.toLowerCase().includes(searchTerm))
      );
    }

    return filteredSkills;
  }

  /**
   * Get projects data with optional filtering and sorting
   * @param {Object} options - Filter and sort options
   * @returns {Array} Filtered and sorted projects array
   */
  getProjects(options = {}) {
    let filteredProjects = [...projectsData.projects];

    // Filter by category
    if (options.category) {
      filteredProjects = filteredProjects.filter(
        project => project.category === options.category
      );
    }

    // Filter by status
    if (options.status) {
      filteredProjects = filteredProjects.filter(
        project => project.status === options.status
      );
    }

    // Filter by difficulty
    if (options.difficulty) {
      filteredProjects = filteredProjects.filter(
        project => project.difficulty === options.difficulty
      );
    }

    // Filter by technology
    if (options.technology) {
      filteredProjects = filteredProjects.filter(project =>
        project.technologies.some(tech =>
          tech.toLowerCase().includes(options.technology.toLowerCase())
        )
      );
    }

    // Search by title or description
    if (options.search) {
      const searchTerm = options.search.toLowerCase();
      filteredProjects = filteredProjects.filter(
        project =>
          project.title.toLowerCase().includes(searchTerm) ||
          project.description.toLowerCase().includes(searchTerm) ||
          project.longDescription.toLowerCase().includes(searchTerm)
      );
    }

    // Sort projects
    if (options.sortBy) {
      filteredProjects = this.sortProjects(
        filteredProjects,
        options.sortBy,
        options.sortOrder
      );
    }

    // Limit results
    if (options.limit) {
      filteredProjects = filteredProjects.slice(0, options.limit);
    }

    return filteredProjects;
  }

  /**
   * Get gaming data with optional filtering
   * @param {Object} filters - Filter options
   * @returns {Object} Filtered gaming data
   */
  getGamingData(filters = {}) {
    const data = { ...gamingData };

    // Filter tournaments by achievement level
    if (filters.achievement) {
      data.tournaments = data.tournaments.filter(
        tournament => tournament.achievement === filters.achievement
      );
    }

    // Filter tournaments by game
    if (filters.game) {
      const searchTerm = filters.game.toLowerCase();
      data.tournaments = data.tournaments.filter(tournament =>
        tournament.game.toLowerCase().includes(searchTerm)
      );
    }

    // Filter tournaments by date range
    if (filters.dateFrom || filters.dateTo) {
      data.tournaments = data.tournaments.filter(tournament => {
        const tournamentDate = new Date(tournament.date);
        const fromDate = filters.dateFrom
          ? new Date(filters.dateFrom)
          : new Date('1900-01-01');
        const toDate = filters.dateTo ? new Date(filters.dateTo) : new Date();

        return tournamentDate >= fromDate && tournamentDate <= toDate;
      });
    }

    return data;
  }

  // ===== SORTING UTILITIES =====

  /**
   * Sort projects by specified criteria
   * @param {Array} projects - Projects to sort
   * @param {string} sortBy - Sort criteria
   * @param {string} sortOrder - Sort order (asc/desc)
   * @returns {Array} Sorted projects array
   */
  sortProjects(projects, sortBy, sortOrder = 'desc') {
    const sortedProjects = [...projects];

    sortedProjects.sort((a, b) => {
      let valueA, valueB;

      switch (sortBy) {
        case 'title':
          valueA = a.title.toLowerCase();
          valueB = b.title.toLowerCase();
          break;
        case 'completionDate':
          valueA = new Date(a.completionDate || '1900-01-01');
          valueB = new Date(b.completionDate || '1900-01-01');
          break;
        case 'difficulty':
          const difficultyOrder = { Common: 1, Rare: 2, Epic: 3, Legendary: 4 };
          valueA = difficultyOrder[a.difficulty] || 0;
          valueB = difficultyOrder[b.difficulty] || 0;
          break;
        case 'xp':
          valueA = a.rewards?.xp || 0;
          valueB = b.rewards?.xp || 0;
          break;
        default:
          return 0;
      }

      if (valueA < valueB) {
        return sortOrder === 'asc' ? -1 : 1;
      }
      if (valueA > valueB) {
        return sortOrder === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return sortedProjects;
  }

  /**
   * Sort skills by specified criteria
   * @param {Array} skills - Skills to sort
   * @param {string} sortBy - Sort criteria
   * @param {string} sortOrder - Sort order (asc/desc)
   * @returns {Array} Sorted skills array
   */
  sortSkills(skills, sortBy, sortOrder = 'desc') {
    const sortedSkills = [...skills];

    sortedSkills.sort((a, b) => {
      let valueA, valueB;

      switch (sortBy) {
        case 'name':
          valueA = a.name.toLowerCase();
          valueB = b.name.toLowerCase();
          break;
        case 'proficiency':
          valueA = a.proficiency;
          valueB = b.proficiency;
          break;
        case 'yearsExperience':
          valueA = a.yearsExperience;
          valueB = b.yearsExperience;
          break;
        case 'category':
          valueA = a.category.toLowerCase();
          valueB = b.category.toLowerCase();
          break;
        default:
          return 0;
      }

      if (valueA < valueB) {
        return sortOrder === 'asc' ? -1 : 1;
      }
      if (valueA > valueB) {
        return sortOrder === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return sortedSkills;
  }

  // ===== USER PREFERENCES MANAGEMENT =====

  /**
   * Load user preferences from localStorage
   * @returns {Object} User preferences object
   */
  loadPreferences() {
    try {
      const stored = localStorage.getItem('jaydeep-portfolio-preferences');
      return stored ? JSON.parse(stored) : this.getDefaultPreferences();
    } catch (error) {
      console.warn('Failed to load preferences from localStorage:', error);
      return this.getDefaultPreferences();
    }
  }

  /**
   * Save user preferences to localStorage
   * @param {Object} preferences - Preferences to save
   */
  savePreferences(preferences = this.preferences) {
    try {
      localStorage.setItem(
        'jaydeep-portfolio-preferences',
        JSON.stringify(preferences)
      );
      this.preferences = { ...preferences };
    } catch (error) {
      console.error('Failed to save preferences to localStorage:', error);
    }
  }

  /**
   * Get default user preferences
   * @returns {Object} Default preferences object
   */
  getDefaultPreferences() {
    return {
      theme: 'dark',
      soundEnabled: true,
      animationsEnabled: true,
      particlesEnabled: true,
      autoPlayMusic: false,
      language: 'en',
      skillsView: 'tree', // 'tree' or 'list'
      projectsView: 'grid', // 'grid' or 'list'
      showCompletedProjects: true,
      showInProgressProjects: true,
      showPlannedProjects: false,
      defaultProjectSort: 'completionDate',
      defaultSkillSort: 'proficiency',
      reducedMotion: false,
      highContrast: false,
      fontSize: 'medium', // 'small', 'medium', 'large'
      lastVisited: new Date().toISOString(),
    };
  }

  /**
   * Update specific preference
   * @param {string} key - Preference key
   * @param {*} value - Preference value
   */
  updatePreference(key, value) {
    this.preferences[key] = value;
    this.savePreferences();
  }

  /**
   * Get specific preference value
   * @param {string} key - Preference key
   * @param {*} defaultValue - Default value if key doesn't exist
   * @returns {*} Preference value
   */
  getPreference(key, defaultValue = null) {
    return this.preferences[key] !== undefined
      ? this.preferences[key]
      : defaultValue;
  }

  /**
   * Reset preferences to defaults
   */
  resetPreferences() {
    this.preferences = this.getDefaultPreferences();
    this.savePreferences();
  }

  // ===== SEARCH AND FILTERING UTILITIES =====

  /**
   * Global search across all content
   * @param {string} query - Search query
   * @param {Object} options - Search options
   * @returns {Object} Search results
   */
  globalSearch(query, options = {}) {
    const searchTerm = query.toLowerCase().trim();
    if (!searchTerm) return { skills: [], projects: [], tournaments: [] };

    const results = {
      skills: [],
      projects: [],
      tournaments: [],
      achievements: [],
    };

    // Search skills
    if (!options.excludeSkills) {
      results.skills = this.getSkills({ search: searchTerm });
    }

    // Search projects
    if (!options.excludeProjects) {
      results.projects = this.getProjects({ search: searchTerm });
    }

    // Search tournaments
    if (!options.excludeTournaments) {
      results.tournaments = gamingData.tournaments.filter(
        tournament =>
          tournament.name.toLowerCase().includes(searchTerm) ||
          tournament.game.toLowerCase().includes(searchTerm) ||
          tournament.description.toLowerCase().includes(searchTerm)
      );
    }

    // Search achievements
    if (!options.excludeAchievements) {
      const allAchievements = [
        ...userProfile.achievements,
        ...gamingData.achievements,
      ];
      results.achievements = allAchievements.filter(
        achievement =>
          achievement.name.toLowerCase().includes(searchTerm) ||
          achievement.description.toLowerCase().includes(searchTerm)
      );
    }

    return results;
  }

  /**
   * Get content statistics
   * @returns {Object} Content statistics
   */
  getContentStats() {
    return {
      totalSkills: skills.length,
      unlockedSkills: skills.filter(skill => skill.unlocked).length,
      totalProjects: projectsData.projects.length,
      completedProjects: projectsData.projects.filter(
        p => p.status === 'completed'
      ).length,
      inProgressProjects: projectsData.projects.filter(
        p => p.status === 'in-progress'
      ).length,
      totalTournaments: gamingData.tournaments.length,
      totalAchievements:
        userProfile.achievements.length + gamingData.achievements.length,
      unlockedAchievements:
        userProfile.achievements.filter(a => a.unlocked).length +
        gamingData.achievements.filter(a => a.unlocked).length,
      skillCategories: Object.keys(skillCategories).length,
      projectCategories: projectsData.categories.length,
      totalXP: projectsData.projects.reduce(
        (sum, project) => sum + (project.rewards?.xp || 0),
        0
      ),
      averageSkillProficiency: Math.round(
        skills.reduce((sum, skill) => sum + skill.proficiency, 0) /
          skills.length
      ),
    };
  }

  // ===== CACHE MANAGEMENT =====

  /**
   * Clear all cached data
   */
  clearCache() {
    this.cache.clear();
  }

  /**
   * Clear specific cache entry
   * @param {string} key - Cache key to clear
   */
  clearCacheEntry(key) {
    this.cache.delete(key);
  }

  /**
   * Get cache statistics
   * @returns {Object} Cache statistics
   */
  getCacheStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

// Create and export singleton instance
const contentManager = new ContentManager();

export default contentManager;

// Export individual methods for convenience
export const {
  getAllData,
  getUserProfile,
  getSkills,
  getProjects,
  getGamingData,
  sortProjects,
  sortSkills,
  loadPreferences,
  savePreferences,
  updatePreference,
  getPreference,
  resetPreferences,
  globalSearch,
  getContentStats,
  clearCache,
} = contentManager;
