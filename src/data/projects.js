// Projects data structured as game missions/levels
export const projectsData = {
  // Mission categories
  categories: [
    {
      id: 'web-development',
      name: 'Web Development Missions',
      icon: '🌐',
      description: 'Full-stack web applications and frontend challenges',
      color: 'cyan',
    },
    {
      id: 'healthcare',
      name: 'Healthcare Solutions',
      icon: '🏥',
      description: 'Medical and pharmaceutical web applications',
      color: 'green',
    },
    {
      id: 'education',
      name: 'Educational Platforms',
      icon: '📚',
      description: 'Learning and examination systems',
      color: 'purple',
    },
    {
      id: 'blogging',
      name: 'Content Management',
      icon: '✍️',
      description: 'Blogging and content creation platforms',
      color: 'orange',
    },
  ],

  // Project missions
  projects: [
    {
      id: 'sparkin',
      title: 'SparkIn',
      subtitle: 'Markdown-based Developer Blogging System',
      category: 'blogging',
      difficulty: 'Epic',
      status: 'completed',
      completionDate: '2023-08-15',
      duration: '3 months',
      description:
        'A comprehensive markdown-based developer blogging system built with MERN stack, featuring JWT authentication and React-Markdown integration.',
      longDescription:
        'SparkIn is a modern blogging platform specifically designed for developers. It features a clean, minimalist interface with markdown support, syntax highlighting for code blocks, and a robust authentication system. The platform allows developers to write, publish, and share technical articles with ease.',
      technologies: [
        'React',
        'Node.js',
        'Express',
        'JWT',
        'React-Markdown',
        'MongoDB',
      ],
      features: [
        'Markdown-based article writing',
        'Syntax highlighting for code blocks',
        'JWT-based authentication system',
        'User profile management',
        'Article categorization and tagging',
        'Responsive design for all devices',
        'Search functionality',
        'Comment system for articles',
      ],
      challenges: [
        'Implementing secure JWT authentication',
        'Optimizing markdown rendering performance',
        'Creating a user-friendly markdown editor',
        'Managing complex state across components',
      ],
      achievements: [
        'Clean and intuitive user interface',
        'Fast markdown rendering',
        'Secure authentication system',
        'Mobile-responsive design',
      ],
      links: {
        github: 'https://github.com/MaybeJaydeep/SparkIn',
      },
      githubUrl: 'https://github.com/MaybeJaydeep/SparkIn',
      images: [
        '/assets/images/projects/sparkin-home.svg',
        '/assets/images/projects/sparkin-signup.svg',
        '/assets/images/projects/sparkin-login.svg',
      ],
      rewards: {
        xp: 2000,
        badges: [
          'Full-Stack Developer',
          'Authentication Expert',
          'Content Management',
        ],
        skills: ['MERN Stack', 'JWT Authentication', 'Markdown Processing'],
      },
    },
    {
      id: 'omenmedicare',
      title: 'OmenMedicare',
      subtitle: 'Pharmaceutical Web Application',
      category: 'healthcare',
      difficulty: 'Legendary',
      status: 'completed',
      completionDate: '2023-06-20',
      duration: '4 months',
      description:
        'A fully automated pharmaceutical web application with rich analytical tools, built using Bootstrap, jQuery, SCSS, PHP, and MySQL.',
      longDescription:
        'OmenMedicare is a comprehensive pharmaceutical management system that automates various aspects of medical inventory, patient management, and analytics. The platform provides healthcare professionals with powerful tools to manage their operations efficiently.',
      technologies: ['Bootstrap', 'jQuery', 'SCSS', 'PHP', 'MySQL'],
      features: [
        'Automated pharmaceutical inventory management',
        'Patient management system',
        'Advanced analytics and reporting',
        'Prescription management',
        'Drug interaction checking',
        'Billing and invoice generation',
        'Multi-user role management',
        'Real-time notifications',
      ],
      challenges: [
        'Implementing complex pharmaceutical business logic',
        'Creating comprehensive analytics dashboard',
        'Ensuring data security and privacy compliance',
        'Optimizing database queries for large datasets',
      ],
      achievements: [
        'Successfully deployed and live at omenmedicare.com',
        'Comprehensive pharmaceutical management features',
        'Advanced analytical tools implementation',
        'Secure and scalable architecture',
      ],
      links: {
        live: 'https://omenmedicare.com',
      },
      liveUrl: 'https://omenmedicare.com',
      images: [
        '/assets/images/projects/omenmedicare-1.svg',
        '/assets/images/projects/omenmedicare-2.svg',
        '/assets/images/projects/omenmedicare-3.svg',
      ],
      rewards: {
        xp: 2500,
        badges: ['Healthcare Solutions', 'Analytics Expert', 'PHP Master'],
        skills: ['PHP Development', 'Healthcare Systems', 'Database Design'],
      },
    },
    {
      id: 'justexam',
      title: 'JustExam',
      subtitle: 'Online Examination System',
      category: 'education',
      difficulty: 'Epic',
      status: 'completed',
      completionDate: '2023-04-10',
      duration: '2.5 months',
      description:
        'An online examination system with rich analytical tools, built using Bootstrap, jQuery, SCSS, AJAX, PHP, and MySQL.',
      longDescription:
        'JustExam is a comprehensive online examination platform that enables educational institutions to conduct secure online exams. The system includes features for question management, exam scheduling, automatic grading, and detailed analytics.',
      technologies: ['Bootstrap', 'jQuery', 'SCSS', 'AJAX', 'PHP', 'MySQL'],
      features: [
        'Online exam creation and management',
        'Multiple question types support',
        'Automatic grading system',
        'Real-time exam monitoring',
        'Detailed analytics and reports',
        'Student performance tracking',
        'Secure exam environment',
        'Time management and controls',
      ],
      challenges: [
        'Implementing secure exam environment',
        'Creating real-time monitoring system',
        'Developing comprehensive analytics',
        'Ensuring system scalability for multiple concurrent users',
      ],
      achievements: [
        'Secure online examination platform',
        'Comprehensive analytical tools',
        'Real-time monitoring capabilities',
        'Scalable architecture for multiple users',
      ],
      links: {
        github: 'https://github.com/MaybeJaydeep/JustExam',
      },
      githubUrl: 'https://github.com/MaybeJaydeep/JustExam',
      images: [
        '/assets/images/projects/justexam-1.svg',
        '/assets/images/projects/justexam-2.svg',
        '/assets/images/projects/justexam-3.svg',
      ],
      rewards: {
        xp: 1800,
        badges: ['Education Technology', 'Security Expert', 'Analytics Master'],
        skills: [
          'Educational Systems',
          'Security Implementation',
          'Real-time Systems',
        ],
      },
    },
  ],

  // Technology color mapping
  technologies: {
    React: { color: '#61DAFB' },
    'Node.js': { color: '#339933' },
    MongoDB: { color: '#47A248' },
    Express: { color: '#000000' },
    JWT: { color: '#000000' },
    'React-Markdown': { color: '#61DAFB' },
    Bootstrap: { color: '#7952B3' },
    jQuery: { color: '#0769AD' },
    SCSS: { color: '#CF649A' },
    PHP: { color: '#777BB4' },
    MySQL: { color: '#4479A1' },
    AJAX: { color: '#0769AD' },
  },

  // Mission statistics
  stats: {
    totalProjects: 6,
    completedProjects: 6,
    inProgressProjects: 0,
    totalXP: 6300,
    totalBadges: 9,
    averageRating: 4.8,
    technologiesUsed: 9,
  },

  // Difficulty levels
  difficultyLevels: {
    Common: {
      color: 'gray',
      xpRange: '100-500',
      description: 'Basic projects and learning exercises',
    },
    Rare: {
      color: 'blue',
      xpRange: '500-1500',
      description: 'Intermediate projects with moderate complexity',
    },
    Epic: {
      color: 'purple',
      xpRange: '1500-2500',
      description: 'Advanced projects requiring specialized skills',
    },
    Legendary: {
      color: 'yellow',
      xpRange: '2500+',
      description: 'Complex, large-scale projects with significant impact',
    },
  },
};

