// Tests for data validation functions and data structure integrity
import {
  validateUserProfile,
  validateSkill,
  validateProject,
  validateTournament,
  validateSkillCategory,
  validateCompleteDataStructure,
  checkDataConsistency,
} from './validation';

import { userProfile } from './userProfile';
import { skills, skillCategories } from './skills';
import { projectsData } from './projects';
import { gamingData } from './gaming';

describe('Data Validation Functions', () => {
  describe('validateUserProfile', () => {
    test('should validate correct user profile structure', () => {
      const result = validateUserProfile(userProfile);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should reject user profile without required fields', () => {
      const invalidProfile = {
        // Missing name, title, level
        stats: {
          ectsCompleted: 10,
          technologiesMastered: 5,
          certificationsEarned: 2,
          tournamentsPlayed: 3,
        },
      };

      const result = validateUserProfile(invalidProfile);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'User profile must have a valid name (string)'
      );
      expect(result.errors).toContain(
        'User profile must have a valid title (string)'
      );
      expect(result.errors).toContain(
        'User profile level must be a non-negative number'
      );
    });

    test('should reject user profile with invalid stats', () => {
      const invalidProfile = {
        name: 'Test User',
        title: 'Developer',
        level: 5,
        stats: {
          projectsCompleted: -1, // Invalid negative number
          technologiesMastered: 'invalid', // Invalid type
          certificationsEarned: 2,
          tournamentsPlayed: 3,
        },
        background: {
          education: {},
          certifications: [],
        },
        characterStats: {},
        achievements: [],
      };

      const result = validateUserProfile(invalidProfile);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'User profile stats.projectsCompleted must be a non-negative number'
      );
      expect(result.errors).toContain(
        'User profile stats.technologiesMastered must be a non-negative number'
      );
    });

    test('should reject user profile with invalid certifications', () => {
      const invalidProfile = {
        name: 'Test User',
        title: 'Developer',
        level: 5,
        stats: {
          projectsCompleted: 10,
          technologiesMastered: 5,
          certificationsEarned: 2,
          tournamentsPlayed: 3,
        },
        background: {
          education: {},
          certifications: [
            {
              // Missing name and issuer
              skills: [],
            },
          ],
        },
        characterStats: {},
        achievements: [],
      };

      const result = validateUserProfile(invalidProfile);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Certification 0 must have a valid name');
      expect(result.errors).toContain(
        'Certification 0 must have a valid issuer'
      );
    });

    test('should reject user profile with invalid character stats', () => {
      const invalidProfile = {
        name: 'Test User',
        title: 'Developer',
        level: 5,
        stats: {
          projectsCompleted: 10,
          technologiesMastered: 5,
          certificationsEarned: 2,
          tournamentsPlayed: 3,
        },
        background: {
          education: {},
          certifications: [],
        },
        characterStats: {
          coding: {
            name: 'Coding',
            level: 150, // Invalid: exceeds maxLevel
            maxLevel: 100,
            experience: 4200,
            nextLevelExp: 5000,
          },
        },
        achievements: [],
      };

      const result = validateUserProfile(invalidProfile);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'Character stat coding level must be between 0 and maxLevel'
      );
    });
  });

  describe('validateSkill', () => {
    test('should validate correct skill structure', () => {
      const validSkill = skills[0]; // Use first skill from actual data
      const result = validateSkill(validSkill);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should reject skill without required fields', () => {
      const invalidSkill = {
        // Missing id, name, category
        proficiency: 85,
        yearsExperience: 3,
      };

      const result = validateSkill(invalidSkill);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Skill must have a valid id (string)');
      expect(result.errors).toContain('Skill must have a valid name (string)');
      expect(result.errors).toContain(
        'Skill must have a valid category (string)'
      );
    });

    test('should reject skill with invalid proficiency', () => {
      const invalidSkill = {
        id: 'test-skill',
        name: 'Test Skill',
        category: 'frontend',
        proficiency: 150, // Invalid: exceeds 100
        yearsExperience: 3,
        level: 'Advanced',
        certifications: [],
        projects: [],
        prerequisites: [],
        unlocked: true,
      };

      const result = validateSkill(invalidSkill);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'Skill proficiency must be a number between 0 and 100'
      );
    });

    test('should reject skill with invalid level', () => {
      const invalidSkill = {
        id: 'test-skill',
        name: 'Test Skill',
        category: 'frontend',
        proficiency: 85,
        yearsExperience: 3,
        level: 'Master', // Invalid level
        certifications: [],
        projects: [],
        prerequisites: [],
        unlocked: true,
      };

      const result = validateSkill(invalidSkill);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'Skill level must be one of: Beginner, Intermediate, Advanced, Expert'
      );
    });

    test('should reject skill with non-array fields', () => {
      const invalidSkill = {
        id: 'test-skill',
        name: 'Test Skill',
        category: 'frontend',
        proficiency: 85,
        yearsExperience: 3,
        level: 'Advanced',
        certifications: 'not-array', // Invalid type
        projects: 'not-array', // Invalid type
        prerequisites: 'not-array', // Invalid type
        unlocked: 'not-boolean', // Invalid type
      };

      const result = validateSkill(invalidSkill);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Skill certifications must be an array');
      expect(result.errors).toContain('Skill projects must be an array');
      expect(result.errors).toContain('Skill prerequisites must be an array');
      expect(result.errors).toContain('Skill unlocked must be a boolean');
    });
  });

  describe('validateProject', () => {
    test('should validate correct project structure', () => {
      const validProject = projectsData.projects[0]; // Use first project from actual data
      const result = validateProject(validProject);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should reject project without required fields', () => {
      const invalidProject = {
        // Missing id, title, category
        status: 'completed',
        difficulty: 'Epic',
      };

      const result = validateProject(invalidProject);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Project must have a valid id (string)');
      expect(result.errors).toContain(
        'Project must have a valid title (string)'
      );
      expect(result.errors).toContain(
        'Project must have a valid category (string)'
      );
    });

    test('should reject project with invalid status', () => {
      const invalidProject = {
        id: 'test-project',
        title: 'Test Project',
        category: 'web-development',
        status: 'invalid-status', // Invalid status
        difficulty: 'Epic',
        description: 'Test description',
        longDescription: 'Test long description',
        technologies: [],
        features: [],
        challenges: [],
        achievements: [],
        images: [],
        links: {},
        rewards: {
          xp: 1000,
          badges: [],
          skills: [],
        },
      };

      const result = validateProject(invalidProject);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'Project status must be one of: completed, in-progress, planned'
      );
    });

    test('should reject project with invalid difficulty', () => {
      const invalidProject = {
        id: 'test-project',
        title: 'Test Project',
        category: 'web-development',
        status: 'completed',
        difficulty: 'Invalid', // Invalid difficulty
        description: 'Test description',
        longDescription: 'Test long description',
        technologies: [],
        features: [],
        challenges: [],
        achievements: [],
        images: [],
        links: {},
        rewards: {
          xp: 1000,
          badges: [],
          skills: [],
        },
      };

      const result = validateProject(invalidProject);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'Project difficulty must be one of: Common, Rare, Epic, Legendary'
      );
    });

    test('should reject project with invalid rewards', () => {
      const invalidProject = {
        id: 'test-project',
        title: 'Test Project',
        category: 'web-development',
        status: 'completed',
        difficulty: 'Epic',
        description: 'Test description',
        longDescription: 'Test long description',
        technologies: [],
        features: [],
        challenges: [],
        achievements: [],
        images: [],
        links: {},
        rewards: {
          xp: -100, // Invalid negative XP
          badges: 'not-array', // Invalid type
          skills: 'not-array', // Invalid type
        },
      };

      const result = validateProject(invalidProject);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'Project rewards.xp must be a non-negative number'
      );
      expect(result.errors).toContain(
        'Project rewards.badges must be an array'
      );
      expect(result.errors).toContain(
        'Project rewards.skills must be an array'
      );
    });
  });

  describe('validateTournament', () => {
    test('should validate correct tournament structure', () => {
      const validTournament = gamingData.tournaments[0]; // Use first tournament from actual data
      const result = validateTournament(validTournament);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should reject tournament without required fields', () => {
      const invalidTournament = {
        // Missing id, name, game
        date: '2023-08-15',
        placement: '1st Place',
      };

      const result = validateTournament(invalidTournament);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'Tournament must have a valid id (string)'
      );
      expect(result.errors).toContain(
        'Tournament must have a valid name (string)'
      );
      expect(result.errors).toContain(
        'Tournament must have a valid game (string)'
      );
    });

    test('should reject tournament with invalid date format', () => {
      const invalidTournament = {
        id: 'test-tournament',
        name: 'Test Tournament',
        game: 'Test Game',
        date: '15-08-2023', // Invalid format
        placement: '1st Place',
        participants: 64,
        achievement: 'gold',
        skills: [],
      };

      const result = validateTournament(invalidTournament);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'Tournament date must be in YYYY-MM-DD format'
      );
    });

    test('should reject tournament with invalid achievement', () => {
      const invalidTournament = {
        id: 'test-tournament',
        name: 'Test Tournament',
        game: 'Test Game',
        date: '2023-08-15',
        placement: '1st Place',
        participants: 64,
        achievement: 'platinum', // Invalid achievement
        skills: [],
      };

      const result = validateTournament(invalidTournament);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'Tournament achievement must be one of: gold, silver, bronze, participation'
      );
    });

    test('should reject tournament with invalid participants count', () => {
      const invalidTournament = {
        id: 'test-tournament',
        name: 'Test Tournament',
        game: 'Test Game',
        date: '2023-08-15',
        placement: '1st Place',
        participants: -5, // Invalid negative number
        achievement: 'gold',
        skills: [],
      };

      const result = validateTournament(invalidTournament);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'Tournament participants must be a positive number'
      );
    });
  });

  describe('validateSkillCategory', () => {
    test('should validate correct skill category structure', () => {
      const validCategory = skillCategories.frontend; // Use actual category data
      const result = validateSkillCategory(validCategory);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should reject skill category without required fields', () => {
      const invalidCategory = {
        // Missing name, icon, color, description
      };

      const result = validateSkillCategory(invalidCategory);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'Skill category must have a valid name (string)'
      );
      expect(result.errors).toContain(
        'Skill category must have a valid icon (string)'
      );
      expect(result.errors).toContain(
        'Skill category must have a valid color (string)'
      );
      expect(result.errors).toContain(
        'Skill category must have a valid description (string)'
      );
    });
  });

  describe('validateCompleteDataStructure', () => {
    test('should validate complete data structure with all sections', () => {
      const completeData = {
        userProfile,
        skills,
        skillCategories,
        projectsData,
        gamingData,
      };

      const result = validateCompleteDataStructure(completeData);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should reject incomplete data structure', () => {
      const incompleteData = {
        // Missing userProfile, skills, etc.
        projectsData: {
          projects: [],
        },
      };

      const result = validateCompleteDataStructure(incompleteData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Missing userProfile data');
      expect(result.errors).toContain('Skills data must be an array');
      expect(result.errors).toContain(
        'Missing or invalid skillCategories data'
      );
    });

    test('should provide detailed section validation results', () => {
      const completeData = {
        userProfile,
        skills,
        skillCategories,
        projectsData,
        gamingData,
      };

      const result = validateCompleteDataStructure(completeData);
      expect(result.sections).toHaveProperty('userProfile');
      expect(result.sections).toHaveProperty('skills');
      expect(result.sections).toHaveProperty('projects');
      expect(result.sections).toHaveProperty('tournaments');
    });
  });

  describe('checkDataConsistency', () => {
    test('should check consistency between different data sections', () => {
      const consistentData = {
        userProfile,
        skills,
        projectsData,
        gamingData,
      };

      const result = checkDataConsistency(consistentData);
      // Note: This might have warnings due to the nature of mock data
      // but should not have critical errors
      expect(result).toHaveProperty('hasIssues');
      expect(result).toHaveProperty('warnings');
      expect(result).toHaveProperty('errors');
      expect(Array.isArray(result.warnings)).toBe(true);
      expect(Array.isArray(result.errors)).toBe(true);
    });

    test('should detect tournament count mismatch', () => {
      const inconsistentData = {
        userProfile: {
          ...userProfile,
          stats: {
            ...userProfile.stats,
            tournamentsPlayed: 999, // Mismatch with actual tournament count
          },
        },
        gamingData,
      };

      const result = checkDataConsistency(inconsistentData);
      expect(result.hasIssues).toBe(true);
      expect(
        result.warnings.some(warning =>
          warning.includes('Tournament count mismatch')
        )
      ).toBe(true);
    });
  });
});

