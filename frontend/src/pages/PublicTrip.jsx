import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPublicSharedTrip } from '../services/api';
import ItineraryView from '../components/itinerary/ItineraryView';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function PublicTrip() {
  const { shareToken } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    getPublicSharedTrip(shareToken).then(({ data }) => { if (active) setTrip(data); })
      .catch((e) => { if (active) setError(e.response?.status === 404 ? 'This share link is invalid or has been revoked.' : 'Unable to load this shared trip right now.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [shareToken]);
  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><LoadingSpinner text="Loading shared trip..." /></div>;
  if (error || !trip) return <div className="wg-page"><div className="wg-container py-16 text-center"><h1 className="text-2xl font-bold">Trip unavailable</h1><p className="mt-3">{error || 'This trip is not available.'}</p><Link className="wg-button wg-button-primary mt-6 inline-flex" to="/">Explore WanderGen</Link></div></div>;
  let itinerary = trip.itinerary?.content || null;
  if (typeof itinerary === 'string') { try { itinerary = JSON.parse(itinerary); } catch { itinerary = null; } }
  return <div className="wg-page"><div className="wg-container py-8"><div className="mb-8"><p className="text-sm font-semibold uppercase tracking-wide text-blue-500">Shared with you</p><h1 className="mt-2 text-3xl font-bold">Trip to {trip.destination}</h1><p className="mt-2 text-sm opacity-75">{new Date(trip.startDate).toLocaleDateString()} — {new Date(trip.endDate).toLocaleDateString()}</p>{trip.travelStyle && <p className="mt-2">Travel style: {trip.travelStyle}</p>}</div>{itinerary ? <ItineraryView itinerary={itinerary} /> : <div className="rounded-xl border p-6">The owner has not generated an itinerary for this trip yet.</div>}<p className="mt-10 text-center text-sm opacity-70">Shared using WanderGen</p></div></div>;
}
