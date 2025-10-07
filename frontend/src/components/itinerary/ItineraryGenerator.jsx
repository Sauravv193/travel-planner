import React, { useState } from 'react';

const ItineraryGenerator = ({ onGenerate }) => {
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState('');
  const [interests, setInterests] = useState(''); // --- NEW STATE ---

  const handleSubmit = (e) => {
    e.preventDefault();
    if (destination.trim() && startDate && endDate) {
      // --- PASS INTERESTS IN SUBMITTED DATA ---
      onGenerate({ destination, startDate, endDate, budget, interests });
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-1">
            Where do you want to go?
          </label>
          <input
            type="text"
            id="destination"
            className="input-field"
            placeholder="e.g., Kyoto, Japan"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              id="start-date"
              className="input-field"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              id="end-date"
              className="input-field"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>
        </div>
        
        {/* --- NEW AREA OF INTEREST FIELD --- */}
        <div>
          <label htmlFor="interests" className="block text-sm font-medium text-gray-700 mb-1">
            Area of Interest (Optional)
          </label>
          <input
            type="text"
            id="interests"
            className="input-field"
            placeholder="e.g., History, food, hiking"
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-1">
            Budget (Optional)
          </label>
          <input
            type="number"
            id="budget"
            className="input-field"
            placeholder="e.g., 1000"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          />
        </div>

        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700"
            disabled={!destination.trim() || !startDate || !endDate}
          >
            Generate Itinerary
          </button>
        </div>
      </form>
    </div>
  );
};

export default ItineraryGenerator;