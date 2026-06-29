import { useEffect, useRef, useState } from 'react';
import { MapPin, Calendar, IndianRupee, TrendingUp } from 'lucide-react';

const DashboardStats = ({ trips }) => {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

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
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const calculateStats = () => {
    const totalTrips = trips.length;
    const upcomingTrips = trips.filter(trip => new Date(trip.startDate) > new Date()).length;
    const totalBudget = trips.reduce((sum, trip) => sum + (trip.budget || 0), 0);
    const destinations = [...new Set(trips.map(trip => trip.destination?.split(',').pop()?.trim() || trip.destination))].length;

    return { totalTrips, upcomingTrips, totalBudget, destinations };
  };

  const stats = calculateStats();

  const statCards = [
    {
      icon: MapPin,
      label: 'Total Trips',
      value: stats.totalTrips,
      gradient: 'from-blue-500 to-indigo-600',
      bgGlow: 'shadow-blue-500/20',
    },
    {
      icon: Calendar,
      label: 'Upcoming',
      value: stats.upcomingTrips,
      gradient: 'from-green-500 to-emerald-600',
      bgGlow: 'shadow-green-500/20',
    },
    {
      icon: IndianRupee,
      label: 'Total Budget',
      value: `₹${(stats.totalBudget / 1000).toFixed(0)}k`,
      gradient: 'from-purple-500 to-pink-600',
      bgGlow: 'shadow-purple-500/20',
    },
    {
      icon: TrendingUp,
      label: 'Destinations',
      value: stats.destinations,
      gradient: 'from-orange-500 to-red-600',
      bgGlow: 'shadow-orange-500/20',
    },
  ];

  return (
    <div
      ref={ref}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
    >
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className={`card p-6 transition-all duration-700 ${
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`w-12 h-12 bg-gradient-to-br ${stat.gradient} rounded-2xl flex items-center justify-center shadow-lg ${stat.bgGlow}`}
              >
                <Icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-3xl font-bold text-gray-900 dark:text-white tabular-nums">
                {stat.value}
              </span>
            </div>
            <span className="text-sm font-medium text-gray-500 dark:text-night-muted">
              {stat.label}
            </span>
            {/* Mini progress bar */}
            <div className="mt-3 w-full h-1 bg-gray-100 dark:bg-night-border rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${stat.gradient} rounded-full transition-all duration-1000 delay-500`}
                style={{ width: visible ? `${Math.min((Number(stat.value) / (stats.totalTrips || 1)) * 100, 100)}%` : '0%' }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardStats;
