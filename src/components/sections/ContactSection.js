import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { TerminalWindow } from '../layout';
import { GlitchText, NeonButton } from '../ui';

const ContactSection = ({ className = '' }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    contactReason: 'general',
  });
  const [formStatus, setFormStatus] = useState('idle'); // idle, sending, success, error
  const [processingStep, setProcessingStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, threshold: 0.2 });

  // Contact reasons with gaming theme
  const contactReasons = [
    { value: 'general', label: '💬 General Inquiry', icon: '💬' },
    { value: 'collaboration', label: '🤝 Collaboration', icon: '🤝' },
    { value: 'job', label: '💼 Job Opportunity', icon: '💼' },
    { value: 'gaming', label: '🎮 Gaming Partnership', icon: '🎮' },
    { value: 'project', label: '🚀 Project Discussion', icon: '🚀' },
    { value: 'mentorship', label: '🎓 Mentorship', icon: '🎓' },
  ];

  // Social links with gaming theme
  const socialLinks = [
    {
      name: 'GitHub',
      url: 'https://github.com/developer',
      icon: '📂',
      color: 'text-gray-400 hover:text-white',
      description: 'Code repositories and projects',
    },
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com/in/developer',
      icon: '💼',
      color: 'text-blue-400 hover:text-blue-300',
      description: 'Professional network and experience',
    },
    {
      name: 'Discord',
      url: 'https://discord.gg/username',
      icon: '🎮',
      color: 'text-purple-400 hover:text-purple-300',
      description: 'Gaming community and chat',
    },
    {
      name: 'Twitter',
      url: 'https://twitter.com/developer',
      icon: '🐦',
      color: 'text-blue-400 hover:text-blue-300',
      description: 'Follow for updates and thoughts',
    },
    {
      name: 'Email',
      url: 'mailto:developer@example.com',
      icon: '📧',
      color: 'text-green-400 hover:text-green-300',
      description: 'Direct email communication',
    },
  ];

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Player name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'ERROR: Invalid email format detected';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    } else if (formData.subject.length < 5) {
      newErrors.subject = 'Subject must be at least 5 characters';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.length < 10) {
      newErrors.message = 'ERROR: Message too short';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async e => {
    e.preventDefault();

    if (!validateForm()) {
      setFormStatus('error');
      return;
    }

    setFormStatus('sending');
    setProcessingStep(0);

    try {
      // Simulate multi-step processing
      setProcessingStep(1); // Encrypting message
      await new Promise(resolve => setTimeout(resolve, 1000));

      setProcessingStep(2); // Establishing secure connection
      await new Promise(resolve => setTimeout(resolve, 1000));

      setProcessingStep(3); // Transmitting data
      await new Promise(resolve => setTimeout(resolve, 1000));

      // In a real app, you would send the form data to your backend
      console.log('Form submitted:', formData);

      setFormStatus('success');
      setShowSuccessAnimation(true);
      setProcessingStep(0);

      // Reset form after success
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
          contactReason: 'general',
        });
        setFormStatus('idle');
        setShowSuccessAnimation(false);
      }, 3000);
    } catch (error) {
      console.error('Form submission error:', error);
      setFormStatus('error');
    }
  };

  // Handle input changes
  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <section ref={ref} className={`py-20 ${className}`}>
      <div className="container mx-auto px-4">
        <TerminalWindow
          title="communication_terminal.exe"
          className="max-w-6xl mx-auto"
        >
          <div className="space-y-8">
            {/* Contact Header */}
            <motion.div
              className="text-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <GlitchText className="text-3xl font-bold text-cyan-400 mb-2">
                ESTABLISH CONNECTION
              </GlitchText>
              <div className="text-green-400 text-sm mb-4">
                Ready to team up? Send a message and let's start the
                conversation!
              </div>
              <div className="text-xs text-gray-400">
                Response time: Usually within 24 hours • All inquiries welcome
              </div>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Contact Form */}
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, x: -50 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h3 className="text-xl font-bold text-green-400 mb-4 flex items-center gap-2">
                  <span>📝</span>
                  Send Message
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Contact Reason */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Mission Type
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {contactReasons.map(reason => (
                        <label
                          key={reason.value}
                          className={`
                            flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all
                            ${
                              formData.contactReason === reason.value
                                ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400'
                                : 'border-gray-600 bg-gray-800/50 text-gray-400 hover:border-gray-500'
                            }
                          `}
                        >
                          <input
                            type="radio"
                            name="contactReason"
                            value={reason.value}
                            checked={formData.contactReason === reason.value}
                            onChange={handleInputChange}
                            className="sr-only"
                          />
                          <span className="text-sm">{reason.icon}</span>
                          <span className="text-xs font-medium">
                            {reason.label.split(' ').slice(1).join(' ')}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Name and Email */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-300 mb-2"
                      >
                        Sender ID *
                      </label>
                      <input
                        id="name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`
                          w-full px-4 py-3 bg-gray-800/50 border-2 rounded-lg text-green-400
                          placeholder-gray-500 focus:outline-none transition-colors
                          ${
                            errors.name
                              ? 'border-red-500 focus:border-red-400'
                              : 'border-green-500/30 focus:border-cyan-400'
                          }
                        `}
                        placeholder="Enter your name"
                        disabled={formStatus === 'sending'}
                      />
                      {errors.name && (
                        <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                          <span>⚠️</span>
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-300 mb-2"
                      >
                        Communication Channel *
                      </label>
                      <input
                        id="email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`
                          w-full px-4 py-3 bg-gray-800/50 border-2 rounded-lg text-green-400
                          placeholder-gray-500 focus:outline-none transition-colors
                          ${
                            errors.email
                              ? 'border-red-500 focus:border-red-400'
                              : 'border-green-500/30 focus:border-cyan-400'
                          }
                        `}
                        placeholder="your.email@example.com"
                        disabled={formStatus === 'sending'}
                      />
                      {errors.email && (
                        <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                          <span>⚠️</span>
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-gray-300 mb-2"
                    >
                      Transmission Subject *
                    </label>
                    <input
                      id="subject"
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className={`
                        w-full px-4 py-3 bg-gray-800/50 border-2 rounded-lg text-green-400
                        placeholder-gray-500 focus:outline-none transition-colors
                        ${
                          errors.subject
                            ? 'border-red-500 focus:border-red-400'
                            : 'border-green-500/30 focus:border-cyan-400'
                        }
                      `}
                      placeholder="What's this about?"
                      disabled={formStatus === 'sending'}
                    />
                    {errors.subject && (
                      <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                        <span>⚠️</span>
                        {errors.subject}
                      </p>
                    )}
                  </div>

                  {/* Message */}
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-300 mb-2"
                    >
                      Message Payload *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={6}
                      className={`
                        w-full px-4 py-3 bg-gray-800/50 border-2 rounded-lg text-green-400
                        placeholder-gray-500 focus:outline-none transition-colors resize-none
                        ${
                          errors.message
                            ? 'border-red-500 focus:border-red-400'
                            : 'border-green-500/30 focus:border-cyan-400'
                        }
                      `}
                      placeholder="Tell me about your project, idea, or just say hello!"
                      disabled={formStatus === 'sending'}
                    />
                    {errors.message && (
                      <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                        <span>⚠️</span>
                        {errors.message}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="flex items-center gap-4">
                    <NeonButton
                      type="submit"
                      variant="primary"
                      disabled={formStatus === 'sending'}
                      className="flex items-center gap-2 min-w-32"
                    >
                      {formStatus === 'sending' ? (
                        <>
                          <motion.div
                            className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: 'linear',
                            }}
                          />
                          Encrypting message...
                        </>
                      ) : formStatus === 'success' ? (
                        <>
                          <span>✅</span>
                          Transmission successful!
                        </>
                      ) : (
                        <>
                          <span>🚀</span>
                          Send Message
                        </>
                      )}
                    </NeonButton>

                    {formStatus === 'error' && (
                      <p className="text-red-400 text-sm flex items-center gap-1">
                        <span>❌</span>
                        Please check your inputs and try again
                      </p>
                    )}
                  </div>
                </form>

                {/* Processing Messages */}
                {formStatus === 'sending' && (
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-cyan-500/30">
                    <div className="space-y-2 text-sm">
                      {processingStep >= 1 && (
                        <div className="text-cyan-400 flex items-center gap-2">
                          <span>🔐</span>
                          Encrypting message...
                        </div>
                      )}
                      {processingStep >= 2 && (
                        <div className="text-green-400 flex items-center gap-2">
                          <span>🔗</span>
                          Establishing secure connection...
                        </div>
                      )}
                      {processingStep >= 3 && (
                        <div className="text-purple-400 flex items-center gap-2">
                          <span>📡</span>
                          Transmitting data...
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Success Messages */}
                {formStatus === 'success' && (
                  <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/30">
                    <div className="space-y-2 text-sm">
                      <div className="text-green-400 flex items-center gap-2 font-semibold">
                        <span>✅</span>
                        Transmission successful!
                      </div>
                      <div className="text-green-300 flex items-center gap-2">
                        <span>📨</span>
                        Message delivered to target recipient
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Contact Info & Social Links */}
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, x: 50 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <h3 className="text-xl font-bold text-green-400 mb-4 flex items-center gap-2">
                  <span>🌐</span>
                  Connect With Me
                </h3>

                {/* Social Links Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {socialLinks.map((link, index) => (
                    <motion.a
                      key={link.name}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`
                        flex items-center gap-3 p-4 rounded-lg border-2 border-gray-600
                        bg-gray-800/50 hover:border-gray-500 transition-all duration-300
                        ${link.color}
                      `}
                      whileHover={{
                        scale: 1.05,
                        boxShadow: '0 0 20px rgba(0, 255, 255, 0.3)',
                      }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                    >
                      <span className="text-xl">{link.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">{link.name}</div>
                        <div className="text-xs text-gray-400 truncate">
                          {link.description}
                        </div>
                      </div>
                    </motion.a>
                  ))}
                </div>

                {/* Quick Contact Info */}
                <div className="bg-gray-800/50 rounded-lg p-6 border border-green-500/20">
                  <h4 className="text-lg font-semibold text-cyan-400 mb-4 flex items-center gap-2">
                    <span>⚡</span>
                    Quick Info
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Status:</span>
                      <span className="text-green-400">Ready</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Connection:</span>
                      <span className="text-cyan-400">
                        Secure Channel Active
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Response Time:</span>
                      <span className="text-green-400">Within 24 hours</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Best Time to Reach:</span>
                      <span className="text-cyan-400">9 AM - 6 PM IST</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Preferred Contact:</span>
                      <span className="text-purple-400">Email or Discord</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Languages:</span>
                      <span className="text-yellow-400">
                        English, JavaScript 😄
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </TerminalWindow>
      </div>

      {/* Success Animation Overlay */}
      {showSuccessAnimation && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-green-500 text-black px-8 py-4 rounded-lg font-bold text-lg flex items-center gap-3"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.5, type: 'spring', stiffness: 200 }}
          >
            <span className="text-2xl">🎉</span>
            Message sent successfully!
            <span className="text-2xl">🚀</span>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
};

export default ContactSection;
