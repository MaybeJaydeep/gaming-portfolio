// Skills data with skill tree structure for gaming-themed visualization
export const skillCategories = {
  frontend: {
    name: 'Frontend Development',
    icon: '🎨',
    color: 'cyan',
    description: 'User interface and experience technologies',
  },
  backend: {
    name: 'Backend Development',
    icon: '⚙️',
    color: 'green',
    description: 'Server-side and database technologies',
  },
  database: {
    name: 'Database Technologies',
    icon: '🗄️',
    color: 'blue',
    description: 'Data storage and management systems',
  },
  tools: {
    name: 'Development Tools',
    icon: '🛠️',
    color: 'orange',
    description: 'Development and deployment tools',
  },
  frameworks: {
    name: 'Frameworks & Libraries',
    icon: '📚',
    color: 'purple',
    description: 'Development frameworks and libraries',
  },
};

export const skills = [
  // Frontend Skills
  {
    id: 'react',
    name: 'React',
    category: 'frontend',
    proficiency: 80,
    yearsExperience: 3,
    level: 'Advanced',
    certifications: [],
    projects: ['SparkIn', 'OmenMedicare', 'JustExam'],
    prerequisites: ['javascript'],
    unlocked: true,
    description:
      'Modern React development with hooks, context, and component architecture',
  },
  {
    id: 'nextjs',
    name: 'Next.js',
    category: 'frontend',
    proficiency: 75,
    yearsExperience: 2,
    level: 'Advanced',
    certifications: [],
    projects: ['Modern Web Applications'],
    prerequisites: ['react'],
    unlocked: true,
    description: 'Full-stack React framework with SSR and static generation',
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    category: 'frontend',
    proficiency: 95,
    yearsExperience: 3,
    level: 'Expert',
    certifications: [],
    projects: ['SparkIn', 'OmenMedicare', 'JustExam'],
    prerequisites: [],
    unlocked: true,
    description:
      'Modern ES6+ JavaScript with async/await, modules, and advanced patterns',
  },
  {
    id: 'tailwind',
    name: 'Tailwind CSS',
    category: 'frontend',
    proficiency: 99,
    yearsExperience: 3,
    level: 'Expert',
    certifications: [],
    projects: ['MrSpark Portfolio', 'Modern Web Apps'],
    prerequisites: [],
    unlocked: true,
    description: 'Utility-first CSS framework for rapid UI development',
  },
  {
    id: 'bootstrap',
    name: 'Bootstrap',
    category: 'frontend',
    proficiency: 85,
    yearsExperience: 3,
    level: 'Advanced',
    certifications: [],
    projects: ['OmenMedicare', 'JustExam'],
    prerequisites: [],
    unlocked: true,
    description: 'Popular CSS framework for responsive web design',
  },
  {
    id: 'shadcn',
    name: 'ShadCN',
    category: 'frontend',
    proficiency: 80,
    yearsExperience: 1,
    level: 'Advanced',
    certifications: [],
    projects: ['Modern UI Components'],
    prerequisites: ['react', 'tailwind'],
    unlocked: true,
    description: 'Modern React component library with Tailwind CSS',
  },
  {
    id: 'daisyui',
    name: 'Daisy UI',
    category: 'frontend',
    proficiency: 75,
    yearsExperience: 1,
    level: 'Advanced',
    certifications: [],
    projects: ['UI Component Systems'],
    prerequisites: ['tailwind'],
    unlocked: true,
    description: 'Component library for Tailwind CSS',
  },
  {
    id: 'reactbits',
    name: 'ReactBits',
    category: 'frameworks',
    proficiency: 70,
    yearsExperience: 1,
    level: 'Advanced',
    certifications: [],
    projects: ['Modern React Components'],
    prerequisites: ['react'],
    unlocked: true,
    description: 'Modern React component library and utilities',
  },

  // Backend Skills
  {
    id: 'nodejs',
    name: 'Node.js',
    category: 'backend',
    proficiency: 90,
    yearsExperience: 3,
    level: 'Expert',
    certifications: [],
    projects: ['SparkIn', 'API Development'],
    prerequisites: ['javascript'],
    unlocked: true,
    description: 'Server-side JavaScript runtime for scalable applications',
  },
  {
    id: 'express',
    name: 'Express.js',
    category: 'backend',
    proficiency: 90,
    yearsExperience: 3,
    level: 'Expert',
    certifications: [],
    projects: ['SparkIn', 'REST APIs'],
    prerequisites: ['nodejs'],
    unlocked: true,
    description: 'Fast, unopinionated web framework for Node.js',
  },
  {
    id: 'php',
    name: 'PHP',
    category: 'backend',
    proficiency: 95,
    yearsExperience: 3,
    level: 'Expert',
    certifications: [],
    projects: ['OmenMedicare', 'JustExam'],
    prerequisites: [],
    unlocked: true,
    description: 'Server-side scripting language for web development',
  },
  {
    id: 'java',
    name: 'Java',
    category: 'backend',
    proficiency: 70,
    yearsExperience: 2,
    level: 'Intermediate',
    certifications: [],
    projects: ['Enterprise Applications'],
    prerequisites: [],
    unlocked: true,
    description:
      'Object-oriented programming language for enterprise applications',
  },
  {
    id: 'flask',
    name: 'Flask',
    category: 'backend',
    proficiency: 60,
    yearsExperience: 1,
    level: 'Intermediate',
    certifications: [],
    projects: ['Python Web Applications'],
    prerequisites: ['python'],
    unlocked: true,
    description: 'Lightweight Python web framework',
  },
  {
    id: 'python',
    name: 'Python',
    category: 'backend',
    proficiency: 60,
    yearsExperience: 2,
    level: 'Intermediate',
    certifications: [],
    projects: ['Data Analysis', 'Web Applications'],
    prerequisites: [],
    unlocked: true,
    description:
      'Versatile programming language for web development and data science',
  },

  // Database Skills
  {
    id: 'mongodb',
    name: 'MongoDB',
    category: 'database',
    proficiency: 85,
    yearsExperience: 3,
    level: 'Advanced',
    certifications: [],
    projects: ['SparkIn', 'NoSQL Applications'],
    prerequisites: [],
    unlocked: true,
    description: 'NoSQL document database for modern applications',
  },
  {
    id: 'mysql',
    name: 'MySQL',
    category: 'database',
    proficiency: 90,
    yearsExperience: 3,
    level: 'Expert',
    certifications: [],
    projects: ['OmenMedicare', 'JustExam'],
    prerequisites: [],
    unlocked: true,
    description: 'Relational database management system',
  },

  // Frameworks & Libraries
  {
    id: 'framer-motion',
    name: 'Framer Motion',
    category: 'frameworks',
    proficiency: 85,
    yearsExperience: 2,
    level: 'Advanced',
    certifications: [],
    projects: ['MrSpark Portfolio', 'Animated Web Apps'],
    prerequisites: ['react'],
    unlocked: true,
    description: 'Production-ready motion library for React',
  },
  {
    id: 'redux',
    name: 'Redux',
    category: 'frameworks',
    proficiency: 75,
    yearsExperience: 2,
    level: 'Advanced',
    certifications: [],
    projects: ['State Management Applications'],
    prerequisites: ['react'],
    unlocked: true,
    description: 'Predictable state container for JavaScript apps',
  },
  {
    id: 'axios',
    name: 'Axios',
    category: 'frameworks',
    proficiency: 90,
    yearsExperience: 3,
    level: 'Expert',
    certifications: [],
    projects: ['API Integration Projects'],
    prerequisites: ['javascript'],
    unlocked: true,
    description: 'Promise-based HTTP client for JavaScript',
  },
  {
    id: 'mongoose',
    name: 'Mongoose',
    category: 'frameworks',
    proficiency: 85,
    yearsExperience: 3,
    level: 'Advanced',
    certifications: [],
    projects: ['MongoDB Applications'],
    prerequisites: ['nodejs', 'mongodb'],
    unlocked: true,
    description: 'MongoDB object modeling for Node.js',
  },

  // Tools & Technologies
  {
    id: 'git',
    name: 'Git',
    category: 'tools',
    proficiency: 90,
    yearsExperience: 3,
    level: 'Expert',
    certifications: [],
    projects: ['All Projects'],
    prerequisites: [],
    unlocked: true,
    description: 'Version control system for tracking code changes',
  },
  {
    id: 'docker',
    name: 'Docker',
    category: 'tools',
    proficiency: 75,
    yearsExperience: 2,
    level: 'Advanced',
    certifications: [],
    projects: ['Containerized Applications'],
    prerequisites: [],
    unlocked: true,
    description: 'Containerization platform for application deployment',
  },
  {
    id: 'aws',
    name: 'AWS',
    category: 'tools',
    proficiency: 70,
    yearsExperience: 1,
    level: 'Intermediate',
    certifications: [],
    projects: ['Cloud Deployments'],
    prerequisites: [],
    unlocked: true,
    description: 'Amazon Web Services cloud platform',
  },
  {
    id: 'microservices',
    name: 'Microservices',
    category: 'tools',
    proficiency: 90,
    yearsExperience: 2,
    level: 'Expert',
    certifications: [],
    projects: ['Scalable Applications'],
    prerequisites: ['nodejs', 'docker'],
    unlocked: true,
    description: 'Architectural pattern for building scalable applications',
  },
  {
    id: 'openswift',
    name: 'OpenSwift',
    category: 'tools',
    proficiency: 65,
    yearsExperience: 1,
    level: 'Intermediate',
    certifications: [],
    projects: ['Container Orchestration'],
    prerequisites: ['docker'],
    unlocked: true,
    description: 'Container orchestration and management platform',
  },
];

