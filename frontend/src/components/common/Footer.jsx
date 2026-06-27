import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-7xl py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="xl:col-span-1">
            <Link to="/" className="flex items-center">
              <div className="h-8 w-8 bg-pink-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">W</span>
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">WanderGen</span>
            </Link>
            <p className="mt-4 text-base text-gray-500 dark:text-gray-400">
              AI-powered travel planning with Google Gemini. Create personalized itineraries, smart photo journals, and adaptive travel experiences.
            </p>
            <div className="mt-6 flex space-x-4">
              <a 
                href="https://github.com/Sauravv193/travel-planner" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <span className="sr-only">GitHub</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white">Features</h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link to="/planner" className="text-base text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                      AI Trip Planning
                    </Link>
                  </li>
                  <li>
                    <span className="text-base text-gray-400 dark:text-gray-500 cursor-not-allowed">
                      Photo Journals
                    </span>
                  </li>
                  <li>
                    <span className="text-base text-gray-400 dark:text-gray-500 cursor-not-allowed">
                      Real-time Adaptation
                    </span>
                  </li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white">Resources</h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <a 
                      href="https://github.com/Sauravv193/travel-planner" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-base text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                    >
                      GitHub Repository
                    </a>
                  </li>
                  <li>
                    <span className="text-base text-gray-400 dark:text-gray-500 cursor-not-allowed">
                      API Documentation
                    </span>
                  </li>
                  <li>
                    <span className="text-base text-gray-400 dark:text-gray-500 cursor-not-allowed">
                      System Design
                    </span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white">Tech Stack</h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <span className="text-base text-gray-500 dark:text-gray-400">React 18 + Vite</span>
                  </li>
                  <li>
                    <span className="text-base text-gray-500 dark:text-gray-400">Spring Boot 3</span>
                  </li>
                  <li>
                    <span className="text-base text-gray-500 dark:text-gray-400">PostgreSQL + Redis</span>
                  </li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white">Deployment</h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <span className="text-base text-gray-500 dark:text-gray-400">Vercel (Frontend)</span>
                  </li>
                  <li>
                    <span className="text-base text-gray-500 dark:text-gray-400">Render (Backend)</span>
                  </li>
                  <li>
                    <span className="text-base text-gray-500 dark:text-gray-400">Neon (Database)</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-200 dark:border-gray-800 pt-8">
          <p className="text-base text-gray-400 xl:text-center">
            &copy; 2025 WanderGen. Built with ❤️ using React, Spring Boot, and Google Gemini AI.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer