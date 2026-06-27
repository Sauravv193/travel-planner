import { useAuth } from '../../hooks/useAuth';
import DashboardStats from './DashboardStats';
import UpcomingTrips from './UpcomingTrips';
import QuickActions from './QuickActions';
import RecentActivity from './RecentActivity';

const Dashboard = ({ trips }) => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-pink-500 to-pink-600 rounded-2xl p-6 md:p-8 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              Welcome back, {user?.username || 'Traveler'}! 👋
            </h1>
            <p className="text-pink-100">
              {trips.length > 0 
                ? `You have ${trips.filter(t => new Date(t.startDate) > new Date()).length} upcoming trip${trips.filter(t => new Date(t.startDate) > new Date()).length !== 1 ? 's' : ''} planned`
                : 'Start planning your next adventure today!'
              }
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <span className="text-2xl font-bold">{user?.username?.charAt(0).toUpperCase() || 'T'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <DashboardStats trips={trips} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Upcoming Trips */}
        <div className="lg:col-span-2 space-y-6">
          <UpcomingTrips trips={trips} />
          
          {/* Recent Activity */}
          <RecentActivity trips={trips} />
        </div>

        {/* Right Column - Quick Actions */}
        <div className="space-y-6">
          <QuickActions />
          
          {/* Profile Completion Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Profile Completion</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Profile Setup</span>
                <span className="text-green-600 dark:text-green-400 font-medium">75%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-pink-500 to-pink-600 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Add travel preferences to get better AI recommendations
              </p>
              <button className="w-full mt-2 text-sm text-pink-600 dark:text-pink-400 font-medium hover:text-pink-700 dark:hover:text-pink-300">
                Complete Profile →
              </button>
            </div>
          </div>

          {/* Travel Tips Card */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">💡 Travel Tip</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
              AI can adapt your itinerary in real-time. If weather changes or plans shift, just describe the situation and get instant adjustments.
            </p>
            <button className="text-sm text-blue-600 dark:text-blue-400 font-medium hover:text-blue-700 dark:hover:text-blue-300">
              Learn more →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;