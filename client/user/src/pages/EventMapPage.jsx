import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Zap, Ticket, Laptop, Crosshair, Loader2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { eventAPI } from '../lib/api'; 
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
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [center, setCenter] = useState([26.2317, 78.1627]); // Default to Gwalior (from your DB record)

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        const res = await eventAPI.getAllEvents();
        setEvents(res.data?.data || []);
      } catch (err) {
        toast.error("Could not load event locations");
      } finally {
        setLoading(false);
      }
    };
    loadEvents();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCenter([pos.coords.latitude, pos.coords.longitude]),
        () => console.log("Location access denied")
      );
    }
  }, []);

  const filteredEvents = useMemo(() => {
    // Only show offline events on a map
    const offlineEvents = events.filter(e => e.mode === 'offline');
    
    return offlineEvents.filter(e => {
      if (filter === 'free') return e.price === 0;
      if (filter === 'paid') return e.price > 0;
      if (filter === 'tech') return e.eventType === 'hackathon';
      return true;
    });
  }, [events, filter]);

  return (
    <div className="relative h-screen w-full bg-[#f8fafc] overflow-hidden">
      
      {/* FILTER DOCK */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-[1000] w-[90%] max-w-2xl">
        <div className="bg-white/90 backdrop-blur-xl border border-slate-100 shadow-2xl rounded-[2.5rem] p-2 flex items-center gap-1">
          {[
            { id: 'all', label: 'All', icon: null },
            { id: 'free', label: 'Free', icon: <Zap size={14} /> },
            { id: 'paid', label: 'Paid', icon: <Ticket size={14} /> },
            { id: 'tech', label: 'Hackathons', icon: <Laptop size={14} /> }
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setFilter(btn.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-[2rem] text-[10px] font-black uppercase tracking-widest transition-all ${
                filter === btn.id ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:bg-slate-50'
              }`}
            >
              {btn.icon} {btn.label}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="absolute inset-0 z-[1001] bg-white/60 backdrop-blur-md flex items-center justify-center">
          <Loader2 className="animate-spin text-indigo-600" size={40} />
        </div>
      )}

      <MapContainer center={center} zoom={12} style={{ height: '100%', width: '100%' }} zoomControl={false}>
        <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />

        {filteredEvents.map((event) => {
          // ✅ FIX: Access path matches your MongoDB Schema [lng, lat]
          const coords = event.geoLocation?.coordinates;
          if (!coords || coords.length < 2) return null;

          // ✅ FIX: Leaflet needs [lat, lng], but MongoDB stores [lng, lat]
          const position = [coords[1], coords[0]];

          return (
            <Marker 
              key={event._id} 
              position={position} 
              icon={customMarkerIcon(event.price > 0 ? '#4f46e5' : '#10b981')}
            >
              <Popup>
                <div className="p-1 w-64 font-sans">
                  <img src={event.banner} className="w-full h-32 object-cover rounded-2xl mb-3" alt="" />
                  <h3 className="font-black text-slate-800 text-sm mb-1">{event.title}</h3>
                  <p className="text-slate-400 text-[10px] font-bold uppercase mb-3">
                    <MapPin size={10} className="inline mr-1"/> {event.location?.address}
                  </p>
                  <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                    <span className="text-xs font-black">₹{event.price || '0'}</span>
                    <button 
                      onClick={() => navigate(`/events/${event._id}`)}
                      className="bg-slate-900 text-white text-[9px] px-4 py-2 rounded-xl font-black"
                    >
                      VIEW EVENT
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
        <RecenterButton coords={center} />
      </MapContainer>

      <style>{`
        .leaflet-popup-content-wrapper { border-radius: 28px !important; padding: 4px !important; }
        .leaflet-popup-tip-container { display: none; }
      `}</style>
    </div>
  );
}
