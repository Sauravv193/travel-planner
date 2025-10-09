import DayCard from './DayCard'
import { useState, useEffect } from 'react'

const ItineraryView = ({ itinerary }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [visibleDays, setVisibleDays] = useState(new Set())

  useEffect(() => {
    setIsVisible(true)
    // Stagger the appearance of each day
    if (itinerary?.days) {
      itinerary.days.forEach((_, index) => {
        setTimeout(() => {
          setVisibleDays(prev => new Set([...prev, index]))
        }, index * 200)
      })
    }
  }, [itinerary])


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
      <div className="space-y-8">
        {/* Enhanced Header */}
        <div className="bg-gradient-to-br from-teal-600 via-emerald-600 to-cyan-600 rounded-2xl shadow-2xl overflow-hidden relative">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-4 right-4 w-24 h-24 bg-white rounded-full opacity-10 animate-pulse"></div>
            <div className="absolute bottom-4 left-4 w-16 h-16 bg-white rounded-full opacity-10 animate-pulse" style={{animationDelay: '1s'}}></div>
            <div className="absolute top-1/2 left-1/3 w-12 h-12 bg-white rounded-full opacity-10 animate-pulse" style={{animationDelay: '0.5s'}}></div>
          </div>
          
          <div className="relative z-10 p-8 md:p-12">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 9m0 8V9m0 0L9 7" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 leading-tight">
                    {processedItinerary.title || 'Your Travel Journey'}
                  </h1>
                  <p className="text-teal-100 text-lg md:text-xl leading-relaxed max-w-2xl">
                    {processedItinerary.description || 'Discover amazing destinations with this personalized adventure plan.'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-4">
              <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
                <svg className="w-5 h-5 mr-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold text-white">
                  {processedItinerary.days.length} Day{processedItinerary.days.length > 1 ? 's' : ''} Adventure
                </span>
              </div>
              
              <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
                <svg className="w-5 h-5 mr-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="font-semibold text-white">
                  {processedItinerary.days.reduce((total, day) => total + (day.activities?.length || 0), 0)} Activities
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Travel Tips Section */}
        {processedItinerary.tips && processedItinerary.tips.length > 0 && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6 shadow-lg">
            <h3 className="font-bold text-amber-800 mb-4 flex items-center text-xl">
              <div className="w-8 h-8 bg-amber-200 rounded-full flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              Essential Travel Tips
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {processedItinerary.tips.map((tip, index) => (
                <div key={index} className="flex items-start bg-white p-4 rounded-xl shadow-sm">
                  <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-amber-700 font-medium">{tip}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Timeline-based Days Display */}
        <div className="relative">
          {/* Main Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-teal-500 via-emerald-500 to-cyan-500 rounded-full shadow-lg"></div>
          
          <div className="space-y-12">
            {processedItinerary.days.map((day, index) => (
              <div 
                key={index}
                className={`transition-all duration-700 transform ${
                  visibleDays.has(index) 
                    ? 'translate-x-0 opacity-100' 
                    : 'translate-x-8 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Day Timeline Marker */}
                <div className="flex items-start relative">
                  {/* Day Number Badge */}
                  <div className="flex-shrink-0 mr-8 relative z-10">
                    <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg border-4 border-white">
                      {index + 1}
                    </div>
                    {index < processedItinerary.days.length - 1 && (
                      <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-px h-12 bg-gradient-to-b from-teal-400 to-transparent"></div>
                    )}
                  </div>
                  
                  {/* Day Content Card */}
                  <div className="flex-1 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900 mb-1">
                            Day {index + 1}: {day.title || `Adventure ${index + 1}`}
                          </h2>
                          {day.overview && (
                            <p className="text-gray-600 leading-relaxed">
                              {day.overview}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 bg-white rounded-full px-4 py-2 shadow-sm">
                          <svg className="w-4 h-4 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-sm font-medium text-gray-700">
                            {day.activities?.length || 0} Activities
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <DayCard day={day} dayNumber={index + 1} isTimelineView={true} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Journey Summary */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 text-center shadow-lg border border-gray-200">
          <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Your Journey Awaits!</h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            You've planned an amazing {processedItinerary.days.length}-day adventure with {' '}
            {processedItinerary.days.reduce((total, day) => total + (day.activities?.length || 0), 0)} exciting activities. 
            Have a wonderful trip!
          </p>
        </div>
      </div>
    </div>
  )
}

export default ItineraryView