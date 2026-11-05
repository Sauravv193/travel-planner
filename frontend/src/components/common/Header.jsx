import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.jsx';
import { useEffect, useState } from 'react';
import ThemeToggle from './ThemeToggle';
import { ArrowUpRight, Compass, LogOut, Menu, X } from 'lucide-react';

const Header = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [location.pathname]);

  const signOut = () => {
    logout();
    setMenuOpen(false);
    navigate('/');
  };

  const links = [
    { label: 'Discover', to: '/', active: location.pathname === '/' },
    ...(user ? [
      { label: 'Plan a trip', to: '/planner', active: location.pathname === '/planner' },
      { label: 'My trips', to: '/profile', active: location.pathname === '/profile' || location.pathname.startsWith('/trip/') },
    ] : []),
  ];

  return (
    <header className={`wg-site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <nav className="wg-nav" aria-label="Main navigation">
        <Link to="/" className="wg-brand" aria-label="WanderGen home">
          <span className="wg-brand-mark"><Compass size={21} strokeWidth={1.8} /></span>
          <span>Wander<span>Gen</span><small>TRAVEL, THOUGHTFULLY</small></span>
        </Link>

        <div className="wg-nav-links">
          {links.map((link) => <Link key={link.label} to={link.to} className={link.active ? 'is-active' : ''}>{link.label}</Link>)}
        </div>

        <div className="wg-nav-actions">
          <ThemeToggle />
          {user ? (
            <>
              <Link to="/profile" className="wg-nav-user"><span>{user.username?.charAt(0).toUpperCase() || 'T'}</span><small>{user.username || 'Your account'}</small></Link>
              <button type="button" onClick={signOut} className="wg-nav-signout" aria-label="Sign out" title="Sign out"><LogOut size={17} /></button>
            </>
          ) : (
            <>
              <Link to="/signin" className="wg-nav-login">Sign in</Link>
              <Link to="/signup" className="wg-nav-join">Get started <ArrowUpRight size={16} /></Link>
            </>
          )}
        </div>

        <button type="button" className="wg-mobile-menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen}>
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </nav>
      <div className={`wg-mobile-menu ${menuOpen ? 'is-open' : ''}`}>
        {links.map((link) => <Link key={link.label} to={link.to} className={link.active ? 'is-active' : ''}>{link.label}</Link>)}
        {user ? <button type="button" onClick={signOut}><LogOut size={16} /> Sign out</button> : <><Link to="/signin">Sign in</Link><Link to="/signup" className="wg-mobile-join">Create an account <ArrowUpRight size={16} /></Link></>}
      </div>
    </header>
  );
};

export default Header;
