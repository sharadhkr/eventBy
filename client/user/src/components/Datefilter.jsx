import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import EventCard from './EventCard'; 
import userAPI from '../lib/api'; 
import { toast } from 'react-hot-toast';

const AnalogDatePicker = () => {
  // 1. STATE & REFS
  const today = new Date().getDate();
  const [selectedDate, setSelectedDate] = useState(today);
  const [allEvents, setAllEvents] = useState([]); 
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  const boxWidth = 55;
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  // 2. FETCH EVENTS FROM BACKEND
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        // Hits your public event controller
        const res = await userAPI.get('/auth/events'); 
        
        // res.data.data is the array from your controller [success: true, data: [...]]
        const eventArray = res?.data?.data || []; 
        setAllEvents(eventArray);
      } catch (err) {
        console.error("Fetch Error:", err.response?.data?.message || err.message);
        setAllEvents([]); 
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // 3. INITIAL SCROLL POSITION
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = (today - 1) * boxWidth;
    }
  }, [today]);

  // 4. HANDLE SCROLLING THE DATE BAR
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const index = Math.round(scrollRef.current.scrollLeft / boxWidth);
    const newDate = index + 1;
    if (newDate !== selectedDate && newDate >= 1 && newDate <= 31) {
      setSelectedDate(newDate);
    }
  };

  // 5. FILTERING LOGIC (Matches your MongoDB Schema)
  const filteredEvents = (allEvents || []).filter(event => {
    if (!event?.eventDate) return false; 
    
    // We use UTC date to ensure Jan 30 stays Jan 30 regardless of timezone
    const d = new Date(event.eventDate);
    const eventDay = d.getUTCDate(); 
    
    return eventDay === selectedDate;
  });

  return (
    <div className="relative w-full flex mb-20 flex-col items-center select-none font-sans bg-white overflow-x-hidden">
      
      {/* Mesh Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-100/40 blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-100/40 blur-[100px]" />
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* --- DATE PICKER UI --- */}
      <div className="relative w-full max-w-2xl mt-4">
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
            {days.map((day) => (
              <div
                key={day}
                style={{ width: `${boxWidth}px`, scrollSnapAlign: 'center' }}
                className="flex-shrink-0 flex justify-center items-end pb-4"
              >
                <div className={`flex flex-col items-center justify-center w-[46px] h-[72px] rounded-xl transition-all duration-500
                  ${selectedDate === day ? 'bg-slate-900 text-white shadow-2xl scale-110' : 'bg-white/60 text-slate-300 scale-90 border border-slate-100'}`}>
                  <span className="text-[7px] font-bold uppercase tracking-widest mb-1 opacity-60">Day</span>
                  <span className="text-xl font-bold">{day}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Row 2: Ticks */}
          <div className="flex h-12 border-t border-slate-100/80 pt-0">
            {days.map((day) => (
              <div key={day} className="flex" style={{ width: `${boxWidth}px` }}>
                <div className="flex flex-col items-center w-full relative">
                  <div className={`w-[2px] h-6 rounded-full transition-all duration-300 
                    ${selectedDate === day ? 'bg-slate-900' : 'bg-slate-400'}`} />
                  <div className="absolute top-0 left-full -translate-x-1/2 flex gap-[8.5px] pointer-events-none">
                    {day < 31 && [1, 2, 3, 4].map((t) => (
                      <div key={t} className="w-[1px] h-3 bg-slate-300" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- EVENTS LIST UI --- */}
      <div className="w-full max-w-5xl px-4 mt-12 pb-24">
        <h2 className="text-xl font-black text-slate-800 mb-8 px-1 italic">
          Events on {selectedDate} Jan
        </h2>

        {loading ? (
          <div className="w-full py-20 text-center">
            <p className="animate-pulse text-slate-400 font-medium">Scanning database...</p>
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-16">
            <AnimatePresence mode="popLayout">
              {filteredEvents.map(event => (
                <EventCard
                  key={event._id}
                  id={event._id}
                  image={event.banner === "placehold.co" ? "placehold.co" : event.banner}
                  title={event.title}
                  price={event.ticketPrice === 0 ? "Free" : event.ticketPrice}
                  date={new Date(event.eventDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                  location={event.location?.address || "Location TBD"}
                  mode={event.mode}
                />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="w-full py-20 text-center bg-gray-50/50 rounded-[3rem] border border-dashed border-slate-200 backdrop-blur-sm">
            <p className="text-slate-400 font-medium">No events scheduled for Day {selectedDate}.</p>
            {selectedDate !== 30 && (
              <p className="text-[10px] text-slate-300 mt-2">Try scrolling to Day 30 to see your test event!</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalogDatePicker;
