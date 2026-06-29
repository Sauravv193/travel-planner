import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.jsx';
import { useState, useEffect } from 'react';
import ThemeToggle from './ThemeToggle';
import { Compass, Menu, X, LogOut, Sparkles } from 'lucide-react';

const Header = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const navigation = [
    { name: 'Home', href: '/', current: location.pathname === '/' },
    ...(user ? [
      { name: 'Plan Trip', href: '/planner', current: location.pathname === '/planner' },
      { name: 'My Trips', href: '/profile', current: location.pathname === '/profile' },
    ] : []),
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-white/90 dark:bg-night-bg/90 backdrop-blur-2xl shadow-lg shadow-gold-500/5'
          : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-gold-400 to-gold-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-gold-500/30 transition-all duration-300">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-lux-charcoal dark:text-white group-hover:text-gold-600 dark:group-hover:text-gold-400 transition-colors duration-300">
              WanderGen
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigation.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  link.current
                    ? 'text-gold-700 dark:text-gold-400 bg-gold-50 dark:bg-gold-500/10'
                    : 'text-lux-charcoal/70 dark:text-night-muted hover:text-lux-charcoal dark:hover:text-white hover:bg-cream-100 dark:hover:bg-night-surface'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-3">
            <ThemeToggle />
            
            {user ? (
              <div className="hidden sm:flex items-center space-x-3">
                <div className="flex items-center space-x-2.5 px-3 py-1.5 bg-gold-50 dark:bg-gold-500/10 border border-gold-200 dark:border-gold-500/20 rounded-full">
                  <div className="w-7 h-7 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-white text-xs font-bold">
                      {user.username?.charAt(0).toUpperCase() || 'T'}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-lux-charcoal dark:text-night-text">
                    {user.username}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="btn-ghost text-sm"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4 mr-1.5" />
                  Sign out
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center space-x-2">
                <Link
                  to="/signin"
                  className="btn-ghost px-4 py-2 text-sm"
                >
                  Sign in
                </Link>
                <Link
                  to="/signup"
                  className="btn-primary py-2 px-4 text-sm"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-cream-100 dark:hover:bg-night-surface transition-colors"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMenuOpen ? (
                <X className="w-5 h-5 text-lux-charcoal dark:text-night-text" />
              ) : (
                <Menu className="w-5 h-5 text-lux-charcoal dark:text-night-text" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden transition-all duration-300 overflow-hidden ${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-white/95 dark:bg-night-card/95 backdrop-blur-2xl border-t border-cream-100 dark:border-night-border px-4 py-4 space-y-2">
          {navigation.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              onClick={() => setIsMenuOpen(false)}
              className={`block px-4 py-3 rounded-xl text-base font-medium transition-all ${
                link.current
                  ? 'text-gold-700 dark:text-gold-400 bg-gold-50 dark:bg-gold-500/10'
                  : 'text-lux-charcoal dark:text-night-text hover:bg-cream-50 dark:hover:bg-night-surface'
              }`}
            >
              {link.name}
            </Link>
          ))}

          <div className="divider-gradient" />

          {user ? (
            <div className="space-y-2">
              <div className="flex items-center space-x-3 px-4 py-3">
                <div className="w-10 h-10 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-white font-bold">
                    {user.username?.charAt(0).toUpperCase() || 'T'}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-lux-charcoal dark:text-white">{user.username}</p>
                  <p className="text-sm text-lux-taupe dark:text-night-muted">{user.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl text-base font-medium text-lux-burgundy dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign out</span>
              </button>
            </div>
          ) : (
            <div className="space-y-2 pt-2">
              <Link
                to="/signin"
                onClick={() => setIsMenuOpen(false)}
                className="block w-full text-center px-4 py-3 rounded-xl text-base font-medium text-lux-charcoal dark:text-night-text border-2 border-cream-200 dark:border-night-border hover:border-gold-300 dark:hover:border-gold-500/50 transition-colors"
              >
                Sign in
              </Link>
              <Link
                to="/signup"
                onClick={() => setIsMenuOpen(false)}
                className="block w-full text-center px-4 py-3 rounded-xl text-base font-medium text-white bg-gradient-to-r from-lux-navy to-lux-navy hover:shadow-lg hover:shadow-lux-navy/30 transition-all"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;