import React from 'react';
import './App.css';

// Simple test component to debug the issue
function SimpleApp() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="p-4 bg-gray-800">
        <h1 className="text-2xl font-bold text-cyan-400">
          Gaming Portfolio - Debug Mode
        </h1>
      </header>

      <main className="p-8">
        <section className="mb-8">
          <h2 className="text-xl text-green-400 mb-4">🎮 Hero Section</h2>
          <div className="bg-gray-800 p-6 rounded-lg border border-cyan-500/30">
            <div className="text-center">
              <div className="text-4xl mb-4">🎮</div>
              <h1 className="text-3xl font-bold text-white mb-2">Your Name</h1>
              <p className="text-cyan-400 text-lg">Full Stack Developer</p>

              <div className="grid grid-cols-2 gap-4 mt-6 max-w-md mx-auto">
                <div className="bg-gray-700 p-3 rounded">
                  <div className="text-cyan-400 font-bold">5+</div>
                  <div className="text-sm text-gray-300">Years Experience</div>
                </div>
                <div className="bg-gray-700 p-3 rounded">
                  <div className="text-green-400 font-bold">50+</div>
                  <div className="text-sm text-gray-300">Projects</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl text-green-400 mb-4">📋 About Section</h2>
          <div className="bg-gray-800 p-6 rounded-lg border border-cyan-500/30">
            <p className="text-gray-300">
              This is a simplified version to test the basic layout and styling.
              If you can see this properly, the issue is with the complex
              components.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl text-green-400 mb-4">🛠️ Skills Section</h2>
          <div className="bg-gray-800 p-6 rounded-lg border border-cyan-500/30">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl mb-2">⚛️</div>
                <div className="text-cyan-400">React</div>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">🟢</div>
                <div className="text-green-400">Node.js</div>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">🐍</div>
                <div className="text-purple-400">Python</div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl text-green-400 mb-4">🚀 Projects Section</h2>
          <div className="bg-gray-800 p-6 rounded-lg border border-cyan-500/30">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-700 p-4 rounded">
                <h3 className="text-cyan-400 font-bold mb-2">Project 1</h3>
                <p className="text-gray-300 text-sm">
                  E-commerce platform built with MERN stack
                </p>
              </div>
              <div className="bg-gray-700 p-4 rounded">
                <h3 className="text-cyan-400 font-bold mb-2">Project 2</h3>
                <p className="text-gray-300 text-sm">
                  ML prediction model with Python
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl text-green-400 mb-4">🎯 Contact Section</h2>
          <div className="bg-gray-800 p-6 rounded-lg border border-cyan-500/30">
            <form className="max-w-md mx-auto">
              <div className="mb-4">
                <label className="block text-cyan-400 mb-2">Name</label>
                <input
                  type="text"
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                  placeholder="Your name"
                />
              </div>
              <div className="mb-4">
                <label className="block text-cyan-400 mb-2">Email</label>
                <input
                  type="email"
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                  placeholder="your@email.com"
                />
              </div>
              <div className="mb-4">
                <label className="block text-cyan-400 mb-2">Message</label>
                <textarea
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white h-24"
                  placeholder="Your message"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-2 px-4 rounded transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 p-4 text-center text-gray-400">
        <p>&copy; 2025 Gaming Portfolio - Debug Mode</p>
      </footer>
    </div>
  );
}

export default SimpleApp;
