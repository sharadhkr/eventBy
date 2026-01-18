import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { organiserAPI } from "../api/api";
import { Plus, Trash2, UploadCloud, Loader2, MapPin, ArrowLeft } from "lucide-react";
import { toast } from "react-hot-toast";

const EVENT_TYPES = ["hackathon", "workshop", "expert-talk", "competition", "meetup"];
const TEAM_TYPES = ["solo", "duo", "squad"];

export default function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);
  const [banner, setBanner] = useState(null);
  const [preview, setPreview] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    eventType: "hackathon",
    rules: [""],
    registrationDeadline: "",
    eventStart: "",
    eventEnd: "",
    pricing: { isFree: true, amount: 0, currency: "INR" },
    teamCriteria: { type: "solo", maxTeamsAllowed: 1 },
    mode: "online",
    lat: "",
    lng: "",
    venueDetails: {
      platform: "",
      meetingLink: "",
      addressLine1: "",
      city: "",
      state: "",
      country: "India",
      pincode: "",
    },
  });

  // 1. Fetch Existing Data
  useEffect(() => {
    const loadEvent = async () => {
      try {
        const res = await organiserAPI.getEventDetails(id);
        const data = res.data.data;

        // Helper: Convert ISO date to YYYY-MM-DDThh:mm format for datetime-local input
        const fmtDate = (iso) => iso ? new Date(iso).toISOString().slice(0, 16) : "";

        setForm({
          ...data,
          registrationDeadline: fmtDate(data.registrationDeadline),
          eventStart: fmtDate(data.eventStart),
          eventEnd: fmtDate(data.eventEnd),
          pricing: data.pricing || { isFree: true, amount: 0, currency: "INR" },
          teamCriteria: data.teamCriteria || { type: "solo", maxTeamsAllowed: 1 },
          venueDetails: data.venueDetails || { platform: "", meetingLink: "" }
        });
        setPreview(data.banner); // Set existing banner URL as preview
      } catch (err) {
        toast.error("Failed to load event details");
        navigate(-1);
      } finally {
        setFetching(false);
      }
    };
    loadEvent();
  }, [id, navigate]);

  /* ========================= HELPERS ========================= */
  const update = (key, value) => setForm((p) => ({ ...p, [key]: value }));
  
  const updateNested = (parent, key, value) =>
    setForm((p) => ({ ...p, [parent]: { ...p[parent], [key]: value } }));

  const updateRule = (i, v) => {
    const rules = [...form.rules];
    rules[i] = v;
    update("rules", rules);
  };

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBanner(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const fetchCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((p) => ({ ...p, lat: pos.coords.latitude.toFixed(6), lng: pos.coords.longitude.toFixed(6) }));
        toast.success("Location updated 📍");
      },
      () => toast.error("Location access denied")
    );
  };

  /* ========================= SUBMIT (UPDATE) ========================= */
  const submit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const fd = new FormData();
      
      // Standard Fields
      const fields = ["title", "description", "eventType", "mode", "registrationDeadline", "eventStart", "eventEnd"];
      fields.forEach(f => fd.append(f, form[f]));

      // Stringified Objects
      fd.append("rules", JSON.stringify(form.rules.filter(Boolean)));
      fd.append("pricing", JSON.stringify(form.pricing));
      fd.append("teamCriteria", JSON.stringify(form.teamCriteria));
      fd.append("venueDetails", JSON.stringify(form.venueDetails));

      if (banner) fd.append("banner", banner);
      if (form.mode === "offline") {
        fd.append("lat", form.lat);
        fd.append("lng", form.lng);
      }

      await organiserAPI.updateEvent(id, fd);
      toast.success("Event updated successfully ✨");
      navigate(`/organiser/event/${id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="p-20 text-center"><Loader2 className="animate-spin mx-auto" /></div>;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10">
      <header className="flex items-center justify-between">
        <div>
          <button onClick={() => navigate(-1)} className="text-slate-500 flex items-center gap-1 mb-2 hover:text-black">
            <ArrowLeft size={16} /> Back
          </button>
          <h1 className="text-3xl font-black">Edit Event</h1>
        </div>
      </header>

      <form onSubmit={submit} className="space-y-10">
        <Section title="Basic Information">
          <Input label="Event Title" value={form.title} required onChange={(e) => update("title", e.target.value)} />
          <Textarea label="Description" value={form.description} onChange={(e) => update("description", e.target.value)} />
          <Select label="Event Type" options={EVENT_TYPES} value={form.eventType} onChange={(e) => update("eventType", e.target.value)} />
        </Section>

        <Section title="Rules">
          {form.rules.map((r, i) => (
            <div key={i} className="flex gap-2">
              <input className="input flex-1" value={r} onChange={(e) => updateRule(i, e.target.value)} />
              <button type="button" onClick={() => update("rules", form.rules.filter((_, idx) => idx !== i))} className="text-red-500">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
          <button type="button" onClick={() => update("rules", [...form.rules, ""])} className="text-purple-600 text-sm flex gap-1 items-center">
            <Plus size={16} /> Add Rule
          </button>
        </Section>

        <Section title="Dates">
          <Input type="datetime-local" label="Registration Deadline" value={form.registrationDeadline} required onChange={(e) => update("registrationDeadline", e.target.value)} />
          <Input type="datetime-local" label="Event Start" value={form.eventStart} required onChange={(e) => update("eventStart", e.target.value)} />
          <Input type="datetime-local" label="Event End" value={form.eventEnd} required onChange={(e) => update("eventEnd", e.target.value)} />
        </Section>

        <Section title="Pricing & Team">
          <div className="flex items-center gap-2 md:col-span-2">
            <input type="checkbox" checked={form.pricing.isFree} onChange={(e) => updateNested("pricing", "isFree", e.target.checked)} />
            <label className="font-semibold">Free Event</label>
          </div>
          {!form.pricing.isFree && (
            <Input type="number" label="Price (INR)" value={form.pricing.amount} onChange={(e) => updateNested("pricing", "amount", Number(e.target.value))} />
          )}
          <Select label="Team Type" options={TEAM_TYPES} value={form.teamCriteria.type} onChange={(e) => updateNested("teamCriteria", "type", e.target.value)} />
        </Section>

        <Section title="Venue">
          <Select label="Mode" options={["online", "offline"]} value={form.mode} onChange={(e) => update("mode", e.target.value)} />
          {form.mode === "online" ? (
            <>
              <Input label="Platform" value={form.venueDetails.platform} onChange={(e) => updateNested("venueDetails", "platform", e.target.value)} />
              <Input label="Meeting Link" value={form.venueDetails.meetingLink} onChange={(e) => updateNested("venueDetails", "meetingLink", e.target.value)} />
            </>
          ) : (
            <>
              <Input label="Address" value={form.venueDetails.addressLine1} onChange={(e) => updateNested("venueDetails", "addressLine1", e.target.value)} />
              <Input label="City" value={form.venueDetails.city} onChange={(e) => updateNested("venueDetails", "city", e.target.value)} />
              <div className="flex gap-4 md:col-span-2">
                <Input label="Lat" value={form.lat} onChange={(e) => update("lat", e.target.value)} />
                <Input label="Lng" value={form.lng} onChange={(e) => update("lng", e.target.value)} />
                <button type="button" onClick={fetchCurrentLocation} className="mt-6 text-purple-600"><MapPin /></button>
              </div>
            </>
          )}
        </Section>

        <Section title="Banner">
          <label className="flex flex-col items-center justify-center h-48 border-2 border-dashed rounded-2xl cursor-pointer overflow-hidden relative">
            {preview ? (
              <img src={preview} alt="Banner" className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center">
                <UploadCloud />
                <span>Change Banner</span>
              </div>
            )}
            <input type="file" className="hidden" accept="image/*" onChange={handleBannerChange} />
          </label>
        </Section>

        <button disabled={loading} className="w-full bg-black text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-colors">
          {loading ? <Loader2 className="animate-spin mx-auto" /> : "Save Changes"}
        </button>
      </form>
    </div>
  );
}

/* UI HELPERS (Same as Create Event) */
const Section = ({ title, children }) => (
  <section className="bg-white p-6 rounded-3xl shadow-sm space-y-4">
    <h3 className="text-lg font-bold">{title}</h3>
    <div className="grid md:grid-cols-2 gap-4">{children}</div>
  </section>
);

const Input = ({ label, ...props }) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</label>
    <input {...props} className="input h-12 px-4 rounded-xl bg-slate-50 border-none focus:ring-2 ring-purple-100" />
  </div>
);

const Textarea = ({ label, ...props }) => (
  <div className="flex flex-col gap-1 md:col-span-2">
    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</label>
    <textarea {...props} rows={4} className="input p-4 rounded-xl bg-slate-50 border-none focus:ring-2 ring-purple-100" />
  </div>
);

const Select = ({ label, options, ...props }) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</label>
    <select {...props} className="input h-12 px-4 rounded-xl bg-slate-50 border-none focus:ring-2 ring-purple-100">
      {options.map((o) => (
        <option key={o} value={o}>{o.toUpperCase()}</option>
      ))}
    </select>
  </div>
);
