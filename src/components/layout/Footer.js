import React from 'react';
import { motion } from 'framer-motion';

const Footer = ({ className = '' }) => {
  const currentYear = new Date().getFullYear();

  // Social links with gaming theme
  const socialLinks = [
    {
      name: 'GitHub',
      url: 'https://github.com/username',
      icon: '📂',
      color: 'hover:text-white',
      description: 'Code & Projects',
    },
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com/in/username',
      icon: '💼',
      color: 'hover:text-blue-400',
      description: 'Professional Network',
    },
    {
      name: 'Discord',
      url: 'https://discord.gg/username',
      icon: '🎮',
      color: 'hover:text-purple-400',
      description: 'Gaming Community',
    },
    {
      name: 'Twitch',
      url: 'https://twitch.tv/username',
      icon: '📺',
      color: 'hover:text-purple-500',
      description: 'Live Streams',
    },
    {
      name: 'Twitter',
      url: 'https://twitter.com/username',
      icon: '🐦',
      color: 'hover:text-cyan-400',
      description: 'Updates & Thoughts',
    },
  ];

  // Quick navigation links
  const quickLinks = [
    { name: 'About', href: '#about', icon: '👤' },
    { name: 'Skills', href: '#skills', icon: '⚡' },
    { name: 'Projects', href: '#projects', icon: '🚀' },
    { name: 'Gaming', href: '#gaming', icon: '🎮' },
    { name: 'Contact', href: '#contact', icon: '📧' },
  ];

  // Gaming stats for footer
  const footerStats = [
    { label: 'Lines of Code', value: '50K+', icon: '💻' },
    { label: 'Projects Built', value: '25+', icon: '🏗️' },
    { label: 'Gaming Hours', value: '2000+', icon: '🎮' },
    { label: 'Achievements', value: '100+', icon: '🏆' },
  ];

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const scrollToSection = href => {
    const element = document.querySelector(href);
    if (element) {
      const offsetTop = element.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth',
      });
    }
  };

  return (
    <footer
      className={`bg-gray-900 border-t border-green-500/20 relative z-10 w-full ${className}`}
      style={{ minHeight: '400px' }}
    >
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
          {/* Brand Section */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-green-400 rounded-lg flex items-center justify-center">
                <span className="text-black font-bold">✨</span>
              </div>
              <div>
                <div className="text-cyan-400 font-bold text-lg">MrSpark</div>
                <div className="text-green-400 text-sm">Level 99 Developer</div>
              </div>
            </div>

            <p className="text-gray-400 text-sm leading-relaxed">
              Combining the precision of competitive gaming with the creativity
              of software development. Building digital experiences that level
              up the web.
            </p>

            <div className="flex items-center gap-2 text-sm">
              <span className="text-green-400">🟢</span>
              <span className="text-gray-300">
                Available for new opportunities
              </span>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-green-400 font-bold text-lg flex items-center gap-2">
              <span>🧭</span>
              Quick Navigation
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <motion.li key={link.name}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors text-sm group"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span className="group-hover:scale-110 transition-transform">
                      {link.icon}
                    </span>
                    {link.name}
                  </button>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Social Links */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 className="text-green-400 font-bold text-lg flex items-center gap-2">
              <span>🌐</span>
              Connect
            </h3>
            <div className="space-y-3">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-3 text-gray-400 ${social.color} transition-colors text-sm group`}
                  whileHover={{ x: 5, scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="text-base group-hover:scale-110 transition-transform">
                    {social.icon}
                  </span>
                  <div>
                    <div className="font-medium">{social.name}</div>
                    <div className="text-xs opacity-70">
                      {social.description}
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3 className="text-green-400 font-bold text-lg flex items-center gap-2">
              <span>📊</span>
              Stats
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {footerStats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="bg-gray-800/50 rounded-lg p-3 border border-gray-700 text-center"
                  whileHover={{
                    scale: 1.05,
                    boxShadow: '0 0 20px rgba(0, 255, 255, 0.2)',
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="text-lg mb-1">{stat.icon}</div>
                  <div className="text-cyan-400 font-bold text-sm">
                    {stat.value}
                  </div>
                  <div className="text-gray-400 text-xs">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <motion.div
              className="text-gray-400 text-sm text-center md:text-left"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <span>© {currentYear} MrSpark.</span>
                <span className="text-green-400">⚡</span>
                <span>Crafted with passion and pixels.</span>
              </div>
              <div className="text-xs mt-1 opacity-70">
                Built with React, Tailwind CSS, and lots of ☕
              </div>
            </motion.div>

            {/* Back to Top Button */}
            <motion.button
              onClick={scrollToTop}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-green-500/30 rounded-lg text-green-400 hover:text-cyan-400 transition-all text-sm"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <span>🚀</span>
              <span>Back to Top</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-green-400/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </footer>
  );
};

export default Footer;
