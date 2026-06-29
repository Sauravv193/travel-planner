import { useState, useEffect, memo } from 'react'

const DayCard = memo(({ day, dayNumber, isTimelineView = false }) => {
  const [animatedActivities, setAnimatedActivities] = useState([])

  useEffect(() => {
    if (day?.activities) {
      day.activities.forEach((_, index) => {
        setTimeout(() => setAnimatedActivities(prev => [...prev, index]), index * 150)
      })
    }
    return () => setAnimatedActivities([])
  }, [day])

  if (!day) {
    return (<div className="text-center py-10 animate-pulse"><div className="w-16 h-16 bg-earth-200 dark:bg-night-border rounded-full mx-auto mb-4"></div><p className="text-earth-500">No activities planned.</p></div>)
  }

  if (isTimelineView) {
    return (
      <div className="transform transition-all duration-500">
        {day.activities && day.activities.length > 0 ? (
          <div className="space-y-6">
            {day.activities.map((activity, index) => (
              <div key={index} className={`flex items-start relative transform transition-all duration-500 ${animatedActivities.includes(index) ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'}`} style={{ transitionDelay: `${index * 100}ms` }}>
                <div className="flex-shrink-0 mr-4 relative">
                  <div className="w-14 h-14 bg-gradient-to-br from-terracotta-400 to-terracotta-600 rounded-xl flex items-center justify-center text-white font-semibold text-xs shadow-md border-2 border-white dark:border-night-card">
                    <div className="text-center"><div className="text-xs font-bold">{activity.time}</div></div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-earth-50/50 to-white/80 dark:from-night-surface/50 dark:to-night-card/80 backdrop-blur-sm p-5 rounded-xl border border-earth-100 dark:border-night-border hover:shadow-lg transition-all duration-300 flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-forest-800 dark:text-white leading-tight mb-1">{activity.title || 'Activity'}</h4>
                      <p className="text-earth-600 dark:text-night-muted text-sm leading-relaxed">{activity.description}</p>
                    </div>
                    {activity.time_of_day && (
                      <div className="ml-3 flex items-center text-earth-500 bg-white/80 dark:bg-night-card/80 backdrop-blur-sm px-3 py-1 rounded-full shadow-soft border border-earth-100 dark:border-night-border">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span className="text-xs font-medium">{activity.time_of_day}</span>
                      </div>
                    )}
                  </div>
                  {activity.location && (
                    <div className="flex items-center text-earth-600 bg-earth-50/80 dark:bg-night-surface/80 backdrop-blur-sm p-2 rounded-lg mb-2">
                      <svg className="w-4 h-4 mr-2 text-terracotta-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      <span className="text-sm font-medium">{activity.location}</span>
                    </div>
                  )}
                  {activity.tips?.length > 0 && (
                    <div className="bg-terracotta-50/80 dark:bg-terracotta-500/10 backdrop-blur-sm border border-terracotta-200 dark:border-terracotta-500/20 rounded-lg p-3 mt-3">
                      <h5 className="font-medium text-terracotta-800 dark:text-terracotta-300 mb-2 flex items-center text-sm">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
                        Tips
                      </h5>
                      <ul className="space-y-1 text-terracotta-700 dark:text-terracotta-300 text-xs">
                        {activity.tips.slice(0, 2).map((tip, tipIndex) => (
                          <li key={tipIndex} className="flex items-start"><span className="w-1 h-1 bg-terracotta-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>{tip}</li>
                        ))}
                        {activity.tips.length > 2 && <li className="text-terracotta-600 font-medium cursor-pointer">+{activity.tips.length - 2} more tips...</li>}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-earth-100 dark:bg-night-border rounded-full mx-auto mb-3 flex items-center justify-center">
              <svg className="w-6 h-6 text-earth-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
            </div>
            <p className="text-earth-500 text-sm">No activities planned for this day.</p>
          </div>
        )}
        {day.food_suggestions && (
          <div className="mt-6 bg-gradient-to-br from-sage-50 to-earth-50 dark:from-sage-900/10 dark:to-sage-900/5 border border-sage-200 dark:border-sage-500/20 rounded-xl p-4">
            <h4 className="font-semibold text-sage-800 dark:text-sage-300 mb-3 flex items-center text-sm">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h1a1 1 0 011 1v6.5a.5.5 0 01-.5.5H18V9.5A1.5 1.5 0 0016.5 8H17z" /></svg>
              Food Recommendations
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {day.food_suggestions.lunch && <div className="bg-white/80 dark:bg-night-surface/80 backdrop-blur-sm p-3 rounded-lg border border-sage-100 dark:border-sage-500/10"><h5 className="font-medium text-sage-800 text-xs mb-1">LUNCH</h5><p className="font-semibold text-sage-900 text-sm mb-1">{day.food_suggestions.lunch.recommendation}</p><p className="text-sage-700 text-xs">{day.food_suggestions.lunch.notes}</p></div>}
              {day.food_suggestions.dinner && <div className="bg-white/80 dark:bg-night-surface/80 backdrop-blur-sm p-3 rounded-lg border border-sage-100 dark:border-sage-500/10"><h5 className="font-medium text-sage-800 text-xs mb-1">DINNER</h5><p className="font-semibold text-sage-900 text-sm mb-1">{day.food_suggestions.dinner.recommendation}</p><p className="text-sage-700 text-xs">{day.food_suggestions.dinner.notes}</p></div>}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="transform transition-all duration-500">
      <div className="mb-8">
        <h3 className="text-3xl font-bold text-forest-800 dark:text-white mb-2 tracking-tight">Day {dayNumber}: {day.title}</h3>
        {day.overview && <p className="text-earth-600 text-lg leading-relaxed bg-earth-50/80 dark:bg-night-surface/80 backdrop-blur-sm p-4 rounded-lg border-l-4 border-terracotta-500">{day.overview}</p>}
      </div>
      <div className="space-y-8 relative">
        <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-terracotta-500 to-terracotta-600 rounded-full opacity-30"></div>
        {day.activities && day.activities.map((activity, index) => (
          <div key={index} className={`flex items-start relative transform transition-all duration-500 ${animatedActivities.includes(index) ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'}`} style={{ transitionDelay: `${index * 100}ms` }}>
            <div className="flex-shrink-0 mr-6 relative">
              <div className="h-16 w-16 bg-gradient-to-br from-terracotta-500 to-terracotta-600 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg z-10 border-4 border-white dark:border-night-card transform hover:scale-110 transition-transform">
                <div className="text-center"><div className="text-xs opacity-90">Start</div><div className="font-bold">{activity.time}</div></div>
              </div>
            </div>
            <div className="card p-6 w-full">
              <h4 className="text-xl font-bold text-forest-800 dark:text-white leading-tight mb-3">{activity.title}</h4>
              <p className="text-earth-600 dark:text-night-muted leading-relaxed mb-4">{activity.description}</p>
              {activity.location && (
                <div className="flex items-center text-earth-600 bg-earth-50/80 dark:bg-night-surface/80 backdrop-blur-sm p-3 rounded-lg mb-3">
                  <svg className="w-5 h-5 mr-2 text-terracotta-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  <span className="font-medium">{activity.location}</span>
                </div>
              )}
              {activity.tips?.length > 0 && (
                <div className="bg-terracotta-50/80 dark:bg-terracotta-500/10 backdrop-blur-sm border border-terracotta-200 dark:border-terracotta-500/20 rounded-lg p-4 mt-4">
                  <h5 className="font-semibold text-terracotta-800 dark:text-terracotta-300 mb-2 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
                    Insider Tips
                  </h5>
                  <ul className="space-y-1 text-terracotta-700 dark:text-terracotta-300 text-sm">
                    {activity.tips.map((tip, tipIndex) => (
                      <li key={tipIndex} className="flex items-start"><span className="w-1.5 h-1.5 bg-terracotta-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>{tip}</li>
                    ))}
                  </ul>
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