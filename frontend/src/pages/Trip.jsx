import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getTripById, regenerateItinerary, deleteTrip, adaptItinerary } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ItineraryView from '../components/itinerary/ItineraryView';
import AIChatInterface from '../components/ai/AIChatInterface';
import ShareTripDialog from '../components/common/ShareTripDialog';
import ConfirmDialog from '../components/common/ConfirmDialog';
import MapView from '../components/common/MapView';
import { useToast } from '../components/common/Toast';
import useKeyboardShortcuts from '../components/common/KeyboardShortcuts';
import { MessageSquare, Share2, MapPin } from 'lucide-react';
import { printItinerary } from '../utils/export';

const Trip = () => {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [parseError, setParseError] = useState(null);
  const [adaptationContext, setAdaptationContext] = useState('');
  const [showAIChat, setShowAIChat] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  // Keyboard shortcuts
  useKeyboardShortcuts([
    { key: 'a', meta: true, action: () => setShowAIChat(prev => !prev), label: 'Cmd+A', description: 'Toggle AI chat' },
    { key: 's', meta: true, action: () => setShowShareDialog(true), label: 'Cmd+S', description: 'Share trip' },
    { key: 'p', meta: true, action: () => printItinerary(trip?.itinerary?.content, trip), label: 'Cmd+P', description: 'Print itinerary' },
  ]);

  const parseItineraryContent = (rawContent) => {
    if (!rawContent) {
      throw new Error("No itinerary content found.");
    }
    try {
      if (typeof rawContent === 'object') {
        return rawContent;
      }
      try {
        const outerResponse = JSON.parse(rawContent);
        if (outerResponse.candidates && outerResponse.candidates[0] && outerResponse.candidates[0].content) {
          let itineraryString = outerResponse.candidates[0].content.parts[0].text;
          itineraryString = itineraryString.replace(/```json/g, '').replace(/```/g, '').trim();
          return JSON.parse(itineraryString);
        }
      } catch (geminiError) {}
      return JSON.parse(rawContent);
    } catch (e) {
      throw new Error("The AI returned a plan in an unexpected format. Please try regenerating it.");
    }
  };

  const fetchTrip = async () => {
    setLoading(true);
    setParseError(null);
    try {
      const response = await getTripById(tripId);
      let parsedContent = null;
      if (response.data.itinerary && response.data.itinerary.content) {
        try {
          parsedContent = parseItineraryContent(response.data.itinerary.content);
        } catch (e) {
          setParseError(e.message);
        }
      }
      setTrip({
        ...response.data,
        itinerary: parsedContent ? { ...response.data.itinerary, content: parsedContent } : null
      });
    } catch (error) {
      setParseError("Failed to fetch trip data from the server.");
      toast.error("Could not load trip. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrip();
  }, [tripId]);

  const handleUpdateItinerary = async () => {
    setIsUpdating(true);
    try {
      await regenerateItinerary(tripId);
      fetchTrip();
      toast.success('Itinerary regenerated successfully!');
    } catch (error) {
      toast.error('Failed to regenerate itinerary.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteTrip = async () => {
    try {
      await deleteTrip(tripId);
      toast.success('Trip deleted successfully.');
      navigate('/profile');
    } catch (error) {
      toast.error('Failed to delete trip.');
    }
  };

  const handleAdaptItinerary = async (context) => {
    if (!context.trim()) {
      toast.warning('Please provide a context for adaptation.');
      return;
    }
    setIsUpdating(true);
    try {
      await adaptItinerary(tripId, { context });
      fetchTrip();
      toast.success('Itinerary adapted successfully!');
    } catch (error) {
      toast.error('Failed to adapt itinerary.');
    } finally {
      setIsUpdating(false);
    }
  };

  // Extract locations from itinerary for map view
  const itineraryLocations = useMemo(() => {
    if (!trip?.itinerary?.content) return [];
    const days = trip.itinerary.content.days || trip.itinerary.content.itinerary || [];
    const locations = [];
    days.forEach(day => {
      (day.activities || []).forEach(act => {
        if (act.location) {
          locations.push({
            name: act.location,
            address: act.location_address || act.location,
            lat: act.lat || 0,
            lng: act.lng || 0,
          });
        }
      });
    });
    return locations;
  }, [trip]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" text="Loading your trip..." />
      </div>
    );
  }

  if (!trip) {
    return <div className="text-center py-10">Trip not found.</div>;
  }

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Trip Header with Actions */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Trip to {trip.destination}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {new Date(trip.startDate).toLocaleDateString()} — {new Date(trip.endDate).toLocaleDateString()}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link to={`/journal/${tripId}`} className="btn-secondary py-2 px-3 text-sm">
              Journal
            </Link>
            <button
              onClick={() => setShowMap(!showMap)}
              className={`btn-secondary py-2 px-3 text-sm flex items-center space-x-1 ${showMap ? 'bg-pink-100 dark:bg-pink-900/30 border-pink-300' : ''}`}
            >
              <MapPin className="w-4 h-4" />
              <span>Map</span>
            </button>
            <button
              onClick={() => setShowShareDialog(true)}
              className="btn-secondary py-2 px-3 text-sm flex items-center space-x-1"
              aria-label="Share trip"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
            <button
              onClick={() => setShowAIChat(!showAIChat)}
              className={`btn-primary py-2 px-3 text-sm flex items-center space-x-1 ${showAIChat ? 'bg-pink-700' : ''}`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>AI</span>
            </button>
            <button onClick={handleUpdateItinerary} disabled={isUpdating} className="btn-secondary py-2 px-3 text-sm">
              {isUpdating ? '...' : 'Regenerate'}
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="py-2 px-3 text-sm border border-red-300 dark:border-red-700 rounded-md text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>

        {/* Quick Adaptation Input */}
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 mb-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2 mb-2">
            <MessageSquare className="w-4 h-4 text-pink-600" />
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Quick Adaptation</h3>
          </div>
          <div className="flex space-x-2">
            <input
              type="text"
              value={adaptationContext}
              onChange={(e) => setAdaptationContext(e.target.value)}
              className="input-field flex-grow dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="e.g., 'Add more museums' or 'Make it cheaper'"
              onKeyDown={(e) => e.key === 'Enter' && handleAdaptItinerary(adaptationContext)}
            />
            <button
              onClick={() => handleAdaptItinerary(adaptationContext)}
              disabled={isUpdating}
              className="btn-primary py-2 px-4 text-sm"
            >
              {isUpdating ? '...' : 'Adapt'}
            </button>
          </div>
        </div>

        {/* Map Section */}
        {showMap && itineraryLocations.length > 0 && (
          <div className="mb-6 animate-slideDown">
            <MapView
              locations={itineraryLocations}
              destination={trip.destination}
            />
          </div>
        )}

        {isUpdating && (
          <div className="text-center p-4 my-4">
            <LoadingSpinner text="Getting the latest recommendations for you..." />
          </div>
        )}

        {trip.itinerary ? (
          <ItineraryView itinerary={trip.itinerary.content} />
        ) : parseError ? (
          <div className="text-center bg-red-50 dark:bg-red-900/20 p-10 rounded-xl shadow-md border border-red-200 dark:border-red-800">
            <h2 className="text-xl font-semibold text-red-800 dark:text-red-400">Error Displaying Itinerary</h2>
            <p className="text-red-600 dark:text-red-300 mt-2">Reason: {parseError}</p>
          </div>
        ) : (
          <div className="text-center bg-white dark:bg-gray-800 p-10 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">No Itinerary Yet</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">An itinerary has not been generated for this trip.</p>
          </div>
        )}
      </div>

      {/* Modals */}
      <AIChatInterface
        tripId={tripId}
        isVisible={showAIChat}
        onClose={() => setShowAIChat(false)}
        onAdaptItinerary={handleAdaptItinerary}
      />
      <ShareTripDialog
        isOpen={showShareDialog}
        onClose={() => setShowShareDialog(false)}
        trip={trip}
        itinerary={trip?.itinerary?.content}
      />
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteTrip}
        title="Delete Trip"
        message={`Are you sure you want to delete your trip to ${trip.destination}? This action cannot be undone and will delete all associated itineraries, photos, and journal entries.`}
        confirmLabel="Delete Trip"
        variant="danger"
      />
    </div>
  );
};

export default Trip;