// Skill tree connections for visualization
export const skillConnections = [
  // Frontend connections
  { from: 'javascript', to: 'react' },
  { from: 'react', to: 'nextjs' },
  { from: 'tailwind', to: 'shadcn' },
  { from: 'tailwind', to: 'daisyui' },

  // Framework connections
  { from: 'react', to: 'framer-motion' },
  { from: 'react', to: 'redux' },
  { from: 'react', to: 'reactbits' },
  { from: 'javascript', to: 'axios' },
  { from: 'nodejs', to: 'mongoose' },
  { from: 'mongodb', to: 'mongoose' },

  // Backend connections
  { from: 'javascript', to: 'nodejs' },
  { from: 'nodejs', to: 'express' },
  { from: 'python', to: 'flask' },

  // Tools connections
  { from: 'docker', to: 'microservices' },
  { from: 'docker', to: 'openswift' },
];

// Get skills by category for organized display
export const getSkillsByCategory = () => {
  const categorizedSkills = {};

  Object.keys(skillCategories).forEach(categoryKey => {
    categorizedSkills[categoryKey] = skills.filter(
      skill => skill.category === categoryKey
    );
  });

  return categorizedSkills;
};

// Get skill by ID
export const getSkillById = id => {
  return skills.find(skill => skill.id === id);
};

// Get prerequisite skills for a given skill
export const getPrerequisites = skillId => {
  const skill = getSkillById(skillId);
  if (!skill || !skill.prerequisites) return [];

  return skill.prerequisites
    .map(prereqId => getSkillById(prereqId))
    .filter(Boolean);
};
