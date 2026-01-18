import React, { useState } from "react";
import { MapPin, Calendar, Bookmark, Loader2, Users, ArrowUpRight, CheckCircle2, Trophy, Sparkles } from "lucide-react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { userAPI } from "../lib/api";
import { useAuth } from "../context/auth.context";

const EventCard = (props) => {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const { 
    _id, id, title, banner, price, eventStart, mode, 
    location, eventType, participationType, maxParticipants, participantsCount 
  } = props;
  
  const eventId = _id || id;

  const isSaved = user?.savedEvents?.some(e => (e._id || e) === eventId);
  const hasJoined = user?.joinedEvents?.some(e => (e._id || e) === eventId);
  const isFull = participantsCount >= maxParticipants;
  const spotsLeft = maxParticipants - participantsCount;
  const urgency = spotsLeft <= 5 && spotsLeft > 0;

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
    const idToUse = _id || id || props._id; 
    if (!idToUse) return toast.error("Event ID is missing!");
    console.log("Navigating to:", idToUse);
    navigate(`/events/${idToUse}`);
  };

  const formatDate = (date) => {
    const d = new Date(date);
    return {
      day: d.getDate(),
      month: d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
    };
  };

  const dateInfo = formatDate(eventStart);

  return (
    <div 
      className="group relative w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate(`/events/${eventId}`)}
    >
      {/* Glow Effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl opacity-0 group-hover:opacity-100 blur-lg transition-all duration-500"></div>
      
      <div className="relative bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer">
        
        {/* IMAGE */}
        <div className="relative h-40 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10"></div>
          
          <img 
            src={banner} 
            className={`w-full h-full object-cover transition-all duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}
            alt={title} 
          />

          {/* Top Actions */}
          <div className="absolute top-2 left-2 right-2 flex justify-between items-start z-20">
            <button
              onClick={handleToggleSave}
              className={`flex items-center justify-center w-9 h-9 rounded-xl backdrop-blur-xl transition-all ${
                isSaved 
                  ? "bg-indigo-500 shadow-lg" 
                  : "bg-white/20 hover:bg-white/30 border border-white/30"
              }`}
            >
              {isSaving ? (
                <Loader2 size={16} className="animate-spin text-white" />
              ) : (
                <Bookmark size={16} fill={isSaved ? "white" : "none"} className="text-white" />
              )}
            </button>

            <div className="bg-indigo-500/90 backdrop-blur-md text-white px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-wider">
              {eventType}
            </div>
          </div>

          {/* Date Badge */}
          <div className="absolute bottom-2 left-2 z-20">
            <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-2 min-w-[50px] border border-white/50">
              <div className="text-center">
                <div className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 to-purple-600">
                  {dateInfo.day}
                </div>
                <div className="text-[7px] font-black text-slate-500 -mt-0.5 tracking-wide">
                  {dateInfo.month}
                </div>
              </div>
            </div>
          </div>

          {/* Price & Urgency */}
          <div className="absolute bottom-2 right-2 z-20 flex flex-col gap-1 items-end">
            <div className={`px-2 py-1 rounded-lg text-[9px] font-black backdrop-blur-xl ${
              price === 0 
                ? "bg-emerald-500 text-white" 
                : "bg-white/90 text-slate-900"
            }`}>
              {price === 0 ? "FREE" : `₹${price}`}
            </div>
            
            {urgency && !hasJoined && (
              <div className="bg-rose-500 text-white px-2 py-0.5 rounded-md text-[7px] font-black flex items-center gap-0.5 animate-pulse">
                <Sparkles size={8} /> {spotsLeft} LEFT
              </div>
            )}
          </div>

          {/* Joined Badge */}
          {hasJoined && (
            <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/20 backdrop-blur-sm">
              <div className="bg-emerald-500 text-white px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-xl border-2 border-white/50">
                <CheckCircle2 size={14} />
                <span className="text-[9px] font-black uppercase">Joined</span>
              </div>
            </div>
          )}
        </div>

        {/* CONTENT */}
        <div className="p-3">
          {/* Title */}
          <h3 className="text-sm font-black text-slate-900 leading-tight line-clamp-2 mb-2">
            {title}
          </h3>

          {/* Info */}
          <div className="space-y-1.5 mb-3">
            <div className="flex items-center gap-1.5">
              <MapPin size={12} className="text-rose-500 flex-shrink-0" />
              <span className="text-[10px] font-semibold text-slate-600 truncate">
                {location?.city || location?.address || "TBD"}
              </span>
            </div>

            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <Users size={12} className="text-indigo-500 flex-shrink-0" />
                <span className="text-[9px] font-bold text-slate-500 uppercase">{participationType}</span>
              </div>
              <div className="text-[9px] font-bold text-slate-500 uppercase bg-slate-100 px-2 py-0.5 rounded">
                {mode}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          {!isFull && !hasJoined && (
            <div className="mb-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[8px] font-bold text-slate-400 uppercase">Spots</span>
                <span className="text-[9px] font-black text-indigo-600">{spotsLeft}/{maxParticipants}</span>
              </div>
              <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all ${
                    urgency ? 'bg-rose-500' : 'bg-indigo-500'
                  }`}
                  style={{ width: `${(participantsCount / maxParticipants) * 100}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* CTA Button */}
          <button
            onClick={handleJoinClick}
            disabled={isFull && !hasJoined}
            className={`group/btn relative w-full overflow-hidden rounded-xl transition-all ${
              hasJoined 
                ? "bg-emerald-500 hover:bg-emerald-600 shadow-md" 
                : isFull 
                ? "bg-slate-200 cursor-not-allowed" 
                : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md hover:shadow-lg"
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-500"></div>
            
            <div className="relative flex items-center justify-between px-3 py-2">
              <span className="text-[10px] font-black uppercase tracking-wide text-white">
                {hasJoined ? "My Pass" : isFull ? "Full" : "Join Now"}
              </span>
              
              <div className="p-1.5 rounded-lg bg-white/20">
                {hasJoined ? (
                  <Trophy size={12} className="text-white" />
                ) : (
                  <ArrowUpRight size={12} className="text-white" />
                )}
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;