// Helper functions for project data manipulation
export const getProjectsByCategory = categoryId => {
  if (!categoryId || categoryId === 'all') {
    return projectsData.projects;
  }
  return projectsData.projects.filter(
    project => project.category === categoryId
  );
};

export const getFeaturedProjects = () => {
  return projectsData.projects.filter(project => project.featured === true);
};

export const getProjectById = projectId => {
  return projectsData.projects.find(project => project.id === projectId);
};

export const getProjectsByStatus = status => {
  return projectsData.projects.filter(project => project.status === status);
};

export const getProjectsByDifficulty = difficulty => {
  return projectsData.projects.filter(
    project => project.difficulty === difficulty
  );
};

export const searchProjects = searchTerm => {
  const term = searchTerm.toLowerCase();
  return projectsData.projects.filter(
    project =>
      project.title.toLowerCase().includes(term) ||
      project.description.toLowerCase().includes(term) ||
      project.technologies.some(tech => tech.toLowerCase().includes(term))
  );
};

export const sortProjectsByDate = (projects, ascending = false) => {
  return [...projects].sort((a, b) => {
    const dateA = new Date(a.completionDate || a.startDate || '1970-01-01');
    const dateB = new Date(b.completionDate || b.startDate || '1970-01-01');
    return ascending ? dateA - dateB : dateB - dateA;
  });
};

export const getProjectStats = () => {
  const projects = projectsData.projects;
  const categories = projectsData.categories;

  return {
    total: projects.length,
    completed: projects.filter(p => p.status === 'completed').length,
    inProgress: projects.filter(p => p.status === 'in-progress').length,
    planned: projects.filter(p => p.status === 'planned').length,
    featured: projects.filter(p => p.featured === true).length,
    byCategory: categories.map(cat => ({
      category: cat.name,
      count: projects.filter(p => p.category === cat.id).length,
    })),
    byDifficulty: {
      common: projects.filter(p => p.difficulty === 'Common').length,
      rare: projects.filter(p => p.difficulty === 'Rare').length,
      epic: projects.filter(p => p.difficulty === 'Epic').length,
      legendary: projects.filter(p => p.difficulty === 'Legendary').length,
    },
  };
};
