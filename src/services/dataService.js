// Data service to handle all data loading with error handling and caching
class DataService {
  constructor() {
    this.cache = new Map();
    this.loadingPromises = new Map();
  }

  // Generic data loader with caching
  async loadData(key, loader, useCache = true) {
    // Return cached data if available
    if (useCache && this.cache.has(key)) {
      return this.cache.get(key);
    }

    // Return existing loading promise if already loading
    if (this.loadingPromises.has(key)) {
      return this.loadingPromises.get(key);
    }

    // Create new loading promise
    const loadingPromise = this.executeLoader(key, loader);
    this.loadingPromises.set(key, loadingPromise);

    try {
      const result = await loadingPromise;

      // Cache the result
      if (useCache) {
        this.cache.set(key, result);
      }

      return result;
    } finally {
      // Clean up loading promise
      this.loadingPromises.delete(key);
    }
  }

  async executeLoader(key, loader) {
    try {
      // Add artificial delay for better UX (minimum loading time)
      const minDelay = new Promise(resolve => setTimeout(resolve, 300));

      let dataPromise;
      if (typeof loader === 'function') {
        dataPromise = loader();
      } else {
        dataPromise = Promise.resolve(loader);
      }

      const [, data] = await Promise.all([minDelay, dataPromise]);
      return data;
    } catch (error) {
      console.error(`Error loading ${key}:`, error);
      throw error;
    }
  }

  // Load user profile data
  async loadUserProfile() {
    return this.loadData('userProfile', async () => {
      const { userProfile } = await import('../data/userProfile.js');
      return userProfile;
    });
  }

  // Load gaming data
  async loadGamingData() {
    return this.loadData('gamingData', async () => {
      const { gamingData } = await import('../data/gaming.js');
      return gamingData;
    });
  }

  // Load skills data
  async loadSkillsData() {
    return this.loadData('skillsData', async () => {
      const { skills, skillCategories, getSkillsByCategory } = await import(
        '../data/skills.js'
      );
      return { skills, skillCategories, getSkillsByCategory };
    });
  }

  // Load projects data
  async loadProjectsData() {
    return this.loadData('projectsData', async () => {
      const { projectsData } = await import('../data/projects.js');
      return projectsData;
    });
  }

  // Load all data at once
  async loadAllData() {
    try {
      const [userProfile, gamingData, skillsData, projectsData] =
        await Promise.all([
          this.loadUserProfile(),
          this.loadGamingData(),
          this.loadSkillsData(),
          this.loadProjectsData(),
        ]);

      return {
        userProfile,
        gamingData,
        skillsData,
        projectsData,
        loaded: true,
        timestamp: Date.now(),
      };
    } catch (error) {
      console.error('Error loading all data:', error);
      throw error;
    }
  }

  // Clear cache
  clearCache() {
    this.cache.clear();
  }

  // Get cached data
  getCachedData(key) {
    return this.cache.get(key);
  }

  // Check if data is cached
  isCached(key) {
    return this.cache.has(key);
  }
}

// Create singleton instance
export const dataService = new DataService();

// Export individual loaders for convenience
export const loadUserProfile = () => dataService.loadUserProfile();
export const loadGamingData = () => dataService.loadGamingData();
export const loadSkillsData = () => dataService.loadSkillsData();
export const loadProjectsData = () => dataService.loadProjectsData();
export const loadAllData = () => dataService.loadAllData();
