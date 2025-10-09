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
    <header className="bg-white shadow-sm border-b border-gray-200">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex w-full items-center justify-between py-4">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="h-10 w-10 bg-teal-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">W</span>
              </div>
              <span className="ml-3 text-2xl font-bold text-gray-900 dark:text-white">WanderGen</span>
            </Link>
            <div className="ml-10 hidden space-x-8 lg:block">
              {navigation.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`text-base font-medium transition-colors ${
                    link.current 
                      ? 'text-teal-600 dark:text-teal-400' 
                      : 'text-gray-900 dark:text-gray-300 hover:text-teal-500 dark:hover:text-teal-400'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            {user ? (
                <div className="hidden sm:flex items-center space-x-4">
                    <span className="text-gray-700 dark:text-gray-300">Hello, {user.username}</span>
                    <button
                        onClick={handleLogout}
                        className="btn-secondary py-2 px-4"
                    >
                        Sign out
                    </button>
                </div>
            ) : (
              <div className="hidden sm:flex items-center space-x-4">
                <Link to="/signin" className="btn-primary py-2 px-4">
                  Sign in
                </Link>
                <Link to="/signup" className="btn-secondary py-2 px-4">
                  Sign up
                </Link>
              </div>
            )}
            <div className="sm:hidden">
                <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    <svg className="h-6 w-6 text-gray-900 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                </button>
            </div>
          </div>
        </div>
        {isMenuOpen && (
            <div className="sm:hidden py-4 border-t border-gray-200 dark:border-gray-700">
                 {user ? (
                    <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center px-5">
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
                    <div className="space-y-1">
                        <Link to="/signin" className="block w-full bg-teal-600 text-white text-center py-2 px-4 border border-transparent rounded-md font-medium">Sign in</Link>
                        <Link to="/signup" className="block w-full bg-white text-gray-700 dark:bg-gray-700 dark:text-gray-200 text-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md font-medium">Sign up</Link>
                    </div>
                )}
            </div>
        )}
      </nav>
    </header>
  );
};

export default Header;