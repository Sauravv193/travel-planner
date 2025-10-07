import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getTripById, regenerateItinerary, deleteTrip, adaptItinerary } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ItineraryView from '../components/itinerary/ItineraryView';

const Trip = () => {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [parseError, setParseError] = useState(null);
  const [adaptationContext, setAdaptationContext] = useState('');
  const navigate = useNavigate();

  // --- IMPROVED: More robust JSON parsing function ---
  const parseItineraryContent = (rawContent) => {
    console.log("Raw itinerary content:", rawContent);
    
    if (!rawContent) {
      throw new Error("No itinerary content found.");
    }
    
    try {
      // First, try to parse as direct JSON (if already parsed)
      if (typeof rawContent === 'object') {
        console.log("Content is already an object:", rawContent);
        return rawContent;
      }
      
      // Try parsing as Gemini API response format
      try {
        const outerResponse = JSON.parse(rawContent);
        if (outerResponse.candidates && outerResponse.candidates[0] && outerResponse.candidates[0].content) {
          let itineraryString = outerResponse.candidates[0].content.parts[0].text;
          itineraryString = itineraryString.replace(/```json/g, '').replace(/```/g, '').trim();
          const parsed = JSON.parse(itineraryString);
          console.log("Parsed from Gemini format:", parsed);
          return parsed;
        }
      } catch (geminiError) {
        console.log("Not Gemini format, trying direct parse...");
      }
      
      // Try direct parse
      const directParsed = JSON.parse(rawContent);
      console.log("Direct parsed successfully:", directParsed);
      return directParsed;
      
    } catch (e) {
      console.error("Failed to parse itinerary content:", e);
      console.log("Raw content that failed to parse:", rawContent);
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
          // --- UPDATED: Use the new parsing function ---
          parsedContent = parseItineraryContent(response.data.itinerary.content);
        } catch (e) {
          console.error(e.message);
          setParseError(e.message);
        }
      }
      
      const parsedTrip = {
        ...response.data,
        itinerary: parsedContent ? { ...response.data.itinerary, content: parsedContent } : null
      };
      setTrip(parsedTrip);

    } catch (error) {
      console.error('Failed to fetch trip:', error);
      setParseError("Failed to fetch trip data from the server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrip();
  }, [tripId]);
  
  // The rest of the file remains the same...

  const handleUpdateItinerary = async () => {
    setIsUpdating(true);
    try {
      await regenerateItinerary(tripId);
      fetchTrip(); 
    } catch (error) {
      console.error('Failed to update itinerary:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteTrip = async () => {
    if (window.confirm('Are you sure you want to delete this trip?')) {
      try {
        await deleteTrip(tripId);
        navigate('/profile');
      } catch (error) {
        console.error('Failed to delete trip:', error);
      }
    }
  };

  const handleAdaptItinerary = async () => {
    if (!adaptationContext.trim()) {
      alert('Please provide a context for adaptation (e.g., "it is raining").');
      return;
    }
    setIsUpdating(true);
    try {
      await adaptItinerary(tripId, { context: adaptationContext });
      fetchTrip();
    } catch (error) {
      console.error('Failed to adapt itinerary:', error);
    } finally {
      setIsUpdating(false);
    }
  };

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
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Trip to {trip.destination}</h1>
          <div className="flex items-center space-x-4">
            <Link to={`/journal/${tripId}`} className="btn-secondary">
              View Journal
            </Link>
            <button onClick={handleUpdateItinerary} disabled={isUpdating} className="btn-primary">
              {isUpdating ? 'Updating...' : 'Update Itinerary'}
            </button>
            <button onClick={handleDeleteTrip} className="btn-secondary" style={{ backgroundColor: '#ef4444', color: 'white' }}>
              Delete Trip
            </button>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold mb-2">Adapt Your Itinerary</h3>
          <p className="text-sm text-gray-600 mb-3">Facing an unexpected change? Describe the situation below (e.g., "it started raining" or "the museum is closed") and the AI will adjust your plan.</p>
          <div className="flex space-x-2">
            <input
              type="text"
              value={adaptationContext}
              onChange={(e) => setAdaptationContext(e.target.value)}
              className="input-field flex-grow"
              placeholder="Enter new context here..."
            />
            <button onClick={handleAdaptItinerary} disabled={isUpdating} className="btn-primary">
              {isUpdating ? 'Adapting...' : 'Adapt Plan'}
            </button>
          </div>
        </div>

        {isUpdating && (
          <div className="text-center p-4 my-4">
            <LoadingSpinner text="Getting the latest recommendations for you..."/>
          </div>
        )}

        {trip.itinerary ? (
          <ItineraryView itinerary={trip.itinerary.content} />
        ) : parseError ? (
           <div className="text-center bg-red-50 p-10 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold text-red-800">Error Displaying Itinerary</h2>
            <p className="text-red-600 mt-2">Reason: {parseError}</p>
          </div>
        ) : (
          <div className="text-center bg-white p-10 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold">No Itinerary Yet</h2>
            <p className="text-gray-600 mt-2">An itinerary has not been generated for this trip.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Trip;