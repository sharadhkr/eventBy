import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMyEvents, updateEvent } from "../api/event.api";
import { toast } from "react-hot-toast";

const EditEvent = () => {
  const { id } = useParams(); // Event ID from URL
  const navigate = useNavigate();

  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    price: "",
    totalTickets: "",
    banner: "",
  });

  const [loading, setLoading] = useState(true);

  // Fetch event data
  const fetchEvent = async () => {
    try {
      setLoading(true);
      const res = await getMyEvents(); // fetch all events
      const event = res.data.events.find((e) => e._id === id);
      if (!event) throw new Error("Event not found");
      setEventData({
        title: event.title,
        description: event.description,
        date: event.date.split("T")[0], // yyyy-mm-dd
        time: event.time,
        location: event.location,
        price: event.ticketPrice || "",
        totalTickets: event.totalSeats || "",
        banner: event.banner || "",
      });
    } catch (err) {
      console.error("FETCH EVENT ERROR:", err);
      toast.error("Failed to load event data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [id]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle banner upload
  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEventData((prev) => ({ ...prev, banner: file }));
    }
  };

  // Submit updated event
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      Object.entries(eventData).forEach(([key, value]) => {
        formData.append(key, value);
      });

      await updateEvent(id, formData);
      toast.success("Event updated successfully");
      navigate("/organiser/manage-events");
    } catch (err) {
      console.error("UPDATE EVENT ERROR:", err);
      toast.error("Failed to update event");
    }
  };

  if (loading) return <div className="p-6">Loading event...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Event</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={eventData.title}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={eventData.description}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />

        <input
          type="date"
          name="date"
          value={eventData.date}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />

        <input
          type="time"
          name="time"
          value={eventData.time}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />

        <input
          type="text"
          name="location"
          placeholder="Location"
          value={eventData.location}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />

        <input
          type="number"
          name="price"
          placeholder="Ticket Price"
          value={eventData.price}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />

        <input
          type="number"
          name="totalTickets"
          placeholder="Total Tickets"
          value={eventData.totalTickets}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />

        <input
          type="file"
          name="banner"
          accept="image/*"
          onChange={handleBannerChange}
          className="w-full"
        />
        {eventData.banner && typeof eventData.banner === "string" && (
          <img
            src={eventData.banner}
            alt="Current banner"
            className="w-full h-48 object-cover rounded mt-2"
          />
        )}

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Update Event
        </button>
      </form>
    </div>
  );
};

export default EditEvent;
