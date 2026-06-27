import { MapPin, Calendar, DollarSign, TrendingUp } from 'lucide-react';

const DashboardStats = ({ trips }) => {
  const calculateStats = () => {
    const totalTrips = trips.length;
    const upcomingTrips = trips.filter(trip => new Date(trip.startDate) > new Date()).length;
    const totalBudget = trips.reduce((sum, trip) => sum + (trip.budget || 0), 0);
    const countries = [...new Set(trips.map(trip => trip.destination.split(',').pop().trim()))].length;
    
    return { totalTrips, upcomingTrips, totalBudget, countries };
  };

  const stats = calculateStats();

  const statCards = [
    {
      icon: MapPin,
      label: 'Total Trips',
      value: stats.totalTrips,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      icon: Calendar,
      label: 'Upcoming',
      value: stats.upcomingTrips,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      icon: DollarSign,
      label: 'Total Budget',
      value: `₹${(stats.totalBudget / 1000).toFixed(0)}k`,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20'
    },
    {
      icon: TrendingUp,
      label: 'Countries',
      value: stats.countries,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className={`${stat.bgColor} rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center shadow-md`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
            </div>
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.label}</div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardStats;