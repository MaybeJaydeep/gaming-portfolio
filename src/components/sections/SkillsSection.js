import React, { useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { TerminalWindow } from '../layout';
import {
  GlitchText,
  StaggerContainer,
  StaggerItem,
  GamingEntrance,
} from '../ui';
import { skillCategories, getSkillsByCategory } from '../../data';
import { useStaggerAnimation } from '../../hooks/usePageTransitions';
import { useResponsive } from '../../hooks/useResponsive';

const SkillsSection = ({ className = '' }) => {
  const [selectedCategory, setSelectedCategory] = useState('frontend');
  const [hoveredSkill, setHoveredSkill] = useState(null);
  const [unlockedSkills, setUnlockedSkills] = useState(new Set());
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, threshold: 0.2 });
  const { isMobile } = useResponsive();

  const categorizedSkills = getSkillsByCategory();

  // Animate skill unlocks when component comes into view
  useEffect(() => {
    if (isInView) {
      const allSkills = Object.values(categorizedSkills).flat();

      allSkills.forEach((skill, index) => {
        setTimeout(() => {
          setUnlockedSkills(prev => new Set([...prev, skill.id]));
        }, index * 150);
      });
    }
  }, [isInView, categorizedSkills]);

  return (
    <section ref={ref} className={`py-20 ${className}`}>
      <div className="container mx-auto px-4">
        <TerminalWindow title="skill_tree.exe" className="max-w-7xl mx-auto">
          <div className="space-y-8">
            {/* Header */}
            <motion.div
              className="text-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <GlitchText className="text-3xl font-bold text-cyan-400 mb-2">
                SKILL TREE
              </GlitchText>
              <div className="text-green-400 text-sm">
                Hover over skills to view details • Click categories to explore
                different skill branches
              </div>
            </motion.div>

            {/* Category Navigation */}
            <StaggerContainer className="flex flex-wrap justify-center gap-4 mb-8">
              {Object.entries(skillCategories).map(([key, category], index) => (
                <StaggerItem key={key} delay={index * 0.1}>
                  <CategoryButton
                    category={category}
                    categoryKey={key}
                    isSelected={selectedCategory === key}
                    onClick={() => setSelectedCategory(key)}
                    skillCount={categorizedSkills[key]?.length || 0}
                  />
                </StaggerItem>
              ))}
            </StaggerContainer>

            {/* Skill Tree Visualization */}
            <GamingEntrance className="relative" delay={0.4}>
              <SkillTree
                skills={categorizedSkills[selectedCategory] || []}
                category={skillCategories[selectedCategory]}
                unlockedSkills={unlockedSkills}
                hoveredSkill={hoveredSkill}
                onSkillHover={setHoveredSkill}
              />
            </GamingEntrance>

            {/* Skill Details Panel - Only show on desktop */}
            {hoveredSkill && !isMobile && (
              <SkillDetailsPanel
                skill={hoveredSkill}
                isUnlocked={unlockedSkills.has(hoveredSkill.id)}
              />
            )}

            {/* Overall Stats */}
            <StaggerContainer className="grid md:grid-cols-3 gap-6 mt-8 pt-8 border-t border-green-500/20">
              <StaggerItem delay={0.1}>
                <StatCard
                  title="Total Skills"
                  value={Object.values(categorizedSkills).flat().length}
                  icon="🎯"
                  color="cyan"
                />
              </StaggerItem>
              <StaggerItem delay={0.2}>
                <StatCard
                  title="Avg Proficiency"
                  value={`${Math.round(
                    Object.values(categorizedSkills)
                      .flat()
                      .reduce((sum, skill) => sum + skill.proficiency, 0) /
                      Object.values(categorizedSkills).flat().length
                  )}%`}
                  icon="📊"
                  color="green"
                />
              </StaggerItem>
              <StaggerItem delay={0.3}>
                <StatCard
                  title="Years Experience"
                  value={Math.max(
                    ...Object.values(categorizedSkills)
                      .flat()
                      .map(skill => skill.yearsExperience)
                  )}
                  icon="⏱️"
                  color="purple"
                />
              </StaggerItem>
            </StaggerContainer>
          </div>
        </TerminalWindow>
      </div>
    </section>
  );
};

