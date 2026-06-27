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
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Upcoming Trips</h3>
          <Calendar className="w-5 h-5 text-gray-400" />
        </div>
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 dark:text-gray-400 mb-4">No upcoming trips planned</p>
          <Link
            to="/planner"
            className="inline-flex items-center text-pink-600 dark:text-pink-400 font-medium hover:text-pink-700 dark:hover:text-pink-300"
          >
            Plan your next trip
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Upcoming Trips</h3>
        <Calendar className="w-5 h-5 text-gray-400" />
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
              <div className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600 hover:border-pink-300 dark:hover:border-pink-600 transition-all duration-200 group-hover:shadow-md">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
                      {trip.destination}
                    </h4>
                    <div className="flex items-center space-x-2 mt-1 text-sm text-gray-500 dark:text-gray-400">
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
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
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
            className="text-sm text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 font-medium"
          >
            View all upcoming trips →
          </Link>
        </div>
      )}
    </div>
  );
};

export default UpcomingTrips;