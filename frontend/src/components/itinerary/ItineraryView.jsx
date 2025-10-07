import DayCard from './DayCard'
import { useState, useEffect } from 'react'

const ItineraryView = ({ itinerary }) => {
  const [currentDay, setCurrentDay] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])


  // Enhanced validation and fallback
  if (!itinerary) {
    return (
        <div className="text-center py-10 bg-white rounded-xl shadow-md transform transition-all duration-500 hover:shadow-lg">
            <div className="animate-pulse">
              <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-4"></div>
              <h3 className="text-lg font-medium text-gray-700">No Itinerary to Display</h3>
              <p className="text-sm text-gray-500 mt-1">No itinerary data was provided.</p>
            </div>
        </div>
    );
  }

  // Handle different possible data structures
  let processedItinerary = itinerary
  
  // If itinerary has a 'days' property that's an array
  if (itinerary.days && Array.isArray(itinerary.days)) {
    processedItinerary = itinerary
  }
  // If the itinerary itself is an array (direct days)
  else if (Array.isArray(itinerary)) {
    processedItinerary = {
      title: 'Your Travel Itinerary',
      description: 'Explore amazing destinations with this personalized plan.',
      totalDays: itinerary.length,
      days: itinerary
    }
  }
  // If it's a string, try to display it as raw content
  else if (typeof itinerary === 'string') {
    return (
      <div className="text-center py-10 bg-white rounded-xl shadow-md">
        <h3 className="text-lg font-medium text-gray-700 mb-4">Raw Itinerary Content</h3>
        <pre className="text-sm text-gray-600 whitespace-pre-wrap text-left max-w-4xl mx-auto p-4 bg-gray-50 rounded-lg overflow-auto">
          {itinerary}
        </pre>
      </div>
    )
  }
  // If no recognizable structure
  else {
    return (
      <div className="text-center py-10 bg-white rounded-xl shadow-md">
        <h3 className="text-lg font-medium text-gray-700 mb-4">Debug: Itinerary Structure</h3>
        <pre className="text-sm text-gray-600 whitespace-pre-wrap text-left max-w-4xl mx-auto p-4 bg-gray-50 rounded-lg overflow-auto">
          {JSON.stringify(itinerary, null, 2)}
        </pre>
      </div>
    )
  }

  if (!processedItinerary.days || !Array.isArray(processedItinerary.days) || processedItinerary.days.length === 0) {
    return (
        <div className="text-center py-10 bg-white rounded-xl shadow-md transform transition-all duration-500 hover:shadow-lg">
            <div className="animate-pulse">
              <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-4"></div>
              <h3 className="text-lg font-medium text-gray-700">No Days Found</h3>
              <p className="text-sm text-gray-500 mt-1">The itinerary doesn't contain any daily plans.</p>
            </div>
        </div>
    );
  }

  return (
    <div className={`transform transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-xl overflow-hidden transition-all duration-500 hover:shadow-2xl border border-gray-100">
        {/* Enhanced Header */}
        <div className="bg-gradient-to-r from-teal-600 to-emerald-600 p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <h2 className="text-4xl font-bold mb-3 leading-tight">{processedItinerary.title || 'Your Travel Itinerary'}</h2>
            <p className="text-teal-100 text-lg leading-relaxed max-w-3xl">{processedItinerary.description || 'Explore amazing destinations with this personalized plan.'}</p>
            <div className="mt-4 inline-flex items-center bg-white/20 rounded-full px-4 py-2">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              <span className="font-semibold">{processedItinerary.days.length} Day Adventure</span>
            </div>
          </div>
        </div>

        {/* Travel Tips Section */}
        {processedItinerary.tips && processedItinerary.tips.length > 0 && (
          <div className="bg-amber-50 border-l-4 border-amber-400 p-6 mx-6 mt-6 rounded-r-lg">
            <h3 className="font-semibold text-amber-800 mb-2 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Essential Tips
            </h3>
            <ul className="space-y-1 text-amber-700">
              {processedItinerary.tips.map((tip, index) => (
                <li key={index} className="flex items-start">
                  <span className="w-2 h-2 bg-amber-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Enhanced Day Navigation */}
        <div className="flex overflow-x-auto border-b border-gray-200 bg-white mx-6 mt-6 rounded-t-lg shadow-sm">
          {processedItinerary.days.map((day, index) => (
            <button
              key={index}
              className={`flex-shrink-0 px-6 py-4 text-sm font-semibold focus:outline-none transition-all duration-300 transform hover:scale-105 ${
                currentDay === index
                  ? 'border-b-2 border-teal-600 text-teal-600 bg-teal-50 shadow-sm'
                  : 'border-b-2 border-transparent text-gray-500 hover:text-teal-600 hover:bg-gray-50'
              }`}
              onClick={() => setCurrentDay(index)}
            >
              <div className="text-center">
                <div className={`text-xs font-medium ${currentDay === index ? 'text-teal-500' : 'text-gray-400'}`}>
                  Day
                </div>
                <div className="text-lg font-bold">{index + 1}</div>
                {day.title && (
                  <div className="text-xs mt-1 max-w-20 truncate">
                    {day.title}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Enhanced Day Content */}
        <div className="p-6 bg-white mx-6 rounded-b-lg shadow-sm">
          <div className="transition-all duration-500 transform">
            <DayCard day={processedItinerary.days[currentDay]} dayNumber={currentDay + 1} />
          </div>
        </div>

        {/* Enhanced Navigation Controls */}
        <div className="px-8 py-6 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
          <button
            className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 ${
              currentDay === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md hover:shadow-lg border border-gray-200'
            }`}
            disabled={currentDay === 0}
            onClick={() => setCurrentDay(currentDay - 1)}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Previous Day
          </button>
          
          <div className="flex items-center space-x-2">
            {processedItinerary.days.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  currentDay === index ? 'bg-teal-600 scale-125' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          
          <button
            className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 ${
              currentDay === processedItinerary.days.length - 1
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-teal-600 text-white hover:bg-teal-700 shadow-md hover:shadow-lg'
            }`}
            disabled={currentDay === processedItinerary.days.length - 1}
            onClick={() => setCurrentDay(currentDay + 1)}
          >
            Next Day
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ItineraryView