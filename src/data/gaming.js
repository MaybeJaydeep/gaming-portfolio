// Gaming achievements, tournament history, and interests data
export const gamingData = {
  // Gaming profile stats
  gamingProfile: {
    gamertag: 'MrSpark',
    level: 214, // Valorant level
    totalHours: 15000, // Updated total including Clash of Clans
    favoriteGenres: ['Battle Royale', 'FPS', 'Strategy', 'Action', 'Adventure'],
    platforms: ['Mobile', 'PC', 'Xbox', 'PlayStation'],
    currentRank: 'Conqueror (PUBG), Plat 2 (Valorant), TH15 (Clash of Clans)',
    peakRank: 'Conqueror, Legend League (Clash of Clans)',
  },

  // Tournament participation and competitive achievements
  tournaments: [
    {
      id: 'pmgc-2020',
      name: 'PMGC',
      game: 'PUBG Mobile',
      date: '2020',
      placement: 'State Level Qualifier',
      prize: '₹30,000',
      teamName: 'OFCSparkOP',
      participants: 'Under 64 teams',
      achievement: 'prize_winner',
      description:
        'Participated in PUBG Mobile Global Championship state level qualifiers with team OFCSparkOP and earned ₹30,000.',
      skills: [
        'Team Coordination',
        'Strategic Planning',
        'Pressure Management',
      ],
    },
    {
      id: 'coc-official-2018',
      name: 'Clash of Clans Official Tournament',
      game: 'Clash of Clans',
      date: '2018',
      placement: 'Runner Up',
      prize: '₹5,000',
      teamName: 'Solo Player',
      participants: 'India Top 100 Players',
      achievement: 'runner_up',
      description:
        "Achieved runner-up position in Clash of Clans official tournament, competing against India's top 100 players and legend league pros.",
      skills: [
        'Strategic Base Building',
        'Attack Planning',
        'Resource Management',
      ],
    },
  ],

  // Local tournaments and betting achievements
  localTournaments: [
    {
      id: 'bgmi-local',
      name: 'BGMI Local Tournaments & Bets',
      game: 'BGMI',
      totalEarnings: '₹5,000',
      description:
        'Multiple local tournament wins and successful betting in BGMI matches',
      achievements: ['Multiple Tournament Wins', 'Consistent Performance'],
    },
    {
      id: 'coc-local',
      name: 'Clash of Clans Local Tournaments & Bets',
      game: 'Clash of Clans',
      totalEarnings: '₹2,000',
      description:
        'Local tournament participation and strategic betting in Clash of Clans',
      achievements: ['Strategic Gameplay', 'Base Building Expertise'],
    },
    {
      id: 'valorant-local',
      name: 'Valorant Local Tournaments & Bets',
      game: 'Valorant',
      totalEarnings: '₹4,000',
      description:
        'Local tournament wins and successful betting in Valorant competitive matches',
      achievements: ['Tactical Shooting', 'Team Coordination'],
    },
  ],

  // Gaming achievements and milestones
  achievements: [
    {
      id: 'pubg-conqueror',
      name: 'PUBG Conqueror',
      description: 'Achieved Conqueror rank in PUBG Mobile/BGMI',
      icon: '👑',
      unlocked: true,
      unlockedDate: '2020-08-15',
      rarity: 'legendary',
      progress: 1,
      maxProgress: 1,
    },
    {
      id: 'tournament-invites',
      name: 'Tournament Invitations',
      description:
        'Received official tournament invitations and played T1 tournaments',
      icon: '🏆',
      unlocked: true,
      unlockedDate: '2020-09-20',
      rarity: 'epic',
      progress: 1,
      maxProgress: 1,
    },
    {
      id: 'streamer-tournaments',
      name: 'Streamer Tournaments',
      description:
        'Played with popular streamers like Snax Gaming, Mortal Gaming, and Scout Gaming',
      icon: '🎮',
      unlocked: true,
      unlockedDate: '2020-10-10',
      rarity: 'legendary',
      progress: 1,
      maxProgress: 1,
    },
    {
      id: 'valorant-plat',
      name: 'Valorant Platinum',
      description: 'Achieved Peak Plat 2 rank in Valorant',
      icon: '⚡',
      unlocked: true,
      unlockedDate: '2022-03-10',
      rarity: 'rare',
      progress: 1,
      maxProgress: 1,
    },
    {
      id: 'gaming-veteran',
      name: 'Gaming Veteran',
      description:
        'Over 12,000 hours of gaming experience across multiple platforms',
      icon: '🎯',
      unlocked: true,
      unlockedDate: '2023-01-01',
      rarity: 'epic',
      progress: 12000,
      maxProgress: 10000,
    },
    {
      id: 'multi-platform-master',
      name: 'Multi-Platform Master',
      description:
        'Mastered games across Mobile, PC, Xbox, and PlayStation platforms',
      icon: '🕹️',
      unlocked: true,
      unlockedDate: '2022-12-20',
      rarity: 'rare',
      progress: 4,
      maxProgress: 4,
    },
    {
      id: 'coc-th15',
      name: 'Clash of Clans TH15 Master',
      description:
        'Reached Town Hall 15 with 3000+ hours of strategic gameplay',
      icon: '🏰',
      unlocked: true,
      unlockedDate: '2023-06-15',
      rarity: 'epic',
      progress: 15,
      maxProgress: 15,
    },
    {
      id: 'coc-legend-league',
      name: 'Legend League Player',
      description: "Competed against India's top 100 players in Legend League",
      icon: '⚔️',
      unlocked: true,
      unlockedDate: '2018-08-20',
      rarity: 'legendary',
      progress: 1,
      maxProgress: 1,
    },
    {
      id: 'coc-tournament-runner-up',
      name: 'Official Tournament Runner-Up',
      description:
        'Achieved runner-up position in Clash of Clans official tournament',
      icon: '🥈',
      unlocked: true,
      unlockedDate: '2018-09-15',
      rarity: 'legendary',
      progress: 1,
      maxProgress: 1,
    },
    {
      id: 'local-tournament-master',
      name: 'Local Tournament Champion',
      description:
        'Earned ₹11,000 total from local tournaments and betting across multiple games',
      icon: '💰',
      unlocked: true,
      unlockedDate: '2023-12-01',
      rarity: 'epic',
      progress: 11000,
      maxProgress: 10000,
    },
  ],

  // Gaming interests and favorite games
  interests: [
    {
      category: 'Battle Royale',
      games: [
        {
          name: 'PUBG Mobile/BGMI',
          hours: 9490,
          rank: 'Conqueror',
          role: 'Assault/IGL',
          achievements: [
            'Conqueror Rank',
            'Official Tournament Invitations',
            'T1 Tournaments with Popular Streamers',
            'State Level PMGC Participation',
          ],
          platform: 'Mobile',
        },
      ],
    },
    {
      category: 'FPS Games',
      games: [
        {
          name: 'Valorant',
          hours: 2190,
          rank: 'Peak Plat 2 (Level 214)',
          role: 'Duelist/Controller',
          achievements: [
            'Peak Platinum 2 Rank',
            'Consistent Ranked Performance',
          ],
          platform: 'PC',
        },
        {
          name: 'Call of Duty: Black Ops Series',
          hours: 129,
          rank: 'Casual Player',
          role: 'All-Around',
          achievements: ['Campaign Completion', 'Multiplayer Experience'],
          platform: 'Xbox',
        },
      ],
    },
    {
      category: 'Strategy Games',
      games: [
        {
          name: 'Clash of Clans',
          hours: 3000,
          rank: 'Town Hall 15, Legend League',
          role: 'Strategic Base Builder',
          achievements: [
            'Town Hall 15 Achievement',
            'Legend League Player',
            'Official Tournament Runner-Up',
            'India Top 100 Ranking (2018)',
            'Competed Against Pro Players',
          ],
          platform: 'Mobile',
        },
      ],
    },
    {
      category: 'Action/Adventure',
      games: [
        {
          name: 'Red Dead Redemption Series',
          hours: 283,
          rank: 'Story Completed',
          role: 'Explorer',
          achievements: ['Story Mode Completion', 'Open World Exploration'],
          platform: 'PC',
        },
        {
          name: 'God of War Series',
          hours: 114,
          rank: 'Story Completed',
          role: 'Action Player',
          achievements: ['Multiple Game Completions', 'Boss Battle Mastery'],
          platform: 'PlayStation (2, 3, 4, 5)',
        },
        {
          name: 'Modern Warfare Series',
          hours: 20,
          rank: 'Story Mode',
          role: 'Campaign Player',
          achievements: ['Story Mode Completion'],
          platform: 'Xbox',
        },
        {
          name: 'Hitman Series',
          hours: 25,
          rank: 'Stealth Master',
          role: 'Stealth Player',
          achievements: ['Silent Assassin Ratings', 'Creative Eliminations'],
          platform: 'PC',
        },
      ],
    },
  ],

  // Skills developed through gaming that transfer to professional work
  transferableSkills: [
    {
      skill: 'Leadership & Team Management',
      description:
        'Led teams in competitive PUBG tournaments and coordinated strategies',
      gamesApplied: ['PUBG Mobile', 'Valorant'],
      professionalRelevance:
        'Project leadership and team coordination in development projects',
    },
    {
      skill: 'Strategic Thinking',
      description:
        'Developed complex game strategies and adapted to changing situations',
      gamesApplied: ['PUBG Mobile', 'Valorant', 'Red Dead Redemption'],
      professionalRelevance:
        'System architecture design and problem-solving approaches',
    },
    {
      skill: 'Quick Decision Making',
      description:
        'Made split-second decisions in high-pressure competitive scenarios',
      gamesApplied: ['PUBG Mobile', 'Valorant', 'Call of Duty'],
      professionalRelevance: 'Rapid debugging and critical issue resolution',
    },
    {
      skill: 'Performance Under Pressure',
      description:
        'Maintained high performance in tournament settings with thousands watching',
      gamesApplied: ['PUBG Mobile tournaments', 'Valorant ranked'],
      professionalRelevance:
        'Meeting tight deadlines and handling production issues',
    },
    {
      skill: 'Adaptability',
      description:
        'Adapted to different game mechanics across multiple platforms and genres',
      gamesApplied: ['All games across Mobile, PC, Xbox, PlayStation'],
      professionalRelevance:
        'Learning new technologies and adapting to changing requirements',
    },
    {
      skill: 'Communication & Coordination',
      description:
        'Coordinated with team members during intense competitive matches',
      gamesApplied: ['PUBG Mobile', 'Valorant'],
      professionalRelevance:
        'Effective collaboration in agile development teams',
    },
  ],
};
