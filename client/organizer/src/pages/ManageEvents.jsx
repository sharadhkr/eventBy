import { useEffect, useState } from "react";
import { organiserEventAPI  } from "../api/event.api";
import EventCard from "../components/EventCard";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ManageEvents = () => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  const fetchEvents = async () => {
    try {
      const res = await organiserEventAPI .getMyEvents();
      setEvents(res.data.data || []);
    } catch {
      toast.error("Failed to load events");
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const deleteEvent = async (id) => {
    await organiserEventAPI .deleteEvent(id);
    setEvents(events.filter(e => e._id !== id));
    toast.success("Event deleted");
  };

  const toggleStatus = async (id) => {
    const res = await organiserEventAPI .toggleStatus(id);
    setEvents(events.map(e =>
      e._id === id ? { ...e, status: res.data.status } : e
    ));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-6">
      {events.map(event => (
        <EventCard
          key={event._id}
          event={event}
          onDelete={deleteEvent}
          onToggle={toggleStatus}
          onEdit={(id) => navigate(`/organiser/event/edit/${id}`)}
        />
      ))}
    </div>
  );
};

export default ManageEvents;
