// Data models and mock data will be exported from here
export { userProfile } from './userProfile';
export {
  skills,
  skillCategories,
  skillConnections,
  getSkillsByCategory,
  getSkillById,
  getPrerequisites,
} from './skills';
export { gamingData } from './gaming';
export {
  projectsData,
  getProjectsByCategory,
  getFeaturedProjects,
  getProjectById,
  getProjectsByStatus,
  getProjectsByDifficulty,
  searchProjects,
  sortProjectsByDate,
  getProjectStats,
} from './projects';

// Data validation functions
export {
  validateUserProfile,
  validateSkill,
  validateProject,
  validateTournament,
  validateSkillCategory,
  validateCompleteDataStructure,
  checkDataConsistency,
} from './validation';

// Content management system
export { default as contentManager } from './contentManager';
export {
  getAllData,
  getUserProfile as getUser,
  getSkills as getFilteredSkills,
  getProjects as getFilteredProjects,
  getGamingData as getFilteredGamingData,
  sortProjects,
  sortSkills,
  updatePreference,
  getPreference,
  resetPreferences,
  globalSearch,
  getContentStats,
  clearCache,
} from './contentManager';
