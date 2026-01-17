import React, { useEffect, useState, useCallback } from "react";
import { userAPI, teamAPI } from "../../lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

// Sub-Components
import ProfileHeader from "../../components/ProfileHeader";
import MiniStats from "../../components/MiniStats";
import TeamInvites from "../../components/TeamInvites";
import TeamsList from "../../components/TeamsList";
import EventCard from "../../components/EventCard";
import CreateTeamWizard from "../../components/CreateTeamWizard";
import Loading from "../../components/Loading";

export default function UserProfile() {
  const [data, setData] = useState({ user: null, invites: [], teams: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("joined");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // useCallback prevents the function from being recreated on every render
  const fetchData = useCallback(async () => {
    try {
      const [profileRes, invitesRes] = await Promise.all([
        userAPI.getProfile(),
        teamAPI.getInvites()
      ]);
      setData({
        user: profileRes.data.data,
        invites: invitesRes.data.data || [],
        teams: profileRes.data.data.teams || []
      });
    } catch (err) {
      toast.error("Session expired or connection error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      <div className="max-w-6xl mx-auto px-6 pt-10 space-y-8">

        {/* 1. Notifications (Invites) */}
        <TeamInvites invites={data.invites} onAction={fetchData} />

        {/* 2. Header & Stats */}
        <ProfileHeader user={data.user} onCreateTeam={() => setIsModalOpen(true)} />
        <MiniStats user={data.user} teamsCount={data.teams.length} />

        {/* 3. Tabs Navigation */}
        <div className="flex bg-white/50 p-1 rounded-2xl w-fit border border-white">
          {['joined', 'saved', 'teams'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-xl text-xs font-black uppercase transition-all ${activeTab === tab ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab} // Using the tab name as a key tells Framer this is a new "page"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {activeTab === 'teams' && <TeamsList teams={data.teams} />}
            {activeTab === 'joined' && data.user?.joinedEvents?.map(e => <EventCard key={e._id} {...e} />)}
            {activeTab === 'saved' && data.user?.savedEvents?.map(e => <EventCard key={e._id} {...e} />)}
          </motion.div>
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isModalOpen && <CreateTeamWizard onClose={() => setIsModalOpen(false)} onCreated={fetchData} />}
      </AnimatePresence>
    </div>
  );
}