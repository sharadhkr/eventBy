import { useEffect, useState } from "react";
import { organiserAPI } from "../api/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { 
  Plus, Megaphone, Edit3, Globe, Lock, Trash2, 
  Sparkles, Calendar, MapPin, Users, MoreHorizontal 
} from "lucide-react";
import Loading from "../components/Loading";

const ManageEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await organiserAPI.getMyEvents();
      setEvents(res.data.data || []);
    } catch {
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (event) => {
    const next = event.status === "published" ? "draft" : "published";
    try {
      await organiserAPI.toggleStatus(event._id, next);
      setEvents((prev) =>
        prev.map((e) => (e._id === event._id ? { ...e, status: next } : e))
      );
      toast.success(`Event set to ${next} mode`);
    } catch {
      toast.error("Status update failed");
    }
  };

  const deleteEvent = async (id) => {
    if (!confirm("Are you sure? This action is permanent!")) return;
    try {
      await organiserAPI.deleteEvent(id);
      setEvents((prev) => prev.filter((e) => e._id !== id));
      toast.success("Event permanently removed");
    } catch {
      toast.error("Delete operation failed");
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-[#fafafa] pb-32 relative overflow-x-hidden">
      {/* Background Aura */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-indigo-100/40 rounded-full blur-[140px]" />
        <div className="absolute bottom-[10%] left-[-5%] w-[500px] h-[500px] bg-pink-100/30 rounded-full blur-[120px]" />
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-10 space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2 text-indigo-600 font-black text-[10px] uppercase tracking-[0.3em]">
              <Sparkles size={14} />
              <span>Vault</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter leading-none">
              Manage Events
            </h1>
          </div>
          <button
            onClick={() => navigate("/events/create")}
            className="flex items-center justify-center gap-3 bg-gray-900 text-white px-8 py-4 rounded-2xl font-black hover:bg-black transition-all shadow-xl shadow-gray-200 group"
          >
            <Plus size={20} /> Create New
          </button>
        </div>

        {events.length === 0 ? (
          <div className="bg-white/60 backdrop-blur-md rounded-[3rem] p-20 text-center border border-white">
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No events found in your archive</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <div 
                key={event._id} 
                className="group relative bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-white shadow-2xl shadow-gray-200/40 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-indigo-100"
              >
                {/* Image & Status Badge */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={event.banner || "/placeholder.jpg"}
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md border shadow-sm ${
                      event.status === 'published' 
                      ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' 
                      : 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                    }`}>
                      {event.status}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 space-y-6">
                  <div>
                    <h3 className="text-2xl font-black text-gray-900 tracking-tight line-clamp-1 mb-2 group-hover:text-indigo-600 transition-colors">
                      {event.title}
                    </h3>
                    <div className="flex items-center gap-3 text-gray-400">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-tighter">
                        <MapPin size={12} className="text-indigo-400" /> {event.mode}
                      </div>
                      <div className="h-1 w-1 bg-gray-200 rounded-full" />
                      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-tighter">
                        <Users size={12} className="text-pink-400" /> {event.participantsCount || 0} Joined
                      </div>
                    </div>
                  </div>

                  {/* Actions Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => navigate(`/events/edit/${event._id}`)}
                      className="flex items-center justify-center gap-2 py-3.5 bg-gray-50 text-gray-700 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-100 transition-all border border-gray-100"
                    >
                      <Edit3 size={14} /> Edit
                    </button>
                    
                    <button
                      onClick={() => toggleStatus(event)}
                      className={`flex items-center justify-center gap-2 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all border ${
                        event.status === 'published' 
                        ? 'border-amber-100 text-amber-600 hover:bg-amber-50' 
                        : 'border-emerald-100 text-emerald-600 hover:bg-emerald-50'
                      }`}
                    >
                      {event.status === "published" ? <Lock size={14} /> : <Globe size={14} />}
                      {event.status === "published" ? "Draft" : "Live"}
                    </button>

                    <button
                      onClick={() => navigate(`/events/${event._id}/announcements`)}
                      className="col-span-2 flex items-center justify-center gap-2 py-4 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                    >
                      <Megaphone size={16} /> Post Announcement
                    </button>

                    <button
                      onClick={() => deleteEvent(event._id)}
                      className="col-span-2 flex items-center justify-center gap-2 py-3 text-red-400 hover:text-red-600 text-[10px] font-black uppercase tracking-[0.2em] transition-all"
                    >
                      <Trash2 size={12} /> Delete Permanently
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ManageEvents;
