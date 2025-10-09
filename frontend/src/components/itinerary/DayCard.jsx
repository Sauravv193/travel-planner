import { useState, useEffect, memo } from 'react'

const DayCard = memo(({ day, dayNumber, isTimelineView = false }) => {
  const [animatedActivities, setAnimatedActivities] = useState([])

  useEffect(() => {
    if (day?.activities) {
      // Stagger animation of activities
      day.activities.forEach((_, index) => {
        setTimeout(() => {
          setAnimatedActivities(prev => [...prev, index])
        }, index * 150)
      })
    }
    return () => setAnimatedActivities([])
  }, [day])

  if (!day) {
    return (
      <div className="text-center py-10 animate-pulse">
        <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-4"></div>
        <p className="text-gray-500">No activities planned for this day.</p>
      </div>
    )
  }

  // Conditionally render for timeline view vs. regular view
  if (isTimelineView) {
    return (
      <div className="transform transition-all duration-500">
        {/* Activities in compact timeline format */}
        {day.activities && day.activities.length > 0 ? (
          <div className="space-y-6">
            {day.activities.map((activity, index) => (
              <div 
                key={index} 
                className={`flex items-start relative transform transition-all duration-500 ${
                  animatedActivities.includes(index) 
                    ? 'translate-x-0 opacity-100' 
                    : 'translate-x-4 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Compact Time Badge */}
                <div className="flex-shrink-0 mr-4 relative">
                  <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl flex items-center justify-center text-white font-semibold text-xs shadow-md border-2 border-white">
                    <div className="text-center">
                      <div className="text-xs font-bold">{activity.time}</div>
                    </div>
                  </div>
                </div>
                
                {/* Compact Activity Card */}
                  <div className="bg-gradient-to-br from-gray-50 to-white p-5 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-teal-200">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-gray-900 leading-tight mb-1">{activity.title || 'Activity'}</h4>
                        <p className="text-gray-600 text-sm leading-relaxed">{activity.description}</p>
                      </div>
                      {(activity.duration || activity.time_of_day) && (
                        <div className="ml-3 flex items-center text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm border">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-xs font-medium">{activity.duration || activity.time_of_day}</span>
                        </div>
                      )}
                    </div>
                  
                  {/* Comprehensive Activity Details */}
                  <div className="space-y-3">
                    {/* Location */}
                    {(activity.location || activity.location_address) && (
                      <div className="flex items-center text-gray-600">
                        <svg className="w-4 h-4 mr-2 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-sm font-medium">{activity.location || activity.location_address}</span>
                      </div>
                    )}

                    {/* Transit Details */}
                    {activity.travel_details && (
                      <div className="flex items-start text-gray-600 bg-blue-50 p-2 rounded-lg">
                        <svg className="w-4 h-4 mr-2 text-blue-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                        </svg>
                        <div className="flex-1">
                          <p className="text-xs font-medium text-blue-700 mb-1">Transit</p>
                          <p className="text-xs text-blue-600">{activity.travel_details}</p>
                        </div>
                      </div>
                    )}

                    {/* Cost and Booking Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {activity.estimated_cost && (
                        <div className="bg-green-50 p-2 rounded-lg">
                          <div className="flex items-center">
                            <svg className="w-3 h-3 mr-1 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                            <span className="text-xs font-medium text-green-700">Cost</span>
                          </div>
                          <p className="text-xs text-green-600 mt-1 break-words">{activity.estimated_cost}</p>
                        </div>
                      )}
                      
                      {activity.booking_info && (
                        <div className="bg-orange-50 p-2 rounded-lg">
                          <div className="flex items-center">
                            <svg className="w-3 h-3 mr-1 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                            </svg>
                            <span className="text-xs font-medium text-orange-700">Booking</span>
                          </div>
                          <p className="text-xs text-orange-600 mt-1 break-words">{activity.booking_info}</p>
                        </div>
                      )}
                    </div>

                    {/* Alternative Option */}
                    {activity.alternative_option && (
                      <div className="bg-gray-50 p-2 rounded-lg border-l-2 border-gray-300">
                        <div className="flex items-center mb-1">
                          <svg className="w-3 h-3 mr-1 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                          </svg>
                          <span className="text-xs font-medium text-gray-700">Alternative</span>
                        </div>
                        <p className="text-xs text-gray-600">{activity.alternative_option}</p>
                      </div>
                    )}
                  </div>

                  {/* Compact Tips */}
                  {activity.tips && activity.tips.length > 0 && (
                    <div className="bg-teal-50 border border-teal-200 rounded-lg p-3 mt-3">
                      <h5 className="font-medium text-teal-800 mb-2 flex items-center text-sm">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        Tips
                      </h5>
                      <ul className="space-y-1 text-teal-700 text-xs">
                        {activity.tips.slice(0, 2).map((tip, tipIndex) => (
                          <li key={tipIndex} className="flex items-start">
                            <span className="w-1 h-1 bg-teal-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                            {tip}
                          </li>
                        ))}
                        {activity.tips.length > 2 && (
                          <li className="text-teal-600 font-medium cursor-pointer hover:text-teal-800">
                            +{activity.tips.length - 2} more tips...
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-3 flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <p className="text-gray-500 text-sm">No activities planned for this day.</p>
          </div>
        )}
        
        {/* Food Suggestions Section */}
        {day.food_suggestions && (
          <div className="mt-6 bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4">
            <h4 className="font-semibold text-yellow-800 mb-3 flex items-center text-sm">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h1a1 1 0 011 1v6.5a.5.5 0 01-.5.5H18V9.5A1.5 1.5 0 0016.5 8H17z" />
              </svg>
              🍽️ Food Recommendations
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {day.food_suggestions.lunch && (
                <div className="bg-white p-3 rounded-lg border border-yellow-100">
                  <h5 className="font-medium text-yellow-800 text-xs mb-1">LUNCH</h5>
                  <p className="font-semibold text-yellow-900 text-sm mb-1 break-words">{day.food_suggestions.lunch.recommendation}</p>
                  <p className="text-yellow-700 text-xs leading-relaxed">{day.food_suggestions.lunch.notes}</p>
                </div>
              )}
              {day.food_suggestions.dinner && (
                <div className="bg-white p-3 rounded-lg border border-yellow-100">
                  <h5 className="font-medium text-yellow-800 text-xs mb-1">DINNER</h5>
                  <p className="font-semibold text-yellow-900 text-sm mb-1 break-words">{day.food_suggestions.dinner.recommendation}</p>
                  <p className="text-yellow-700 text-xs leading-relaxed">{day.food_suggestions.dinner.notes}</p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Practical Tips Section */}
        {day.practical_tips && (
          <div className="mt-4 bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-200 rounded-xl p-4">
            <h4 className="font-semibold text-indigo-800 mb-3 flex items-center text-sm">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              💡 Day Tips
            </h4>
            <div className="space-y-2">
              {day.practical_tips.transport_tip && (
                <div className="bg-white p-2 rounded-lg border border-indigo-100">
                  <div className="flex items-center mb-1">
                    <svg className="w-3 h-3 mr-1 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                    <span className="text-xs font-medium text-indigo-800">Transport</span>
                  </div>
                  <p className="text-indigo-700 text-xs">{day.practical_tips.transport_tip}</p>
                </div>
              )}
              {day.practical_tips.cultural_etiquette && (
                <div className="bg-white p-2 rounded-lg border border-indigo-100">
                  <div className="flex items-center mb-1">
                    <svg className="w-3 h-3 mr-1 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                    <span className="text-xs font-medium text-indigo-800">Culture</span>
                  </div>
                  <p className="text-indigo-700 text-xs">{day.practical_tips.cultural_etiquette}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }

  // Regular detailed view for non-timeline usage
  return (
    <div className="transform transition-all duration-500">
      {/* Enhanced Day Header */}
      <div className="mb-8">
        <h3 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Day {dayNumber}: {day.title}</h3>
        {day.overview && (
          <p className="text-gray-600 text-lg leading-relaxed bg-teal-50 p-4 rounded-lg border-l-4 border-teal-500">
            {day.overview}
          </p>
        )}
      </div>
      
      <div className="space-y-8 relative">
        {/* Enhanced Timeline */}
        <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-teal-500 to-emerald-500 rounded-full opacity-30"></div>

        {day.activities && day.activities.map((activity, index) => (
          <div 
            key={index} 
            className={`flex items-start relative transform transition-all duration-500 ${
              animatedActivities.includes(index) 
                ? 'translate-x-0 opacity-100' 
                : 'translate-x-4 opacity-0'
            }`}
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            {/* Enhanced Time Badge */}
            <div className="flex-shrink-0 mr-6 relative">
              <div className="h-16 w-16 bg-gradient-to-br from-teal-600 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg z-10 border-4 border-white transform hover:scale-110 transition-transform duration-200">
                <div className="text-center">
                  <div className="text-xs opacity-90">Start</div>
                  <div className="font-bold">{activity.time}</div>
                </div>
              </div>
              {activity.duration && (
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full border">
                  {activity.duration}
                </div>
              )}
            </div>
            
            {/* Enhanced Activity Card */}
            <div className="bg-white p-6 rounded-xl shadow-lg w-full border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="mb-3">
                <h4 className="text-xl font-bold text-gray-900 leading-tight">{activity.title}</h4>
              </div>
              
              <p className="text-gray-700 leading-relaxed mb-4">{activity.description}</p>
              
              {/* Enhanced Location */}
              {activity.location && (
                <div className="flex items-center text-gray-600 mb-3 bg-gray-50 p-3 rounded-lg">
                  <svg className="w-5 h-5 mr-2 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="font-medium">{activity.location}</span>
                </div>
              )}

              {/* Activity Tips */}
              {activity.tips && activity.tips.length > 0 && (
                <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 mt-4">
                  <h5 className="font-semibold text-teal-800 mb-2 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    Insider Tips
                  </h5>
                  <ul className="space-y-1 text-teal-700 text-sm">
                    {activity.tips.map((tip, tipIndex) => (
                      <li key={tipIndex} className="flex items-start">
                        <span className="w-1.5 h-1.5 bg-teal-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Action Buttons */}
              {activity.duration && (
                <div className="flex items-center mt-4 pt-4 border-t border-gray-100">
                  <span className="inline-flex items-center text-gray-500 text-sm">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {activity.duration}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
})

export default DayCard