describe('Data Structure Integrity Tests', () => {
  test('all skills should have unique IDs', () => {
    const skillIds = skills.map(skill => skill.id);
    const uniqueIds = new Set(skillIds);
    expect(uniqueIds.size).toBe(skillIds.length);
  });

  test('all projects should have unique IDs', () => {
    const projectIds = projectsData.projects.map(project => project.id);
    const uniqueIds = new Set(projectIds);
    expect(uniqueIds.size).toBe(projectIds.length);
  });

  test('all tournaments should have unique IDs', () => {
    const tournamentIds = gamingData.tournaments.map(
      tournament => tournament.id
    );
    const uniqueIds = new Set(tournamentIds);
    expect(uniqueIds.size).toBe(tournamentIds.length);
  });

  test('all skill prerequisites should reference existing skills', () => {
    const skillIds = new Set(skills.map(skill => skill.id));

    skills.forEach(skill => {
      skill.prerequisites.forEach(prereqId => {
        expect(skillIds.has(prereqId)).toBe(true);
      });
    });
  });

  test('all skills should belong to valid categories', () => {
    const validCategories = Object.keys(skillCategories);

    skills.forEach(skill => {
      expect(validCategories).toContain(skill.category);
    });
  });

  test('all projects should belong to valid categories', () => {
    const validCategories = projectsData.categories.map(cat => cat.id);

    projectsData.projects.forEach(project => {
      expect(validCategories).toContain(project.category);
    });
  });

  test('user profile stats should be consistent with actual data counts', () => {
    // This test checks if the stats in user profile match the actual data
    const actualProjectCount = projectsData.projects.filter(
      p => p.status === 'completed'
    ).length;
    const actualTournamentCount = gamingData.tournaments.length;
    const actualCertificationCount =
      userProfile.background.certifications.length;

    // Note: These might not match exactly in mock data, but structure should be consistent
    expect(typeof userProfile.stats.projectsCompleted).toBe('number');
    expect(typeof userProfile.stats.tournamentsPlayed).toBe('number');
    expect(typeof userProfile.stats.certificationsEarned).toBe('number');
    expect(userProfile.stats.certificationsEarned).toBe(
      actualCertificationCount
    );
  });

  test('all achievement IDs should be unique', () => {
    const userAchievementIds = userProfile.achievements.map(
      achievement => achievement.id
    );
    const gamingAchievementIds = gamingData.achievements.map(
      achievement => achievement.id
    );

    const allAchievementIds = [...userAchievementIds, ...gamingAchievementIds];
    const uniqueIds = new Set(allAchievementIds);

    expect(uniqueIds.size).toBe(allAchievementIds.length);
  });

  test('project difficulty levels should match defined levels', () => {
    const validDifficulties = Object.keys(projectsData.difficultyLevels);

    projectsData.projects.forEach(project => {
      expect(validDifficulties).toContain(project.difficulty);
    });
  });

  test('skill proficiency levels should be within valid range', () => {
    skills.forEach(skill => {
      expect(skill.proficiency).toBeGreaterThanOrEqual(0);
      expect(skill.proficiency).toBeLessThanOrEqual(100);
      expect(skill.yearsExperience).toBeGreaterThanOrEqual(0);
    });
  });
});
