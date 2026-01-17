import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { organiserAPI } from "../api/api";
import { toast } from "react-hot-toast";
import { Loader2, Save, ArrowLeft } from "lucide-react";

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const res = await organiserAPI.getEventDetails(id);
      const e = res.data.data;

      setForm({
        title: e.title,
        description: e.description,
        eventDate: new Date(e.eventDate).toISOString().slice(0, 16),
        registrationDeadline: new Date(e.registrationDeadline).toISOString().slice(0, 16),
        address: e.location?.address || "",
        price: e.pricing?.amount || 0,
        maxParticipants: e.maxParticipants,
        banner: e.banner,
      });
    } catch {
      toast.error("Failed to load event");
      navigate("/events/manage");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);

      const payload = {
        title: form.title,
        description: form.description,
        eventDate: form.eventDate,
        registrationDeadline: form.registrationDeadline,
        location: { address: form.address },
        pricing: { isFree: form.price === 0, amount: Number(form.price) },
        maxParticipants: Number(form.maxParticipants),
      };

      await organiserAPI.updateEvent(id, payload);
      toast.success("Event updated");
      navigate("/events/manage");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 mb-6 text-slate-600">
        <ArrowLeft size={16} /> Back
      </button>

      <div className="bg-white rounded-3xl shadow p-8">
        <h1 className="text-2xl font-bold mb-6">Edit Event</h1>

        <form onSubmit={submit} className="space-y-6">
          <input name="title" value={form.title} onChange={handleChange} className="input" placeholder="Title" />
          <textarea name="description" value={form.description} onChange={handleChange} className="input" rows={4} placeholder="Description" />

          <div className="grid grid-cols-2 gap-4">
            <input type="datetime-local" name="eventDate" value={form.eventDate} onChange={handleChange} className="input" />
            <input type="datetime-local" name="registrationDeadline" value={form.registrationDeadline} onChange={handleChange} className="input" />
          </div>

          <input name="address" value={form.address} onChange={handleChange} className="input" placeholder="Address" />

          <div className="grid grid-cols-2 gap-4">
            <input type="number" name="price" value={form.price} onChange={handleChange} className="input" placeholder="Price" />
            <input type="number" name="maxParticipants" value={form.maxParticipants} onChange={handleChange} className="input" placeholder="Capacity" />
          </div>

          <button disabled={saving} className="w-full bg-indigo-600 text-white py-3 rounded-xl flex justify-center gap-2">
            {saving ? <Loader2 className="animate-spin" /> : <><Save size={16} /> Save</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditEvent;

/* Tailwind helper:
.input { @apply w-full p-3 rounded-xl bg-slate-50 border focus:ring-2 focus:ring-indigo-500 }
*/