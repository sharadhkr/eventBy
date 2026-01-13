import { useEffect, useState } from "react";
import { getMyEvents, deleteEvent } from "../api/event.api";
import EventCard from "../components/EventCard";
import { toast } from "react-hot-toast";

const ManageEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch events
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await getMyEvents();
      setEvents(res.data.events); // Ensure backend sends { events: [...] }
    } catch (err) {
      console.error("FETCH EVENTS ERROR:", err);
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Delete event
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      await deleteEvent(id);
      toast.success("Event deleted successfully");
      setEvents(events.filter((e) => e._id !== id));
    } catch (err) {
      console.error("DELETE EVENT ERROR:", err);
      toast.error("Failed to delete event");
    }
  };

  return (
    <div className="p-6 md:p-10">
      <h1 className="text-2xl md:text-4xl font-bold mb-6">Manage Events</h1>

      {loading ? (
        <div>Loading events...</div>
      ) : events.length === 0 ? (
        <div className="text-gray-500">No events created yet.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div key={event._id} className="relative">
              <EventCard event={event} />

              {/* Controls */}
              <div className="absolute top-2 right-2 flex gap-2">
                <button
                  onClick={() => handleDelete(event._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition"
                >
                  Delete
                </button>

                <button
                  onClick={() => window.location.href = `/organiser/event/edit/${event._id}`}
                  className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition"
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageEvents;
