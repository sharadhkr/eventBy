import React, { useState } from "react";
import {
  Heart,
  MapPin,
  Calendar,
  Clock,
  Trophy,
  ExternalLink,
  Bookmark,
  Loader2,
  User
} from "lucide-react";
import { motion } from "framer-motion";
import { userAPI } from "../lib/api";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/auth.context";
import { useNavigate } from "react-router-dom";

const EventCard = ({
  id,
  image,
  title,
  price,
  date,
  time,
  location,
  mode,
  organiser,
  prize,
}) => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [joining, setJoining] = useState(false);
  const [saving, setSaving] = useState(false);

  const hasJoined = user?.joinedEvents?.includes(id);
  const isSaved = user?.savedEvents?.includes(id);

  /* ================= SAVE EVENT ================= */
  const toggleSave = async (e) => {
    e.stopPropagation();
    if (!user) return toast.error("Login required");

    try {
      setSaving(true);
      const res = await userAPI.toggleSaveEvent(id);
      await refreshUser();
      toast.success(res.data.saved ? "Event saved" : "Removed from saved");
    } catch {
      toast.error("Failed to save event");
    } finally {
      setSaving(false);
    }
  };

  /* ================= JOIN EVENT ================= */
  const handleJoin = async (e) => {
    e.stopPropagation();

    if (!user) return toast.error("Please login");
    if (hasJoined) return navigate(`/events/${id}`);

    try {
      setJoining(true);
      await userAPI.joinEvent(id);
      await refreshUser();
      navigate(`/events/${id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Join failed");
    } finally {
      setJoining(false);
    }
  };

  return (
    <motion.div
      layout
      whileHover={{ y: -6 }}
      onClick={() => navigate(`/events/${id}`)}
      className="relative group bg-white/80 backdrop-blur-xl border border-white/30 rounded-[2rem] p-4 shadow-xl cursor-pointer"
    >
      {/* IMAGE */}
      <div className="relative h-52 rounded-[1.5rem] overflow-hidden shadow-2xl">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* PRICE */}
        <div className="absolute top-3 right-3 bg-black/80 text-white px-3 py-1 rounded-full text-xs font-bold">
          {price === 0 ? "FREE" : `₹${price}`}
        </div>

        {/* MODE */}
        <div className="absolute bottom-3 left-3 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase text-white">
          {mode}
        </div>
      </div>

      {/* CONTENT */}
      <div className="mt-4 space-y-3">
        <h3 className="text-lg font-black text-slate-800 line-clamp-2">
          {title}
        </h3>

        {/* META */}
        <div className="grid grid-cols-2 gap-y-2 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Calendar size={14} /> {date}
          </div>

          <div className="flex items-center gap-2">
            <Clock size={14} /> {time || "TBA"}
          </div>

          <div className="flex items-center gap-2 col-span-2">
            <MapPin size={14} /> {location}
          </div>

          {prize && (
            <div className="flex items-center gap-2 col-span-2 text-green-600 font-semibold">
              <Trophy size={14} /> Prize: {prize}
            </div>
          )}

          {organiser && (
            <div className="flex items-center gap-2 col-span-2">
              <User size={14} /> {organiser}
            </div>
          )}
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-2 pt-3 border-t">
          {/* SAVE */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={toggleSave}
            className={`p-2 rounded-xl border ${
              isSaved
                ? "bg-indigo-50 text-indigo-600 border-indigo-200"
                : "border-slate-200 text-slate-400"
            }`}
          >
            {saving ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Bookmark size={16} fill={isSaved ? "currentColor" : "none"} />
            )}
          </motion.button>

          {/* JOIN */}
          <motion.button
            disabled={joining}
            onClick={handleJoin}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl font-bold text-xs transition ${
              hasJoined
                ? "bg-green-500 text-white"
                : "bg-slate-900 text-white"
            }`}
          >
            {joining ? (
              <Loader2 size={14} className="animate-spin" />
            ) : hasJoined ? (
              "View Event"
            ) : (
              <>
                Join Now <ExternalLink size={12} />
              </>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default EventCard;
