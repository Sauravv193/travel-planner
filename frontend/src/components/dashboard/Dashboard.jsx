import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useEffect, useRef, useState } from 'react';
import DashboardStats from './DashboardStats';
import UpcomingTrips from './UpcomingTrips';
import QuickActions from './QuickActions';
import RecentActivity from './RecentActivity';
import { Sparkles, Compass, ArrowRight } from 'lucide-react';

const Dashboard = ({ trips }) => {
  const { user } = useAuth();
  const [visible, setVisible] = useState(false);
  const headerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (headerRef.current) observer.observe(headerRef.current);
    return () => observer.disconnect();
  }, []);

  const upcomingCount = trips.filter(t => new Date(t.startDate) > new Date()).length;

  return (
    <div className="space-y-8">
      {/* Welcome Header - Classic Luxury Gradient */}
      <div
        ref={headerRef}
        className={`relative overflow-hidden bg-gradient-to-br from-lux-navy via-lux-navy to-lux-navy rounded-3xl p-8 sm:p-10 text-white shadow-2xl shadow-lux-navy/20 transition-all duration-700 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        {/* Gold Accent Stripe */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold-400 via-gold-500 to-gold-400" />
        
        {/* Decorative Orbs */}
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-gold-500/5 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-gold-400/5 blur-3xl" />

        <div className="relative z-10 flex items-center justify-between">
          <div className="space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full border border-gold-400/30">
              <Sparkles className="w-4 h-4 text-gold-300" />
              <span className="text-sm font-medium text-white/80">
                {trips.length > 0 ? `${upcomingCount} upcoming trip${upcomingCount !== 1 ? 's' : ''}` : 'Start your journey'}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold leading-tight">
              Welcome back, {user?.username || 'Traveler'}
            </h1>

            <p className="text-white/70 text-lg max-w-xl leading-relaxed">
              {trips.length > 0
                ? 'Continue planning your adventures and exploring new destinations across India.'
                : 'Ready for your next adventure? Start planning your perfect trip across India today!'}
            </p>

            {trips.length === 0 && (
              <Link
                to="/planner"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-gold-500/20 backdrop-blur-sm border border-gold-400/30 rounded-xl text-white font-semibold hover:bg-gold-500/30 transition-all duration-300 group"
              >
                <Compass className="w-5 h-5" />
                <span>Plan Your First Trip</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
          </div>

          {/* Avatar */}
          <div className="hidden sm:block">
            <div className="w-20 h-20 bg-gold-500/15 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-gold-400/30 shadow-xl">
              <span className="text-3xl font-bold text-gold-300">
                {user?.username?.charAt(0).toUpperCase() || 'T'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <DashboardStats trips={trips} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left - Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <UpcomingTrips trips={trips} />
          <RecentActivity trips={trips} />
        </div>

        {/* Right - Sidebar */}
        <div className="space-y-6">
          <QuickActions />

          {/* Profile Completion */}
          <div className="card-classic p-6">
            <h3 className="text-lg font-bold text-lux-charcoal dark:text-white mb-4">
              Profile Completion
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-lux-taupe dark:text-night-muted">Profile Setup</span>
                <span className="text-gold-600 dark:text-gold-400 font-semibold">75%</span>
              </div>
              <div className="w-full h-2.5 bg-cream-100 dark:bg-night-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-gold-400 to-gold-600 rounded-full transition-all duration-1000"
                  style={{ width: '75%' }}
                />
              </div>
              <p className="text-xs text-lux-taupe dark:text-night-muted">
                Add travel preferences to get better AI recommendations
              </p>
              <button className="text-sm text-gold-600 dark:text-gold-400 font-medium hover:text-gold-700 dark:hover:text-gold-300 transition-colors">
                Complete Profile →
              </button>
            </div>
          </div>

          {/* Travel Tip */}
          <div className="bg-gradient-to-br from-gold-50 to-cream-50 dark:from-gold-900/10 dark:to-gold-900/5 rounded-2xl p-6 border border-gold-200/50 dark:border-gold-500/10">
            <h3 className="text-lg font-bold text-lux-charcoal dark:text-white mb-3">💡 Travel Tip</h3>
            <p className="text-sm text-lux-taupe dark:text-night-muted leading-relaxed mb-4">
              AI can adapt your itinerary in real-time. If weather changes or plans shift, just describe the situation and get instant adjustments.
            </p>
            <button className="text-sm font-medium text-gold-600 dark:text-gold-400 hover:text-gold-700 dark:hover:text-gold-300 transition-colors">
              Learn more →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;