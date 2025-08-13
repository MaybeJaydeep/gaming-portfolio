// User profile data with professional background and achievements
export const userProfile = {
  name: 'Jaydeep Badal',
  title: 'MERN and PHP Web Developer',
  level: 5, // Years of experience
  location: 'Ahmedabad, Gujarat',
  avatar: '/assets/images/avatar.png',
  stats: {
    projectsCompleted: 6,
    technologiesMastered: 12,
    certificationsEarned: 6, // Updated with all IBM certificates
    tournamentsPlayed: 2,
  },

  // Professional background information
  background: {
    education: [
      {
        degree: 'BE in Computer Science and Engineering',
        specialization: 'Data Science',
        institution: 'Gujarat Technological University',
        year: '2026',
        status: 'Pursuing',
      },
      {
        degree: 'Diploma in Computer Engineering',
        specialization: 'Computer Engineering',
        institution: 'Gujarat Technological University',
        year: '2023',
        status: 'Completed',
      },
    ],
    certifications: [
      {
        name: 'Containers with Docker, Kubernetes, and OpenShift',
        issuer: 'IBM Career Education Program',
        year: '2025',
        level: 'Professional',
        courseCode: 'CC0202EN',
        issueDate: 'July 14, 2025',
        skills: [
          'Docker',
          'Kubernetes',
          'OpenShift',
          'Container Orchestration',
          'DevOps',
        ],
        verificationUrl:
          'https://courses.ibmcep.cognitiveclass.ai/certificates/c7c61d33b23443f9bb0736ce7e47a73c',
        description:
          'Comprehensive course on containerization technologies and orchestration platforms',
        provider: 'IBM Skills Network',
      },
      {
        name: 'Microservices and Serverless for Application Developers',
        issuer: 'IBM Career Education Program',
        year: '2025',
        level: 'Professional',
        courseCode: 'CD0260EN',
        issueDate: 'July 17, 2025',
        skills: [
          'Microservices',
          'Serverless Architecture',
          'Application Development',
          'Cloud Computing',
        ],
        verificationUrl:
          'https://courses.ibmcep.cognitiveclass.ai/certificates/bca3ba3534d94638b4259287247a60247',
        description:
          'Advanced course on modern application architecture patterns and serverless computing',
        provider: 'IBM Skills Network',
      },
      {
        name: 'Project on SparkIn: A Markdown-Based Blogging Platform for Developers',
        issuer: 'IBM Career Education Program',
        year: '2025',
        level: 'Capstone Project',
        issueDate: 'July 29, 2025',
        skills: [
          'HTML',
          'CSS',
          'JavaScript',
          'Git',
          'GitHub',
          'Front-End Development',
          'Docker',
          'Kubernetes',
          'OpenShift',
          'Microservices',
          'Serverless',
          'Full Stack Development',
        ],
        verificationUrl:
          'https://ibmcep.cognitiveclass.ai/certificates/4e7864d-cb35-4860-bbc8-1b5fa624a167',
        description:
          'Capstone project demonstrating full-stack development skills with modern technologies',
        provider: 'IBM Skills Network',
        projectDetails: {
          name: 'BlogNest',
          type: 'Markdown-Based Blogging Platform',
          target: 'Developers',
          technologies: [
            'HTML',
            'CSS',
            'JavaScript',
            'Git',
            'GitHub',
            'Docker',
            'Kubernetes',
            'OpenShift',
            'Microservices',
            'Serverless',
          ],
        },
      },
      {
        name: 'React for Front-End Development',
        issuer: 'IBM Career Education Program',
        year: '2025',
        level: 'Professional',
        courseCode: 'CD0210EN',
        issueDate: 'July 9, 2025',
        skills: [
          'React',
          'Front-End Development',
          'JavaScript',
          'Component Architecture',
          'State Management',
        ],
        verificationUrl:
          'https://courses.ibmcep.cognitiveclass.ai/certificates/b387db56a1ae84ada8b0b947467c4052a',
        description:
          'Comprehensive course on React framework for building modern front-end applications',
        provider: 'IBM Skills Network',
      },
      {
        name: 'Getting Started with Git and GitHub',
        issuer: 'IBM Career Education Program',
        year: '2025',
        level: 'Professional',
        courseCode: 'CD0131EN',
        issueDate: 'July 4, 2025',
        skills: [
          'Git',
          'GitHub',
          'Version Control',
          'Collaboration',
          'Source Code Management',
        ],
        verificationUrl:
          'https://courses.ibmcep.cognitiveclass.ai/certificates/dee8f90cba432c5889e12bac2236e004',
        description:
          'Essential course on version control systems and collaborative development workflows',
        provider: 'IBM Skills Network',
      },
      {
        name: 'HTML, CSS, and JavaScript for Beginners',
        issuer: 'IBM Career Education Program',
        year: '2025',
        level: 'Professional',
        courseCode: 'WD0102EN',
        issueDate: 'July 4, 2025',
        skills: [
          'HTML',
          'CSS',
          'JavaScript',
          'Web Development',
          'Front-End Fundamentals',
        ],
        verificationUrl:
          'https://courses.ibmcep.cognitiveclass.ai/certificates/9eee5a3d4d324f64a3358e313bc08b6e',
        description:
          'Foundational course covering essential web development technologies and best practices',
        provider: 'IBM Skills Network',
      },
    ],
    experience: {
      totalYears: 3,
      currentRole: 'MERN Developer at Bacany (About to join)',
      previousRoles: ['Intern in IBM for MERN Developer'],
    },
  },

  // Professional Experience for detailed display
  professionalExperience: [
    {
      id: 'ibm-internship',
      company: 'IBM',
      position: 'Full Stack Developer Intern',
      duration: '15 days',
      period: 'July 2025',
      type: 'Internship',
      status: 'Completed',
      location: 'Remote',
      description:
        'Intensive internship program focused on full-stack development using modern technologies and methodologies.',
      projectsDelivered: [
        {
          name: 'SparkIn',
          type: 'Markdown-Based Blogging Platform',
          description:
            'A comprehensive blogging platform designed specifically for developers, featuring markdown support and modern UI/UX.',
          technologies: [
            'HTML5',
            'CSS3',
            'JavaScript',
            'React',
            'Node.js',
            'Git',
            'GitHub',
            'Docker',
            'Kubernetes',
            'OpenShift',
            'Microservices',
            'Serverless Architecture',
          ],
          impact:
            'Successfully delivered a fully functional platform demonstrating full-stack development capabilities',
        },
      ],
      skillsGained: [
        'Full Stack Development',
        'React Development',
        'Node.js Backend',
        'Containerization with Docker',
        'Kubernetes Orchestration',
        'OpenShift Deployment',
        'Microservices Architecture',
        'Serverless Computing',
        'Git Version Control',
        'Agile Development',
        'Project Management',
        'Technical Documentation',
      ],
      achievements: [
        'Successfully completed intensive 15-day program',
        'Delivered production-ready application',
        'Gained hands-on experience with enterprise technologies',
        'Earned 6 professional certifications',
        'Demonstrated proficiency in modern development practices',
      ],
      mentorship:
        'Worked under senior developers and received guidance on industry best practices',
      learningOutcomes: [
        'Advanced understanding of full-stack development lifecycle',
        'Practical experience with containerization and orchestration',
        'Proficiency in modern JavaScript frameworks and libraries',
        'Knowledge of cloud-native application development',
        'Understanding of DevOps practices and CI/CD pipelines',
      ],
    },
    {
      id: 'upcoming-role',
      company: 'Bacany Technology',
      position: 'MERN Stack Developer',
      duration: 'Full-time',
      period: 'Starting Soon',
      type: 'Full-time Position',
      status: 'About to Join',
      location: 'Ahmedabad, Gujarat',
      description:
        'Upcoming role as a MERN Stack Developer focusing on building scalable web applications and contributing to innovative projects.',
      expectedResponsibilities: [
        'Develop and maintain web applications using MERN stack',
        'Collaborate with cross-functional teams',
        'Implement responsive and user-friendly interfaces',
        'Optimize application performance and scalability',
        'Participate in code reviews and technical discussions',
        'Contribute to architectural decisions',
      ],
      skillsToApply: [
        'MongoDB',
        'Express.js',
        'React.js',
        'Node.js',
        'JavaScript/TypeScript',
        'RESTful APIs',
        'Database Design',
        'Version Control (Git)',
        'Agile Methodologies',
      ],
    },
  ],

  // Character stats for gaming-style presentation
  characterStats: {
    react: {
      name: 'React Development',
      level: 80,
      maxLevel: 100,
      experience: 4000,
      nextLevelExp: 5000,
    },
    tailwindcss: {
      name: 'Tailwind CSS',
      level: 99,
      maxLevel: 100,
      experience: 4950,
      nextLevelExp: 5000,
    },
    nodejs: {
      name: 'Node.js',
      level: 90,
      maxLevel: 100,
      experience: 4500,
      nextLevelExp: 5000,
    },
    php: {
      name: 'PHP Development',
      level: 95,
      maxLevel: 100,
      experience: 4750,
      nextLevelExp: 5000,
    },
    javascript: {
      name: 'JavaScript',
      level: 95,
      maxLevel: 100,
      experience: 4750,
      nextLevelExp: 5000,
    },
    microservices: {
      name: 'Microservices & APIs',
      level: 90,
      maxLevel: 100,
      experience: 4500,
      nextLevelExp: 5000,
    },
  },

  // Achievements for unlock animations
  achievements: [
    {
      id: 'ibm-intern',
      name: 'IBM Intern',
      description: 'Completed internship at IBM as MERN Developer',
      icon: '🏢',
      unlocked: true,
      unlockedDate: '2025-07-18',
      rarity: 'legendary',
    },
    {
      id: 'mern-master',
      name: 'MERN Stack Master',
      description: 'Mastered the MERN stack development',
      icon: '🏆',
      unlocked: true,
      unlockedDate: '2025-06-15',
      rarity: 'epic',
    },
    {
      id: 'php-expert',
      name: 'PHP Expert',
      description: 'Advanced PHP development skills (95/100)',
      icon: '⚡',
      unlocked: true,
      unlockedDate: '2022-08-20',
      rarity: 'epic',
    },
    {
      id: 'tailwind-master',
      name: 'Tailwind CSS Master',
      description: 'Near-perfect Tailwind CSS expertise (99/100)',
      icon: '🎨',
      unlocked: true,
      unlockedDate: '2025-02-15',
      rarity: 'legendary',
    },
    {
      id: 'project-master',
      name: 'Project Master',
      description: 'Successfully completed 6+ professional projects',
      icon: '💼',
      unlocked: true,
      unlockedDate: '2023-09-01',
      rarity: 'rare',
    },
  ],
};
