import React, { useMemo, useState } from 'react';
import { CalendarDays, ChevronDown, Clock3, MapPin, Utensils, Wallet, Lightbulb, Sparkles, Users } from 'lucide-react';

const cleanText = (value) => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  return '';
};

const normalizeItinerary = (itinerary) => {
  if (!itinerary) return null;
  if (typeof itinerary === 'string') {
    try { itinerary = JSON.parse(itinerary); } catch { return { raw: itinerary, days: [] }; }
  }
  if (Array.isArray(itinerary)) return { title: 'Your travel plan', days: itinerary };
  const sourceDays = Array.isArray(itinerary.days) ? itinerary.days : Array.isArray(itinerary.itinerary) ? itinerary.itinerary : [];
  return {
    ...itinerary,
    title: itinerary.title || 'Your travel plan',
    description: itinerary.description || itinerary.trip_summary || '',
    days: sourceDays.map((day, index) => ({
      ...day,
      title: day.title || day.theme || `Day ${index + 1}`,
      overview: day.overview || day.daily_overview || '',
      activities: Array.isArray(day.activities) ? day.activities : [],
    })),
    budgetBreakdown: itinerary.budgetBreakdown || itinerary.overall_budget_breakdown,
    essentialTips: itinerary.essentialTips || itinerary.essential_travel_tips || [],
  };
};

const ItineraryView = ({ itinerary }) => {
  const [expandedDay, setExpandedDay] = useState(0);
  const [showBudget, setShowBudget] = useState(false);
  const [showTips, setShowTips] = useState(false);

  const plan = useMemo(() => normalizeItinerary(itinerary), [itinerary]);
  const activityCount = plan?.days?.reduce((sum, day) => sum + (day.activities?.length || 0), 0) || 0;

  if (!plan) {
    return <div className="wg-empty"><h3>No itinerary yet</h3><p>Your itinerary will appear here once it has been generated.</p></div>;
  }
  if (plan.raw) {
    return <div className="wg-alert"><span>{plan.raw}</span></div>;
  }
  if (!plan.days.length) {
    return <div className="wg-empty"><h3>No day-by-day plan found</h3><p>The saved itinerary doesn't contain daily activities yet. Try generating it again.</p></div>;
  }

  return (
    <section className="wg-itinerary">
      <div className="wg-itinerary-intro">
        <div>
          <span className="wg-eyebrow"><Sparkles size={15} /> YOUR PERSONAL PLAN</span>
          <h2>{plan.title}</h2>
          {plan.description && <p>{plan.description}</p>}
        </div>
        <div className="wg-itinerary-stats">
          <span><CalendarDays size={16} /> {plan.days.length} days</span>
          <span><MapPin size={16} /> {activityCount} stops</span>
        </div>
      </div>

      <div className="wg-itinerary-toolbar">
        <span>DAY-BY-DAY OVERVIEW</span>
        <span>Open a day for the full plan</span>
      </div>

      <div className="wg-day-list">
        {plan.days.map((day, index) => {
          const activities = day.activities || [];
          const isOpen = expandedDay === index;
          return (
            <article className={`wg-day-card ${isOpen ? 'is-open' : ''}`} key={day.id || index}>
              <button className="wg-day-toggle" onClick={() => setExpandedDay(isOpen ? -1 : index)} aria-expanded={isOpen}>
                <span className="wg-day-number">{String(index + 1).padStart(2, '0')}</span>
                <span className="wg-day-heading">
                  <strong>{day.title}</strong>
                  <small>{day.date || day.day_date || `${activities.length} planned ${activities.length === 1 ? 'stop' : 'stops'}`}</small>
                  {day.overview && <span className="wg-day-summary">{day.overview}</span>}
                </span>
                <span className="wg-day-count">{activities.length} {activities.length === 1 ? 'activity' : 'activities'}</span>
                <ChevronDown size={19} className={`wg-chevron ${isOpen ? 'is-open' : ''}`} />
              </button>

              {isOpen && (
                <div className="wg-day-details">
                  {activities.length ? (
                    <div className="wg-activity-list">
                      {activities.map((activity, activityIndex) => {
                        const title = activity.title || activity.name || activity.time_of_day || `Stop ${activityIndex + 1}`;
                        const time = activity.time || activity.time_of_day || '';
                        const location = activity.location || activity.location_address || '';
                        const description = activity.description || activity.details || '';
                        const tips = activity.tips || (activity.practical_tips ? [activity.practical_tips.transport_tip, activity.practical_tips.cultural_etiquette].filter(Boolean) : []);
                        const cost = activity.estimated_cost || activity.cost || '';
                        const hasMore = description || location || cost || activity.booking_info || activity.travel_details || tips.length;
                        return (
                          <details className="wg-activity" key={activity.id || activityIndex}>
                            <summary>
                              <span className="wg-activity-index">{String(activityIndex + 1).padStart(2, '0')}</span>
                              <span className="wg-activity-main">
                                <strong>{cleanText(title)}</strong>
                                <span>
                                  {time && <em><Clock3 size={13} /> {cleanText(time)}</em>}
                                  {location && <em><MapPin size={13} /> {cleanText(location)}</em>}
                                </span>
                              </span>
                              {cost && <span className="wg-activity-cost">{cleanText(cost)}</span>}
                              {hasMore && <ChevronDown size={16} className="wg-activity-chevron" />}
                            </summary>
                            {hasMore && (
                              <div className="wg-activity-extra">
                                {description && <p>{cleanText(description)}</p>}
                                {activity.booking_info && <p><strong>Booking:</strong> {cleanText(activity.booking_info)}</p>}
                                {activity.travel_details && <p><strong>Getting there:</strong> {cleanText(activity.travel_details)}</p>}
                                {Array.isArray(tips) && tips.length > 0 && (
                                  <div className="wg-tip-inline"><Lightbulb size={15} /><span>{tips.slice(0, 2).map(cleanText).filter(Boolean).join(' · ')}</span></div>
                                )}
                              </div>
                            )}
                          </details>
                        );
                      })}
                    </div>
                  ) : <p className="wg-muted">No activities were added for this day.</p>}

                  {day.food_suggestions && (
                    <div className="wg-food-row">
                      <Utensils size={17} />
                      <div>
                        <strong>Local food ideas</strong>
                        <span>{[day.food_suggestions.lunch?.recommendation, day.food_suggestions.dinner?.recommendation].filter(Boolean).join(' · ') || 'Explore local favourites nearby'}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </article>
          );
        })}
      </div>

      {plan.budgetBreakdown && (
        <div className="wg-extra-panel">
          <button className="wg-extra-toggle" onClick={() => setShowBudget(!showBudget)} aria-expanded={showBudget}>
            <span><Wallet size={17} /> Estimated budget breakdown</span>
            <ChevronDown size={18} className={showBudget ? 'is-open' : ''} />
          </button>
          {showBudget && (
            <div className="wg-budget-grid">
              {Object.entries(plan.budgetBreakdown).map(([key, value]) => (
                <div className="wg-budget-item" key={key}>
                  <small>{key.replaceAll('_', ' ')}</small>
                  <strong>{cleanText(value)}</strong>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {Array.isArray(plan.essentialTips) && plan.essentialTips.length > 0 && (
        <div className="wg-extra-panel">
          <button className="wg-extra-toggle" onClick={() => setShowTips(!showTips)} aria-expanded={showTips}>
            <span><Lightbulb size={17} /> Travel tips <small>{plan.essentialTips.length}</small></span>
            <ChevronDown size={18} className={showTips ? 'is-open' : ''} />
          </button>
          {showTips && (
            <ul className="wg-essential-tips">
              {plan.essentialTips.slice(0, 8).map((tip, index) => <li key={index}>{cleanText(tip)}</li>)}
            </ul>
          )}
        </div>
      )}
    </section>
  );
};

export default ItineraryView;
