import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import EventCard from './EventCard'; 
import userAPI from '../lib/api'; 
import { SlidersHorizontal, LayoutGrid, Cpu, Rocket, Users, Coffee } from 'lucide-react';

const AnalogDatePicker = () => {
  // 1. GENERATE TIMELINE (10 Days Past to 60 Days Future)
  const timeline = useMemo(() => {
    return Array.from({ length: 70 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - 10 + i); // Start 10 days ago
      return {
        id: d.toISOString().split('T')[0],
        dayNum: d.getDate(),
        dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
        monthName: d.toLocaleDateString('en-US', { month: 'short' }),
        isFirst: d.getDate() === 1
      };
    });
  }, []);

  // Set today as initial selection
  const todayId = new Date().toISOString().split('T')[0];
  const [selectedDateId, setSelectedDateId] = useState(todayId);
  const [allEvents, setAllEvents] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  const scrollRef = useRef(null);
  const boxWidth = 55; // EXACT original width

  const categories = ["All", "Hackathon", "Tech", "Workshop", "Social"];

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const res = await userAPI.get('/users/events'); 
        setAllEvents(res?.data?.data || []);
      } catch (err) { setAllEvents([]); } finally { setLoading(false); }
    };
    fetchEvents();
  }, []);

  // Initial Scroll to Today
  useEffect(() => {
    if (scrollRef.current) {
      const todayIndex = timeline.findIndex(t => t.id === todayId);
      scrollRef.current.scrollLeft = todayIndex * boxWidth;
    }
  }, [timeline, todayId]);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const index = Math.round(scrollRef.current.scrollLeft / boxWidth);
    if (timeline[index] && timeline[index].id !== selectedDateId) {
      setSelectedDateId(timeline[index].id);
    }
  };

  const filteredEvents = allEvents.filter(event => {
    const eventDate = new Date(event.eventDate).toISOString().split('T')[0];
    const matchesDate = eventDate === selectedDateId;
    const matchesCategory = activeCategory === "All" || event.mode === activeCategory;
    return matchesDate && matchesCategory;
  });

  return (
    <div className="relative w-full flex mb-20 flex-col items-center select-none font-sans overflow-x-hidden">
      
      {/* Mesh Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-5%] left-[-5%] w-[40%] h-[40%] rounded-full bg-purple-50/50 blur-[80px]" />
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* --- DATE PICKER UI (ORIGINAL SCALE DESIGN) --- */}
      <div className="relative w-full max-w-2xl">
        <div className="absolute inset-y-0 left-0 w-1/6 z-30 pointer-events-none bg-gradient-to-r from-white via-white/80 to-transparent" />
        <div className="absolute inset-y-0 right-0 w-1/6 z-30 pointer-events-none bg-gradient-to-l from-white via-white/80 to-transparent" />

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
          {/* Row 1: Numbers */}
          <div className="flex items-end h-28">
            {timeline.map((item) => (
              <div key={item.id} style={{ width: `${boxWidth}px`, scrollSnapAlign: 'center' }} className="flex-shrink-0 flex justify-center items-end pb-4 relative">
                
                {item.isFirst && (
                  <span className="absolute -top-6 text-[8px] font-black text-purple-400 uppercase tracking-tighter">
                    {item.monthName}
                  </span>
                )}

                <div className={`flex flex-col items-center justify-center w-[46px] h-[72px] rounded-xl transition-all duration-500
                  ${selectedDateId === item.id ? 'bg-slate-900 text-white shadow-2xl scale-110' : 'bg-white/60 text-slate-300 scale-90 border border-slate-100'}`}>
                  
                  {/* Day Name above Date */}
                  <span className="text-[6px] font-black uppercase tracking-widest mb-0.5 opacity-50">
                    {item.dayName}
                  </span>
                  
                  <span className="text-xl font-bold">{item.dayNum}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Row 2: Ticks (ORIGINAL DESIGN) */}
          <div className="flex h-12 border-t border-slate-100/80 pt-0">
            {timeline.map((item) => (
              <div key={item.id} className="flex" style={{ width: `${boxWidth}px` }}>
                <div className="flex flex-col items-center w-full relative">
                  <div className={`w-[2px] h-6 rounded-full transition-all duration-300 
                    ${selectedDateId === item.id ? 'bg-slate-900' : 'bg-slate-400'}`} />
                  <div className="absolute top-0 left-full -translate-x-1/2 flex gap-[8.5px] pointer-events-none">
                    {[1, 2, 3, 4].map((t) => (
                      <div key={t} className="w-[1px] h-3 bg-slate-200" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- LIGHT MINIMAL FILTER UI --- */}
      <div className="w-full max-w-4xl px-6 mt-4 flex items-center justify-between">
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-[15px] font-bold tracking-tight transition-all
                ${activeCategory === cat 
                  ? 'bg-purple-50 text-purple-600 ring-1 ring-purple-100 shadow-sm' 
                  : 'bg-white text-slate-400 hover:text-slate-600'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        <button className="ml-4 p-2 text-slate-300 hover:text-purple-400 transition-colors">
          <SlidersHorizontal size={16} strokeWidth={2.5} />
        </button>
      </div>

      {/* --- EVENTS LIST --- */}
      <div className="w-full max-w-5xl px-4 mt-6 drop-shadow-xl pb-24">
        {loading ? (
           <div className="w-full py-20 text-center text-slate-300 text-[10px] font-bold tracking-widest uppercase">Fetching Events...</div>
        ) : filteredEvents.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-16">
            <AnimatePresence mode="popLayout">
              {filteredEvents.map(event => (
                <EventCard
                  key={event._id}
                  id={event._id}
                  image={event.banner}
                  title={event.title}
                  price={event.ticketPrice === 0 ? "Free" : `₹${event.ticketPrice}`}
                  date={new Date(event.eventDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                  location={event.location?.address || "TBD"}
                  mode={event.mode}
                />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="w-full py-20 text-center bg-slate-50/40 rounded-[2.5rem] border border-dashed border-slate-100">
            <p className="text-slate-300 text-xs font-medium">No events for this date.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalogDatePicker;
