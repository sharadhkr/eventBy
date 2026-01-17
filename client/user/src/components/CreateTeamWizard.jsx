import React, { useEffect, useState } from "react";
import { teamAPI } from "../lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { X, Users, Zap, ArrowLeft, Search, Send, UserPlus, CheckCircle2 } from "lucide-react";
import { toast } from "react-hot-toast";

export default function CreateTeamWizard({ onClose, onCreated }) {
  const [step, setStep] = useState(1);
  const [teamData, setTeamData] = useState({ name: '', size: 2 });
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(false);

  // --- Optimized Debounce Search ---
  useEffect(() => {
    if (search.trim().length < 3) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await teamAPI.searchUsers(search);
        // Filter out users already in the invite list
        const filtered = res.data.data.filter(
          u => !invites.find(invited => invited._id === u._id)
        );
        setSearchResults(filtered);
      } catch (err) {
        console.error("Search failed", err);
      }
    }, 400); // 400ms is the sweet spot for search

    return () => clearTimeout(timer);
  }, [search, invites]);

  const handleAddUser = (user) => {
    if (invites.length >= teamData.size - 1) {
      toast.error(`A team of ${teamData.size} only needs ${teamData.size - 1} more members.`);
      return;
    }
    setInvites(prev => [...prev, user]);
    setSearch('');
    setSearchResults([]);
  };

  const handleCreate = async () => {
    if (invites.length !== teamData.size - 1) {
      return toast.error(`Please invite ${teamData.size - 1} members to continue.`);
    }
    
    try {
      setLoading(true);
      await teamAPI.createTeam({
        name: teamData.name.trim(),
        size: teamData.size,
        inviteeIds: invites.map(u => u._id)
      });
      toast.success("Team Created! Invites have been sent. 🚀");
      onCreated(); // Re-fetches profile data in parent
      onClose();   // Closes modal
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
        className="bg-white w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden"
      >
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-900 transition-colors">
          <X size={20}/>
        </button>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div key="s1" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-slate-900">Team Identity</h2>
                <p className="text-slate-400 text-sm">Choose a name and squad size for your journey.</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Team Name</label>
                  <input 
                    className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-indigo-500 focus:bg-white outline-none font-bold text-lg transition-all" 
                    placeholder="e.g. Dream Team" 
                    value={teamData.name}
                    onChange={(e) => setTeamData({...teamData, name: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Squad Format</label>
                  <div className="grid grid-cols-2 gap-4">
                    {[2, 4].map(size => (
                      <button 
                        key={size}
                        onClick={() => { setTeamData({...teamData, size}); setInvites([]); }}
                        className={`p-6 rounded-3xl font-black border-2 transition-all flex flex-col items-center gap-2 ${teamData.size === size ? 'border-indigo-600 bg-indigo-50/50 text-indigo-600' : 'border-slate-100 text-slate-300 hover:border-slate-200'}`}
                      >
                        {size === 2 ? <Users size={24}/> : <Zap size={24}/>}
                        <span className="text-sm">{size === 2 ? 'Duo (2)' : 'Squad (4)'}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button 
                disabled={teamData.name.length < 3}
                onClick={() => setStep(2)}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold disabled:opacity-30 shadow-xl shadow-slate-200 hover:translate-y-[-2px] active:translate-y-[0px] transition-all"
              >
                Next: Recruit Members
              </button>
            </motion.div>
          ) : (
            <motion.div key="s2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-6">
              <div className="flex items-center gap-3">
                <button onClick={() => setStep(1)} className="p-2 rounded-xl hover:bg-slate-100 transition-colors"><ArrowLeft size={20}/></button>
                <h2 className="text-2xl font-black">Recruit ({invites.length + 1}/{teamData.size})</h2>
              </div>
              
              {/* Search Box */}
              <div className="relative">
                <Search className="absolute left-4 top-4 text-slate-400" size={20} />
                <input 
                  autoFocus
                  className="w-full p-4 pl-12 bg-slate-50 border-none rounded-2xl outline-none font-medium focus:ring-2 ring-indigo-500/20 transition-all" 
                  placeholder="Search teammate by name..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                
                {/* Results Dropdown */}
                <AnimatePresence>
                  {searchResults.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl z-[110] max-h-48 overflow-y-auto p-2"
                    >
                      {searchResults.map(u => (
                        <button key={u._id} onClick={() => handleAddUser(u)} className="w-full p-3 flex items-center justify-between hover:bg-indigo-50 rounded-xl transition-colors group">
                          <div className="flex items-center gap-3">
                            <img src={u.photoURL} className="w-8 h-8 rounded-full bg-slate-200" alt=""/>
                            <div className="text-left">
                              <p className="text-sm font-bold text-slate-800">{u.displayName}</p>
                              <p className="text-[10px] text-slate-400 font-medium">{u.email}</p>
                            </div>
                          </div>
                          <UserPlus size={16} className="text-indigo-400 group-hover:text-indigo-600" />
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Recruitment List */}
              <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                 <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                    <span className="text-xs font-bold text-slate-400 italic">You (Leader)</span>
                    <CheckCircle2 size={16} className="text-emerald-500" />
                 </div>

                 {invites.map(m => (
                   <div key={m._id} className="flex justify-between items-center p-3 bg-indigo-50 rounded-2xl border border-indigo-100">
                      <div className="flex items-center gap-3">
                        <img src={m.photoURL} className="w-8 h-8 rounded-full border-2 border-white"/>
                        <span className="font-bold text-indigo-900 text-sm">{m.displayName}</span>
                      </div>
                      <button onClick={() => setInvites(invites.filter(i => i._id !== m._id))} className="p-2 hover:bg-white rounded-lg transition-colors text-indigo-400 hover:text-red-500">
                        <X size={16}/>
                      </button>
                   </div>
                 ))}

                 {/* Empty Slot Placeholders */}
                 {[...Array(teamData.size - 1 - invites.length)].map((_, i) => (
                   <div key={i} className="p-4 border-2 border-dashed border-slate-100 rounded-2xl flex items-center justify-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-slate-200 animate-pulse" />
                      <span className="text-[10px] font-black text-slate-200 uppercase tracking-widest">Awaiting Recruit</span>
                   </div>
                 ))}
              </div>

              <button 
                onClick={handleCreate}
                disabled={invites.length !== teamData.size - 1 || loading}
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-indigo-100 disabled:bg-slate-100 disabled:text-slate-400 disabled:shadow-none hover:bg-indigo-700 transition-all"
              >
                {loading ? (
                   <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <><Send size={18}/> Finalize & Send Invites</>
                )}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}