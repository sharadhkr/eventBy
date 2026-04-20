import { useEffect, useState } from "react";
import { dashboardAPI } from "../lib/api";
import JoinedEventCard from "../components/events/JoinedEventCard";
import RecommendedEventCard from "../components/events/RecommendedEventCard";
import AnnouncementFeed from "../components/events/AnnouncementFeed";
import { Loader2, Sparkles, Heart, MapPin, Users, TrendingUp } from "lucide-react";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

export default function UserEvents() {
  const [loading, setLoading] = useState(true);
  const [joined, setJoined] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);

        const [joinedRes, recommendedRes, announcementRes] = await Promise.all([
          dashboardAPI.getDashboardEvents(),
          dashboardAPI.getRecommendedEvents(),
          dashboardAPI.getDashboardAnnouncements(),
        ]);

        setJoined(joinedRes.data.data || []);
        setRecommended(recommendedRes.data.data || []);
        setAnnouncements(announcementRes.data.data || []);
      } catch {
        toast.error("Failed to load events dashboard");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity }}>
          <Loader2 size={40} className="text-indigo-600" />
        </motion.div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pb-20"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Hero Section */}
      <motion.div
        className="relative overflow-hidden px-4 md:px-8 pt-8 pb-12"
        variants={itemVariants}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-100/40 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-100/30 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-indigo-100/60 rounded-full backdrop-blur-md border border-indigo-200/40">
            <Sparkles size={16} className="text-indigo-600" />
            <span className="text-sm font-semibold text-indigo-700">Your Event Hub</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
            Events Awaiting You
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Discover amazing events, connect with like-minded people, and create unforgettable memories.
          </p>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-16">
        {/* JOINED EVENTS */}
        <motion.section variants={itemVariants}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-4xl font-black text-gray-900 flex items-center gap-3 mb-2">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600"></div>
                My Events
              </h2>
              <p className="text-gray-600">{joined.length} events registered</p>
            </div>
            {joined.length > 0 && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold"
              >
                <TrendingUp size={16} />
                {joined.length} Active
              </motion.div>
            )}
          </div>

          {joined.length === 0 ? (
            <motion.div
              className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-12 text-center border-2 border-dashed border-gray-300"
              whileHover={{ borderColor: "#6366f1" }}
            >
              <Users size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 text-lg font-semibold mb-2">No events joined yet</p>
              <p className="text-gray-500">Explore events and join one to get started!</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {joined.map((item, idx) => (
                <motion.div
                  key={item._id}
                  variants={itemVariants}
                  whileHover={{ y: -8 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <JoinedEventCard data={item} />
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>

        {/* RECOMMENDED */}
        <motion.section variants={itemVariants}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-4xl font-black text-gray-900 flex items-center gap-3 mb-2">
                <Heart size={32} className="text-red-500" />
                Recommended For You
              </h2>
              <p className="text-gray-600">Personalized picks based on your interests</p>
            </div>
          </div>

          {recommended.length === 0 ? (
            <motion.div
              className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-12 text-center border-2 border-dashed border-gray-300"
              whileHover={{ borderColor: "#ec4899" }}
            >
              <MapPin size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 text-lg font-semibold mb-2">No recommendations yet</p>
              <p className="text-gray-500">Check back soon for personalized event suggestions</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommended.map((event, idx) => (
                <motion.div
                  key={event._id}
                  variants={itemVariants}
                  whileHover={{ y: -8 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <RecommendedEventCard event={event} />
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>

        {/* ANNOUNCEMENTS */}
        <motion.section
          variants={itemVariants}
          className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100"
        >
          <h2 className="text-4xl font-black text-gray-900 mb-8 flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center">
              <span className="text-xl">📢</span>
            </div>
            Announcements
          </h2>

          {announcements.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No announcements at the moment</p>
            </div>
          ) : (
            <AnnouncementFeed announcements={announcements} />
          )}
        </motion.section>
      </div>
    </motion.div>
  );
}
