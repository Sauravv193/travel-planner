import { Link } from 'react-router-dom'
import { Compass, Mail, MapPin } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  return (
    <footer className="bg-white/80 dark:bg-night-bg/80 backdrop-blur-xl border-t border-earth-100 dark:border-night-border">
      <div className="mx-auto max-w-7xl py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-12">
          <div className="xl:col-span-1">
            <Link to="/" className="flex items-center group">
              <div className="h-10 w-10 bg-gradient-to-br from-terracotta-400 to-terracotta-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-terracotta-500/20 transition-all duration-300">
                <Compass className="w-5 h-5 text-white" />
              </div>
              <span className="ml-3 text-xl font-bold text-forest-800 dark:text-white group-hover:text-terracotta-600 dark:group-hover:text-terracotta-400 transition-colors">WanderGen</span>
            </Link>
            <p className="mt-6 text-base text-earth-600 dark:text-night-muted leading-relaxed max-w-sm">
              AI-powered travel planning for India. Create personalized itineraries, smart photo journals, and adaptive travel experiences.
            </p>
            <div className="mt-6 flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-earth-600 dark:text-night-muted">
                <MapPin className="w-4 h-4 text-terracotta-500" />
                <span className="text-sm">Made in India</span>
              </div>
              <div className="flex items-center space-x-2 text-earth-600 dark:text-night-muted">
                <Mail className="w-4 h-4 text-terracotta-500" />
                <span className="text-sm">hello@wandergen.in</span>
              </div>
            </div>
          </div>
          <div className="mt-12 xl:col-span-2 xl:mt-0">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-widest text-forest-700 dark:text-white">Features</h3>
                <ul className="mt-4 space-y-3">
                  <li><Link to="/planner" className="text-base text-earth-600 hover:text-terracotta-600 dark:text-night-muted dark:hover:text-terracotta-400 transition-colors">AI Trip Planning</Link></li>
                  <li><span className="text-base text-earth-400/50 dark:text-night-muted/50 cursor-not-allowed">Photo Journals</span></li>
                  <li><span className="text-base text-earth-400/50 dark:text-night-muted/50 cursor-not-allowed">Real-time Adaptation</span></li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-widest text-forest-700 dark:text-white">Quick Links</h3>
                <ul className="mt-4 space-y-3">
                  <li><Link to="/planner" className="text-base text-earth-600 hover:text-terracotta-600 dark:text-night-muted dark:hover:text-terracotta-400 transition-colors">Plan a Trip</Link></li>
                  <li><Link to="/signin" className="text-base text-earth-600 hover:text-terracotta-600 dark:text-night-muted dark:hover:text-terracotta-400 transition-colors">Sign In</Link></li>
                  <li><Link to="/signup" className="text-base text-earth-600 hover:text-terracotta-600 dark:text-night-muted dark:hover:text-terracotta-400 transition-colors">Create Account</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-widest text-forest-700 dark:text-white">Explore</h3>
                <ul className="mt-4 space-y-3">
                  <li><span className="text-base text-earth-600 dark:text-night-muted">Destinations</span></li>
                  <li><span className="text-base text-earth-600 dark:text-night-muted">Travel Guides</span></li>
                  <li><span className="text-base text-earth-600 dark:text-night-muted">Tips & Tricks</span></li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-widest text-forest-700 dark:text-white">Company</h3>
                <ul className="mt-4 space-y-3">
                  <li><span className="text-base text-earth-600 dark:text-night-muted">About Us</span></li>
                  <li><span className="text-base text-earth-600 dark:text-night-muted">Privacy</span></li>
                  <li><span className="text-base text-earth-600 dark:text-night-muted">Terms</span></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-earth-100 dark:border-night-border pt-8">
          <p className="text-base text-earth-500 dark:text-night-muted xl:text-center">&copy; {currentYear} WanderGen. Crafted with care in India.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer