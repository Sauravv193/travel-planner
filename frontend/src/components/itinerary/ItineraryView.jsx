import DayCard from './DayCard'
import { useState, useEffect, useMemo } from 'react'

const ItineraryView = ({ itinerary }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [visibleDays, setVisibleDays] = useState(new Set())

  const processedItinerary = useMemo(() => {
    if (!itinerary) return null;
    let processed = itinerary
    if (itinerary.itinerary && Array.isArray(itinerary.itinerary)) {
      processed = { title: 'Your Travel Itinerary', description: itinerary.trip_summary || 'Explore amazing destinations with this personalized plan.', totalDays: itinerary.itinerary.length, days: itinerary.itinerary, budgetBreakdown: itinerary.overall_budget_breakdown, essentialTips: itinerary.essential_travel_tips || [] }
    } else if (itinerary.days && Array.isArray(itinerary.days)) {
      processed = { ...itinerary, days: itinerary.days, essentialTips: itinerary.essential_travel_tips || [] }
    } else if (Array.isArray(itinerary)) {
      processed = { title: 'Your Travel Itinerary', description: 'Explore amazing destinations with this personalized plan.', totalDays: itinerary.length, days: itinerary, essentialTips: [] }
    }
    return processed;
  }, [itinerary]);

  useEffect(() => {
    setIsVisible(true)
    if (processedItinerary?.days) {
      processedItinerary.days.forEach((_, index) => {
        setTimeout(() => setVisibleDays(prev => new Set([...prev, index])), index * 100)
      })
    }
  }, [processedItinerary])

  if (!processedItinerary) {
    return (<div className="text-center py-10 card"><div className="animate-pulse"><div className="w-16 h-16 bg-cream-200 dark:bg-night-border rounded-full mx-auto mb-4"></div><h3 className="text-lg font-medium text-warm-dark dark:text-night-text">No Itinerary to Display</h3><p className="text-sm text-cream-500 dark:text-night-muted mt-1">No itinerary data was provided.</p></div></div>);
  }
  if (typeof itinerary === 'string') {
    return (<div className="text-center py-10 card"><h3 className="text-lg font-medium text-warm-dark dark:text-night-text mb-4">Raw Itinerary Content</h3><pre className="text-sm text-brown-600 whitespace-pre-wrap text-left max-w-4xl mx-auto p-4 bg-cream-50 dark:bg-night-surface rounded-lg overflow-auto">{itinerary}</pre></div>)
  }
  if (!processedItinerary.days || !Array.isArray(processedItinerary.days) || processedItinerary.days.length === 0) {
    return (<div className="text-center py-10 card"><div className="animate-pulse"><div className="w-16 h-16 bg-cream-200 dark:bg-night-border rounded-full mx-auto mb-4"></div><h3 className="text-lg font-medium text-warm-dark dark:text-night-text">No Days Found</h3><p className="text-sm text-cream-500 dark:text-night-muted mt-1">The itinerary doesn't contain any daily plans.</p></div></div>);
  }

  return (
    <div className={`transform transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
      <div className="space-y-8">
        {/* Glass Header */}
        <div className="bg-gradient-to-br from-maroon-500 via-maroon-600 to-maroon-700 rounded-2xl shadow-glass-xl overflow-hidden relative">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-beige-400 via-beige-300 to-beige-400" />
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 right-4 w-24 h-24 bg-beige-300 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute bottom-4 left-4 w-16 h-16 bg-beige-300 rounded-full opacity-20 animate-pulse" style={{animationDelay: '1s'}}></div>
          </div>
          <div className="relative z-10 p-8 md:p-12">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-beige-300/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-beige-300/20">
                  <svg className="w-8 h-8 text-beige-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 9m0 8V9m0 0L9 7" /></svg>
                </div>
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 leading-tight">{processedItinerary.title || 'Your Travel Journey'}</h1>
                  <p className="text-white/70 text-lg md:text-xl leading-relaxed max-w-2xl">{processedItinerary.description || 'Discover amazing destinations with this personalized adventure plan.'}</p>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/10">
                <svg className="w-5 h-5 mr-3 text-beige-300" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>
                <span className="font-semibold text-white">{processedItinerary.days.length} Day{processedItinerary.days.length > 1 ? 's' : ''} Adventure</span>
              </div>
              <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/10">
                <svg className="w-5 h-5 mr-3 text-beige-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <span className="font-semibold text-white">{processedItinerary.days.reduce((total, day) => total + (day.activities?.length || 0), 0)} Activities</span>
              </div>
            </div>
          </div>
        </div>

        {/* Budget Breakdown */}
        {processedItinerary.budgetBreakdown && (
          <div className="bg-gradient-to-br from-beige-50 to-cream-50 dark:from-beige-900/10 dark:to-maroon-900/5 border border-beige-200 dark:border-beige-500/20 rounded-2xl p-6 shadow-glass">
            <h3 className="font-bold text-warm-dark dark:text-white mb-6 flex items-center text-xl">
              <div className="w-8 h-8 bg-beige-200 dark:bg-beige-500/20 rounded-full flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-beige-600 dark:text-beige-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" /></svg>
              </div>
              Budget Breakdown (Total Estimates)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-white/80 dark:bg-night-surface/80 backdrop-blur-sm p-4 sm:p-5 rounded-xl shadow-soft border border-beige-100 dark:border-beige-500/10">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-warm-dark dark:text-night-text text-xs sm:text-sm uppercase tracking-wide">Accommodation</h4>
                </div>
                <p className="text-warm-dark dark:text-white font-medium text-base sm:text-lg break-words">{processedItinerary.budgetBreakdown.accommodation_estimate}</p>
              </div>
              <div className="bg-white/80 dark:bg-night-surface/80 backdrop-blur-sm p-4 sm:p-5 rounded-xl shadow-soft border border-beige-100 dark:border-beige-500/10">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-warm-dark dark:text-night-text text-xs sm:text-sm uppercase tracking-wide">Meals</h4>
                </div>
                <p className="text-warm-dark dark:text-white font-medium text-base sm:text-lg break-words">{processedItinerary.budgetBreakdown.food_estimate}</p>
              </div>
              <div className="bg-white/80 dark:bg-night-surface/80 backdrop-blur-sm p-4 sm:p-5 rounded-xl shadow-soft border border-beige-100 dark:border-beige-500/10">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-warm-dark dark:text-night-text text-xs sm:text-sm uppercase tracking-wide">Activities</h4>
                </div>
                <p className="text-warm-dark dark:text-white font-medium text-base sm:text-lg break-words">{processedItinerary.budgetBreakdown.activities_estimate}</p>
              </div>
            </div>
          </div>
        )}

        {/* Timeline */}
        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-maroon-500 via-maroon-400 to-maroon-500 rounded-full shadow-lg"></div>
          <div className="space-y-12">
            {processedItinerary.days.map((day, index) => (
              <div key={index} className={`transition-all duration-700 transform ${visibleDays.has(index) ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}`} style={{ transitionDelay: `${index * 100}ms` }}>
                <div className="flex items-start relative">
                  <div className="flex-shrink-0 mr-8 relative z-10">
                    <div className="w-16 h-16 bg-gradient-to-br from-maroon-500 to-maroon-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg border-4 border-white dark:border-night-card shadow-maroon-500/20">{index + 1}</div>
                    {index < processedItinerary.days.length - 1 && (<div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-px h-12 bg-gradient-to-b from-maroon-400 to-transparent"></div>)}
                  </div>
                  <div className="flex-1 card overflow-hidden">
                    <div className="bg-gradient-to-r from-cream-50 to-beige-100 dark:from-night-surface dark:to-night-border/30 p-6 border-b border-cream-100 dark:border-night-border">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-2xl font-bold text-warm-dark dark:text-white mb-1">Day {index + 1}: {day.title || `Adventure ${index + 1}`}</h2>
                          {day.overview && <p className="text-brown-600 dark:text-night-muted leading-relaxed">{day.overview}</p>}
                        </div>
                        <div className="flex items-center space-x-2 bg-white/80 dark:bg-night-card/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-soft border border-cream-100 dark:border-night-border">
                          <svg className="w-4 h-4 text-maroon-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          <span className="text-sm font-medium text-warm-dark dark:text-night-text">{day.activities?.length || 0} Activities</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-6"><DayCard day={day} dayNumber={index + 1} isTimelineView={true} /></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Travel Tips */}
        {processedItinerary.essentialTips?.length > 0 && (
          <div className="bg-gradient-to-br from-maroon-50 to-cream-50 dark:from-maroon-900/10 dark:to-maroon-900/5 border border-maroon-200 dark:border-maroon-500/20 rounded-2xl p-8 shadow-glass">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-maroon-200 dark:bg-maroon-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-maroon-600 dark:text-maroon-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="text-2xl font-bold text-warm-dark dark:text-white mb-2">Essential Travel Tips</h3>
              <p className="text-brown-600 dark:text-night-muted">Important insights for a smoother journey</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {processedItinerary.essentialTips.map((tip, index) => (
                <div key={index} className="bg-white/80 dark:bg-night-surface/80 backdrop-blur-sm p-4 sm:p-5 rounded-xl shadow-soft border border-maroon-100 dark:border-maroon-500/10">
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-maroon-100 dark:bg-maroon-500/20 rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-1">
                      <span className="text-maroon-600 dark:text-maroon-400 font-bold text-sm">{index + 1}</span>
                    </div>
                    <p className="text-warm-dark dark:text-night-text font-medium text-sm sm:text-base leading-relaxed">{tip}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Journey Summary */}
        <div className="card p-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-maroon-500 to-maroon-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-maroon-500/20">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
          </div>
          <h3 className="text-2xl font-bold text-warm-dark dark:text-white mb-2">Your Journey Awaits!</h3>
          <p className="text-brown-600 dark:text-night-muted max-w-2xl mx-auto">You've planned an amazing {processedItinerary.days.length}-day adventure with {processedItinerary.days.reduce((total, day) => total + (day.activities?.length || 0), 0)} exciting activities. Have a wonderful trip!</p>
        </div>
      </div>
    </div>
  )
}

export default ItineraryView
