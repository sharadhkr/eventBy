import { useEffect, useState } from "react";
import { organiserAPI } from "../api/event.api"; // Updated to use our new API object
import EventCard from "../components/EventCard";
import { toast } from "react-hot-toast";
import { Trash2, Edit3, Plus, LayoutGrid } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const ManageEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await organiserAPI.getMyEvents();
      // res.data.data matches the controller we updated (data: events)
      setEvents(res.data.data || []); 
    } catch (err) {
      console.error("FETCH EVENTS ERROR:", err);
      toast.error("Failed to load your events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (id) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="font-medium text-slate-800">Delete this event permanently?</p>
        <div className="flex gap-2">
          <button 
            className="bg-red-500 text-white px-3 py-1 rounded-lg text-xs font-bold"
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                await organiserAPI.deleteEvent(id);
                setEvents(events.filter((e) => e._id !== id));
                toast.success("Event removed");
              } catch (err) {
                toast.error("Delete failed");
              }
            }}
          >
            Yes, Delete
          </button>
          <button className="bg-slate-100 px-3 py-1 rounded-lg text-xs" onClick={() => toast.dismiss(t.id)}>Cancel</button>
        </div>
      </div>
    ), { duration: 5000 });
  };

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-10 min-h-screen bg-slate-50/50">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <LayoutGrid className="text-purple-600" /> Manage Events
          </h1>
          <p className="text-slate-500 mt-1">Monitor, edit, and track your hosted events</p>
        </div>
        
        <Link 
          to="/organiser/event/create" 
          className="flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-black transition-all shadow-lg shadow-slate-200"
        >
          <Plus size={20} /> Create New
        </Link>
      </header>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => <div key={i} className="h-80 bg-slate-200 animate-pulse rounded-[2.5rem]" />)}
        </div>
      ) : events.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
            <LayoutGrid size={32} className="text-slate-300" />
          </div>
          <p className="text-slate-400 font-medium">You haven't created any events yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          <AnimatePresence mode="popLayout">
            {events.map((event) => (
              <motion.div 
                key={event._id} 
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative"
              >
                {/* Properly mapping fields from DB to EventCard props */}
                <EventCard 
                  id={event._id}
                  image={event.banner}
                  title={event.title}
                  price={event.ticketPrice}
                  date={new Date(event.eventDate).toLocaleDateString()}
                  location={event.location.address}
                  mode={event.mode}
                />

                {/* Management Overlay - Appears on Hover */}
                <div className="absolute -top-4 -right-2 flex flex-col gap-2 z-20">
                  <Link
                    to={`/organiser/event/edit/${event._id}`}
                    className="p-3 bg-white text-slate-600 rounded-2xl shadow-xl hover:bg-slate-900 hover:text-white transition-all border border-slate-100"
                  >
                    <Edit3 size={18} />
                  </Link>
                  <button
                    onClick={() => handleDelete(event._id)}
                    className="p-3 bg-white text-red-500 rounded-2xl shadow-xl hover:bg-red-500 hover:text-white transition-all border border-slate-100"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default ManageEvents;
