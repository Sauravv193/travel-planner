import React, { useState } from 'react';

const ItineraryGenerator = ({ onGenerate }) => {
  const [destination, setDestination] = useState('');
  const [numberOfTravelers, setNumberOfTravelers] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [interests, setInterests] = useState('');
  const [accommodationStyle, setAccommodationStyle] = useState('');
  const [budgetTier, setBudgetTier] = useState('');
  const [travelStyle, setTravelStyle] = useState('');
  const [dietaryNeeds, setDietaryNeeds] = useState('');
  const [mustTryFoods, setMustTryFoods] = useState('');
  const [budget, setBudget] = useState('');
  const [budgetError, setBudgetError] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (destination.trim() && startDate && endDate) {
      onGenerate({ destination, numberOfTravelers, startDate, endDate, budget: budget ? parseFloat(budget) : null, interests, accommodationStyle, budgetTier, travelStyle, dietaryNeeds, mustTryFoods });
    }
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));
  
  const isStepValid = (step) => {
    switch (step) {
      case 1: return destination.trim() && numberOfTravelers > 0 && startDate && endDate;
      case 2: return true;
      case 3: return true;
      default: return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-warm-dark mb-2 flex items-center">
                <span className="w-8 h-8 bg-maroon-50 text-maroon-600 rounded-full flex items-center justify-center text-sm font-semibold mr-3">📋</span>
                Traveler Profile
              </h3>
              <p className="text-brown-600 text-sm">Tell us about your trip basics</p>
            </div>
            <div>
              <label htmlFor="destination" className="block text-sm font-medium text-warm-dark mb-2">Destination *</label>
              <input type="text" id="destination" className="input-field" placeholder="e.g., Bhubaneswar, India" value={destination} onChange={(e) => setDestination(e.target.value)} required />
            </div>
            <div>
              <label htmlFor="travelers" className="block text-sm font-medium text-warm-dark mb-2">Number of Travelers *</label>
              <select id="travelers" className="input-field" value={numberOfTravelers} onChange={(e) => setNumberOfTravelers(parseInt(e.target.value))}>
                {[1,2,3,4,5,6,7,8].map(num => (<option key={num} value={num}>{num}</option>))}
              </select>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="start-date" className="block text-sm font-medium text-warm-dark mb-2">Start Date *</label>
                <input type="date" id="start-date" className="input-field" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
              </div>
              <div>
                <label htmlFor="end-date" className="block text-sm font-medium text-warm-dark mb-2">End Date *</label>
                <input type="date" id="end-date" className="input-field" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
              </div>
            </div>
            <div>
              <label htmlFor="interests" className="block text-sm font-medium text-warm-dark mb-2">Interests</label>
              <select id="interests" className="input-field" value={interests} onChange={(e) => setInterests(e.target.value)}>
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
              <label htmlFor="accommodation" className="block text-sm font-medium text-warm-dark mb-2">Accommodation Style</label>
              <select id="accommodation" className="input-field" value={accommodationStyle} onChange={(e) => setAccommodationStyle(e.target.value)}>
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
              <h3 className="text-xl font-bold text-warm-dark mb-2 flex items-center">
                <span className="w-8 h-8 bg-brown-50 text-brown-600 rounded-full flex items-center justify-center text-sm font-semibold mr-3">💼</span>
                Preferences
              </h3>
              <p className="text-brown-600 text-sm">Help us customize your experience</p>
            </div>              <div>
              <label htmlFor="budget" className="block text-sm font-medium text-warm-dark mb-2">Budget (₹) *</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-brown-500 dark:text-night-muted font-medium">₹</span>
                <input
                  type="text"
                  inputMode="numeric"
                  id="budget"
                  className="input-field pl-8"
                  placeholder="e.g., 50000"
                  value={budget}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, '');
                    setBudget(val);
                    if (val && parseInt(val, 10) <= 0) {
                      setBudgetError('Budget must be greater than 0');
                    } else {
                      setBudgetError('');
                    }
                  }}
                  required
                />
              </div>
              {budgetError && <p className="text-red-500 text-xs mt-1">{budgetError}</p>}
            </div>
            <div>
              <label htmlFor="budget-tier" className="block text-sm font-medium text-warm-dark mb-2">Budget Tier (Optional)</label>
              <select id="budget-tier" className="input-field" value={budgetTier} onChange={(e) => setBudgetTier(e.target.value)}>
                <option value="">Select budget range</option>
                <option value="Budget (₹2k-5k/day)">Budget (₹2k-5k/day)</option>
                <option value="Standard (₹10k-20k/day)">Standard (₹10k-20k/day)</option>
                <option value="Premium (₹20k-50k/day)">Premium (₹20k-50k/day)</option>
                <option value="Luxury (₹50k+/day)">Luxury (₹50k+/day)</option>
              </select>
            </div>
            <div>
              <label htmlFor="travel-style" className="block text-sm font-medium text-warm-dark mb-2">Travel Style</label>
              <select id="travel-style" className="input-field" value={travelStyle} onChange={(e) => setTravelStyle(e.target.value)}>
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
              <h3 className="text-xl font-bold text-warm-dark mb-2 flex items-center">
                <span className="w-8 h-8 bg-beige-50 text-beige-600 rounded-full flex items-center justify-center text-sm font-semibold mr-3">🍴</span>
                Culinary Profile
              </h3>
              <p className="text-brown-600 text-sm">Let us know about your food preferences</p>
            </div>
            <div>
              <label htmlFor="dietary-needs" className="block text-sm font-medium text-warm-dark mb-2">Dietary Needs</label>
              <input type="text" id="dietary-needs" className="input-field" placeholder="e.g., Vegan, Gluten-Free, Vegetarian" value={dietaryNeeds} onChange={(e) => setDietaryNeeds(e.target.value)} />
            </div>
            <div>
              <label htmlFor="must-try-foods" className="block text-sm font-medium text-warm-dark mb-2">Must-Try Local Foods</label>
              <textarea id="must-try-foods" className="input-field" rows={3} placeholder="e.g., Dalma, Pithas, Chhena Poda, Rasgulla" value={mustTryFoods} onChange={(e) => setMustTryFoods(e.target.value)} />
              <p className="text-sm text-brown-600 mt-1">Tell us about local dishes you'd love to try</p>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="card overflow-hidden">
      {/* Progress Bar */}
      <div className="bg-cream-50/80 dark:bg-night-surface/80 backdrop-blur-sm px-6 py-4 border-b border-cream-100 dark:border-night-border">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold text-warm-dark">Create Your Perfect Itinerary</h2>
          <span className="text-sm text-brown-600">Step {currentStep} of {totalSteps}</span>
        </div>
        <div className="w-full bg-cream-200 dark:bg-night-border rounded-full h-2">
          <div className="bg-gradient-to-r from-maroon-500 to-brown-500 h-2 rounded-full transition-all duration-300" style={{ width: `${(currentStep / totalSteps) * 100}%` }} />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        {renderStepContent()}

        <div className="flex justify-between items-center mt-8 pt-6 border-t border-cream-100 dark:border-night-border">
          <button type="button" onClick={prevStep} disabled={currentStep === 1}
            className={`flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              currentStep === 1 ? 'text-cream-400 cursor-not-allowed' : 'text-brown-600 hover:text-warm-dark hover:bg-cream-50 dark:hover:bg-night-surface'
            }`}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Previous
          </button>

          {currentStep < totalSteps ? (
            <button type="button" onClick={nextStep} disabled={!isStepValid(currentStep)}
              className={`flex items-center px-6 py-3 rounded-xl text-sm font-semibold transition-all ${
                isStepValid(currentStep)
                  ? 'text-white bg-maroon-500 hover:bg-maroon-600 hover:shadow-lg hover:shadow-maroon-500/20'
                  : 'text-cream-400 bg-cream-200 dark:bg-night-border cursor-not-allowed'
              }`}
            >
              Next
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          ) : (
            <button type="submit" disabled={!destination.trim() || !startDate || !endDate}
              className={`flex items-center px-6 py-3 rounded-xl text-sm font-semibold transition-all ${
                destination.trim() && startDate && endDate
                  ? 'text-white bg-maroon-500 hover:bg-maroon-600 hover:shadow-lg hover:shadow-maroon-500/20'
                  : 'text-cream-400 bg-cream-200 dark:bg-night-border cursor-not-allowed'
              }`}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              Generate Itinerary
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ItineraryGenerator;
