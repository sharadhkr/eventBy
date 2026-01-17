import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Zap, Ticket, Laptop, Crosshair, Loader2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { eventAPI } from '../lib/api'; // Ensure this points to your api.js
import { toast } from 'react-hot-toast';

// 1. Premium Custom Marker Styling
const customMarkerIcon = (color) => L.divIcon({
  html: `<div style="background-color: ${color};" class="w-10 h-10 rounded-2xl border-4 border-white shadow-2xl flex items-center justify-center transition-transform hover:scale-110">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
         </div>`,
  className: '',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

// 2. Map Helper: Recenter to User
function RecenterButton({ coords }) {
  const map = useMap();
  return (
    <button 
      onClick={() => map.flyTo(coords, 12)}
      className="absolute bottom-10 right-10 z-[1000] p-4 bg-white rounded-3xl shadow-2xl hover:bg-slate-50 text-indigo-600 transition-all border border-slate-100"
    >
      <Crosshair size={24} />
    </button>
  );
}

export default function EventMapPage() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]); // Default empty array
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  
  // Default center (e.g., Mumbai) - will update if user allows location
  const [center, setCenter] = useState([19.0760, 72.8777]);

  // Fetch Events from API
  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        const res = await eventAPI.getAllEvents();
        
        // Safety check: access the nested data array from your api.js structure
        const eventData = res.data?.data || [];
        setEvents(eventData);
      } catch (err) {
        console.error("Failed to fetch events for map:", err);
        toast.error("Could not load event locations");
      } finally {
        setLoading(false);
      }
    };

    loadEvents();

    // Get real user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCenter([pos.coords.latitude, pos.coords.longitude]),
        () => console.log("Location access denied")
      );
    }
  }, []);

  // Filter Logic with Safety Check
  const filteredEvents = useMemo(() => {
    if (!Array.isArray(events)) return [];
    
    return events.filter(e => {
      if (filter === 'free') return e.price === 0;
      if (filter === 'paid') return e.price > 0;
      if (filter === 'tech') return e.category?.toLowerCase() === 'tech';
      return true;
    });
  }, [events, filter]);

  return (
    <div className="relative h-screen w-full bg-[#f8fafc] overflow-hidden font-sans">
      
      {/* 3. PREMIUM FLOATING FILTER DOCK */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-[1000] w-[90%] max-w-2xl">
        <div className="bg-white/80 backdrop-blur-2xl border border-white/40 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[2.5rem] p-2 flex items-center gap-1">
          {[
            { id: 'all', label: 'All', icon: null },
            { id: 'free', label: 'Free', icon: <Zap size={14} />, color: 'emerald' },
            { id: 'paid', label: 'Paid', icon: <Ticket size={14} />, color: 'indigo' },
            { id: 'tech', label: 'Tech', icon: <Laptop size={14} />, color: 'blue' }
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setFilter(btn.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-[2rem] text-[11px] font-black uppercase tracking-widest transition-all ${
                filter === btn.id 
                ? 'bg-slate-900 text-white shadow-xl scale-105' 
                : 'text-slate-500 hover:bg-white/50'
              }`}
            >
              {btn.icon} {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. LOADING OVERLAY */}
      {loading && (
        <div className="absolute inset-0 z-[1001] bg-white/60 backdrop-blur-md flex flex-col items-center justify-center">
          <Loader2 className="animate-spin text-indigo-600 mb-4" size={40} />
          <p className="font-black text-slate-800 uppercase tracking-widest text-xs">Mapping Events...</p>
        </div>
      )}

      {/* 5. THE MAP */}
      <MapContainer 
        center={center} 
        zoom={11} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; CARTO'
        />

        {/* User Marker */}
        <Marker position={center} icon={L.divIcon({ html: `<div class="w-5 h-5 bg-blue-500 rounded-full border-4 border-white shadow-2xl animate-pulse"></div>`, className: '' })} />

        {/* Event Markers with Safety Check for Coordinates */}
        {filteredEvents.map((event) => {
          const lat = event.location?.coordinates?.lat;
          const lng = event.location?.coordinates?.lng;

          if (!lat || !lng) return null; // Skip events without locations

          return (
            <Marker 
              key={event._id}
              position={[lat, lng]}
              icon={customMarkerIcon(event.price > 0 ? '#4f46e5' : '#10b981')}
            >
              <Popup className="premium-popup">
                <div className="p-1 w-64">
                  <div className="h-32 rounded-2xl overflow-hidden mb-3">
                    <img src={event.banner || event.image} className="w-full h-full object-cover" alt="" />
                  </div>
                  <h3 className="font-black text-slate-800 text-base leading-tight mb-1">{event.title}</h3>
                  <p className="text-slate-400 text-[10px] font-bold uppercase mb-4">{event.location?.address || 'Venue TBD'}</p>
                  
                  <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                    <span className="text-sm font-black text-slate-900">
                      {event.price === 0 ? 'FREE' : `₹${event.price}`}
                    </span>
                    <button 
                      onClick={() => navigate(`/events/${event._id}`)}
                      className="flex items-center gap-2 bg-slate-900 text-white text-[10px] px-4 py-2 rounded-xl font-black transition-transform hover:scale-105 active:scale-95"
                    >
                      VIEW DETAILS <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        <RecenterButton coords={center} />
      </MapContainer>

      {/* 6. STYLE INJECTIONS */}
      <style>{`
        .leaflet-popup-content-wrapper { 
          border-radius: 32px !important; 
          padding: 8px !important; 
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
          border: 1px solid rgba(255,255,255,0.3);
        }
        .leaflet-popup-tip-container { display: none; }
        .leaflet-container { font-family: 'Inter', sans-serif !important; }
        .premium-popup .leaflet-popup-content { margin: 8px !important; width: auto !important; }
      `}</style>
    </div>
  );
}3




