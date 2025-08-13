import React, { useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { TerminalWindow } from '../layout';
import {
  GlitchText,
  NeonButton,
  StaggerContainer,
  StaggerItem,
  GamingEntrance,
} from '../ui';
import {
  projectsData,
  getProjectsByCategory,
  getFeaturedProjects,
} from '../../data';

const ProjectsSection = ({ className = '' }) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);
  const [filteredProjects, setFilteredProjects] = useState(
    projectsData.projects
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, threshold: 0.2 });

  // Filter projects based on category, search, and featured status
  useEffect(() => {
    let projects = getProjectsByCategory(activeCategory);

    if (showFeaturedOnly) {
      projects = projects.filter(project => project.featured);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      projects = projects.filter(
        project =>
          project.title.toLowerCase().includes(query) ||
          project.description.toLowerCase().includes(query) ||
          project.technologies.some(tech => tech.toLowerCase().includes(query))
      );
    }

    setFilteredProjects(projects);
  }, [activeCategory, searchQuery, showFeaturedOnly]);

  return (
    <section ref={ref} className={`py-20 ${className}`}>
      <div className="container mx-auto px-4">
        <TerminalWindow
          title="projects_showcase.exe"
          className="max-w-7xl mx-auto"
        >
          <div className="space-y-8">
            {/* Projects Header */}
            <motion.div
              className="text-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <GlitchText className="text-3xl font-bold text-cyan-400 mb-2">
                PROJECT PORTFOLIO
              </GlitchText>
              <div className="text-green-400 text-sm mb-4">
                Showcasing {projectsData.stats.totalProjects} projects •{' '}
                {projectsData.stats.completedProjects} completed •{' '}
                {projectsData.stats.technologiesUsed} technologies
              </div>
              <div className="text-xs text-gray-400">
                {projectsData.stats.totalBadges} badges earned •{' '}
                {projectsData.stats.totalXP.toLocaleString()} XP • Rating:{' '}
                {projectsData.stats.averageRating}/5
              </div>
            </motion.div>

            {/* Search and Filters */}
            <motion.div
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* Search Bar */}
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search projects, technologies..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 sm:py-3 bg-gray-800/50 border border-green-500/30 rounded-lg text-green-400 placeholder-gray-500 focus:border-cyan-400 focus:outline-none transition-colors text-sm sm:text-base"
                  />
                  <div className="absolute right-3 top-2.5 sm:top-3.5 text-gray-500">
                    🔍
                  </div>
                </div>
              </div>

              {/* Featured Toggle */}
              <div className="flex items-center justify-center sm:justify-start">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showFeaturedOnly}
                    onChange={e => setShowFeaturedOnly(e.target.checked)}
                    className="sr-only"
                  />
                  <div
                    className={`relative w-10 h-5 sm:w-12 sm:h-6 rounded-full transition-colors ${
                      showFeaturedOnly ? 'bg-cyan-500' : 'bg-gray-600'
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 left-0.5 sm:top-1 sm:left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        showFeaturedOnly
                          ? 'translate-x-5 sm:translate-x-6'
                          : 'translate-x-0'
                      }`}
                    />
                  </div>
                  <span className="ml-2 sm:ml-3 text-xs sm:text-sm text-gray-300">
                    Featured Only
                  </span>
                </label>
              </div>
            </motion.div>

            {/* Category Filters */}
            <motion.div
              className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6 sm:mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {/* All Categories Button */}
              <motion.button
                onClick={() => setActiveCategory('all')}
                className={`
                  px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border-2 transition-all duration-300 text-xs sm:text-sm font-medium
                  ${
                    activeCategory === 'all'
                      ? 'border-cyan-500 text-cyan-400 bg-cyan-500/10'
                      : 'border-gray-600 text-gray-400 hover:border-gray-500'
                  }
                `}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                <span className="mr-1 sm:mr-2">🎯</span>
                <span className="hidden sm:inline">All Projects</span>
                <span className="sm:hidden">All</span>
              </motion.button>

              {projectsData.categories.map((category, index) => (
                <motion.button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`
                    px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border-2 transition-all duration-300 text-xs sm:text-sm font-medium
                    ${
                      activeCategory === category.id
                        ? 'border-cyan-500 text-cyan-400 bg-cyan-500/10'
                        : 'border-gray-600 text-gray-400 hover:border-gray-500'
                    }
                  `}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.4 + (index + 1) * 0.1 }}
                >
                  <span className="mr-1 sm:mr-2">{category.icon}</span>
                  <span className="hidden sm:inline">{category.name}</span>
                  <span className="sm:hidden">
                    {category.name.split(' ')[0]}
                  </span>
                </motion.button>
              ))}
            </motion.div>

            {/* Projects Grid */}
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <AnimatePresence mode="wait">
                {filteredProjects.map((project, index) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    index={index}
                    onClick={() => setSelectedProject(project)}
                    isInView={isInView}
                  />
                ))}
              </AnimatePresence>
            </motion.div>

            {/* No Results Message */}
            {filteredProjects.length === 0 && (
              <motion.div
                className="text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                <div className="text-6xl mb-4">🔍</div>
                <div className="text-gray-400 text-lg mb-2">
                  No projects found
                </div>
                <div className="text-gray-500 text-sm">
                  Try adjusting your search terms or category filters
                </div>
              </motion.div>
            )}

            {/* Project Statistics */}
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-green-500/20"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <StatCard
                icon="📁"
                label="Total Projects"
                value={projectsData.stats.totalProjects}
                color="text-cyan-400"
              />
              <StatCard
                icon="✅"
                label="Completed"
                value={projectsData.stats.completedProjects}
                color="text-green-400"
              />
              <StatCard
                icon="🏆"
                label="Badges Earned"
                value={projectsData.stats.totalBadges}
                color="text-yellow-400"
              />
              <StatCard
                icon="🔧"
                label="Technologies"
                value={projectsData.stats.technologiesUsed}
                color="text-purple-400"
              />
            </motion.div>
          </div>
        </TerminalWindow>
      </div>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

