import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, Loader2 } from 'lucide-react';
import EventCard from './EventCard'; 
import { eventAPI } from '../lib/api'; // ✅ Using the correct API export

const AnalogDatePicker = () => {
  /* ================= TIMELINE GENERATION ================= */
  // Generates dates from 10 days ago to 60 days ahead
  const timeline = useMemo(() => {
    return Array.from({ length: 70 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - 10 + i);
      // ✅ CRITICAL: Local Date String "YYYY-MM-DD" matches DB processing
      const id = d.toLocaleDateString('en-CA'); 
      return {
        id, // This ID (e.g., "2026-01-19") is what we match against
        dayNum: d.getDate(),
        dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
        monthName: d.toLocaleDateString('en-US', { month: 'short' }),
        isFirst: d.getDate() === 1
      };
    });
  }, []);

  // Default to Today
  const todayId = new Date().toLocaleDateString('en-CA');
  const [selectedDateId, setSelectedDateId] = useState(todayId);
  const [allEvents, setAllEvents] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  const scrollRef = useRef(null);
  const boxWidth = 55; 
  // Categories MUST match your Schema Enum (case-insensitive logic handles the rest)
  const categories = ["All", "Hackathon", "Workshop", "Competition", "Meetup"];

  /* ================= FETCH EVENTS ================= */
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        // ✅ Calling the correct endpoint from your api.js
        const res = await eventAPI.getAllEvents(); 
        console.log("Events Fetched:", res.data.data.length); 
        setAllEvents(res?.data?.data || []);
      } catch (err) { 
        console.error("Fetch failed:", err);
        setAllEvents([]); 
      } finally { 
        setLoading(false); 
      }
    };
    fetchEvents();
  }, []);

  /* ================= SCROLL SYNC ================= */
  useEffect(() => {
    if (scrollRef.current) {
      const todayIndex = timeline.findIndex(t => t.id === todayId);
      if (todayIndex !== -1) {
        scrollRef.current.scrollLeft = todayIndex * boxWidth;
      }
    }
  }, [timeline, todayId]);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const index = Math.round(scrollRef.current.scrollLeft / boxWidth);
    if (timeline[index] && timeline[index].id !== selectedDateId) {
      setSelectedDateId(timeline[index].id);
    }
  };

  /* ================= FILTER LOGIC (THE FIX) ================= */
  const filteredEvents = allEvents.filter(event => {
    // 1. Validate Date Existence
    if (!event.eventStart) return false;

    // 2. Normalize DB Date to Local YYYY-MM-DD (Fixes Timezone Bug)
    const eventDateStr = new Date(event.eventStart).toLocaleDateString('en-CA');
    const matchesDate = eventDateStr === selectedDateId;

    // 3. Normalize Category (Backend: "hackathon" vs UI: "Hackathon")
    const eventType = event.eventType?.toLowerCase() || "";
    const selectedType = activeCategory.toLowerCase();
    const matchesCategory = activeCategory === "All" || eventType === selectedType;
    
    return matchesDate && matchesCategory;
  });

  return (
    <div className="relative w-full flex mb-20 flex-col items-center select-none overflow-x-hidden">
      <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>

      {/* --- SCALE UI --- */}
      <div className="relative w-full max-w-2xl mt-10">
        <div className="absolute inset-y-0 left-0 w-24 z-30 pointer-events-none bg-gradient-to-r from-white to-transparent" />
        <div className="absolute inset-y-0 right-0 w-24 z-30 pointer-events-none bg-gradient-to-l from-white to-transparent" />

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex flex-col items-start overflow-x-auto no-scrollbar scroll-smooth"
          style={{ scrollSnapType: 'x mandatory', paddingLeft: 'calc(50% - 27.5px)', paddingRight: 'calc(50% - 27.5px)' }}
        >
          {/* Numbers Row */}
          <div className="flex items-end h-28">
            {timeline.map((item) => (
              <div key={item.id} style={{ width: `${boxWidth}px`, scrollSnapAlign: 'center' }} className="flex-shrink-0 flex justify-center items-end pb-4 relative">
                {item.isFirst && (
                  <span className="absolute -top-6 text-[10px] font-black text-indigo-500 uppercase tracking-widest">
                    {item.monthName}
                  </span>
                )}
                <div className={`flex flex-col items-center justify-center w-[46px] h-[72px] rounded-2xl transition-all duration-500
                  ${selectedDateId === item.id ? 'bg-slate-900 text-white shadow-xl scale-110' : 'bg-white text-slate-300 border border-slate-100'}`}>
                  <span className="text-[7px] font-black uppercase mb-1 opacity-60">{item.dayName}</span>
                  <span className="text-xl font-bold">{item.dayNum}</span>
                </div>
              </div>
            ))}
          </div>
          {/* Ticks Row */}
          <div className="flex h-10 border-t border-slate-100 pt-2">
            {timeline.map((item) => (
              <div key={item.id} className="flex justify-center" style={{ width: `${boxWidth}px` }}>
                <div className={`w-[2px] h-5 rounded-full transition-all ${selectedDateId === item.id ? 'bg-slate-900' : 'bg-slate-200'}`} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- FILTER BUTTONS --- */}
      <div className="w-full max-w-4xl px-6 mt-8 flex items-center justify-between">
        <div className="flex gap-3 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap
                ${activeCategory === cat 
                  ? 'bg-slate-900 text-white shadow-lg' 
                  : 'bg-white text-slate-400 border border-slate-100 hover:border-slate-300'}`}
            >
              {cat}
            </button>
          ))}
        </div>
        <SlidersHorizontal size={18} className="text-slate-400 ml-4" />
      </div>

      {/* --- EVENTS GRID --- */}
      <div className="w-full max-w-6xl px-6 mt-12 pb-32">
        {loading ? (
           <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
             <Loader2 className="animate-spin text-indigo-500" />
             <span className="text-[10px] font-black tracking-widest">LOADING EVENTS...</span>
           </div>
        ) : filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredEvents.map(event => (
                <motion.div
                  key={event._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  layout
                >
                  {/* ✅ Pass ALL properties directly */}
                  <EventCard {...event} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="w-full py-32 text-center border-2 border-dashed border-slate-100 rounded-[3rem]">
            <p className="text-slate-300 font-bold uppercase text-[10px] tracking-widest">
              No {activeCategory !== "All" ? activeCategory : ""} Events on {new Date(selectedDateId).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalogDatePicker;
