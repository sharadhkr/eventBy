import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, ChevronRight } from "lucide-react"; // Install lucide-react
import api from "../lib/api";

export default function TopEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/users/home/details");
        setEvents(res.data.data.topEvents || []);
      } catch (err) {
        console.error("Failed to load top events", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleNext = () => setIndex((prev) => (prev + 1) % events.length);
  const handleDragEnd = (e, info) => {
    if (info.offset.x < -50) handleNext();
    else if (info.offset.x > 50) setIndex((prev) => (prev - 1 + events.length) % events.length);
  };

  if (loading || events.length === 0) return null;

  const getCard = (offset) => {
    const i = (index + offset + events.length) % events.length;
    return { ...events[i], offset };
  };

  const visibleCards = [getCard(-1), getCard(1), getCard(0)];

  return (
    <section className=" max-w-7xl mx-auto overflow-hidden">
      <div className="flex items-center justify-between px-6 mb-4">
        <div>
          <h2 className="text-[15px] font-bold text-slate-400 uppercase tracking-[0.2em]">Top Events</h2>
          <p className="text-xs font-bold text-purple-400 uppercase tracking-widest">Trending Now</p>
        </div>
        <div className="flex gap-1">
            {events.map((_, i) => (
                <div key={i} className={`h-1 w-4 rounded-full transition-all ${index === i ? 'bg-purple-600' : 'bg-slate-200'}`} />
            ))}
        </div>
      </div>
      
      <div className="relative h-[230px] w-full flex justify-center touch-none">
        <AnimatePresence initial={false}>
          {visibleCards.map(({ event, position, offset }) => {
            const isCenter = offset === 0;
            return (
              <motion.div
                key={event._id}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={handleDragEnd}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{
                  x: offset * (window.innerWidth < 640 ? 160 : 280), // Responsive spacing
                  scale: isCenter ? 1 : 0.8,
                  zIndex: isCenter ? 30 : 10,
                  opacity: isCenter ? 1 : 0.6,
                  rotateY: offset * 15, // 3D effect
                  filter: isCenter ? "blur(0px)" : "blur(2px)",
                }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                onClick={isCenter ? undefined : handleNext}
                className={`absolute w-[200px] sm:w-[320px] aspect-[4/4] cursor-grab active:cursor-grabbing bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden border border-white/20`}
              >
                {/* Banner with Rank Overlay */}
                <div className="relative h-full w-full">
                  <img src={event.banner} alt="" className="h-full w-full object-cover" />
                  
                  {/* Premium Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  
                  {/* Rank Badge */}
                  <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md border border-white/30 text-white px-3 py-1.5 rounded-2xl flex items-center gap-2">
                    <Trophy size={14} className="text-yellow-400" />
                    <span className="text-[10px] font-black uppercase">Rank #{position}</span>
                  </div>

                  {/* Content Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <p className="text-[10px] font-bold text-purple-400 uppercase tracking-widest mb-1">
                      {event.organiser.organisationName}
                    </p>
                    <h3 className="text-xl font-bold leading-tight mb-3 line-clamp-2">
                      {event.title}
                    </h3>
                    
                    <div className="flex items-center justify-between">
                      <div className="bg-white/10 backdrop-blur-lg px-4 py-2 rounded-xl border border-white/10">
                        <p className="text-[10px] uppercase opacity-60 font-bold">Entry</p>
                        <p className="text-sm font-black">
                           {event.isPaid ? `₹${event.price}` : "FREE"}
                        </p>
                      </div>
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-white text-black p-3 rounded-xl shadow-lg"
                      >
                        <ChevronRight size={20} />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </section>
  );
}