// Project Card Component
const ProjectCard = ({ project, index, onClick, isInView }) => {
  const statusColors = {
    completed: 'border-green-500 bg-green-500/10',
    'in-progress': 'border-yellow-500 bg-yellow-500/10',
    planned: 'border-gray-500 bg-gray-500/10',
  };

  const difficultyColors = {
    beginner: 'text-green-400',
    intermediate: 'text-yellow-400',
    advanced: 'text-orange-400',
    expert: 'text-red-400',
  };

  return (
    <motion.div
      className={`
        relative p-6 rounded-lg border-2 cursor-pointer transition-all duration-500
        ${statusColors[project.status]} hover:scale-105
      `}
      initial={{ opacity: 0, y: 50, rotateX: -15 }}
      animate={
        isInView
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
        delay: index * 0.1,
        type: 'spring',
        stiffness: 100,
      }}
      whileHover={{
        scale: 1.05,
        boxShadow: '0 15px 40px rgba(0, 255, 255, 0.4)',
      }}
      onClick={onClick}
    >
      {/* Featured Badge */}
      {project.featured && (
        <div className="absolute -top-2 -right-2 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-full">
          ⭐ FEATURED
        </div>
      )}

      {/* Project Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-green-400 font-bold text-lg mb-1 leading-tight">
            {project.title}
          </h3>
          <div className="flex items-center gap-2 text-xs">
            <span
              className={`font-medium ${difficultyColors[project.difficulty]}`}
            >
              {project.difficulty.toUpperCase()}
            </span>
            <span className="text-gray-500">•</span>
            <span className="text-gray-400">
              {
                projectsData.categories.find(cat => cat.id === project.category)
                  ?.icon
              }
              {
                projectsData.categories.find(cat => cat.id === project.category)
                  ?.name
              }
            </span>
          </div>
        </div>
      </div>

      {/* Project Description */}
      <p className="text-gray-300 text-sm mb-4 line-clamp-3">
        {project.description}
      </p>

      {/* Technologies */}
      <div className="flex flex-wrap gap-1 mb-4">
        {project.technologies.slice(0, 4).map(tech => (
          <span
            key={tech}
            className="text-xs bg-gray-800/50 text-cyan-300 px-2 py-1 rounded border border-cyan-500/30"
            style={{
              borderColor: projectsData.technologies[tech]?.color + '50',
              color: projectsData.technologies[tech]?.color || '#00FFFF',
            }}
          >
            {tech}
          </span>
        ))}
        {project.technologies.length > 4 && (
          <span className="text-xs text-gray-400 px-2 py-1">
            +{project.technologies.length - 4} more
          </span>
        )}
      </div>

      {/* Project Status and Date */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              project.status === 'completed'
                ? 'bg-green-400'
                : project.status === 'in-progress'
                ? 'bg-yellow-400'
                : 'bg-gray-400'
            }`}
          />
          <span className="text-gray-400 capitalize">
            {project.status.replace('-', ' ')}
          </span>
        </div>
        {project.completedDate && (
          <span className="text-gray-500">
            {new Date(project.completedDate).toLocaleDateString()}
          </span>
        )}
      </div>

      {/* Hover indicator */}
      <div className="absolute bottom-2 right-2 text-xs text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">
        Click for details →
      </div>
    </motion.div>
  );
};

// Project Modal Component
const ProjectModal = ({ project, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  return (
    <motion.div
      className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-2 sm:p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-gray-900 border border-cyan-500 rounded-lg max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 50 }}
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex justify-between items-start p-4 sm:p-6 border-b border-gray-700 gap-3">
          <div className="flex-1 min-w-0 pr-2 sm:pr-4">
            <h2 className="text-cyan-400 text-lg sm:text-2xl font-bold mb-2 leading-tight break-words">
              {project.title}
            </h2>
            <div className="flex flex-wrap items-center gap-1 sm:gap-4 text-xs sm:text-sm">
              <span className="text-green-400 flex items-center">
                <span className="mr-1">
                  {
                    projectsData.categories.find(
                      cat => cat.id === project.category
                    )?.icon
                  }
                </span>
                <span className="hidden sm:inline">
                  {
                    projectsData.categories.find(
                      cat => cat.id === project.category
                    )?.name
                  }
                </span>
              </span>
              <span className="text-gray-400 hidden sm:inline">•</span>
              <span className="text-yellow-400 font-medium text-xs sm:text-sm">
                {project.difficulty.toUpperCase()}
              </span>
              <span className="text-gray-400 hidden sm:inline">•</span>
              <span
                className={`capitalize text-xs sm:text-sm ${
                  project.status === 'completed'
                    ? 'text-green-400'
                    : project.status === 'in-progress'
                    ? 'text-yellow-400'
                    : 'text-gray-400'
                }`}
              >
                {project.status.replace('-', ' ')}
              </span>
            </div>
          </div>

          {/* Enhanced Close Button - Fixed positioning */}
          <button
            onClick={onClose}
            className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 hover:text-red-300 transition-all duration-200 group ml-2"
            aria-label="Close modal"
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-3 sm:p-6 space-y-3 sm:space-y-6">
          {/* Project Images */}
          {project.images && project.images.length > 0 && (
            <div className="space-y-3 sm:space-y-4">
              <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden relative">
                <img
                  src={project.images[currentImageIndex]}
                  alt={`${project.title} screenshot ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover"
                  onError={e => {
                    e.target.src =
                      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzc0MTUxIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzlDQTNBRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIE5vdCBBdmFpbGFibGU8L3RleHQ+PC9zdmc+';
                  }}
                />
                {/* Image counter */}
                {project.images.length > 1 && (
                  <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {currentImageIndex + 1} / {project.images.length}
                  </div>
                )}
              </div>
              {project.images.length > 1 && (
                <div className="flex gap-2 justify-center">
                  {project.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-colors ${
                        index === currentImageIndex
                          ? 'bg-cyan-400'
                          : 'bg-gray-600 hover:bg-gray-500'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Project Description */}
          <div>
            <h3 className="text-green-400 text-base sm:text-lg font-semibold mb-2 sm:mb-3">
              About This Project
            </h3>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              {project.longDescription}
            </p>
          </div>

          {/* Technologies */}
          <div>
            <h3 className="text-green-400 text-base sm:text-lg font-semibold mb-2 sm:mb-3">
              Technologies Used
            </h3>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {project.technologies.map(tech => (
                <span
                  key={tech}
                  className="px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm border"
                  style={{
                    borderColor:
                      projectsData.technologies[tech]?.color || '#00FFFF',
                    color: projectsData.technologies[tech]?.color || '#00FFFF',
                    backgroundColor:
                      (projectsData.technologies[tech]?.color || '#00FFFF') +
                      '20',
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-green-400 text-base sm:text-lg font-semibold mb-2 sm:mb-3">
              Key Features
            </h3>
            <ul className="space-y-1.5 sm:space-y-2">
              {project.features.map((feature, index) => (
                <li
                  key={index}
                  className="text-gray-300 text-sm sm:text-base flex items-start"
                >
                  <span className="text-cyan-400 mr-2 mt-0.5 sm:mt-1 flex-shrink-0 text-xs sm:text-sm">
                    ▶
                  </span>
                  <span className="flex-1">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Achievements */}
          {project.achievements && project.achievements.length > 0 && (
            <div>
              <h3 className="text-green-400 text-lg font-semibold mb-3">
                Achievements
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.achievements.map((achievement, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm border border-yellow-500/30"
                  >
                    🏆 {achievement}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Links */}
          <div className="flex gap-4 pt-4">
            {project.liveUrl && (
              <NeonButton
                variant="primary"
                onClick={() => window.open(project.liveUrl, '_blank')}
                className="flex items-center gap-2"
              >
                🚀 Live Demo
              </NeonButton>
            )}
            {project.githubUrl && (
              <NeonButton
                variant="secondary"
                onClick={() => window.open(project.githubUrl, '_blank')}
                className="flex items-center gap-2"
              >
                📂 Source Code
              </NeonButton>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Stat Card Component
const StatCard = ({ icon, label, value, color }) => (
  <motion.div
    className="bg-gray-800/50 rounded-lg p-4 border border-green-500/20 text-center"
    whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(0, 255, 255, 0.3)' }}
    transition={{ duration: 0.2 }}
  >
    <div className="text-2xl mb-2">{icon}</div>
    <div className={`text-xl font-bold ${color} mb-1`}>{value}</div>
    <div className="text-sm text-gray-400">{label}</div>
  </motion.div>
);

export default ProjectsSection;
