import React from "react";
import { Calendar, Users, Zap, Bookmark } from "lucide-react";

export default function MiniStats({ user, teamsCount }) {
  const stats = [
    { 
      label: "Events", 
      value: user?.joinedEvents?.length || 0, 
      icon: <Calendar size={18}/>, 
      color: "bg-indigo-50 text-indigo-600" 
    },
    { 
      label: "Teams", 
      value: teamsCount || 0, 
      icon: <Users size={18}/>, 
      color: "bg-purple-50 text-purple-600" 
    },
    { 
      label: "Skills", 
      value: user?.skills?.length || 0, 
      icon: <Zap size={18}/>, 
      color: "bg-yellow-50 text-yellow-600" 
    },
    { 
      label: "Saved", 
      value: user?.savedEvents?.length || 0, 
      icon: <Bookmark size={18}/>, 
      color: "bg-pink-50 text-pink-600" 
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, idx) => (
        <div key={idx} className="bg-white/70 border border-white p-4 rounded-3xl flex items-center gap-4 shadow-sm hover:translate-y-[-2px] transition-transform">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
            {stat.icon}
          </div>
          <div>
            <p className="text-xl font-black leading-none text-slate-900">{stat.value}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
              {stat.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}