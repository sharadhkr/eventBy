import { useAdminTopEvents } from "../context/Topevent";
import TopEventSlot from "../components/TopEventSlot";
import { motion } from "framer-motion";
import { Loader2, Star } from "lucide-react";

const AdminTopEvents = () => {
  const {
    topEvents,
    allEvents,
    loading,
    setTopEvent,
    removeTopEvent,
  } = useAdminTopEvents();

  const getSlot = (pos) =>
    topEvents.find((t) => t.position === pos) || null;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600 font-semibold">Loading top events...</p>
        </div>
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
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="w-full"
    >
      {/* Header */}
      <motion.div className="mb-8" variants={itemVariants}>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg">
            <Star className="text-white" size={24} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-yellow-600 via-orange-500 to-red-500 bg-clip-text text-transparent">
            Featured Events
          </h1>
        </div>
        <p className="text-gray-600 mt-2">Manage and showcase your top 3 events</p>
      </motion.div>

      {/* Featured Events Grid */}
      <motion.div
        variants={itemVariants}
        className="grid md:grid-cols-3 gap-6 mb-8"
      >
        {[1, 2, 3].map((pos) => (
          <motion.div key={pos} variants={itemVariants}>
            <TopEventSlot
              position={pos}
              topEvent={getSlot(pos)}
              allEvents={allEvents}
              onSelect={setTopEvent}
              onRemove={removeTopEvent}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Info Card */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 md:p-8"
      >
        <h3 className="text-lg font-bold text-gray-900 mb-3">📌 How it works</h3>
        <ul className="space-y-2 text-gray-600 text-sm">
          <li className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-5 h-5 bg-indigo-100 text-indigo-600 rounded-full text-xs font-bold">1</span>
            Select an event from the dropdown in each slot
          </li>
          <li className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-5 h-5 bg-indigo-100 text-indigo-600 rounded-full text-xs font-bold">2</span>
            The event will be featured on the main page
          </li>
          <li className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-5 h-5 bg-indigo-100 text-indigo-600 rounded-full text-xs font-bold">3</span>
            Remove events anytime to update the featured list
          </li>
        </ul>
      </motion.div>
    </motion.div>
  );
};

export default AdminTopEvents;
