import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { organiserAPI } from "../api/api";
import { toast } from "react-hot-toast";
import { Loader2, Save, ArrowLeft, Image as ImageIcon } from "lucide-react";

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    eventDate: "",
    registrationDeadline: "",
    location: { address: "" },
    ticketPrice: "",
    totalCapacity: "",
    banner: "",
  });

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // 1. Fetch event data and format it for HTML inputs
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const res = await organiserAPI.getMyEvents();
        const event = res.data.data.find((e) => e._id === id);
        
        if (!event) throw new Error("Event not found");

        setForm({
          title: event.title,
          description: event.description,
          // Format date to 'YYYY-MM-DDTHH:MM' for datetime-local input
          eventDate: new Date(event.eventDate).toISOString().slice(0, 16),
          registrationDeadline: new Date(event.registrationDeadline).toISOString().slice(0, 16),
          location: { address: event.location?.address || "" },
          ticketPrice: event.ticketPrice,
          totalCapacity: event.totalCapacity,
          banner: event.banner || "",
        });
      } catch (err) {
        toast.error("Failed to load event data");
        navigate("/organiser/manage-events");
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "address") {
      setForm(prev => ({ ...prev, location: { address: value } }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setUpdating(true);
      await organiserAPI.updateEvent(id, form);
      toast.success("Changes saved successfully!");
      navigate("/organiser/manage-events");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <Loader2 className="animate-spin text-purple-600" size={40} />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-slate-50 min-h-screen">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 transition-colors"
      >
        <ArrowLeft size={18} /> Back to Manage
      </button>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-black text-slate-900">Edit Event</h1>
          <p className="text-slate-500">Update your event details and settings</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase text-slate-400 mb-2 ml-1">Event Title</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase text-slate-400 mb-2 ml-1">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="4"
                className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-2 ml-1">Event Date & Time</label>
              <input
                type="datetime-local"
                name="eventDate"
                value={form.eventDate}
                onChange={handleChange}
                className="w-full p-4 bg-slate-50 rounded-2xl border-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-2 ml-1">Registration Deadline</label>
              <input
                type="datetime-local"
                name="registrationDeadline"
                value={form.registrationDeadline}
                onChange={handleChange}
                className="w-full p-4 bg-slate-50 rounded-2xl border-none"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase text-slate-400 mb-2 ml-1">Location Address</label>
              <input
                name="address"
                value={form.location.address}
                onChange={handleChange}
                className="w-full p-4 bg-slate-50 rounded-2xl border-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-2 ml-1">Price ($)</label>
              <input
                type="number"
                name="ticketPrice"
                value={form.ticketPrice}
                onChange={handleChange}
                className="w-full p-4 bg-slate-50 rounded-2xl border-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-2 ml-1">Capacity</label>
              <input
                type="number"
                name="totalCapacity"
                value={form.totalCapacity}
                onChange={handleChange}
                className="w-full p-4 bg-slate-50 rounded-2xl border-none"
                required
              />
            </div>
          </div>

          <div className="bg-slate-50 p-6 rounded-3xl border border-dashed border-slate-200">
            <label className="block text-xs font-bold uppercase text-slate-400 mb-4 ml-1">Current Banner</label>
            {form.banner ? (
              <div className="relative rounded-2xl overflow-hidden group">
                <img src={form.banner} alt="Preview" className="w-full h-48 object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                   <p className="text-white text-xs font-bold flex items-center gap-2"><ImageIcon size={16}/> Banner is Locked</p>
                </div>
              </div>
            ) : (
              <div className="h-48 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400">No banner</div>
            )}
          </div>

          <button
            type="submit"
            disabled={updating}
            className="w-full bg-slate-900 text-white p-5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-all disabled:opacity-50"
          >
            {updating ? <Loader2 className="animate-spin" /> : <><Save size={20} /> Save Changes</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditEvent;
