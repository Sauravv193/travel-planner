import React, { useState } from 'react';

const ItineraryGenerator = ({ onGenerate }) => {
  // Traveler Profile
  const [destination, setDestination] = useState('');
  const [numberOfTravelers, setNumberOfTravelers] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [interests, setInterests] = useState('');
  const [accommodationStyle, setAccommodationStyle] = useState('');
  
  // Preferences
  const [budgetTier, setBudgetTier] = useState('');
  const [travelStyle, setTravelStyle] = useState('');
  
  // Culinary Profile
  const [dietaryNeeds, setDietaryNeeds] = useState('');
  const [mustTryFoods, setMustTryFoods] = useState('');
  
  // Form step management
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (destination.trim() && startDate && endDate) {
      const formData = {
        destination,
        numberOfTravelers,
        startDate,
        endDate,
        interests,
        accommodationStyle,
        budgetTier,
        travelStyle,
        dietaryNeeds,
        mustTryFoods
      };
      onGenerate(formData);
    }
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));
  
  const isStepValid = (step) => {
    switch (step) {
      case 1:
        return destination.trim() && numberOfTravelers > 0 && startDate && endDate;
      case 2:
        return true; // Preferences are optional
      case 3:
        return true; // Culinary profile is optional
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center">
                <span className="w-8 h-8 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                  📋
                </span>
                Traveler Profile
              </h3>
              <p className="text-gray-600 text-sm">Tell us about your trip basics</p>
            </div>

            <div>
              <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-2">
                Destination *
              </label>
              <input
                type="text"
                id="destination"
                className="input-field"
                placeholder="e.g., Bhubaneswar, India"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="travelers" className="block text-sm font-medium text-gray-700 mb-2">
                Number of Travelers *
              </label>
              <select
                id="travelers"
                className="input-field"
                value={numberOfTravelers}
                onChange={(e) => setNumberOfTravelers(parseInt(e.target.value))}
              >
                {[1,2,3,4,5,6,7,8].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date *
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
                <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-2">
                  End Date *
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

            <div>
              <label htmlFor="interests" className="block text-sm font-medium text-gray-700 mb-2">
                Interests
              </label>
              <select
                id="interests"
                className="input-field"
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
              >
                <option value="">Select your interests</option>
                <option value="History & Heritage">History & Heritage</option>
                <option value="Adventure & Sports">Adventure & Sports</option>
                <option value="Food & Culinary">Food & Culinary</option>
                <option value="Nature & Wildlife">Nature & Wildlife</option>
                <option value="Art & Culture">Art & Culture</option>
                <option value="Beaches & Relaxation">Beaches & Relaxation</option>
                <option value="Shopping & Entertainment">Shopping & Entertainment</option>
                <option value="Spiritual & Religious">Spiritual & Religious</option>
              </select>
            </div>

            <div>
              <label htmlFor="accommodation" className="block text-sm font-medium text-gray-700 mb-2">
                Accommodation Style
              </label>
              <select
                id="accommodation"
                className="input-field"
                value={accommodationStyle}
                onChange={(e) => setAccommodationStyle(e.target.value)}
              >
                <option value="">Any</option>
                <option value="Budget Hotels">Budget Hotels</option>
                <option value="Mid-range Hotels">Mid-range Hotels</option>
                <option value="Luxury Hotels">Luxury Hotels</option>
                <option value="Hostels">Hostels</option>
                <option value="Guesthouses">Guesthouses</option>
                <option value="Homestays">Homestays</option>
                <option value="Resorts">Resorts</option>
              </select>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-6">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center">
                <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                  💼
                </span>
                Preferences
              </h3>
              <p className="text-gray-600 text-sm">Help us customize your experience</p>
            </div>

            <div>
              <label htmlFor="budget-tier" className="block text-sm font-medium text-gray-700 mb-2">
                Budget Tier
              </label>
              <select
                id="budget-tier"
                className="input-field"
                value={budgetTier}
                onChange={(e) => setBudgetTier(e.target.value)}
              >
                <option value="">Select budget range</option>
                <option value="Budget (₹2k-5k/day)">Budget (₹2k-5k/day)</option>
                <option value="Standard (₹10k-20k/day)">Standard (₹10k-20k/day)</option>
                <option value="Premium (₹20k-50k/day)">Premium (₹20k-50k/day)</option>
                <option value="Luxury (₹50k+/day)">Luxury (₹50k+/day)</option>
              </select>
            </div>

            <div>
              <label htmlFor="travel-style" className="block text-sm font-medium text-gray-700 mb-2">
                Travel Style
              </label>
              <select
                id="travel-style"
                className="input-field"
                value={travelStyle}
                onChange={(e) => setTravelStyle(e.target.value)}
              >
                <option value="">Select your style</option>
                <option value="Solo Adventurer">Solo Adventurer</option>
                <option value="Couple Getaway">Couple Getaway</option>
                <option value="Family Trip">Family Trip</option>
                <option value="Group Explorer">Group Explorer</option>
                <option value="Business Traveler">Business Traveler</option>
                <option value="Backpacker">Backpacker</option>
                <option value="Luxury Seeker">Luxury Seeker</option>
              </select>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-6">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center">
                <span className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                  🍴
                </span>
                Culinary Profile
              </h3>
              <p className="text-gray-600 text-sm">Let us know about your food preferences</p>
            </div>

            <div>
              <label htmlFor="dietary-needs" className="block text-sm font-medium text-gray-700 mb-2">
                Dietary Needs
              </label>
              <input
                type="text"
                id="dietary-needs"
                className="input-field"
                placeholder="e.g., Vegan, Gluten-Free, Vegetarian"
                value={dietaryNeeds}
                onChange={(e) => setDietaryNeeds(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="must-try-foods" className="block text-sm font-medium text-gray-700 mb-2">
                Must-Try Local Foods
              </label>
              <textarea
                id="must-try-foods"
                className="input-field"
                rows={3}
                placeholder="e.g., Dalma, Pithas, Chhena Poda, Rasgulla"
                value={mustTryFoods}
                onChange={(e) => setMustTryFoods(e.target.value)}
              />
              <p className="text-sm text-gray-500 mt-1">Tell us about local dishes you'd love to try</p>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Progress Bar */}
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold text-gray-900">Create Your Perfect Itinerary</h2>
          <span className="text-sm text-gray-500">Step {currentStep} of {totalSteps}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-teal-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        {renderStepContent()}

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`flex items-center px-4 py-2 rounded-md text-sm font-medium ${
              currentStep === 1
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </button>

          {currentStep < totalSteps ? (
            <button
              type="button"
              onClick={nextStep}
              disabled={!isStepValid(currentStep)}
              className={`flex items-center px-6 py-3 rounded-md text-sm font-medium ${
                isStepValid(currentStep)
                  ? 'text-white bg-teal-600 hover:bg-teal-700'
                  : 'text-gray-400 bg-gray-200 cursor-not-allowed'
              }`}
            >
              Next
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ) : (
            <button
              type="submit"
              disabled={!destination.trim() || !startDate || !endDate}
              className={`flex items-center px-6 py-3 rounded-md text-sm font-medium ${
                destination.trim() && startDate && endDate
                  ? 'text-white bg-teal-600 hover:bg-teal-700'
                  : 'text-gray-400 bg-gray-200 cursor-not-allowed'
              }`}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Generate Itinerary
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ItineraryGenerator;