import { Link } from 'react-router-dom';
import { ArrowUpRight, Compass, Instagram, MapPin } from 'lucide-react';

const Footer = () => (
  <footer className="wg-site-footer">
    <div className="wg-footer-main">
      <div className="wg-footer-brand">
        <Link to="/" className="wg-brand">
          <span className="wg-brand-mark"><Compass size={21} strokeWidth={1.8} /></span>
          <span>Wander<span>Gen</span><small>TRAVEL, THOUGHTFULLY</small></span>
        </Link>
        <p>Thoughtful travel planning for people who want to see more and stress less.</p>
        <span className="wg-footer-origin"><MapPin size={14} /> Made for journeys across India</span>
      </div>
      <div className="wg-footer-column"><strong>EXPLORE</strong><Link to="/">Discover</Link><Link to="/planner">Plan a trip</Link><Link to="/profile">My trips</Link></div>
      <div className="wg-footer-column"><strong>YOUR ACCOUNT</strong><Link to="/signin">Sign in</Link><Link to="/signup">Create account</Link></div>
      <div className="wg-footer-note"><span>GO A LITTLE FURTHER.</span><p>One destination at a time.</p><Link to="/planner">Start planning <ArrowUpRight size={16} /></Link></div>
    </div>
    <div className="wg-footer-bottom"><span>© {new Date().getFullYear()} WanderGen</span><span>Made for the curious.</span></div>
  </footer>
);

export default Footer;
