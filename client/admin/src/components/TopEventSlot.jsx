import toast from "react-hot-toast";
import { Trash2, Plus, Image as ImageIcon } from "lucide-react";
import { motion } from "framer-motion";

const TopEventSlot = ({
  position,
  topEvent,
  allEvents,
  onSelect,
  onRemove,
}) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold opacity-90">POSITION</p>
            <h3 className="text-2xl font-black">#{position}</h3>
          </div>
          <div className="text-4xl font-black opacity-20">#{position}</div>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {topEvent ? (
          <>
            {/* Event Image */}
            <div className="relative rounded-xl overflow-hidden h-40 bg-gradient-to-br from-gray-200 to-gray-300">
              {topEvent.event.banner ? (
                <img
                  src={topEvent.event.banner}
                  alt={topEvent.event.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="text-gray-400" size={32} />
                </div>
              )}
            </div>

            {/* Event Info */}
            <div>
              <p className="font-bold text-gray-900 line-clamp-2">
                {topEvent.event.title}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {topEvent.event.organiser?.organisationName}
              </p>
            </div>

            {/* Remove Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                onRemove(topEvent.event._id);
                toast.success("Event removed from top slot");
              }}
              className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-2 rounded-lg transition duration-300"
            >
              <Trash2 size={16} />
              Remove Event
            </motion.button>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-3">
              <Plus className="text-gray-400" size={24} />
            </div>
            <p className="text-gray-500 font-semibold">Empty Slot</p>
            <p className="text-xs text-gray-400 mt-1">Select an event to feature</p>
          </div>
        )}

        {/* Select Dropdown */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-2">
            SELECT EVENT
          </label>
          <select
            className="w-full bg-white border-2 border-gray-200 rounded-lg px-3 py-2 text-sm font-medium text-gray-900 focus:border-indigo-500 focus:outline-none transition duration-300"
            defaultValue=""
            onChange={(e) => {
              if (!e.target.value) return;
              onSelect(e.target.value, position);
              toast.success("Event featured successfully");
              e.target.value = "";
            }}
          >
            <option value="">Choose an event...</option>
            {allEvents.map((e) => (
              <option key={e._id} value={e._id}>
                {e.title}
              </option>
            ))}
          </select>
        </div>
      </div>
    </motion.div>
  );
};

export default TopEventSlot;
