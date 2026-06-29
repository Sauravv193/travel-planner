import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTrips, deleteTrip } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/common/LoadingSpinner';
import InspirationPhotoUpload from '../components/profile/InspirationPhotoUpload';
import Dashboard from '../components/dashboard/Dashboard';

const Profile = () => {
  const { user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingTripId, setDeletingTripId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [tripToDelete, setTripToDelete] = useState(null);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const response = await getTrips();
      setTrips(response.data);
    } catch (error) {
      // Handle error silently or show user-friendly message
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (trip) => {
    setTripToDelete(trip);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!tripToDelete) return;
    
    try {
      setDeletingTripId(tripToDelete.id);
      await deleteTrip(tripToDelete.id);
      setTrips(trips.filter(trip => trip.id !== tripToDelete.id));
      setShowDeleteModal(false);
      setTripToDelete(null);
    } catch (error) {
      alert('Failed to delete trip. Please try again.');
    } finally {
      setDeletingTripId(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setTripToDelete(null);
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner text="Loading your profile..." />
      </div>
    );
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Productivity Dashboard */}
        <Dashboard trips={trips} />

        {/* Travel Style Section */}
        <div className="mt-8 card p-6">
          <h2 className="text-xl font-semibold text-warm-dark dark:text-white mb-4">Your Travel Style</h2>
          <p className="text-brown-600 dark:text-night-muted mb-4">Upload photos that inspire you (e.g., serene beaches, bustling cityscapes, ancient ruins). Our AI will learn your unique travel "vibe" to give you better recommendations in the future.</p>
          <InspirationPhotoUpload />
        </div>

        {/* All Trips Section */}
        <div className="mt-8 card p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-warm-dark dark:text-white">All Your Trips</h2>
            <div className="flex items-center space-x-3">
              <button 
                onClick={fetchTrips} 
                disabled={loading}
                className="btn-secondary py-2 px-4 text-sm"
              >
                {loading ? 'Refreshing...' : 'Refresh'}
              </button>
              <Link to="/edit-profile" className="btn-secondary py-2 px-4 text-sm">
                Edit Profile
              </Link>
            </div>
          </div>
          {trips.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="mt-2 text-sm font-medium text-warm-dark dark:text-white">No trips yet</h3>
              <p className="mt-1 text-sm text-brown-600 dark:text-night-muted">Get started by planning your first trip!</p>
              <div className="mt-6">
                <Link
                  to="/planner"
                  className="btn-primary"
                >
                  Plan a Trip
                </Link>
              </div>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {trips.map((trip) => (
                <li key={trip.id} className="py-4">
                  <div className="flex items-center space-x-4">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-lg font-medium text-warm-dark dark:text-white">{trip.destination}</p>
                      <p className="truncate text-brown-600 dark:text-night-muted">
                        {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Link
                        to={`/trip/${trip.id}`}
                        className="inline-flex items-center shadow-soft px-4 py-2 border border-cream-200 dark:border-night-border text-sm leading-5 font-medium rounded-xl text-warm-dark dark:text-night-text bg-white/80 dark:bg-night-card/80 hover:bg-cream-50 dark:hover:bg-night-surface transition-all"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => handleDeleteClick(trip)}
                        disabled={deletingTripId === trip.id}
                        className="inline-flex items-center shadow-soft px-4 py-2 border border-red-300 dark:border-red-600 text-sm leading-5 font-medium rounded-xl text-red-700 dark:text-red-400 bg-white/80 dark:bg-night-card/80 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        {deletingTripId === trip.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && tripToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white/90 dark:bg-night-card/90 backdrop-blur-xl border border-cream-100 dark:border-night-border rounded-2xl p-6 max-w-md w-full mx-4 shadow-glass-xl">
            <h3 className="text-lg font-semibold text-warm-dark dark:text-white mb-2">
              Delete Trip
            </h3>
            <p className="text-brown-600 dark:text-night-muted mb-4">
              Are you sure you want to delete your trip to <strong>{tripToDelete.destination}</strong>? This action cannot be undone and will delete all associated itineraries and journal entries.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleDeleteCancel}
                className="px-4 py-2 border border-cream-200 dark:border-night-border rounded-xl text-sm font-medium text-warm-dark dark:text-night-text bg-white/80 dark:bg-night-card/80 hover:bg-cream-50 dark:hover:bg-night-surface transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deletingTripId === tripToDelete.id}
                className="px-4 py-2 bg-red-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deletingTripId === tripToDelete.id ? 'Deleting...' : 'Delete Trip'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;