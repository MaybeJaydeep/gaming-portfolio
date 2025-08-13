import React, { useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { TerminalWindow } from '../layout';
import { GlitchText, NeonButton } from '../ui';
import { gamingData } from '../../data';
import { useResponsive } from '../../hooks/useResponsive';

const GamingSection = ({ className = '' }) => {
  const [activeTab, setActiveTab] = useState('tournaments');
  const [visibleTournaments, setVisibleTournaments] = useState(new Set());
  const [unlockedAchievements, setUnlockedAchievements] = useState(new Set());
  const [selectedTournament, setSelectedTournament] = useState(null);
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, threshold: 0.2 });
  const { isMobile, isTablet } = useResponsive();

  // Animate tournaments and achievements when component comes into view
  useEffect(() => {
    if (isInView) {
      // Reveal tournaments with staggered animation
      gamingData.tournaments.forEach((tournament, index) => {
        setTimeout(() => {
          setVisibleTournaments(prev => new Set([...prev, tournament.id]));
        }, index * 300);
      });

      // Unlock achievemen with delay
      gamingData.achievements.forEach((achievement, index) => {
        setTimeout(() => {
          setUnlockedAchievements(prev => new Set([...prev, achievement.id]));
        }, gamingData.tournaments.length * 300 + index * 200);
      });
    }
  }, [isInView]);

  return (
    <section ref={ref} className={`py-20 ${className}`}>
      <div className="container mx-auto px-4">
        <TerminalWindow
          title="gaming_profile.exe"
          className="max-w-7xl mx-auto"
        >
          <div className="space-y-8">
            {/* Gaming Header */}
            <motion.div
              className="text-center mb-6 sm:mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <GlitchText className="text-2xl sm:text-3xl font-bold text-cyan-400 mb-2">
                GAMING ACHIEVEMENTS
              </GlitchText>
              <div className="text-green-400">
                <div className="text-lg sm:text-xl mb-1">
                  Gamertag: {gamingData.gamingProfile.gamertag}
                </div>
                <div className="text-xs sm:text-sm opacity-80">
                  Level {gamingData.gamingProfile.level} •{' '}
                  {gamingData.gamingProfile.totalHours}+ Hours Played
                </div>
                <div className="text-xs mt-2 leading-relaxed">
                  <div>
                    Current Rank: {gamingData.gamingProfile.currentRank}
                  </div>
                  <div>Peak: {gamingData.gamingProfile.peakRank}</div>
                </div>
              </div>
            </motion.div>

            {/* Gaming Profile Stats */}
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <StatCard
                icon="🏆"
                label="Tournaments"
                value={gamingData.tournaments.length}
                color="text-yellow-400"
              />
              <StatCard
                icon="🎮"
                label="Total Hours"
                value={`${gamingData.gamingProfile.totalHours}+`}
                color="text-cyan-400"
              />
              <StatCard
                icon="🏅"
                label="Achievements"
                value={gamingData.achievements.length}
                color="text-purple-400"
              />
              <StatCard
                icon="💰"
                label="Total Earnings"
                value={`₹${(
                  gamingData.tournaments.reduce((sum, t) => {
                    const prizeValue =
                      parseInt(t.prize.replace(/[₹$,]/g, '')) || 0;
                    return sum + prizeValue;
                  }, 0) +
                  (gamingData.localTournaments || []).reduce((sum, lt) => {
                    const localPrize =
                      parseInt(lt.totalEarnings.replace(/[₹$,]/g, '')) || 0;
                    return sum + localPrize;
                  }, 0)
                ).toLocaleString()}`}
                color="text-green-400"
              />
            </motion.div>

            {/* Tab Navigation */}
            <motion.div
              className="flex justify-center mb-6 sm:mb-8 px-2"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="flex flex-wrap justify-center gap-2 sm:gap-4 bg-gray-800/50 rounded-lg p-2 w-full max-w-2xl">
                <NeonButton
                  variant={
                    activeTab === 'tournaments' ? 'primary' : 'secondary'
                  }
                  onClick={() => setActiveTab('tournaments')}
                  className="px-3 sm:px-6 py-2 text-xs sm:text-sm flex-1 sm:flex-none min-w-0"
                >
                  <span className="truncate">Tournaments</span>
                </NeonButton>
                <NeonButton
                  variant={
                    activeTab === 'achievements' ? 'primary' : 'secondary'
                  }
                  onClick={() => setActiveTab('achievements')}
                  className="px-3 sm:px-6 py-2 text-xs sm:text-sm flex-1 sm:flex-none min-w-0"
                >
                  <span className="truncate">Achievements</span>
                </NeonButton>
                <NeonButton
                  variant={activeTab === 'interests' ? 'primary' : 'secondary'}
                  onClick={() => setActiveTab('interests')}
                  className="px-3 sm:px-6 py-2 text-xs sm:text-sm flex-1 sm:flex-none min-w-0"
                >
                  <span className="truncate">
                    {isMobile ? 'Interests' : 'Gaming Interests'}
                  </span>
                </NeonButton>
              </div>
            </motion.div>

            {/* Content Sections */}
            <div className="min-h-[400px] sm:min-h-[600px]">
              {activeTab === 'tournaments' && (
                <TournamentsSection
                  tournaments={gamingData.tournaments}
                  visibleTournaments={visibleTournaments}
                  selectedTournament={selectedTournament}
                  setSelectedTournament={setSelectedTournament}
                  isInView={isInView}
                />
              )}

              {activeTab === 'achievements' && (
                <AchievementsSection
                  achievements={gamingData.achievements}
                  unlockedAchievements={unlockedAchievements}
                  isInView={isInView}
                />
              )}

              {activeTab === 'interests' && (
                <InterestsSection
                  interests={gamingData.interests}
                  transferableSkills={gamingData.transferableSkills}
                  isInView={isInView}
                />
              )}
            </div>
          </div>
        </TerminalWindow>
      </div>
    </section>
  );
};

