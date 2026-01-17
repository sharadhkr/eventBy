import React, { useState } from "react";
import { MapPin, Calendar, Bookmark, Sparkles, Loader2, Users, ArrowUpRight, CheckCircle2, Trophy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { userAPI } from "../lib/api";
import { useAuth } from "../context/auth.context";

const EventCard = (props) => {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  
  // Destructure all relevant fields from your DB Schema
  const { 
    _id, id, title, banner, price, eventStart, mode, 
    location, eventType, participationType, maxParticipants, participantsCount 
  } = props;
  
  const eventId = _id || id;

  // 1. Logic for Status
  const isSaved = user?.savedEvents?.some(e => (e._id || e) === eventId);
  const hasJoined = user?.joinedEvents?.some(e => (e._id || e) === eventId);
  const isFull = participantsCount >= maxParticipants;

  const handleToggleSave = async (e) => {
    e.stopPropagation();
    if (!user) return toast.error("Please login to bookmark");
    try {
      setIsSaving(true);
      await userAPI.toggleSaveEvent(eventId);
      await refreshUser();
      if (!isSaved) toast.success("Saved to collection! ✨");
    } catch (err) {
      toast.error("Failed to update bookmark");
    } finally {
      setIsSaving(false);
    }
  };

  const handleJoinClick = (e) => {
  e.stopPropagation();
  
  // ✅ FIX: Use the correct ID variable
  const idToUse = _id || id || props._id; 
  
  if (!idToUse) {
    return toast.error("Event ID is missing!");
  }
  
  console.log("Navigating to:", idToUse);
  navigate(`/events/${idToUse}`);
};

  return (
    <motion.div 
      layout
      whileHover={{ y: -10 }}
      className="group relative bg-white border border-slate-100 rounded-[2.8rem] p-4 shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer"
      onClick={() => navigate(`/events/${eventId}`)}
    >
      {/* IMAGE SECTION */}
      <div className="relative h-56 rounded-[2.2rem] overflow-hidden">
        <img src={banner} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={title} />
        
        {/* TOP OVERLAYS */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-20">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleToggleSave}
            className={`flex items-center justify-center w-11 h-11 rounded-2xl backdrop-blur-md transition-all ${
              isSaved ? "bg-indigo-500 text-white shadow-lg" : "bg-white/20 text-white border border-white/30"
            }`}
          >
            {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Bookmark size={18} fill={isSaved ? "white" : "none"} />}
          </motion.button>

          <div className="bg-white/20 backdrop-blur-md border border-white/30 text-white px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest">
            {eventType}
          </div>
        </div>

        {/* BOTTOM OVERLAYS */}
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
          <div className="flex flex-col gap-1">
             <div className="bg-slate-900/90 text-white px-3 py-1 rounded-lg text-[10px] font-bold w-fit">
                {price === 0 ? "FREE" : `₹${price}`}
             </div>
             {hasJoined && (
               <div className="bg-emerald-500/90 text-white px-3 py-1 rounded-lg text-[9px] font-black flex items-center gap-1">
                 <CheckCircle2 size={10} /> JOINED
               </div>
             )}
          </div>
          <div className="bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-slate-900 text-[10px] font-black shadow-sm">
             {mode.toUpperCase()}
          </div>
        </div>
      </div>

      {/* CONTENT SECTION */}
      <div className="mt-6 px-2">
        <h3 className="text-xl font-black text-slate-800 leading-tight line-clamp-1 mb-4">
          {title}
        </h3>

        {/* DETAILED INFO GRID */}
        <div className="grid grid-cols-2 gap-y-4 gap-x-2 mb-6">
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-tight">
            <Calendar size={14} className="text-indigo-500" />
            {new Date(eventStart).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
          </div>

          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-tight">
            <Users size={14} className="text-indigo-500" />
            {participationType}
          </div>

          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-tight col-span-2">
            <MapPin size={14} className="text-rose-500" />
            <span className="truncate">{location?.address || location?.city || "Venue TBD"}</span>
          </div>
        </div>

        {/* DYNAMIC ACTION BUTTON */}
        <motion.button
          onClick={handleJoinClick}
          whileHover={{ x: 5 }}
          disabled={isFull && !hasJoined}
          className={`w-full group/btn flex items-center justify-between p-2 rounded-[1.5rem] transition-all duration-300 ${
            hasJoined 
            ? "bg-emerald-50 text-emerald-600 border border-emerald-100" 
            : isFull 
            ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
            : "bg-slate-900 hover:bg-indigo-600 text-white shadow-xl shadow-slate-200"
          }`}
        >
          <span className="pl-6 text-[10px] font-black uppercase tracking-[0.2em]">
            {hasJoined ? "View My Pass" : isFull ? "House Full" : "Grab My Spot"}
          </span>
          <div className={`p-4 rounded-xl transition-colors ${hasJoined ? "bg-emerald-100" : "bg-white/10"}`}>
            {hasJoined ? <Trophy size={16} /> : <ArrowUpRight size={16} />}
          </div>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default EventCard;