// Category Button Component
const CategoryButton = ({
  category,
  categoryKey,
  isSelected,
  onClick,
  skillCount,
}) => {
  const colorClasses = {
    cyan: 'border-cyan-500 text-cyan-400 bg-cyan-500/10',
    green: 'border-green-500 text-green-400 bg-green-500/10',
    purple: 'border-purple-500 text-purple-400 bg-purple-500/10',
    orange: 'border-orange-500 text-orange-400 bg-orange-500/10',
    blue: 'border-blue-500 text-blue-400 bg-blue-500/10',
  };

  return (
    <motion.button
      className={`
        relative px-6 py-3 rounded-lg border-2 transition-all duration-300
        ${
          isSelected
            ? colorClasses[category.color]
            : 'border-gray-600 text-gray-400 hover:border-gray-500'
        }
      `}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="flex items-center space-x-2">
        <span className="text-lg">{category.icon}</span>
        <div className="text-left">
          <div className="font-medium text-sm">{category.name}</div>
          <div className="text-xs opacity-70">{skillCount} skills</div>
        </div>
      </div>

      {isSelected && (
        <motion.div
          className={`absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-${category.color}-400/20 to-transparent`}
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
        />
      )}
    </motion.button>
  );
};

// Skill Tree Component
const SkillTree = ({
  skills,
  category,
  unlockedSkills,
  hoveredSkill,
  onSkillHover,
}) => {
  // Organize skills in a tree-like grid layout
  const organizeSkillsInGrid = skills => {
    const rows = Math.ceil(skills.length / 4);
    const grid = [];

    for (let i = 0; i < rows; i++) {
      grid.push(skills.slice(i * 4, (i + 1) * 4));
    }

    return grid;
  };

  const skillGrid = organizeSkillsInGrid(skills);

  return (
    <div className="space-y-8">
      <div className="text-center mb-6">
        <h3 className={`text-xl font-bold text-${category.color}-400 mb-2`}>
          {category.icon} {category.name}
        </h3>
        <p className="text-gray-400 text-sm">{category.description}</p>
      </div>

      <div className="space-y-6">
        {skillGrid.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 max-w-4xl w-full">
              {row.map((skill, colIndex) => (
                <SkillNode
                  key={skill.id}
                  skill={skill}
                  isUnlocked={unlockedSkills.has(skill.id)}
                  isHovered={hoveredSkill?.id === skill.id}
                  onHover={() => onSkillHover(skill)}
                  onLeave={() => onSkillHover(null)}
                  category={category}
                  delay={rowIndex * 0.2 + colIndex * 0.1}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Individual Skill Node Component
const SkillNode = ({
  skill,
  isUnlocked,
  isHovered,
  onHover,
  onLeave,
  category,
  delay,
}) => {
  const proficiencyLevel =
    skill.proficiency >= 90
      ? 'Expert'
      : skill.proficiency >= 75
      ? 'Advanced'
      : skill.proficiency >= 60
      ? 'Intermediate'
      : 'Beginner';

  const levelColors = {
    Expert: 'text-yellow-400 border-yellow-500',
    Advanced: 'text-green-400 border-green-500',
    Intermediate: 'text-blue-400 border-blue-500',
    Beginner: 'text-gray-400 border-gray-500',
  };

  return (
    <motion.div
      className={`
        relative p-2 sm:p-4 rounded-lg border-2 cursor-pointer transition-all duration-300
        ${
          isUnlocked
            ? `${levelColors[proficiencyLevel]} bg-gray-800/50`
            : 'border-gray-700 text-gray-600 bg-gray-900/30'
        }
        ${isHovered ? 'scale-105 shadow-lg' : ''}
      `}
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={
        isUnlocked
          ? {
              opacity: 1,
              scale: isHovered ? 1.05 : 1,
              y: 0,
            }
          : {}
      }
      transition={{
        duration: 0.6,
        delay,
        type: 'spring',
        stiffness: 100,
      }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      {/* Unlock animation effect */}
      {isUnlocked && (
        <motion.div
          className={`absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-${category.color}-400/20 to-transparent`}
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ duration: 1, delay: delay + 0.5 }}
        />
      )}

      <div className="text-center space-y-1 sm:space-y-2">
        {/* Skill Name */}
        <div className="font-bold text-xs sm:text-sm leading-tight">
          {skill.name}
        </div>

        {/* Proficiency Bar */}
        <div className="relative h-1.5 sm:h-2 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className={`absolute inset-y-0 left-0 bg-gradient-to-r from-${category.color}-500 to-${category.color}-300 rounded-full`}
            initial={{ width: 0 }}
            animate={
              isUnlocked ? { width: `${skill.proficiency}%` } : { width: 0 }
            }
            transition={{ duration: 1, delay: delay + 0.3 }}
          />
        </div>

        {/* Proficiency Percentage */}
        <div className="text-xs">{skill.proficiency}%</div>

        {/* Level Badge - Hidden on mobile */}
        <div
          className={`hidden sm:block text-xs px-2 py-1 rounded ${levelColors[proficiencyLevel]} bg-opacity-20`}
        >
          {proficiencyLevel}
        </div>

        {/* Experience - Smaller on mobile */}
        <div className="text-xs opacity-70">{skill.yearsExperience}y</div>
      </div>

      {/* Glow effect for high-level skills */}
      {isUnlocked && skill.proficiency >= 90 && (
        <motion.div
          className={`absolute inset-0 rounded-lg border-2 border-yellow-400/50`}
          animate={{
            boxShadow: [
              '0 0 5px rgba(255, 215, 0, 0.3)',
              '0 0 20px rgba(255, 215, 0, 0.6)',
              '0 0 5px rgba(255, 215, 0, 0.3)',
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </motion.div>
  );
};

// Skill Details Panel Component
const SkillDetailsPanel = ({ skill, isUnlocked }) => {
  return (
    <motion.div
      className="bg-gray-800/80 rounded-lg p-6 border border-cyan-500/30"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-cyan-400 font-bold text-lg mb-2">{skill.name}</h4>
          <p className="text-gray-300 text-sm mb-4">{skill.description}</p>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Proficiency:</span>
              <span className="text-green-400">{skill.proficiency}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Experience:</span>
              <span className="text-green-400">
                {skill.yearsExperience} years
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Level:</span>
              <span className="text-green-400">{skill.level}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {/* Certifications */}
          {skill.certifications && skill.certifications.length > 0 && (
            <div>
              <h5 className="text-cyan-400 font-medium mb-2">Certifications</h5>
              <div className="space-y-1">
                {skill.certifications.map((cert, index) => (
                  <div
                    key={index}
                    className="text-xs bg-cyan-400/20 text-cyan-300 px-2 py-1 rounded"
                  >
                    {cert}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {skill.projects && skill.projects.length > 0 && (
            <div>
              <h5 className="text-cyan-400 font-medium mb-2">Projects</h5>
              <div className="space-y-1">
                {skill.projects.slice(0, 3).map((project, index) => (
                  <div key={index} className="text-xs text-gray-300">
                    • {project}
                  </div>
                ))}
                {skill.projects.length > 3 && (
                  <div className="text-xs text-gray-400">
                    +{skill.projects.length - 3} more projects
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, icon, color }) => {
  const colorClasses = {
    cyan: 'text-cyan-400 border-cyan-500/30',
    green: 'text-green-400 border-green-500/30',
    purple: 'text-purple-400 border-purple-500/30',
  };

  return (
    <motion.div
      className={`text-center p-4 rounded-lg border ${colorClasses[color]} bg-gray-800/30`}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
    >
      <div className="text-2xl mb-2">{icon}</div>
      <div className={`text-2xl font-bold ${colorClasses[color]} mb-1`}>
        {value}
      </div>
      <div className="text-gray-400 text-sm">{title}</div>
    </motion.div>
  );
};

export default SkillsSection;