// StatCard Component
const StatCard = ({ icon, label, value, color }) => (
  <motion.div
    className="bg-gray-800/50 rounded-lg p-3 sm:p-4 border border-green-500/20 text-center"
    whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(0, 255, 255, 0.3)' }}
    transition={{ duration: 0.2 }}
  >
    <div className="text-lg sm:text-2xl mb-1 sm:mb-2">{icon}</div>
    <div className={`text-sm sm:text-xl font-bold ${color} mb-1`}>{value}</div>
    <div className="text-xs sm:text-sm text-gray-400">{label}</div>
  </motion.div>
);

// Tournaments Section Component
const TournamentsSection = ({
  tournaments,
  visibleTournaments,
  selectedTournament,
  setSelectedTournament,
  isInView,
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={isInView ? { opacity: 1 } : {}}
    transition={{ duration: 0.6 }}
  >
    <h3 className="text-cyan-400 text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-center px-4">
      🏆 COMPETITIVE TOURNAMENT HISTORY
    </h3>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {tournaments.map((tournament, index) => (
        <TournamentCard
          key={tournament.id}
          tournament={tournament}
          isVisible={visibleTournaments.has(tournament.id)}
          delay={index * 0.1}
          onClick={() => setSelectedTournament(tournament)}
        />
      ))}
    </div>

    {/* Tournament Detail Modal */}
    {selectedTournament && (
      <TournamentModal
        tournament={selectedTournament}
        onClose={() => setSelectedTournament(null)}
      />
    )}
  </motion.div>
);

// Tournament Card Component
const TournamentCard = ({ tournament, isVisible, delay, onClick }) => {
  const achievementColors = {
    gold: 'border-yellow-500 bg-yellow-500/10',
    silver: 'border-gray-400 bg-gray-400/10',
    bronze: 'border-orange-500 bg-orange-500/10',
    participation: 'border-blue-500 bg-blue-500/10',
  };

  const placementIcons = {
    '1st Place': '🥇',
    '2nd Place': '🥈',
    '3rd Place': '🥉',
    '4th Place': '🏅',
    '5th Place': '🏅',
  };

  return (
    <motion.div
      className={`
        relative p-4 sm:p-6 rounded-lg border-2 cursor-pointer transition-all duration-500
        ${
          isVisible
            ? `${achievementColors[tournament.achievement]} hover:scale-105`
            : 'border-gray-700 bg-gray-900/30 opacity-30'
        }
      `}
      initial={{ opacity: 0, y: 50, rotateX: -90 }}
      animate={
        isVisible
          ? {
              opacity: 1,
              y: 0,
              rotateX: 0,
              boxShadow: '0 10px 30px rgba(0, 255, 255, 0.2)',
            }
          : {}
      }
      transition={{
        duration: 0.8,
        delay,
        type: 'spring',
        stiffness: 100,
      }}
      whileHover={{
        scale: 1.05,
        boxShadow: '0 15px 40px rgba(0, 255, 255, 0.4)',
      }}
      onClick={onClick}
    >
      {/* Reveal animation effect */}
      {isVisible && (
        <motion.div
          className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent"
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ duration: 1.2, delay: delay + 0.3 }}
        />
      )}

      <div className="relative z-10">
        {/* Tournament Header */}
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="text-xl sm:text-2xl">
            {placementIcons[tournament.placement] || '🎮'}
          </div>
          <div className="text-right">
            <div className="text-xs sm:text-sm text-gray-400">
              {tournament.game}
            </div>
            <div className="text-xs text-gray-500">
              {new Date(tournament.date).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Tournament Info */}
        <div className="space-y-1.5 sm:space-y-2">
          <h4 className="text-green-400 font-semibold text-xs sm:text-sm leading-tight">
            {tournament.name}
          </h4>

          <div className="flex items-center justify-between">
            <span className="text-cyan-400 font-bold text-xs sm:text-sm">
              {tournament.placement}
            </span>
            <span className="text-yellow-400 font-semibold text-xs sm:text-sm">
              {tournament.prize}
            </span>
          </div>

          <div className="text-xs text-gray-300">
            Team: {tournament.teamName}
          </div>

          <div className="text-xs text-gray-400">
            {tournament.participants} participants
          </div>
        </div>

        {/* Hover indicator */}
        <div className="absolute bottom-2 right-2 text-xs text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">
          Click for details →
        </div>
      </div>
    </motion.div>
  );
};

