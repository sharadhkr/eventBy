import React, { useState } from "react";
import { MapPin, Calendar, Bookmark, Sparkles, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { userAPI } from "../lib/api";
import { useAuth } from "../context/auth.context";

const EventCard = (props) => {
  const { user, refreshUser } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  
  const { _id, id, title, banner, price, eventStart, mode, location } = props;
  const eventId = _id || id;
  const isSaved = user?.savedEvents?.some(e => (e._id || e) === eventId);

  /* ================= CREATIVE TOGGLE SAVE ================= */
  const handleToggleSave = async (e) => {
    e.stopPropagation();
    if (!user) return toast.error("Please login to bookmark");

    try {
      setIsSaving(true);
      await userAPI.toggleSaveEvent(eventId);
      await refreshUser(); // Update global context
      
      if (!isSaved) {
        toast.success("Added to your collection!", {
          icon: '✨',
          style: { borderRadius: '15px', background: '#1e293b', color: '#fff' }
        });
      }
    } catch (err) {
      toast.error("Network hiccup. Try again?");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div 
      layout
      className="group relative bg-white border border-slate-100 rounded-[2.8rem] p-4 shadow-xl hover:shadow-2xl transition-all duration-500"
    >
      {/* IMAGE SECTION */}
      <div className="relative h-56 rounded-[2.2rem] overflow-hidden">
        <img src={banner} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={title} />
        
        {/* 🔥 CREATIVE SAVE BUTTON (FLOATING) */}
        <div className="absolute top-4 left-4 z-20">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleToggleSave}
            className={`relative flex items-center justify-center w-12 h-12 rounded-2xl backdrop-blur-xl transition-all duration-300 ${
              isSaved 
                ? "bg-indigo-500 text-white shadow-lg shadow-indigo-200" 
                : "bg-white/20 hover:bg-white/40 text-white border border-white/30"
            }`}
          >
            <AnimatePresence mode="wait">
              {isSaving ? (
                <motion.div
                  key="loader"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                >
                  <Loader2 size={20} className="animate-spin" />
                </motion.div>
              ) : (
                <motion.div
                  key="icon"
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                  <Bookmark size={20} fill={isSaved ? "white" : "none"} strokeWidth={2.5} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Sparkle burst animation when saved */}
            {isSaved && !isSaving && (
              <motion.div 
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1.5 }}
                className="absolute -top-1 -right-1 text-yellow-300 pointer-events-none"
              >
                <Sparkles size={16} fill="currentColor" />
              </motion.div>
            )}
          </motion.button>
        </div>

        {/* Price & Mode Badges */}
        <div className="absolute bottom-4 right-4 flex gap-2">
          <div className="bg-slate-900/80 backdrop-blur text-white px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-tighter">
            {price === 0 ? "Free Access" : `₹${price}`}
          </div>
        </div>
      </div>

      {/* CONTENT SECTION */}
      <div className="mt-6 px-2 pb-2">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-black text-slate-800 leading-tight line-clamp-1 flex-1">
            {title}
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center gap-2.5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            <div className="p-2 bg-indigo-50 rounded-xl text-indigo-500">
               <Calendar size={14} />
            </div>
            {new Date(eventStart).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
          </div>

          <div className="flex items-center gap-2.5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            <div className="p-2 bg-rose-50 rounded-xl text-rose-500">
               <MapPin size={14} />
            </div>
            <span className="truncate">{location?.city || "Remote"}</span>
          </div>
        </div>

        <motion.button
          className="w-full group/btn drop-shadow-xl flex items-center justify-between bg-indigo-500 hover:bg-indigo-600 text-white p-4 rounded-[1.5rem] transition-all duration-300"
        >
          <span className="pl-6 text-[10px] font-black uppercase tracking-[0.3em]">Grab Spot</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default EventCard;
