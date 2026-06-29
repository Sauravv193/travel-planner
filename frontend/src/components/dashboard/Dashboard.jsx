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
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } }, { threshold: 0.1 });
    if (headerRef.current) observer.observe(headerRef.current);
    return () => observer.disconnect();
  }, []);

  const upcomingCount = trips.filter(t => new Date(t.startDate) > new Date()).length;

  return (
    <div className="space-y-8">
      <div ref={headerRef} className={`relative overflow-hidden bg-gradient-to-br from-forest-500 via-forest-600 to-forest-700 rounded-3xl p-8 sm:p-10 text-white shadow-glass-xl transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-terracotta-400 via-terracotta-500 to-terracotta-400" />
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-terracotta-500/5 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-terracotta-400/5 blur-3xl" />

        <div className="relative z-10 flex items-center justify-between">
          <div className="space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <Sparkles className="w-4 h-4 text-terracotta-300" />
              <span className="text-sm font-medium text-white/80">{trips.length > 0 ? `${upcomingCount} upcoming trip${upcomingCount !== 1 ? 's' : ''}` : 'Start your journey'}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold leading-tight">Welcome back, {user?.username || 'Traveler'}</h1>
            <p className="text-white/70 text-lg max-w-xl leading-relaxed">
              {trips.length > 0 ? 'Continue planning your adventures across India.' : 'Ready for your next adventure? Start planning your perfect trip today!'}
            </p>
            {trips.length === 0 && (
              <Link to="/planner" className="inline-flex items-center space-x-2 px-6 py-3 bg-terracotta-500/20 backdrop-blur-sm border border-terracotta-400/30 rounded-xl text-white font-semibold hover:bg-terracotta-500/30 transition-all duration-300 group">
                <Compass className="w-5 h-5" /><span>Plan Your First Trip</span><ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
          </div>
          <div className="hidden sm:block">
            <div className="w-20 h-20 bg-terracotta-500/15 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-terracotta-400/30 shadow-xl">
              <span className="text-3xl font-bold text-terracotta-300">{user?.username?.charAt(0).toUpperCase() || 'T'}</span>
            </div>
          </div>
        </div>
      </div>

      <DashboardStats trips={trips} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <UpcomingTrips trips={trips} />
          <RecentActivity trips={trips} />
        </div>
        <div className="space-y-6">
          <QuickActions />
          <div className="card p-6">
            <h3 className="text-lg font-bold text-forest-800 dark:text-white mb-4">Profile Completion</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-earth-600 dark:text-night-muted">Profile Setup</span>
                <span className="text-terracotta-600 dark:text-terracotta-400 font-semibold">75%</span>
              </div>
              <div className="w-full h-2 bg-earth-100 dark:bg-night-border rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-terracotta-400 to-terracotta-600 rounded-full transition-all duration-1000" style={{ width: '75%' }} />
              </div>
              <p className="text-xs text-earth-500 dark:text-night-muted">Add travel preferences for better AI recommendations</p>
              <button className="text-sm text-terracotta-600 dark:text-terracotta-400 font-medium hover:text-terracotta-700 dark:hover:text-terracotta-300 transition-colors">Complete Profile →</button>
            </div>
          </div>
          <div className="bg-gradient-to-br from-terracotta-50 to-earth-50 dark:from-terracotta-900/10 dark:to-terracotta-900/5 rounded-2xl p-6 border border-terracotta-200/50 dark:border-terracotta-500/10">
            <h3 className="text-lg font-bold text-forest-800 dark:text-white mb-3">💡 Travel Tip</h3>
            <p className="text-sm text-earth-600 dark:text-night-muted leading-relaxed mb-4">AI can adapt your itinerary in real-time. If weather changes or plans shift, just describe the situation and get instant adjustments.</p>
            <button className="text-sm font-medium text-terracotta-600 dark:text-terracotta-400 hover:text-terracotta-700 dark:hover:text-terracotta-300 transition-colors">Learn more →</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;