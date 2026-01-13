import { useState } from "react";
import { createEvent } from "../api/event.api";
import EventCard from "../components/EventCard";

const CreateEvent = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    price: "",
    totalTickets: "",
    banner: "",
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "eventrix"); // cloudinary preset

    setLoading(true);

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload",
      {
        method: "POST",
        body: data,
      }
    );

    const result = await res.json();
    setForm({ ...form, banner: result.secure_url });
    setPreview(result.secure_url);
    setLoading(false);
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      await createEvent(form);
      alert("Event created successfully");
    } catch (err) {
      console.error(err);
      alert("Event creation failed");
    }
  };

  return (
    <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 p-6">
      {/* FORM */}
      <form onSubmit={submit} className="space-y-4 bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-bold">Create Event</h2>

        <input
          name="title"
          placeholder="Event Title"
          className="input"
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Event Description"
          className="input"
          onChange={handleChange}
        />

        <input type="date" name="date" className="input" onChange={handleChange} />
        <input type="time" name="time" className="input" onChange={handleChange} />

        <input
          name="location"
          placeholder="Location"
          className="input"
          onChange={handleChange}
        />

        <input
          name="price"
          placeholder="Ticket Price"
          type="number"
          className="input"
          onChange={handleChange}
        />

        <input
          name="totalTickets"
          placeholder="Total Tickets"
          type="number"
          className="input"
          onChange={handleChange}
        />

        <input type="file" onChange={handleImageUpload} />

        <button
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded"
        >
          {loading ? "Uploading..." : "Create Event"}
        </button>
      </form>

      {/* PREVIEW */}
      <div>
        <h3 className="font-semibold mb-2">Live Preview</h3>
        <EventCard event={{ ...form, banner: preview }} />
      </div>
    </div>
  );
};

export default CreateEvent;
