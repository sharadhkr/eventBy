import { useEffect, useState } from "react";
import { organiserAPI } from "../api/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Plus, Megaphone } from "lucide-react";

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
      toast.success(`Event ${next}`);
    } catch {
      toast.error("Failed to update status");
    }
  };

  const deleteEvent = async (id) => {
    if (!confirm("Delete this event permanently?") ) return;
    try {
      await organiserAPI.deleteEvent(id);
      setEvents((prev) => prev.filter((e) => e._id !== id));
      toast.success("Event deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Manage Events</h1>
        <button
          onClick={() => navigate("/events/create")}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl"
        >
          <Plus size={18} /> Create Event
        </button>
      </header>

      {loading ? (
        <p>Loading...</p>
      ) : events.length === 0 ? (
        <p className="text-slate-500">No events found</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {events.map((event) => (
            <div key={event._id} className="bg-white rounded-2xl shadow p-4 space-y-3">
              <img
                src={event.banner || "/placeholder.jpg"}
                alt={event.title}
                className="w-full h-40 object-cover rounded-xl"
              />
              <h3 className="font-semibold text-lg line-clamp-1">{event.title}</h3>
              <p className="text-sm text-slate-500">{event.location?.address}</p>
              <p className="text-xs">Status: <b>{event.status}</b></p>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => navigate(`/events/edit/${event._id}`)}
                  className="btn-secondary"
                >Edit</button>
                <button
                  onClick={() => toggleStatus(event)}
                  className="btn-secondary"
                >{event.status === "published" ? "Unpublish" : "Publish"}</button>
                <button
                  onClick={() => navigate(`/events/${event._id}/announcements`)}
                  className="btn-secondary col-span-2 flex items-center justify-center gap-2"
                >
                  <Megaphone size={16} /> Announcements
                </button>
                <button
                  onClick={() => deleteEvent(event._id)}
                  className="btn-danger col-span-2"
                >Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageEvents;

/* Tailwind helpers:
.btn-secondary { @apply border rounded-xl py-2 text-sm hover:bg-slate-100 }
.btn-danger { @apply bg-red-50 text-red-600 rounded-xl py-2 text-sm }
*/