import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.jsx';
import { useState } from 'react';
import ThemeToggle from './ThemeToggle';

const Header = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navigation = [
    { name: 'Home', href: '/', current: location.pathname === '/' },
    ...(user ? [
      { name: 'Plan Trip', href: '/planner', current: location.pathname === '/planner' },
      { name: 'My Trips', href: '/profile', current: location.pathname === '/profile' },
    ] : [])
  ];

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex w-full items-center justify-between py-4">
          <div className="flex items-center">
            <Link to="/" className="flex items-center group">
              <div className="h-10 w-10 bg-gradient-to-br from-pink-400 to-pink-600 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200">
                <span className="text-white font-bold text-xl">W</span>
              </div>
              <span className="ml-3 text-2xl font-bold text-gray-900 dark:text-white group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors duration-200">WanderGen</span>
            </Link>
            <div className="ml-10 hidden space-x-8 lg:block">
              {navigation.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`text-base font-medium transition-colors relative ${
                    link.current 
                      ? 'text-pink-600 dark:text-pink-400' 
                      : 'text-gray-900 dark:text-gray-300 hover:text-pink-500 dark:hover:text-pink-400'
                  }`}
                >
                  {link.name}
                  {link.current && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-600 dark:bg-pink-400 rounded-full"></span>
                  )}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            {user ? (
                <div className="hidden sm:flex items-center space-x-4">
                    <div className="flex items-center space-x-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full">
                      <div className="w-6 h-6 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{user.username.charAt(0).toUpperCase()}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{user.username}</span>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="btn-secondary py-2 px-4 text-sm"
                    >
                        Sign out
                    </button>
                </div>
            ) : (
              <div className="hidden sm:flex items-center space-x-3">
                <Link to="/signin" className="text-gray-700 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 font-medium px-4 py-2 transition-colors duration-200">
                  Sign in
                </Link>
                <Link to="/signup" className="btn-primary py-2 px-4 text-sm">
                  Get Started
                </Link>
              </div>
            )}
            <div className="sm:hidden">
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <svg className="h-6 w-6 text-gray-900 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                </button>
            </div>
          </div>
        </div>
        {isMenuOpen && (
            <div className="sm:hidden py-4 border-t border-gray-200 dark:border-gray-700 animate-slideDown">
                 {user ? (
                    <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center px-5">
                            <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center">
                              <span className="text-white font-bold">{user.username.charAt(0).toUpperCase()}</span>
                            </div>
                            <div className="ml-3">
                                <div className="text-base font-medium text-gray-800 dark:text-white">Hello, {user.username}</div>
                            </div>
                        </div>
                        <div className="mt-3 space-y-1">
                            <Link to="/profile" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700">My Trips</Link>
                            <Link to="/planner" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700">Plan Trip</Link>
                            <button onClick={handleLogout} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700">
                                Sign out
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <Link to="/signin" className="block w-full bg-pink-600 text-white text-center py-3 px-4 border border-transparent rounded-lg font-medium hover:bg-pink-700 transition-colors">Sign in</Link>
                        <Link to="/signup" className="block w-full bg-white text-gray-700 dark:bg-gray-800 dark:text-gray-200 text-center py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Get Started</Link>
                    </div>
                )}
            </div>
        )}
      </nav>
    </header>
  );
};

export default Header;