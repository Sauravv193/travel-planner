import { useState, useEffect } from 'react'

const DayCard = ({ day, dayNumber, isTimelineView = false }) => {
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
                <div className="flex-1 bg-gradient-to-br from-gray-50 to-white p-5 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-teal-200">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-gray-900 leading-tight mb-1">{activity.title}</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">{activity.description}</p>
                    </div>
                    {activity.duration && (
                      <div className="ml-3 flex items-center text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm border">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-xs font-medium">{activity.duration}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Compact Location */}
                  {activity.location && (
                    <div className="flex items-center text-gray-600 mb-3">
                      <svg className="w-4 h-4 mr-2 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-sm font-medium">{activity.location}</span>
                    </div>
                  )}

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
}

export default DayCard