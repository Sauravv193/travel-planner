import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ItineraryGenerator from '../components/itinerary/ItineraryGenerator';
import ItineraryView from '../components/itinerary/ItineraryView';
import { createTrip, generateItinerary, getTripById, getJobStatus } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ItineraryGenerationProgress from '../components/loading/ItineraryGenerationProgress';

const Planner = () => {
  const [itinerary, setItinerary] = useState(null);
  const [newTripId, setNewTripId] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [currentDestination, setCurrentDestination] = useState('');
  const navigate = useNavigate();
  const pollingRef = useRef(null);
  const isMountedRef = useRef(true);

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
      } catch (geminiError) {
        // Continue to direct parse
      }
      
      return JSON.parse(rawContent);
      
    } catch (e) {
      throw new Error("The AI returned a plan in an unexpected format.");
    }
  };

  // Poll job status until completed, then fetch trip for itinerary content
  const pollJobAndFetchTrip = useCallback(async (jobId, tripId) => {
    const pollInterval = 2000; // poll every 2 seconds
    const maxAttempts = 60; // max 2 minutes of polling
    let attempts = 0;

    return new Promise((resolve, reject) => {
      const poll = async () => {
        attempts++;
        try {
          const jobResponse = await getJobStatus(jobId);
          const jobStatus = jobResponse.data.status;

          if (jobStatus === 'COMPLETED') {
            // Job completed — fetch the trip to get the generated itinerary
            const tripResponse = await getTripById(tripId);
            resolve(tripResponse);
          } else if (jobStatus === 'FAILED') {
            reject(new Error(jobResponse.data.errorMessage || 'Itinerary generation failed.'));
          } else if (attempts >= maxAttempts) {
            reject(new Error('Itinerary generation timed out. Please try again.'));
          } else {
            // Still processing — poll again
            pollingRef.current = setTimeout(poll, pollInterval);
          }
        } catch (err) {
          reject(new Error('Failed to check generation status: ' + (err.message || 'Unknown error')));
        }
      };
      poll();
    });
  }, []);

  // Prevent state updates after unmount
  const safeSetState = useCallback((setter, value) => {
    if (isMountedRef.current) {
      setter(value);
    }
  }, []);

  const handleGenerate = async (planDetails) => {
    setIsGenerating(true);
    setError('');
    setItinerary(null);
    setCurrentDestination(planDetails.destination);
    try {
      // Step 1: Create the trip
      const tripResponse = await createTrip({
        destination: planDetails.destination,
        startDate: planDetails.startDate,
        endDate: planDetails.endDate,
        budget: planDetails.budget,
        interests: planDetails.interests,
        numberOfTravelers: planDetails.numberOfTravelers,
        accommodationStyle: planDetails.accommodationStyle,
        budgetTier: planDetails.budgetTier,
        travelStyle: planDetails.travelStyle,
        dietaryNeeds: planDetails.dietaryNeeds,
        mustTryFoods: planDetails.mustTryFoods,
      });
      const generatedTripId = tripResponse.data.id;
      setNewTripId(generatedTripId);

      // Step 2: Start async itinerary generation (returns jobId)
      const genResponse = await generateItinerary(generatedTripId);
      const jobId = genResponse.data.jobId;

      if (!jobId) {
        throw new Error('No job ID returned from itinerary generation.');
      }

      // Step 3: Poll job status until completed, then fetch trip
      const tripDataResponse = await pollJobAndFetchTrip(jobId, generatedTripId);

      // Step 4: Parse and display the itinerary from the trip data
      const tripData = tripDataResponse.data;
      if (tripData.itinerary && tripData.itinerary.content) {
        const parsedItinerary = parseItineraryContent(tripData.itinerary.content);
        setItinerary(parsedItinerary);
      } else {
        // Itinerary content wasn't in the trip response yet — fetch again
        const retryResponse = await getTripById(generatedTripId);
        if (retryResponse.data.itinerary && retryResponse.data.itinerary.content) {
          const parsedItinerary = parseItineraryContent(retryResponse.data.itinerary.content);
          setItinerary(parsedItinerary);
        } else {
          throw new Error('Itinerary was generated but content could not be retrieved.');
        }
      }

    } catch (err) {
      const status = err.response?.status;
      const backendMessage = err.response?.data?.message;

      if (status === 400) {
        setError(backendMessage || 'Invalid trip details. Please check your inputs and try again.');
      } else if (status === 401 || status === 403) {
        setError('Your session has expired. Please sign in again.');
      } else if (status === 429) {
        setError('Too many requests. Please wait a moment and try again.');
      } else if (status === 500 && backendMessage) {
        setError(backendMessage);
      } else if (status >= 500) {
        setError('Something went wrong on the server. Please try again in a moment.');
      } else {
        setError(err.message || 'Sorry, something went wrong while planning your trip. Please try again.');
      }
    } finally {
      if (isMountedRef.current) {
        setIsGenerating(false);
      }
    }
  };
  
  // Cleanup polling and mark unmounted on unmount
  React.useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (pollingRef.current) {
        clearTimeout(pollingRef.current);
      }
    };
  }, []);
  
  const handleSaveAndNavigate = async () => {
    if (newTripId) {
      // Add a small delay to ensure the database transaction is complete
      try {
        await getTripById(newTripId);
        navigate(`/trip/${newTripId}`);
      } catch (error) {
        navigate(`/trip/${newTripId}`);
      }
    }
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">            <h1 className="text-3xl font-bold text-warm-dark dark:text-white mb-2">Plan Your Next Adventure</h1>
          <p className="text-lg text-brown-600 dark:text-night-muted">
            Describe your trip, and our AI will create a personalized itinerary.
          </p>
        </div>

        {!itinerary && !isGenerating && <ItineraryGenerator onGenerate={handleGenerate} />}

        {isGenerating && (
          <div className="mt-12">
            <ItineraryGenerationProgress destination={currentDestination} />
          </div>
        )}

        {error && <p className="text-center text-red-500 mt-4">{error}</p>}
        
        {itinerary && !isGenerating && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-center text-warm-dark dark:text-white mb-4">Here's Your Plan!</h2>
            <ItineraryView itinerary={itinerary} />
            <div className="mt-6 text-center">
              <button onClick={handleSaveAndNavigate} className="btn-primary py-3 px-6 text-lg">
                Save & View Trip
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Planner;