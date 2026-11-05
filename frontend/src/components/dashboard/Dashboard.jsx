import { createElement } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ArrowRight, CalendarDays, Compass, MapPin, Wallet } from 'lucide-react';

const Dashboard = ({ trips = [] }) => {
  const { user } = useAuth();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcoming = trips
    .filter((trip) => {
      const date = trip.startDate ? new Date(`${trip.startDate}T00:00:00`) : null;
      return date && !Number.isNaN(date.getTime()) && date >= today;
    })
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
  const budget = trips.reduce((sum, trip) => sum + (Number(trip.budget) || 0), 0);
  const destinations = new Set(trips.map((trip) => trip.destination).filter(Boolean)).size;

  const stats = [
    { label: 'Trips planned', value: trips.length, icon: Compass },
    { label: 'Coming up', value: upcoming.length, icon: CalendarDays },
    { label: 'Destinations', value: destinations, icon: MapPin },
    { label: 'Planned budget', value: `₹${budget.toLocaleString('en-IN')}`, icon: Wallet },
  ];

  return (
    <section className="wg-dashboard">
      <div className="wg-dashboard-hero">
        <div>
          <span className="wg-dashboard-label">YOUR TRAVEL DASHBOARD</span>
          <h2>Good to see you, {user?.username || 'traveller'}.</h2>
          <p>{trips.length ? 'Your plans are all together. Pick a trip and keep the good stuff moving.' : 'A new place is closer than you think. Start with a destination and we’ll help shape the days.'}</p>
          <Link to="/planner" className="wg-dashboard-cta">{trips.length ? 'Plan another trip' : 'Plan your first trip'} <ArrowRight size={16} /></Link>
        </div>
        <div className="wg-dashboard-mark"><Compass size={54} strokeWidth={1.3} /></div>
      </div>

      <div className="wg-dashboard-stats">
        {stats.map((stat) => (
          <div className="wg-dashboard-stat" key={stat.label}>
            <span className="wg-dashboard-stat-icon">{createElement(stat.icon, { size: 18 })}</span>
            <div><strong>{stat.value}</strong><small>{stat.label}</small></div>
          </div>
        ))}
      </div>

      {upcoming.length > 0 && (
        <div className="wg-next-trip">
          <div>
            <span className="wg-eyebrow">ON THE HORIZON</span>
            <strong>{upcoming[0].destination}</strong>
            <small>Next up · {new Date(`${upcoming[0].startDate}T00:00:00`).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</small>
          </div>
          <Link to={`/trip/${upcoming[0].id}`}>View trip <ArrowRight size={15} /></Link>
        </div>
      )}
    </section>
  );
};

export default Dashboard;
