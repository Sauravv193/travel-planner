import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertCircle, ArrowUpRight, CalendarDays, Compass, MapPin, Plus,
  RefreshCw, Search, Trash2, Wallet, Users, X
} from 'lucide-react';
import { getTrips, deleteTrip } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import InspirationPhotoUpload from '../components/profile/InspirationPhotoUpload';
import Dashboard from '../components/dashboard/Dashboard';

const dateValue = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const formatDate = (value) => {
  const date = dateValue(value);
  return date ? date.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : 'Date not set';
};

const tripDuration = (trip) => {
  const start = dateValue(trip.startDate);
  const end = dateValue(trip.endDate);
  if (!start || !end) return null;
  return Math.max(1, Math.round((end - start) / 86400000) + 1);
};

const Profile = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [deletingTripId, setDeletingTripId] = useState(null);
  const [tripToDelete, setTripToDelete] = useState(null);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const fetchTrips = useCallback(async () => {
    setLoading(true);
    setFetchError('');
    try {
      const response = await getTrips();
      if (!Array.isArray(response.data)) {
        throw new Error('The server returned an unexpected trips response.');
      }
      setTrips(response.data);
    } catch (error) {
      const status = error.response?.status;
      setFetchError(
        status === 401 || status === 403
          ? 'Your session could not be verified. Sign in again, then reload your trips.'
          : error.response?.data?.message || error.message || 'We could not load your trips. Check your connection and try again.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  const visibleTrips = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return trips
      .filter((trip) => {
        const start = dateValue(trip.startDate);
        const isUpcoming = start && start >= today;
        if (filter === 'upcoming' && !isUpcoming) return false;
        if (filter === 'past' && (!start || isUpcoming)) return false;
        return (trip.destination || '').toLowerCase().includes(search.trim().toLowerCase());
      })
      .sort((a, b) => (dateValue(a.startDate)?.getTime() || 0) - (dateValue(b.startDate)?.getTime() || 0));
  }, [trips, filter, search]);

  const handleDeleteConfirm = async () => {
    if (!tripToDelete) return;
    try {
      setDeletingTripId(tripToDelete.id);
      await deleteTrip(tripToDelete.id);
      setTrips((current) => current.filter((trip) => trip.id !== tripToDelete.id));
      setTripToDelete(null);
    } catch (error) {
      setFetchError(error.response?.data?.message || 'The trip could not be deleted. Please try again.');
    } finally {
      setDeletingTripId(null);
    }
  };

  const filters = [
    { id: 'all', label: 'All trips' },
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'past', label: 'Past trips' },
  ];

  return (
    <div className="wg-page">
      <div className="wg-container">
        <div className="wg-page-heading">
          <div>
            <span className="wg-eyebrow"><Compass size={15} /> YOUR TRAVEL SPACE</span>
            <h1>My trips</h1>
            <p>Every journey, in one place. Pick up where you left off.</p>
          </div>
          <Link to="/planner" className="wg-button wg-button-primary">
            <Plus size={18} /> Plan a trip
          </Link>
        </div>

        {fetchError && (
          <div className="wg-alert" role="alert">
            <AlertCircle size={19} />
            <div className="wg-alert-copy">
              <strong>We couldn't refresh your trips</strong>
              <span>{fetchError}</span>
            </div>
            <button className="wg-icon-button" onClick={fetchTrips} aria-label="Retry loading trips">
              <RefreshCw size={17} />
            </button>
          </div>
        )}

        {!fetchError && !loading && <Dashboard trips={trips} />}

        <section className="wg-section">
          <div className="wg-section-heading">
            <div>
              <span className="wg-eyebrow">YOUR COLLECTION</span>
              <h2>Trips you've planned <span className="wg-count">{trips.length}</span></h2>
            </div>
            <button className="wg-button wg-button-secondary" onClick={fetchTrips} disabled={loading}>
              <RefreshCw size={16} className={loading ? 'wg-spin' : ''} /> Refresh
            </button>
          </div>

          <div className="wg-toolbar">
            <div className="wg-filter-tabs" role="tablist" aria-label="Filter trips">
              {filters.map((item) => (
                <button
                  key={item.id}
                  role="tab"
                  aria-selected={filter === item.id}
                  className={`wg-filter-tab ${filter === item.id ? 'is-active' : ''}`}
                  onClick={() => setFilter(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <label className="wg-search">
              <Search size={17} />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Find a destination" />
              {search && <button onClick={() => setSearch('')} aria-label="Clear search"><X size={15} /></button>}
            </label>
          </div>

          {loading ? (
            <div className="wg-loading"><LoadingSpinner text="Finding your trips..." /></div>
          ) : fetchError ? (
            <div className="wg-empty">
              <div className="wg-empty-icon"><AlertCircle size={25} /></div>
              <h3>Your trips haven't loaded</h3>
              <p>This is a loading error, not an empty trip list. Retry to check the server again.</p>
              <button className="wg-button wg-button-primary" onClick={fetchTrips}><RefreshCw size={16} /> Try again</button>
            </div>
          ) : visibleTrips.length === 0 ? (
            <div className="wg-empty">
              <div className="wg-empty-icon"><MapPin size={25} /></div>
              <h3>{trips.length === 0 ? 'Your next story starts here' : 'No trips match this view'}</h3>
              <p>{trips.length === 0 ? 'Create a trip and your saved plans will appear here, even after you come back.' : 'Try another filter or search for a different destination.'}</p>
              {trips.length === 0 && <Link to="/planner" className="wg-button wg-button-primary"><Plus size={17} /> Create your first trip</Link>}
            </div>
          ) : (
            <div className="wg-trip-grid">
              {visibleTrips.map((trip, index) => {
                const duration = tripDuration(trip);
                return (
                  <article className="wg-trip-card" key={trip.id}>
                    <div className={`wg-trip-art wg-trip-art-${index % 4}`}>
                      <span className="wg-trip-art-label"><MapPin size={14} /> {trip.destination}</span>
                      <span className="wg-trip-art-mark">{String(trip.destination || 'W').trim().charAt(0).toUpperCase()}</span>
                    </div>
                    <div className="wg-trip-content">
                      <div className="wg-trip-title-row">
                        <div>
                          <span className="wg-trip-kicker">YOUR NEXT CHAPTER</span>
                          <h3>{trip.destination}</h3>
                        </div>
                        <button className="wg-icon-button wg-delete-button" onClick={() => setTripToDelete(trip)} aria-label={`Delete trip to ${trip.destination}`}>
                          <Trash2 size={17} />
                        </button>
                      </div>
                      <div className="wg-trip-meta">
                        <span><CalendarDays size={15} /> {formatDate(trip.startDate)} – {formatDate(trip.endDate)}</span>
                        {duration && <span>{duration} days</span>}
                      </div>
                      <div className="wg-trip-facts">
                        {trip.numberOfTravelers && <span><Users size={15} /> {trip.numberOfTravelers} travellers</span>}
                        {trip.budget && <span><Wallet size={15} /> ₹{Number(trip.budget).toLocaleString('en-IN')}</span>}
                      </div>
                      <Link to={`/trip/${trip.id}`} className="wg-trip-link">
                        Open itinerary <ArrowUpRight size={17} />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <section className="wg-inspiration">
          <div>
            <span className="wg-eyebrow">MAKE IT PERSONAL</span>
            <h2>What inspires your next journey?</h2>
            <p>Save places and visual ideas to help shape future recommendations.</p>
          </div>
          <InspirationPhotoUpload />
        </section>
      </div>

      {tripToDelete && (
        <div className="wg-modal-backdrop" role="presentation" onClick={() => setTripToDelete(null)}>
          <div className="wg-modal" role="dialog" aria-modal="true" aria-labelledby="delete-trip-title" onClick={(event) => event.stopPropagation()}>
            <div className="wg-modal-icon"><Trash2 size={21} /></div>
            <h2 id="delete-trip-title">Delete this trip?</h2>
            <p>Your trip to <strong>{tripToDelete.destination}</strong> will be moved out of your active trips. This cannot be undone from the app.</p>
            <div className="wg-modal-actions">
              <button className="wg-button wg-button-secondary" onClick={() => setTripToDelete(null)}>Keep trip</button>
              <button className="wg-button wg-button-danger" onClick={handleDeleteConfirm} disabled={deletingTripId === tripToDelete.id}>
                <Trash2 size={16} /> {deletingTripId === tripToDelete.id ? 'Deleting...' : 'Delete trip'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
