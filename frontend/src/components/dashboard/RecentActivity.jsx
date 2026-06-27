import { Clock, MapPin, Plus, CheckCircle } from 'lucide-react';

const RecentActivity = ({ trips }) => {
  // Simulate recent activities based on trips
  const activities = [
    {
      type: 'trip_created',
      icon: Plus,
      color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
      title: 'New trip planned',
      description: trips.length > 0 ? `${trips[0].destination}` : 'No recent trips',
      time: '2 hours ago'
    },
    {
      type: 'itinerary_generated',
      icon: CheckCircle,
      color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
      title: 'Itinerary generated',
      description: trips.length > 0 ? `${trips[0].destination} - 5 days` : 'No recent itineraries',
      time: '2 hours ago'
    },
    {
      type: 'destination_viewed',
      icon: MapPin,
      color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
      title: 'Destination explored',
      description: trips.length > 1 ? `${trips[1]?.destination || 'Tokyo, Japan'}` : 'Kyoto, Japan',
      time: '1 day ago'
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
        <Clock className="w-5 h-5 text-gray-400" />
      </div>
      <div className="space-y-4">
        {activities.map((activity, index) => {
          const Icon = activity.icon;
          return (
            <div key={index} className="flex items-start space-x-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${activity.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.title}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{activity.description}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{activity.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentActivity;