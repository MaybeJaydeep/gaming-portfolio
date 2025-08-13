// Data validation functions for ensuring data structure integrity

/**
 * Validates user profile data structure
 * @param {Object} profile - User profile object to validate
 * @returns {Object} - Validation result with isValid boolean and errors array
 */
export const validateUserProfile = profile => {
  const errors = [];

  // Required fields validation
  if (!profile.name || typeof profile.name !== 'string') {
    errors.push('User profile must have a valid name (string)');
  }

  if (!profile.title || typeof profile.title !== 'string') {
    errors.push('User profile must have a valid title (string)');
  }

  if (typeof profile.level !== 'number' || profile.level < 0) {
    errors.push('User profile level must be a non-negative number');
  }

  // Stats validation
  if (!profile.stats || typeof profile.stats !== 'object') {
    errors.push('User profile must have a stats object');
  } else {
    const requiredStats = [
      'projectsCompleted',
      'technologiesMastered',
      'certificationsEarned',
      'tournamentsPlayed',
    ];
    requiredStats.forEach(stat => {
      if (typeof profile.stats[stat] !== 'number' || profile.stats[stat] < 0) {
        errors.push(`User profile stats.${stat} must be a non-negative number`);
      }
    });
  }

  // Background validation
  if (!profile.background || typeof profile.background !== 'object') {
    errors.push('User profile must have a background object');
  } else {
    // Education validation
    if (
      !profile.background.education ||
      typeof profile.background.education !== 'object'
    ) {
      errors.push('User profile background must have an education object');
    }

    // Certifications validation
    if (!Array.isArray(profile.background.certifications)) {
      errors.push('User profile background.certifications must be an array');
    } else {
      profile.background.certifications.forEach((cert, index) => {
        if (!cert.name || typeof cert.name !== 'string') {
          errors.push(`Certification ${index} must have a valid name`);
        }
        if (!cert.issuer || typeof cert.issuer !== 'string') {
          errors.push(`Certification ${index} must have a valid issuer`);
        }
        if (!Array.isArray(cert.skills)) {
          errors.push(`Certification ${index} must have a skills array`);
        }
      });
    }
  }

  // Character stats validation
  if (!profile.characterStats || typeof profile.characterStats !== 'object') {
    errors.push('User profile must have characterStats object');
  } else {
    Object.entries(profile.characterStats).forEach(([key, stat]) => {
      if (!stat.name || typeof stat.name !== 'string') {
        errors.push(`Character stat ${key} must have a valid name`);
      }
      if (
        typeof stat.level !== 'number' ||
        stat.level < 0 ||
        stat.level > stat.maxLevel
      ) {
        errors.push(
          `Character stat ${key} level must be between 0 and maxLevel`
        );
      }
      if (typeof stat.maxLevel !== 'number' || stat.maxLevel <= 0) {
        errors.push(`Character stat ${key} maxLevel must be a positive number`);
      }
    });
  }

  // Achievements validation
  if (!Array.isArray(profile.achievements)) {
    errors.push('User profile achievements must be an array');
  } else {
    profile.achievements.forEach((achievement, index) => {
      if (!achievement.id || typeof achievement.id !== 'string') {
        errors.push(`Achievement ${index} must have a valid id`);
      }
      if (!achievement.name || typeof achievement.name !== 'string') {
        errors.push(`Achievement ${index} must have a valid name`);
      }
      if (typeof achievement.unlocked !== 'boolean') {
        errors.push(`Achievement ${index} unlocked must be a boolean`);
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validates skill data structure
 * @param {Object} skill - Skill object to validate
 * @returns {Object} - Validation result with isValid boolean and errors array
 */
export const validateSkill = skill => {
  const errors = [];

  // Required fields validation
  if (!skill.id || typeof skill.id !== 'string') {
    errors.push('Skill must have a valid id (string)');
  }

  if (!skill.name || typeof skill.name !== 'string') {
    errors.push('Skill must have a valid name (string)');
  }

  if (!skill.category || typeof skill.category !== 'string') {
    errors.push('Skill must have a valid category (string)');
  }

  // Proficiency validation (0-100)
  if (
    typeof skill.proficiency !== 'number' ||
    skill.proficiency < 0 ||
    skill.proficiency > 100
  ) {
    errors.push('Skill proficiency must be a number between 0 and 100');
  }

  // Years experience validation
  if (typeof skill.yearsExperience !== 'number' || skill.yearsExperience < 0) {
    errors.push('Skill yearsExperience must be a non-negative number');
  }

  // Level validation
  const validLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
  if (!validLevels.includes(skill.level)) {
    errors.push(`Skill level must be one of: ${validLevels.join(', ')}`);
  }

  // Arrays validation
  if (!Array.isArray(skill.certifications)) {
    errors.push('Skill certifications must be an array');
  }

  if (!Array.isArray(skill.projects)) {
    errors.push('Skill projects must be an array');
  }

  if (!Array.isArray(skill.prerequisites)) {
    errors.push('Skill prerequisites must be an array');
  }

  // Boolean validation
  if (typeof skill.unlocked !== 'boolean') {
    errors.push('Skill unlocked must be a boolean');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validates project data structure
 * @param {Object} project - Project object to validate
 * @returns {Object} - Validation result with isValid boolean and errors array
 */
export const validateProject = project => {
  const errors = [];

  // Required fields validation
  if (!project.id || typeof project.id !== 'string') {
    errors.push('Project must have a valid id (string)');
  }

  if (!project.title || typeof project.title !== 'string') {
    errors.push('Project must have a valid title (string)');
  }

  if (!project.category || typeof project.category !== 'string') {
    errors.push('Project must have a valid category (string)');
  }

  // Status validation
  const validStatuses = ['completed', 'in-progress', 'planned'];
  if (!validStatuses.includes(project.status)) {
    errors.push(`Project status must be one of: ${validStatuses.join(', ')}`);
  }

  // Difficulty validation
  const validDifficulties = ['Common', 'Rare', 'Epic', 'Legendary'];
  if (!validDifficulties.includes(project.difficulty)) {
    errors.push(
      `Project difficulty must be one of: ${validDifficulties.join(', ')}`
    );
  }

  // Description validation
  if (!project.description || typeof project.description !== 'string') {
    errors.push('Project must have a valid description (string)');
  }

  if (!project.longDescription || typeof project.longDescription !== 'string') {
    errors.push('Project must have a valid longDescription (string)');
  }

  // Arrays validation
  if (!Array.isArray(project.technologies)) {
    errors.push('Project technologies must be an array');
  }

  if (!Array.isArray(project.features)) {
    errors.push('Project features must be an array');
  }

  if (!Array.isArray(project.challenges)) {
    errors.push('Project challenges must be an array');
  }

  if (!Array.isArray(project.achievements)) {
    errors.push('Project achievements must be an array');
  }

  if (!Array.isArray(project.images)) {
    errors.push('Project images must be an array');
  }

  // Links validation
  if (!project.links || typeof project.links !== 'object') {
    errors.push('Project must have a links object');
  }

  // Rewards validation
  if (!project.rewards || typeof project.rewards !== 'object') {
    errors.push('Project must have a rewards object');
  } else {
    if (typeof project.rewards.xp !== 'number' || project.rewards.xp < 0) {
      errors.push('Project rewards.xp must be a non-negative number');
    }
    if (!Array.isArray(project.rewards.badges)) {
      errors.push('Project rewards.badges must be an array');
    }
    if (!Array.isArray(project.rewards.skills)) {
      errors.push('Project rewards.skills must be an array');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validates gaming tournament data structure
 * @param {Object} tournament - Tournament object to validate
 * @returns {Object} - Validation result with isValid boolean and errors array
 */
export const validateTournament = tournament => {
  const errors = [];

  // Required fields validation
  if (!tournament.id || typeof tournament.id !== 'string') {
    errors.push('Tournament must have a valid id (string)');
  }

  if (!tournament.name || typeof tournament.name !== 'string') {
    errors.push('Tournament must have a valid name (string)');
  }

  if (!tournament.game || typeof tournament.game !== 'string') {
    errors.push('Tournament must have a valid game (string)');
  }

  // Date validation
  if (!tournament.date || typeof tournament.date !== 'string') {
    errors.push('Tournament must have a valid date (string)');
  } else {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(tournament.date)) {
      errors.push('Tournament date must be in YYYY-MM-DD format');
    }
  }

  // Placement validation
  if (!tournament.placement || typeof tournament.placement !== 'string') {
    errors.push('Tournament must have a valid placement (string)');
  }

  // Participants validation
  if (
    typeof tournament.participants !== 'number' ||
    tournament.participants <= 0
  ) {
    errors.push('Tournament participants must be a positive number');
  }

  // Achievement validation
  const validAchievements = ['gold', 'silver', 'bronze', 'participation'];
  if (!validAchievements.includes(tournament.achievement)) {
    errors.push(
      `Tournament achievement must be one of: ${validAchievements.join(', ')}`
    );
  }

  // Skills validation
  if (!Array.isArray(tournament.skills)) {
    errors.push('Tournament skills must be an array');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validates skill category data structure
 * @param {Object} category - Skill category object to validate
 * @returns {Object} - Validation result with isValid boolean and errors array
 */
export const validateSkillCategory = category => {
  const errors = [];

  if (!category.name || typeof category.name !== 'string') {
    errors.push('Skill category must have a valid name (string)');
  }

  if (!category.icon || typeof category.icon !== 'string') {
    errors.push('Skill category must have a valid icon (string)');
  }

  if (!category.color || typeof category.color !== 'string') {
    errors.push('Skill category must have a valid color (string)');
  }

  if (!category.description || typeof category.description !== 'string') {
    errors.push('Skill category must have a valid description (string)');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validates complete data structure integrity
 * @param {Object} data - Complete data object with all sections
 * @returns {Object} - Comprehensive validation result
 */
export const validateCompleteDataStructure = data => {
  const results = {
    isValid: true,
    errors: [],
    warnings: [],
    sections: {},
  };

  // Validate user profile
  if (data.userProfile) {
    const profileValidation = validateUserProfile(data.userProfile);
    results.sections.userProfile = profileValidation;
    if (!profileValidation.isValid) {
      results.isValid = false;
      results.errors.push(
        ...profileValidation.errors.map(err => `UserProfile: ${err}`)
      );
    }
  } else {
    results.isValid = false;
    results.errors.push('Missing userProfile data');
  }

  // Validate skills
  if (Array.isArray(data.skills)) {
    const skillValidations = data.skills.map((skill, index) => {
      const validation = validateSkill(skill);
      if (!validation.isValid) {
        results.isValid = false;
        results.errors.push(
          ...validation.errors.map(err => `Skill[${index}]: ${err}`)
        );
      }
      return validation;
    });
    results.sections.skills = skillValidations;
  } else {
    results.isValid = false;
    results.errors.push('Skills data must be an array');
  }

  // Validate skill categories
  if (data.skillCategories && typeof data.skillCategories === 'object') {
    Object.entries(data.skillCategories).forEach(([key, category]) => {
      const validation = validateSkillCategory(category);
      if (!validation.isValid) {
        results.isValid = false;
        results.errors.push(
          ...validation.errors.map(err => `SkillCategory[${key}]: ${err}`)
        );
      }
    });
  } else {
    results.isValid = false;
    results.errors.push('Missing or invalid skillCategories data');
  }

  // Validate projects
  if (data.projectsData && Array.isArray(data.projectsData.projects)) {
    const projectValidations = data.projectsData.projects.map(
      (project, index) => {
        const validation = validateProject(project);
        if (!validation.isValid) {
          results.isValid = false;
          results.errors.push(
            ...validation.errors.map(err => `Project[${index}]: ${err}`)
          );
        }
        return validation;
      }
    );
    results.sections.projects = projectValidations;
  } else {
    results.isValid = false;
    results.errors.push('Missing or invalid projectsData.projects array');
  }

  // Validate gaming tournaments
  if (data.gamingData && Array.isArray(data.gamingData.tournaments)) {
    const tournamentValidations = data.gamingData.tournaments.map(
      (tournament, index) => {
        const validation = validateTournament(tournament);
        if (!validation.isValid) {
          results.isValid = false;
          results.errors.push(
            ...validation.errors.map(err => `Tournament[${index}]: ${err}`)
          );
        }
        return validation;
      }
    );
    results.sections.tournaments = tournamentValidations;
  } else {
    results.isValid = false;
    results.errors.push('Missing or invalid gamingData.tournaments array');
  }

  return results;
};

/**
 * Utility function to check data consistency across different sections
 * @param {Object} data - Complete data object
 * @returns {Object} - Consistency check results
 */
export const checkDataConsistency = data => {
  const warnings = [];
  const errors = [];

  // Check if skill IDs referenced in projects exist
  if (data.projectsData && data.skills) {
    const skillIds = new Set(data.skills.map(skill => skill.id));

    data.projectsData.projects.forEach(project => {
      if (project.rewards && project.rewards.skills) {
        project.rewards.skills.forEach(skillName => {
          // This is a simplified check - in a real scenario, you might want to map skill names to IDs
          const matchingSkill = data.skills.find(
            skill => skill.name.toLowerCase() === skillName.toLowerCase()
          );
          if (!matchingSkill) {
            warnings.push(
              `Project "${project.title}" references skill "${skillName}" that doesn't exist in skills data`
            );
          }
        });
      }
    });
  }

  // Check if certification names in user profile match those in skills
  if (data.userProfile && data.skills) {
    const skillCertifications = new Set();
    data.skills.forEach(skill => {
      skill.certifications.forEach(cert => skillCertifications.add(cert));
    });

    data.userProfile.background.certifications.forEach(cert => {
      if (!skillCertifications.has(cert.name)) {
        warnings.push(
          `User profile certification "${cert.name}" is not referenced in any skill`
        );
      }
    });
  }

  // Check if gaming achievements count matches actual tournaments
  if (data.gamingData && data.userProfile) {
    const tournamentCount = data.gamingData.tournaments.length;
    const profileTournamentCount = data.userProfile.stats.tournamentsPlayed;

    if (tournamentCount !== profileTournamentCount) {
      warnings.push(
        `Tournament count mismatch: ${tournamentCount} tournaments in data vs ${profileTournamentCount} in profile stats`
      );
    }
  }

  return {
    hasIssues: warnings.length > 0 || errors.length > 0,
    warnings,
    errors,
  };
};
