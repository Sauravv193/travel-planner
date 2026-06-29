import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, ArrowRight } from 'lucide-react';

const UpcomingTrips = ({ trips }) => {
  const upcomingTrips = trips
    .filter(trip => new Date(trip.startDate) > new Date())
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
    .slice(0, 3);

  const getDaysUntil = (date) => {
    const today = new Date();
    const tripDate = new Date(date);
    const diffTime = tripDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getTripDuration = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = endDate - startDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (upcomingTrips.length === 0) {
    return (
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-warm-dark dark:text-white">Upcoming Trips</h3>
          <Calendar className="w-5 h-5 text-brown-500" />
        </div>
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-cream-100 dark:bg-night-border rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-8 h-8 text-cream-400" />
          </div>
          <p className="text-brown-600 dark:text-night-muted mb-4">No upcoming trips planned</p>
          <Link
            to="/planner"
            className="inline-flex items-center text-maroon-600 dark:text-maroon-400 font-medium hover:text-maroon-700 dark:hover:text-maroon-300"
          >
            Plan your next trip
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-warm-dark dark:text-white">Upcoming Trips</h3>
        <Calendar className="w-5 h-5 text-brown-500" />
      </div>
      <div className="space-y-4">
        {upcomingTrips.map((trip) => {
          const daysUntil = getDaysUntil(trip.startDate);
          const duration = getTripDuration(trip.startDate, trip.endDate);
          
          return (
            <Link
              key={trip.id}
              to={`/trip/${trip.id}`}
              className="block group"
            >
              <div className="bg-cream-50/50 to-white dark:from-night-surface dark:to-night-card rounded-lg p-4 border border-cream-100 dark:border-night-border hover:border-maroon-300 dark:hover:border-maroon-500/50 transition-all duration-200 group-hover:shadow-md">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-semibold text-warm-dark dark:text-white group-hover:text-maroon-600 dark:group-hover:text-maroon-400 transition-colors">
                      {trip.destination}
                    </h4>
                    <div className="flex items-center space-x-2 mt-1 text-sm text-brown-600 dark:text-night-muted">
                      <Clock className="w-3 h-3" />
                      <span>{duration} day{duration > 1 ? 's' : ''}</span>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    daysUntil <= 7 
                      ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' 
                      : daysUntil <= 30 
                      ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                      : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  }`}>
                    {daysUntil === 0 ? 'Today' : daysUntil === 1 ? 'Tomorrow' : `${daysUntil} days`}
                  </div>
                </div>
                <div className="flex items-center text-sm text-brown-600 dark:text-night-muted">
                  <Calendar className="w-4 h-4 mr-2" />
                  {new Date(trip.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      {trips.filter(trip => new Date(trip.startDate) > new Date()).length > 3 && (
        <div className="mt-4 text-center">
          <Link
            to="/profile"
            className="text-sm text-maroon-600 dark:text-maroon-400 hover:text-maroon-700 dark:hover:text-maroon-300 font-medium"
          >
            View all upcoming trips →
          </Link>
        </div>
      )}
    </div>
  );
};

export default UpcomingTrips;
