import React from "react";
import { Pencil, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ProfileHeader({ user, onCreateTeam }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white/80 backdrop-blur-2xl border border-white p-6 rounded-[2.5rem] shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="flex items-center gap-6">
        <div className="relative group">
          <img
            src={user?.photoURL || "https://api.dicebear.com/7.x/avataaars/svg"}
            alt="Profile"
            className="w-24 h-24 rounded-3xl object-cover border-2 border-white shadow-lg"
          />
          <button 
            onClick={() => navigate("/editprofile")}
            className="absolute -bottom-2 -right-2 p-2 bg-slate-900 text-white rounded-xl shadow-lg hover:scale-110 transition-transform"
          >
            <Pencil size={14} />
          </button>
        </div>
        
        <div className="space-y-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3">
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              {user?.displayName || "Loading..."}
            </h1>
            <span className="bg-indigo-50 text-indigo-600 text-[10px] px-2 py-0.5 rounded-lg font-bold uppercase">
              {user?.role || "Member"}
            </span>
          </div>
          <p className="text-slate-400 text-sm font-medium">
            {user?.email}
          </p>
        </div>
      </div>

      <button 
        onClick={onCreateTeam}
        className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95"
      >
        <Plus size={18} /> Create Team
      </button>
    </div>
  );
}