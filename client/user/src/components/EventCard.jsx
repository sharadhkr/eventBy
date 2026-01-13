import React, { useState } from 'react';
import { Heart, MapPin, Calendar, ExternalLink, Bookmark, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { userAPI } from '../lib/api';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/auth.context';

const EventCard = ({ 
  id, // MongoDB _id
  image,
  title,
  price,
  date,
  location,
  mode,
  isJoinedInitial = false 
}) => {
  const { user, refreshUser } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [joining, setJoining] = useState(false);

  // Check if user is already in the participants list
  const hasJoined = user?.joinedEvents?.includes(id) || isJoinedInitial;

  const handleJoinEvent = async (e) => {
    e.preventDefault();
    if (!user) return toast.error("Please login to join!");
    if (hasJoined) return toast.success("You are already registered!");

    try {
      setJoining(true);
      const res = await userAPI.joinEvent(id);
      toast.success(res.data.message || "Joined successfully! 🎉");
      await refreshUser(); // Update global auth state to reflect new event
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to join event");
    } finally {
      setJoining(false);
    }
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative group w-full bg-white/80 backdrop-blur-xl border border-white/20 rounded-[2rem] p-3 sm:p-5 shadow-xl transition-all"
    >
      {/* 1. Floating Image Section - Scaled for Mobile Grid */}
      <div className="relative -mt-8 sm:-mt-12 mb-4 h-32 sm:h-56 w-full rounded-[1.5rem] overflow-hidden shadow-2xl">
        <img 
          src={image || "images.unsplash.com"} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-2 right-2 bg-slate-900/90 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold shadow-lg">
          {price === "Free" || price === 0 ? "FREE" : `$${price}`}
        </div>
        <div className="absolute bottom-2 left-2 bg-white/20 backdrop-blur-md text-white border border-white/30 px-2 py-0.5 rounded-lg text-[8px] sm:text-[10px] font-bold uppercase">
          {mode}
        </div>
      </div>

      {/* 2. Content Section */}
      <div className="space-y-3 px-1">
        <h3 className="text-sm sm:text-xl font-black text-slate-800 leading-tight line-clamp-1 sm:line-clamp-2">
          {title}
        </h3>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center text-slate-500 gap-1.5">
            <Calendar size={12} className="text-purple-500" />
            <span className="text-[10px] sm:text-xs font-medium">{date}</span>
          </div>
          <div className="flex items-center text-slate-500 gap-1.5">
            <MapPin size={12} className="text-blue-500" />
            <span className="text-[10px] sm:text-xs font-medium truncate">{location}</span>
          </div>
        </div>

        {/* 3. Action Row */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 gap-2">
          <div className="flex gap-1 sm:gap-2">
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsLiked(!isLiked)}
              className={`p-1.5 sm:p-2.5 rounded-xl border transition-all ${
                isLiked ? 'bg-red-50 border-red-100 text-red-500' : 'border-slate-100 text-slate-400 hover:bg-slate-50'
              }`}
            >
              <Heart size={16} fill={isLiked ? "currentColor" : "none"} />
            </motion.button>
          </div>

          {/* Dynamic Join/Ticket Button */}
          <motion.button 
            disabled={joining || hasJoined}
            onClick={handleJoinEvent}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            className={`flex flex-1 items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl text-[10px] sm:text-xs font-bold shadow-lg transition-all ${
              hasJoined 
                ? 'bg-green-500 text-white shadow-green-100' 
                : 'bg-slate-900 text-white shadow-slate-200'
            }`}
          >
            {joining ? (
              <Loader2 size={14} className="animate-spin" />
            ) : hasJoined ? (
              "Joined"
            ) : (
              <>Join <ExternalLink size={12} /></>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default EventCard;
