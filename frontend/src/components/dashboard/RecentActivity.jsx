import { Clock, MapPin, Plus, CheckCircle } from 'lucide-react';

const RecentActivity = ({ trips }) => {
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
      color: 'bg-brown-100 text-brown-600 dark:bg-brown-900/30 dark:text-brown-400',
      title: 'Itinerary generated',
      description: trips.length > 0 ? `${trips[0].destination} - 5 days` : 'No recent itineraries',
      time: '2 hours ago'
    },
    {
      type: 'destination_viewed',
      icon: MapPin,
      color: 'bg-beige-100 text-beige-600 dark:bg-beige-900/30 dark:text-beige-400',
      title: 'Destination explored',
      description: trips.length > 1 ? `${trips[1]?.destination || 'Goa, India'}` : 'Goa, India',
      time: '1 day ago'
    }
  ];

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-warm-dark dark:text-white">Recent Activity</h3>
        <Clock className="w-5 h-5 text-brown-500" />
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
                <p className="text-sm font-medium text-warm-dark dark:text-white">{activity.title}</p>
                <p className="text-sm text-brown-600 dark:text-night-muted truncate">{activity.description}</p>
                <p className="text-xs text-cream-500 dark:text-night-muted mt-1">{activity.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentActivity;
