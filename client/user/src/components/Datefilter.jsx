import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, Loader2 } from 'lucide-react';
import EventCard from './EventCard'; 
import { eventAPI } from '../lib/api';

const AnalogDatePicker = () => {
  const boxWidth = 55; // Exact width of one date segment
  
  /* ================= TIMELINE GENERATION ================= */
  const timeline = useMemo(() => {
    return Array.from({ length: 70 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - 10 + i);
      const id = d.toLocaleDateString('en-CA'); 
      return {
        id,
        dayNum: d.getDate(),
        dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
        monthName: d.toLocaleDateString('en-US', { month: 'short' }),
        isFirst: d.getDate() === 1
      };
    });
  }, []);

  const todayId = new Date().toLocaleDateString('en-CA');
  const [selectedDateId, setSelectedDateId] = useState(todayId);
  const [allEvents, setAllEvents] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  const scrollRef = useRef(null);
  const categories = ["All", "Hackathon", "Workshop", "Competition", "Meetup"];

  /* ================= FETCH EVENTS ================= */
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const res = await eventAPI.getAllEvents(); 
        setAllEvents(res?.data?.data || []);
      } catch (err) { 
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

  /* ================= FILTER LOGIC ================= */
  const filteredEvents = allEvents.filter(event => {
    if (!event.eventStart) return false;
    const eventDateStr = new Date(event.eventStart).toLocaleDateString('en-CA');
    const matchesDate = eventDateStr === selectedDateId;
    const matchesCategory = activeCategory === "All" || 
                           event.eventType?.toLowerCase() === activeCategory.toLowerCase();
    return matchesDate && matchesCategory;
  });

  return (
    <div className="relative w-full flex mb-20 flex-col items-center select-none overflow-x-hidden">
      <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>

      {/* --- ANALOG SCALE UI --- */}
      <div className="relative w-full max-w-2xl">
        {/* Gradient Fades */}
        <div className="absolute inset-y-0 left-0 w-20 z-30 pointer-events-none bg-gradient-to-r from-[#f8fafc] to-transparent" />
        <div className="absolute inset-y-0 right-0 w-20 z-30 pointer-events-none bg-gradient-to-l from-[#f8fafc] to-transparent" />

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex flex-col items-start overflow-x-auto no-scrollbar scroll-smooth"
          style={{ 
            scrollSnapType: 'x mandatory', 
            paddingLeft: 'calc(50% - 27.5px)', 
            paddingRight: 'calc(50% - 27.5px)' 
          }}
        >
          {/* Row 1: Date Boxes */}
          <div className="flex items-end h-24">
            {timeline.map((item) => (
              <div 
                key={item.id} 
                style={{ width: `${boxWidth}px`, scrollSnapAlign: 'center' }} 
                className="flex-shrink-0 flex justify-center items-end pb-2 relative"
              >
                {item.isFirst && (
                  <span className="absolute -top-4 text-[9px] font-black text-indigo-500 uppercase tracking-widest">
                    {item.monthName}
                  </span>
                )}
                <div className={`flex flex-col items-center justify-center w-[44px] h-[64px] rounded-2xl transition-all duration-500
                  ${selectedDateId === item.id ? 'bg-slate-900 text-white shadow-xl scale-110' : 'bg-white text-slate-300 border border-slate-100'}`}>
                  <span className="text-[7px] font-black uppercase mb-0.5 opacity-60">{item.dayName}</span>
                  <span className="text-lg font-black">{item.dayNum}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Row 2: Analog Needles (The Ticks) */}
          <div className="flex h-10 border-t border-slate-200/60 pt-0">
            {timeline.map((item) => (
              <div 
                key={item.id} 
                className="flex relative" 
                style={{ width: `${boxWidth}px` }}
              >
                <div className="flex flex-col items-center w-full relative">
                  {/* Primary Long Needle */}
                  <div className={`w-[2px] h-5 rounded-full transition-all duration-300 
                    ${selectedDateId === item.id ? 'bg-slate-900 h-6' : 'bg-slate-300'}`} 
                  />
                  
                  {/* Small Sub-Needles (4 ticks between primary ones) */}
                  <div className="absolute top-0 left-1/2 w-full flex justify-evenly items-start pointer-events-none px-[1px]">
                    {[1, 2, 3, 4].map((sub) => (
                      <div 
                        key={sub} 
                        className="w-[1px] h-2.5 bg-slate-200 rounded-full mt-[2px]" 
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- FILTERS --- */}
      <div className="w-full max-w-4xl px-6 mt-6 flex items-center justify-between">
        <div className="flex gap-2.5 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-[11px] font-black tracking-widest uppercase transition-all
                ${activeCategory === cat 
                  ? 'bg-slate-900 text-white shadow-lg' 
                  : 'bg-white text-slate-400 border border-slate-100'}`}
            >
              {cat}
            </button>
          ))}
        </div>
        <SlidersHorizontal size={18} className="text-slate-400 ml-4 shrink-0" />
      </div>

      {/* --- EVENTS GRID (FIXED FOR MOBILE: 2 CARDS PER ROW) --- */}
      <div className="w-full max-w-7xl px-4 mt-10 pb-32">
        {loading ? (
           <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
             <Loader2 className="animate-spin text-indigo-500" size={32} />
             <span className="text-[10px] font-black tracking-[0.3em] uppercase">Syncing Events</span>
           </div>
        ) : filteredEvents.length > 0 ? (
          /* 🔥 grid-cols-2 on mobile, grid-cols-3 on large screens */
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8">
            <AnimatePresence mode="popLayout">
              {filteredEvents.map(event => (
                <motion.div
                  key={event._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  layout
                >
                  <EventCard {...event} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="w-full py-24 text-center border-2 border-dashed border-slate-100 rounded-[3rem]">
            <p className="text-slate-300 font-black uppercase text-[10px] tracking-widest">
              No Events on {new Date(selectedDateId).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalogDatePicker;
