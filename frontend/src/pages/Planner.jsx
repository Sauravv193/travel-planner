import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ItineraryGenerator from '../components/itinerary/ItineraryGenerator';
import ItineraryView from '../components/itinerary/ItineraryView';
import { createTrip, generateItinerary, getTripById } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Planner = () => {
  const [itinerary, setItinerary] = useState(null);
  const [newTripId, setNewTripId] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

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

  const handleGenerate = async (planDetails) => {
    setIsGenerating(true);
    setError('');
    setItinerary(null);
    try {
      const tripResponse = await createTrip({
        destination: planDetails.destination,
        startDate: planDetails.startDate,
        endDate: planDetails.endDate,
        budget: planDetails.budget,
        interests: planDetails.interests,
      });
      const generatedTripId = tripResponse.data.id;
      setNewTripId(generatedTripId);

      const itineraryResponse = await generateItinerary(generatedTripId);
      
      const parsedItinerary = parseItineraryContent(itineraryResponse.data.content);
      setItinerary(parsedItinerary);

    } catch (err) {
      if (err.response && err.response.status >= 500) {
        setError('The AI service seems to be overloaded. Please wait a moment and try again.');
      } else {
        setError(err.message || 'Sorry, something went wrong while planning your trip. Please try again.');
      }
    } finally {
      setIsGenerating(false);
    }
  };
  
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
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Plan Your Next Adventure</h1>
          <p className="text-lg text-gray-600">
            Describe your trip, and our AI will create a personalized itinerary.
          </p>
        </div>

        {!itinerary && !isGenerating && <ItineraryGenerator onGenerate={handleGenerate} />}

        {isGenerating && (
          <div className="mt-12 flex justify-center">
            <LoadingSpinner size="large" text="Creating your perfect itinerary..." />
          </div>
        )}

        {error && <p className="text-center text-red-500 mt-4">{error}</p>}
        
        {itinerary && !isGenerating && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-center mb-4">Here's Your Plan!</h2>
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