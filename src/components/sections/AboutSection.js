import React, { useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { GlitchText } from '../ui';
import { TerminalCard, AchievementCard, ProgressCard } from '../ui/GamingCard';
import { userProfile } from '../../data';
import { useResponsive } from '../../hooks/useResponsive';

const AboutSection = ({ className = '' }) => {
  const [visibleStats, setVisibleStats] = useState({});
  const [unlockedAchievements, setUnlockedAchievements] = useState(new Set());
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, threshold: 0.3 });
  const { isMobile, isTablet } = useResponsive();

  // Animate stats when component comes into view
  useEffect(() => {
    if (isInView) {
      const statsEntries = Object.entries(userProfile.characterStats);

      statsEntries.forEach(([key], index) => {
        setTimeout(() => {
          setVisibleStats(prev => ({ ...prev, [key]: true }));
        }, index * 200);
      });

      // Unlock achievements with delay
      userProfile.achievements.forEach((achievement, index) => {
        setTimeout(() => {
          setUnlockedAchievements(prev => new Set([...prev, achievement.id]));
        }, statsEntries.length * 200 + index * 300);
      });
    }
  }, [isInView]);

  return (
    <section
      ref={ref}
      className={`${
        isMobile ? 'py-12' : isTablet ? 'py-16' : 'py-20'
      } ${className}`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <TerminalCard
          title="character_profile.exe"
          className="max-w-6xl mx-auto"
        >
          <div className={`${isMobile ? 'space-y-6' : 'space-y-8'}`}>
            {/* Character Header */}
            <motion.div
              className={`text-center ${isMobile ? 'mb-6' : 'mb-8'}`}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <GlitchText className="text-3xl font-bold text-cyan-400 mb-2">
                CHARACTER PROFILE
              </GlitchText>
              <div className="text-green-400">
                <div className="text-xl mb-1">{userProfile.name}</div>
                <div className="text-sm opacity-80">{userProfile.title}</div>
                <div className="text-xs mt-2">
                  Level {userProfile.level} •{' '}
                  {userProfile.stats.projectsCompleted} Projects Completed
                </div>
              </div>
            </motion.div>

            <div
              className={`grid ${
                isMobile ? 'grid-cols-1 gap-6' : 'lg:grid-cols-2 gap-8'
              }`}
            >
              {/* Left Column: Professional Experience + Character Stats */}
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, x: -50 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {/* Professional Experience */}
                <div>
                  <h3 className="text-cyan-400 text-lg font-semibold mb-3 flex items-center">
                    <span className="mr-2">💼</span>
                    PROFESSIONAL EXPERIENCE
                  </h3>
                  <div className="space-y-3">
                    {userProfile.professionalExperience?.map((exp, index) => (
                      <motion.div
                        key={exp.id}
                        className="bg-gray-800/50 rounded-lg p-3 border border-green-500/20"
                        initial={{ opacity: 0, y: 10 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{
                          duration: 0.4,
                          delay: 0.6 + index * 0.1,
                        }}
                      >
                        <div className="text-green-400 font-medium text-sm">
                          {exp.position}
                        </div>
                        <div className="text-xs text-gray-300">
                          {exp.company} • {exp.duration} • {exp.status}
                        </div>

                        {/* Project Delivered - Compact */}
                        {exp.projectsDelivered && (
                          <div className="mt-2">
                            <div className="text-xs text-cyan-300 font-medium">
                              Project:{' '}
                              <span className="text-green-400">
                                {exp.projectsDelivered[0]?.name}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Top Skills Only */}
                        <div className="flex flex-wrap gap-1 mt-2">
                          {(exp.skillsGained || exp.skillsToApply || [])
                            .slice(0, 4)
                            .map(skill => (
                              <span
                                key={skill}
                                className="text-xs bg-cyan-400/20 text-cyan-300 px-2 py-1 rounded"
                              >
                                {skill}
                              </span>
                            ))}
                          {(exp.skillsGained || exp.skillsToApply || [])
                            .length > 4 && (
                            <span className="text-xs text-gray-400 px-2 py-1">
                              +
                              {(exp.skillsGained || exp.skillsToApply || [])
                                .length - 4}
                            </span>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Character Stats */}
                <div>
                  <h3 className="text-cyan-400 text-lg font-semibold mb-4 flex items-center">
                    <span className="mr-2">📊</span>
                    CHARACTER STATS
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(userProfile.characterStats).map(
                      ([key, stat]) => (
                        <StatBar
                          key={key}
                          stat={stat}
                          isVisible={visibleStats[key]}
                        />
                      )
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Right Column: Education + Certifications */}
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, x: 50 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                {/* Education */}
                <div>
                  <h3 className="text-cyan-400 text-lg font-semibold mb-3 flex items-center">
                    <span className="mr-2">🎓</span>
                    EDUCATION
                  </h3>
                  <div className="space-y-3">
                    {userProfile.background.education.map((edu, index) => (
                      <motion.div
                        key={edu.degree}
                        className="bg-gray-800/50 rounded-lg p-4 border border-green-500/20"
                        initial={{ opacity: 0, y: 10 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{
                          duration: 0.4,
                          delay: 0.6 + index * 0.1,
                        }}
                      >
                        <div className="text-green-400 font-medium">
                          {edu.degree}
                        </div>
                        <div className="text-sm text-gray-300">
                          Specialization: {edu.specialization}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {edu.institution} • {edu.year} • {edu.status}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Certifications */}
                <div>
                  <h3 className="text-cyan-400 text-lg font-semibold mb-3 flex items-center">
                    <span className="mr-2">🏆</span>
                    CERTIFICATIONS
                  </h3>
                  <div className="space-y-3">
                    {userProfile.background.certifications.map(
                      (cert, index) => (
                        <motion.div
                          key={cert.name}
                          className="bg-gray-800/50 rounded-lg p-3 border border-green-500/20"
                          initial={{ opacity: 0, y: 10 }}
                          animate={isInView ? { opacity: 1, y: 0 } : {}}
                          transition={{
                            duration: 0.4,
                            delay: 0.6 + index * 0.1,
                          }}
                        >
                          <div className="text-green-400 font-medium text-sm">
                            {cert.name}
                          </div>
                          <div className="text-xs text-gray-300">
                            {cert.issuer} • {cert.year} • {cert.level}
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {cert.skills.map(skill => (
                              <span
                                key={skill}
                                className="text-xs bg-cyan-400/20 text-cyan-300 px-2 py-1 rounded"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </motion.div>
                      )
                    )}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Achievements Section */}
            <motion.div
              className="mt-8"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <h3 className="text-cyan-400 text-lg font-semibold mb-4 flex items-center">
                <span className="mr-2">🏅</span>
                ACHIEVEMENTS UNLOCKED
              </h3>

              <div
                className={`grid ${
                  isMobile
                    ? 'grid-cols-1 gap-3'
                    : isTablet
                    ? 'grid-cols-2 gap-4'
                    : 'md:grid-cols-2 lg:grid-cols-3 gap-4'
                }`}
              >
                {userProfile.achievements.map((achievement, index) => (
                  <AchievementCardWrapper
                    key={achievement.id}
                    achievement={achievement}
                    isUnlocked={unlockedAchievements.has(achievement.id)}
                    delay={index * 0.1}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </TerminalCard>
      </div>
    </section>
  );
};

// StatBar Component for animated progress bars
const StatBar = ({ stat, isVisible }) => {
  return (
    <ProgressCard
      title={stat.name}
      current={stat.level}
      max={stat.maxLevel}
      label={`EXP: ${stat.experience.toLocaleString()} / ${stat.nextLevelExp.toLocaleString()}`}
      color="cyan"
      animated={isVisible}
    />
  );
};

// AchievementCard Component for unlock animations - using the new gaming card
const AchievementCardWrapper = ({ achievement, isUnlocked, delay }) => (
  <AchievementCard
    title={achievement.name}
    description={achievement.description}
    icon={achievement.icon}
    rarity={achievement.rarity}
    unlocked={isUnlocked}
    unlockedDate={achievement.unlockedDate}
    delay={delay}
  />
);

export default AboutSection;
