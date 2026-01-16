import React, { useEffect, useState } from "react";
import { userAPI } from "../../lib/api";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil, Calendar, Bookmark, Users, Zap, ExternalLink, Mail, Trophy } from "lucide-react";
import Loading from "../../components/Loading";

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("joined");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await userAPI.getProfile();
        setUser(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 pb-32">
      {/* --- DYNAMIC BACKGROUND SHAPES --- */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-100 rounded-full blur-[120px] opacity-60" />
        <div className="absolute top-1/2 -right-24 w-80 h-80 bg-purple-100 rounded-full blur-[120px] opacity-60" />
      </div>

      <div className="max-w-6xl mx-auto px-6 pt-12 relative z-10 space-y-8">
        
        {/* --- HEADER BENTO --- */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Main Identity */}
          <div className="md:col-span-2 bg-white/70 backdrop-blur-2xl border border-white p-8 rounded-[2.5rem] shadow-sm flex flex-col md:flex-row items-center gap-8">
            <div className="relative group">
              <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
              <img
                src={user?.photoURL || "/avatar.png"}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover relative z-10 border-4 border-white shadow-xl"
              />
            </div>
            <div className="text-center md:text-left space-y-2">
              <div className="flex items-center justify-center md:justify-start gap-3">
                <h1 className="text-4xl font-black tracking-tight">{user?.displayName}</h1>
                <span className="bg-indigo-600 text-white text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-widest">
                  {user?.role}
                </span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-4 text-slate-500">
                <span className="flex items-center gap-1 text-sm"><Mail size={14}/> {user?.email}</span>
                <span className="flex items-center gap-1 text-sm"><Trophy size={14}/> Top 5% Participant</span>
              </div>
            </div>
          </div>

          {/* Quick Actions Bento */}
          <div className="bg-slate-100 text-white p-4 rounded-[2.5rem] shadow-lg flex flex-col justify-between ">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Global Sync</h3>
            <div className="space-y-4">
              <button 
                onClick={() => navigate("/editprofile")}
                className="w-full mt-2 py-4 rounded-2xl bg-purple-400/40 hover:bg-white/20 border border-white/10 transition-all  flex items-center justify-center gap-2 font-bold"
              >
                <Pencil size={18} /> Edit Identity
              </button>
            </div>
          </div>
        </motion.div>

        {/* --- STATS DASHBOARD --- */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <BentoStat icon={<Calendar className="text-indigo-500" />} label="Exp" value={user?.joinedEvents?.length || 0} sub="Events" />
          <BentoStat icon={<Zap className="text-yellow-500" />} label="Skills" value={user?.skills?.length || 0} sub="Acquired" />
          <BentoStat icon={<Users className="text-purple-500" />} label="Network" value={user?.teams?.length || 0} sub="Teams" />
          <BentoStat icon={<Bookmark className="text-pink-500" />} label="Library" value={user?.savedEvents?.length || 0} sub="Saved" />
        </div>

        {/* --- DYNAMIC INTERACTIVE SECTION --- */}
        <div className="space-y-6">
          {/* Navigation Pill */}
          <div className="flex bg-white/50 backdrop-blur-md p-1.5 rounded-2xl w-fit border border-white shadow-sm">
            {['joined', 'saved', 'teams'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  activeTab === tab ? 'bg-white text-indigo-600 shadow-sm scale-105' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {renderTabContent(activeTab, user)}
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}

/* --- RENDER LOGIC --- */
function renderTabContent(tab, user) {
  const items = {
    joined: user?.joinedEvents || [],
    saved: user?.savedEvents || [],
    teams: user?.teams || []
  }[tab];

  if (!items.length) return <div className="col-span-full py-20 text-center text-slate-400 font-medium">Nothing found in this archive.</div>;

  return items.map((item, i) => (
    <motion.div 
      key={item._id || i}
      whileHover={{ y: -5 }}
      className="bg-white border border-slate-100 p-6 rounded-[2rem] shadow-sm hover:shadow-xl transition-all group"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
          {tab === 'teams' ? <Users size={20}/> : <Calendar size={20}/>}
        </div>
        <ExternalLink size={16} className="text-slate-300 group-hover:text-indigo-600 transition-colors cursor-pointer" />
      </div>
      <h3 className="font-black text-lg leading-tight mb-2">{item.title || item.name}</h3>
      <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">
        {item.eventDate ? new Date(item.eventDate).toDateString() : `${item.members?.length || 0} Members`}
      </p>
    </motion.div>
  ));
}

/* --- REUSABLE COMPONENTS --- */
function BentoStat({ icon, label, value, sub }) {
  return (
    <div className="bg-white/80 backdrop-blur-md border border-white p-6 rounded-[2rem] shadow-sm flex flex-col justify-between h-40 group hover:bg-white transition-all">
      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center transition-transform group-hover:scale-110">
        {icon}
      </div>
      <div>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-black">{value}</span>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{sub}</span>
        </div>
        <p className="text-xs font-bold text-slate-500">{label}</p>
      </div>
    </div>
  );
}

function LoadingScreen() {
  return (
    <Loading/>
  );
}
