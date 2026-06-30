import { Clock, MapPin, Plus, CheckCircle } from 'lucide-react';

const RecentActivity = ({ trips }) => {
  // Build real activity entries from the trips data
  const buildActivities = () => {
    const activities = [];
    
    if (trips.length > 0) {
      // Most recent trip creation
      const latestTrip = trips[0];
      activities.push({
        icon: Plus,
        color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
        title: 'New trip planned',
        description: latestTrip.destination || 'New destination',
        time: latestTrip.createdAt 
          ? formatRelativeTime(new Date(latestTrip.createdAt)) 
          : 'Recently'
      });
      
      // Trip with itinerary
      if (latestTrip.itinerary) {
        activities.push({
          icon: CheckCircle,
          color: 'bg-brown-100 text-brown-600 dark:bg-brown-900/30 dark:text-brown-400',
          title: 'Itinerary generated',
          description: `${latestTrip.destination}`,
          time: 'Recently'
        });
      }
      
      // Second trip if exists
      if (trips.length > 1) {
        activities.push({
          icon: MapPin,
          color: 'bg-beige-100 text-beige-600 dark:bg-beige-900/30 dark:text-beige-400',
          title: 'Destination explored',
          description: trips[1].destination || 'Another destination',
          time: 'Earlier'
        });
      }
    }
    
    if (activities.length === 0) {
      activities.push({
        icon: MapPin,
        color: 'bg-beige-100 text-beige-600 dark:bg-beige-900/30 dark:text-beige-400',
        title: 'Welcome to WanderGen!',
        description: 'Plan your first trip to get started',
        time: 'Just now'
      });
    }
    
    return activities;
  };

  const formatRelativeTime = (date) => {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  const activities = buildActivities();

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
