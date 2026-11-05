import React, { useState, useRef, useCallback, useEffect } from 'react';
import { AlertCircle, Compass, ArrowUpRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import ItineraryGenerator from '../components/itinerary/ItineraryGenerator';
import { createTrip, generateItinerary, getTripById, getJobStatus } from '../services/api';
import ItineraryGenerationProgress from '../components/loading/ItineraryGenerationProgress';

const Planner = () => {
  const [newTripId, setNewTripId] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [currentDestination, setCurrentDestination] = useState('');
  const navigate = useNavigate();
  const pollingRef = useRef(null);
  const isMountedRef = useRef(true);

  const parseItineraryContent = (rawContent) => {
    if (!rawContent) throw new Error('No itinerary content found.');
    if (typeof rawContent === 'object') return rawContent;
    try {
      const outerResponse = JSON.parse(rawContent);
      const generatedText = outerResponse.candidates?.[0]?.content?.parts?.[0]?.text;
      if (generatedText) {
        const cleaned = generatedText.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleaned);
      }
    } catch (error) {
      // Try parsing the saved content directly below.
    }
    try {
      return JSON.parse(rawContent);
    } catch {
      throw new Error('The AI returned a plan in an unexpected format.');
    }
  };

  const pollJobAndFetchTrip = useCallback(async (jobId, tripId) => {
    const pollInterval = 2000;
    const maxAttempts = 60;
    let attempts = 0;

    return new Promise((resolve, reject) => {
      const poll = async () => {
        attempts += 1;
        try {
          const jobResponse = await getJobStatus(jobId);
          const jobStatus = jobResponse.data.status;
          if (jobStatus === 'COMPLETED') {
            resolve(await getTripById(tripId));
          } else if (jobStatus === 'FAILED') {
            reject(new Error(jobResponse.data.errorMessage || 'Itinerary generation failed.'));
          } else if (attempts >= maxAttempts) {
            reject(new Error('Itinerary generation timed out. Your trip is saved, but its itinerary may need to be generated again.'));
          } else {
            pollingRef.current = setTimeout(poll, pollInterval);
          }
        } catch (err) {
          reject(new Error('Could not check itinerary generation: ' + (err.message || 'Unknown error')));
        }
      };
      poll();
    });
  }, []);

  const handleGenerate = async (planDetails) => {
    setIsGenerating(true);
    setError('');
    setNewTripId(null);
    setCurrentDestination(planDetails.destination);

    try {
      // The trip record is saved first; the itinerary is generated against that saved record.
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

      const generationResponse = await generateItinerary(generatedTripId);
      const jobId = generationResponse.data.jobId;
      if (!jobId) throw new Error('The server did not return an itinerary job ID.');

      const completedTripResponse = await pollJobAndFetchTrip(jobId, generatedTripId);
      let savedContent = completedTripResponse.data?.itinerary?.content;

      if (!savedContent) {
        const retryResponse = await getTripById(generatedTripId);
        savedContent = retryResponse.data?.itinerary?.content;
      }
      if (!savedContent) throw new Error('Your trip was saved, but its itinerary could not be loaded yet.');

      // Validate the generated payload, then open the database-backed trip route.
      parseItineraryContent(savedContent);
      navigate(`/trip/${generatedTripId}`);
    } catch (err) {
      const status = err.response?.status;
      const backendMessage = err.response?.data?.message;
      if (status === 400) setError(backendMessage || 'Invalid trip details. Check your inputs and try again.');
      else if (status === 401 || status === 403) setError('Your session has expired. Sign in again to continue.');
      else if (status === 429) setError('Too many requests. Wait a moment and try again.');
      else if (status >= 500 && backendMessage) setError(backendMessage);
      else if (status >= 500) setError('The server had a problem. Your trip may already be saved; check My Trips before creating it again.');
      else setError(err.message || 'Something went wrong while planning your trip.');
    } finally {
      if (isMountedRef.current) setIsGenerating(false);
    }
  };

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (pollingRef.current) clearTimeout(pollingRef.current);
    };
  }, []);

  return (
    <div className="wg-page">
      <div className="wg-container max-w-5xl mx-auto">
        <div className="wg-page-heading wg-planner-heading">
          <div>
            <span className="wg-eyebrow"><Compass size={15} /> PLAN SOMETHING MEMORABLE</span>
            <h1>Where to next?</h1>
            <p>Tell us what kind of trip you have in mind. We’ll shape it into a day-by-day plan.</p>
          </div>
        </div>

        {!isGenerating && <ItineraryGenerator onGenerate={handleGenerate} />}

        {isGenerating && (
          <div className="mt-8">
            <ItineraryGenerationProgress destination={currentDestination} />
          </div>
        )}

        {error && (
          <div className="wg-alert mt-5" role="alert">
            <AlertCircle size={18} />
            <span>{error}</span>
            {newTripId && <Link to={`/trip/${newTripId}`} className="wg-alert-link">Open saved trip <ArrowUpRight size={15} /></Link>}
          </div>
        )}
      </div>
    </div>
  );
};

export default Planner;
