import { useState } from 'react';
import { MapPin, Navigation, ExternalLink } from 'lucide-react';
import { useToast } from './Toast';

/**
 * MapView Component
 * 
 * Displays locations on an interactive map using OpenStreetMap (free, no API key needed).
 * Falls back to static map tiles if interactions aren't needed.
 * 
 * Engineering considerations:
 * - No external API key required
 * - Lightweight - no heavy mapping library dependency
 * - Uses OpenStreetMap's free tile service
 * - Graceful fallback to static image
 */
const MapView = ({ locations = [], destination, center, className = '' }) => {
  const toast = useToast();

  // Default center if none provided
  const defaultCenter = { lat: 20, lng: 0 };
  const mapCenter = center || defaultCenter;

  const openInGoogleMaps = () => {
    if (locations.length > 0) {
      const coords = locations.map(l => `${l.lat},${l.lng}`).join('/');
      window.open(`https://www.google.com/maps/dir/${coords}`, '_blank');
    } else if (destination) {
      window.open(`https://www.google.com/maps/search/${encodeURIComponent(destination)}`, '_blank');
    }
  };

  // Generate OpenStreetMap embed URL
  const getOsmEmbedUrl = () => {
    // Filter to only locations with valid coordinates
    const validLocations = locations.filter(l => l.lat && l.lng && l.lat !== 0 && l.lng !== 0);
    const useLocations = validLocations.length > 0 ? validLocations : locations;
    
    // Calculate average center from available locations
    let avgLat = mapCenter.lat;
    let avgLng = mapCenter.lng;
    if (useLocations.length > 0) {
      avgLat = useLocations.reduce((s, l) => s + (l.lat || 0), 0) / useLocations.length;
      avgLng = useLocations.reduce((s, l) => s + (l.lng || 0), 0) / useLocations.length;
    }
    
    const zoom = 12;

    // If locations have valid coords, show directions route
    if (validLocations.length > 1) {
      const coords = validLocations.map(l => `${l.lat},${l.lng}`).join('/');
      return `https://www.openstreetmap.org/directions?engine=graphhopper_car&route=${coords}#map=${zoom}/${avgLat}/${avgLng}`;
    }

    // Fallback: destination search or location list
    if (destination) {
      return `https://www.openstreetmap.org/export/embed.html?bbox=${avgLng - 0.05},${avgLat - 0.05},${avgLng + 0.05},${avgLat + 0.05}&layer=mapnik&marker=${avgLat},${avgLng}`;
    }

    return `https://www.openstreetmap.org/export/embed.html?bbox=${avgLng - 0.05},${avgLat - 0.05},${avgLng + 0.05},${avgLat + 0.05}&layer=mapnik`;
  };

  if (!locations.length && !destination) {
    return (
      <div className={`bg-gray-100 dark:bg-gray-700 rounded-xl p-8 text-center ${className}`}>
        <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-500 dark:text-gray-400 text-sm">No location data available</p>
      </div>
    );
  }

  return (
    <div className={`rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 ${className}`}>
      {/* Map Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-pink-600" />
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {destination || 'Trip Locations'}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          {locations.length > 1 && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {locations.length} stops
            </span>
          )}
          <button
            onClick={openInGoogleMaps}
            className="flex items-center space-x-1 px-3 py-1.5 bg-pink-50 dark:bg-pink-900/20 text-pink-700 dark:text-pink-300 rounded-lg text-xs font-medium hover:bg-pink-100 dark:hover:bg-pink-900/40 transition-colors"
            aria-label="Open in Google Maps"
          >
            <Navigation className="w-3 h-3" />
            <span>Open Maps</span>
            <ExternalLink className="w-3 h-3 ml-1" />
          </button>
        </div>
      </div>

      {/* Map Embed */}
      <div className="relative bg-gray-100 dark:bg-gray-700" style={{ height: '300px' }}>
        <iframe
          title={`Map of ${destination || 'trip locations'}`}
          src={getOsmEmbedUrl()}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="rounded-b-xl"
        />

        {/* Location markers info overlay */}
        {locations.length > 0 && (
          <div className="absolute bottom-3 left-3 right-3">
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
              <div className="flex flex-wrap gap-2">
                {locations.slice(0, 3).map((loc, i) => (
                  <span key={i} className="inline-flex items-center space-x-1 text-xs">
                    <div className={`w-2 h-2 rounded-full ${
                      ['bg-red-500', 'bg-blue-500', 'bg-green-500'][i]
                    }`} />
                    <span className="text-gray-700 dark:text-gray-300 truncate max-w-[120px]">
                      {loc.name || `Stop ${i + 1}`}
                    </span>
                  </span>
                ))}
                {locations.length > 3 && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    +{locations.length - 3} more
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Location List */}
      {locations.length > 0 && (
        <div className="px-4 py-3 bg-white dark:bg-gray-800 space-y-2">
          {locations.map((loc, i) => (
            <a
              key={i}
              href={`https://www.google.com/maps/search/${encodeURIComponent(loc.name || '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-orange-500', 'bg-purple-500'][i % 5]
              }`}>
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {loc.name || `Location ${i + 1}`}
                </p>
                {loc.address && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{loc.address}</p>
                )}
              </div>
              <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-pink-600 transition-colors flex-shrink-0" />
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default MapView;