// Tournament Modal Component
const TournamentModal = ({ tournament, onClose }) => (
  <motion.div
    className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onClick={onClose}
  >
    <motion.div
      className="bg-gray-900 border border-cyan-500 rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
      initial={{ scale: 0.8, y: 50 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0.8, y: 50 }}
      onClick={e => e.stopPropagation()}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-cyan-400 text-xl font-bold">{tournament.name}</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white text-2xl"
        >
          ×
        </button>
      </div>

      <div className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-400 mb-1">Game</div>
            <div className="text-green-400">{tournament.game}</div>
          </div>
          <div>
            <div className="text-sm text-gray-400 mb-1">Date</div>
            <div className="text-green-400">
              {new Date(tournament.date).toLocaleDateString()}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-400 mb-1">Placement</div>
            <div className="text-cyan-400 font-bold">
              {tournament.placement}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-400 mb-1">Prize</div>
            <div className="text-yellow-400 font-semibold">
              {tournament.prize}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-400 mb-1">Team</div>
            <div className="text-green-400">{tournament.teamName}</div>
          </div>
          <div>
            <div className="text-sm text-gray-400 mb-1">Participants</div>
            <div className="text-green-400">
              {tournament.participants} teams
            </div>
          </div>
        </div>

        <div>
          <div className="text-sm text-gray-400 mb-2">Description</div>
          <div className="text-gray-300">{tournament.description}</div>
        </div>

        <div>
          <div className="text-sm text-gray-400 mb-2">Skills Demonstrated</div>
          <div className="flex flex-wrap gap-2">
            {tournament.skills.map(skill => (
              <span
                key={skill}
                className="text-xs bg-cyan-400/20 text-cyan-300 px-3 py-1 rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  </motion.div>
);

// Achievements Section Component
const AchievementsSection = ({
  achievements,
  unlockedAchievements,
  isInView,
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={isInView ? { opacity: 1 } : {}}
    transition={{ duration: 0.6 }}
  >
    <h3 className="text-cyan-400 text-xl font-semibold mb-6 text-center">
      🏅 GAMING ACHIEVEMENTS UNLOCKED
    </h3>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {achievements.map((achievement, index) => (
        <GamingAchievementCard
          key={achievement.id}
          achievement={achievement}
          isUnlocked={unlockedAchievements.has(achievement.id)}
          delay={index * 0.15}
        />
      ))}
    </div>
  </motion.div>
);

// Gaming Achievement Card Component
const GamingAchievementCard = ({ achievement, isUnlocked, delay }) => {
  const rarityColors = {
    common: 'border-gray-500 text-gray-400 bg-gray-500/10',
    rare: 'border-blue-500 text-blue-400 bg-blue-500/10',
    epic: 'border-purple-500 text-purple-400 bg-purple-500/10',
    legendary: 'border-yellow-500 text-yellow-400 bg-yellow-500/10',
  };

  return (
    <motion.div
      className={`
        relative p-4 sm:p-6 rounded-lg border-2 transition-all duration-500
        ${
          isUnlocked
            ? `${rarityColors[achievement.rarity]}`
            : 'border-gray-700 text-gray-600 bg-gray-900/30'
        }
      `}
      initial={{ opacity: 0, scale: 0.5, rotateY: 180 }}
      animate={
        isUnlocked
          ? {
              opacity: 1,
              scale: 1,
              rotateY: 0,
              boxShadow:
                achievement.rarity === 'legendary'
                  ? '0 0 30px rgba(255, 215, 0, 0.4)'
                  : '0 0 20px rgba(0, 255, 255, 0.3)',
            }
          : {}
      }
      transition={{
        duration: 1,
        delay,
        type: 'spring',
        stiffness: 80,
      }}
      whileHover={
        isUnlocked
          ? {
              scale: 1.05,
              boxShadow:
                achievement.rarity === 'legendary'
                  ? '0 0 40px rgba(255, 215, 0, 0.6)'
                  : '0 0 30px rgba(0, 255, 255, 0.5)',
            }
          : {}
      }
    >
      {/* Unlock animation effect */}
      {isUnlocked && (
        <motion.div
          className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-white/20 to-transparent"
          initial={{ x: '-100%', opacity: 0 }}
          animate={{ x: '100%', opacity: 1 }}
          transition={{ duration: 1.5, delay: delay + 0.5 }}
        />
      )}

      <div className="relative z-10 text-center">
        <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">
          {achievement.icon}
        </div>
        <div className="font-bold text-base sm:text-lg mb-2 leading-tight">
          {achievement.name}
        </div>
        <div className="text-xs sm:text-sm opacity-80 mb-3">
          {achievement.description}
        </div>

        {/* Progress bar for achievements with progress */}
        {achievement.progress !== undefined && (
          <div className="mb-3">
            <div className="flex justify-between text-xs mb-1">
              <span>Progress</span>
              <span>
                {achievement.progress}/{achievement.maxProgress}
              </span>
            </div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-500 to-green-400"
                initial={{ width: 0 }}
                animate={
                  isUnlocked
                    ? {
                        width: `${
                          (achievement.progress / achievement.maxProgress) * 100
                        }%`,
                      }
                    : {}
                }
                transition={{ duration: 1, delay: delay + 0.8 }}
              />
            </div>
          </div>
        )}

        {isUnlocked && achievement.unlockedDate && (
          <div className="text-xs opacity-60">
            Unlocked: {new Date(achievement.unlockedDate).toLocaleDateString()}
          </div>
        )}
      </div>

      {/* Rarity indicator */}
      <div
        className={`absolute top-3 right-3 text-xs px-2 py-1 rounded ${
          isUnlocked
            ? rarityColors[achievement.rarity]
            : 'text-gray-600 border-gray-600'
        } border`}
      >
        {achievement.rarity.toUpperCase()}
      </div>
    </motion.div>
  );
};

// Interests Section Component
const InterestsSection = ({ interests, transferableSkills, isInView }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={isInView ? { opacity: 1 } : {}}
    transition={{ duration: 0.6 }}
    className="space-y-8"
  >
    <h3 className="text-cyan-400 text-xl font-semibold mb-6 text-center">
      🎮 GAMING INTERESTS & SKILLS
    </h3>

    {/* Gaming Categories */}
    <div className="space-y-6">
      {interests.map((category, categoryIndex) => (
        <motion.div
          key={category.category}
          className="bg-gray-800/30 rounded-lg p-6 border border-green-500/20"
          initial={{ opacity: 0, x: -50 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: categoryIndex * 0.2 }}
        >
          <h4 className="text-green-400 text-lg font-semibold mb-4">
            {category.category}
          </h4>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {category.games.map((game, gameIndex) => (
              <motion.div
                key={game.name}
                className="bg-gray-900/50 rounded-lg p-4 border border-cyan-500/20"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.4,
                  delay: categoryIndex * 0.2 + gameIndex * 0.1,
                }}
                whileHover={{
                  scale: 1.02,
                  boxShadow: '0 5px 15px rgba(0, 255, 255, 0.2)',
                }}
              >
                <div className="text-cyan-400 font-semibold mb-2">
                  {game.name}
                </div>
                <div className="text-sm space-y-1">
                  <div className="text-gray-300">
                    <span className="text-gray-400">Hours:</span> {game.hours}
                  </div>
                  <div className="text-gray-300">
                    <span className="text-gray-400">Rank:</span> {game.rank}
                  </div>
                  <div className="text-gray-300">
                    <span className="text-gray-400">Role:</span> {game.role}
                  </div>
                </div>

                <div className="mt-3">
                  <div className="text-xs text-gray-400 mb-1">
                    Achievements:
                  </div>
                  <div className="space-y-1">
                    {game.achievements.map((achievement, achIndex) => (
                      <div key={achIndex} className="text-xs text-green-400">
                        • {achievement}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>

    {/* Transferable Skills */}
    <motion.div
      className="bg-gray-800/30 rounded-lg p-6 border border-purple-500/20"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.8 }}
    >
      <h4 className="text-purple-400 text-lg font-semibold mb-4">
        🧠 TRANSFERABLE SKILLS TO PROFESSIONAL WORK
      </h4>

      <div className="grid md:grid-cols-2 gap-4">
        {transferableSkills.map((skill, index) => (
          <motion.div
            key={skill.skill}
            className="bg-gray-900/50 rounded-lg p-4 border border-purple-500/20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
            whileHover={{
              scale: 1.02,
              boxShadow: '0 5px 15px rgba(147, 51, 234, 0.2)',
            }}
          >
            <div className="text-purple-400 font-semibold mb-2">
              {skill.skill}
            </div>
            <div className="text-sm text-gray-300 mb-2">
              {skill.description}
            </div>
            <div className="text-xs text-gray-400 mb-2">
              <span className="text-purple-300">Games:</span>{' '}
              {skill.gamesApplied.join(', ')}
            </div>
            <div className="text-xs text-green-400">
              <span className="text-gray-400">Professional Relevance:</span>{' '}
              {skill.professionalRelevance}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  </motion.div>
);

export default GamingSection;
