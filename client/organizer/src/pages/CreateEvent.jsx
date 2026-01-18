import React, { useState } from "react";
import { organiserAPI } from "../api/api";
import { 
  Plus, Trash2, UploadCloud, Loader2, MapPin, 
  Sparkles, Calendar, Users, Info, Image as ImageIcon 
} from "lucide-react";
import { toast } from "react-hot-toast";

const EVENT_TYPES = ["hackathon", "workshop", "expert-talk", "competition", "meetup"];
const TEAM_TYPES = ["solo", "duo", "squad"];

export default function OrganiserCreateEventFull() {
  const [loading, setLoading] = useState(false);
  const [banner, setBanner] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);

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

  /* =========================
     HELPERS
  ========================= */
  const update = (key, value) => setForm((p) => ({ ...p, [key]: value }));

  const updateNested = (parent, key, value) =>
    setForm((p) => ({
      ...p,
      [parent]: { ...p[parent], [key]: value },
    }));

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBanner(file);
      setBannerPreview(URL.createObjectURL(file));
    }
  };

  const fetchCurrentLocation = () => {
    if (!navigator.geolocation) return toast.error("Geolocation not supported");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((p) => ({
          ...p,
          lat: pos.coords.latitude.toFixed(6),
          lng: pos.coords.longitude.toFixed(6),
        }));
        toast.success("Location captured 📍");
      },
      () => toast.error("Failed to fetch location"),
      { enableHighAccuracy: true }
    );
  };

  const updateRule = (i, v) => {
    const rules = [...form.rules];
    rules[i] = v;
    update("rules", rules);
  };

  const addRule = () => update("rules", [...form.rules, ""]);
  const removeRule = (i) => update("rules", form.rules.filter((_, idx) => idx !== i));

  /* =========================
     SUBMIT
  ========================= */
  const submit = async (e) => {
    e.preventDefault();
    if (!banner) return toast.error("Banner image is required");

    try {
      setLoading(true);
      const fd = new FormData();
      
      // Append flat fields
      fd.append("title", form.title);
      fd.append("description", form.description);
      fd.append("eventType", form.eventType);
      fd.append("mode", form.mode);
      fd.append("registrationDeadline", form.registrationDeadline);
      fd.append("eventStart", form.eventStart);
      fd.append("eventEnd", form.eventEnd);
      fd.append("banner", banner);

      // Append Objects as JSON strings
      fd.append("rules", JSON.stringify(form.rules.filter(Boolean)));
      fd.append("pricing", JSON.stringify(form.pricing));
      fd.append("teamCriteria", JSON.stringify(form.teamCriteria));
      fd.append("venueDetails", JSON.stringify(form.venueDetails));

      if (form.mode === "offline") {
        fd.append("lat", form.lat);
        fd.append("lng", form.lng);
      }

      await organiserAPI.createEvent(fd);
      toast.success("Event Published Successfully! 🎉");
      navigate("/"); // Redirect to dashboard
    } catch (err) {
      toast.error(err.response?.data?.message || "Creation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] pb-24 relative overflow-x-hidden">
      {/* Background Aura */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-5%] left-[-5%] w-[500px] h-[500px] bg-violet-100/40 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[400px] h-[400px] bg-pink-100/30 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-12">
        <header className="mb-12">
          <div className="flex items-center gap-2 mb-2 text-violet-600 font-black text-[10px] uppercase tracking-[0.3em]">
            <Sparkles size={14} />
            <span>Event Studio</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter leading-none">
            Create Event
          </h1>
        </header>

        <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form Area */}
          <div className="lg:col-span-2 space-y-8">
            
            <Section title="Basic Information" icon={Info}>
              <div className="space-y-6">
                <FloatingInput label="Event Title" required onChange={(e) => update("title", e.target.value)} />
                <textarea 
                  placeholder="Event Description..."
                  className="w-full p-6 bg-gray-50/50 rounded-[2rem] border-none focus:ring-4 focus:ring-violet-500/10 outline-none h-40 font-medium text-gray-800"
                  onChange={(e) => update("description", e.target.value)}
                />
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Category</label>
                  <div className="flex flex-wrap gap-2">
                    {EVENT_TYPES.map(type => (
                      <button 
                        key={type} type="button" 
                        onClick={() => update("eventType", type)}
                        className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all border-2 ${form.eventType === type ? 'bg-violet-600 text-white border-violet-600 shadow-lg' : 'bg-white text-gray-500 border-gray-100 hover:border-violet-200'}`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Section>

            <Section title="Rules & Guidelines" icon={Plus}>
              <div className="space-y-4">
                {form.rules.map((r, i) => (
                  <div key={i} className="flex gap-3">
                    <input 
                      className="flex-1 p-4 bg-gray-50 rounded-2xl border-none outline-none font-medium text-sm" 
                      placeholder={`Rule #${i+1}`}
                      value={r} 
                      onChange={(e) => updateRule(i, e.target.value)} 
                    />
                    {form.rules.length > 1 && (
                      <button type="button" onClick={() => removeRule(i)} className="p-4 text-red-400 hover:bg-red-50 rounded-2xl transition-colors">
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={addRule} className="px-6 py-3 bg-violet-50 text-violet-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-violet-100 transition-all">
                  + Add Rule
                </button>
              </div>
            </Section>

            <Section title="Location & Venue" icon={MapPin}>
              <div className="grid grid-cols-2 gap-4 p-1 bg-gray-100/50 rounded-2xl mb-8">
                {["online", "offline"].map(m => (
                  <button key={m} type="button" onClick={() => update("mode", m)}
                    className={`py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${form.mode === m ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400'}`}>
                    {m}
                  </button>
                ))}
              </div>

              {form.mode === "online" ? (
                <div className="grid md:grid-cols-2 gap-6">
                  <FloatingInput label="Platform" onChange={(e) => updateNested("venueDetails", "platform", e.target.value)} />
                  <FloatingInput label="Meeting Link" onChange={(e) => updateNested("venueDetails", "meetingLink", e.target.value)} />
                </div>
              ) : (
                <div className="space-y-6">
                  <FloatingInput label="Address Line 1" onChange={(e) => updateNested("venueDetails", "addressLine1", e.target.value)} />
                  <div className="grid grid-cols-2 gap-6">
                    <FloatingInput label="City" onChange={(e) => updateNested("venueDetails", "city", e.target.value)} />
                    <FloatingInput label="State" onChange={(e) => updateNested("venueDetails", "state", e.target.value)} />
                  </div>
                  <div className="flex items-center gap-4 bg-violet-50 p-6 rounded-3xl border border-violet-100">
                    <div className="flex-1 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[9px] font-black text-violet-400 uppercase">Latitude</p>
                        <p className="font-bold text-gray-900">{form.lat || "Not Set"}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-violet-400 uppercase">Longitude</p>
                        <p className="font-bold text-gray-900">{form.lng || "Not Set"}</p>
                      </div>
                    </div>
                    <button type="button" onClick={fetchCurrentLocation} className="p-4 bg-violet-600 text-white rounded-2xl hover:bg-violet-700 transition-shadow shadow-lg shadow-violet-200">
                      <MapPin size={20} />
                    </button>
                  </div>
                </div>
              )}
            </Section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-white/80 backdrop-blur-md p-8 rounded-[2.5rem] border border-white shadow-xl shadow-gray-200/30">
              <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                <ImageIcon size={20} className="text-violet-600" /> Banner
              </h3>
              <label className="relative block group cursor-pointer">
                <div className="h-64 w-full rounded-[2rem] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center overflow-hidden transition-all group-hover:border-violet-400 bg-gray-50/50">
                  {bannerPreview ? (
                    <img src={bannerPreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <UploadCloud className="text-gray-300 mb-2" size={40} />
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center px-4">Upload Event Banner</span>
                    </>
                  )}
                </div>
                <input type="file" className="hidden" accept="image/*" onChange={handleBannerChange} />
              </label>
            </div>

            <Section title="Scheduling" icon={Calendar}>
              <div className="space-y-6">
                <FloatingInput type="datetime-local" label="Reg. Deadline" onChange={(e) => update("registrationDeadline", e.target.value)} />
                <FloatingInput type="datetime-local" label="Starts" onChange={(e) => update("eventStart", e.target.value)} />
                <FloatingInput type="datetime-local" label="Ends" onChange={(e) => update("eventEnd", e.target.value)} />
              </div>
            </Section>

            <Section title="Participation" icon={Users}>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                  <span className="text-xs font-black text-gray-500 uppercase">Free Event</span>
                  <input type="checkbox" checked={form.pricing.isFree} onChange={(e) => updateNested("pricing", "isFree", e.target.checked)} className="w-5 h-5 accent-violet-600" />
                </div>
                {!form.pricing.isFree && (
                  <FloatingInput type="number" label="Price (INR)" onChange={(e) => updateNested("pricing", "amount", Number(e.target.value))} />
                )}
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Type</label>
                    <select className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none font-bold text-sm appearance-none"
                      value={form.teamCriteria.type} onChange={(e) => updateNested("teamCriteria", "type", e.target.value)}>
                      {TEAM_TYPES.map(t => <option key={t} value={t}>{t.toUpperCase()}</option>)}
                    </select>
                  </div>
                  {form.teamCriteria.type !== "solo" && (
                    <FloatingInput type="number" label="Max Teams" onChange={(e) => updateNested("teamCriteria", "maxTeamsAllowed", Number(e.target.value))} />
                  )}
                </div>
              </div>
            </Section>

            <button disabled={loading} className="w-full py-5 bg-gray-900 text-white rounded-[2rem] font-black text-lg shadow-2xl hover:bg-black transition-all flex items-center justify-center gap-3">
              {loading ? <Loader2 className="animate-spin" /> : "Launch Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* =========================
   UI HELPERS
========================= */

const Section = ({ title, icon: Icon, children }) => (
  <section className="bg-white/80 backdrop-blur-md p-8 rounded-[3rem] border border-white shadow-xl shadow-gray-200/20 space-y-6">
    <div className="flex items-center gap-3">
      <div className="p-2.5 bg-violet-50 text-violet-600 rounded-xl"><Icon size={20} /></div>
      <h3 className="text-xl font-black text-gray-900 tracking-tight">{title}</h3>
    </div>
    <div className="grid grid-cols-1 gap-4">{children}</div>
  </section>
);

const FloatingInput = ({ label, ...props }) => (
  <div className="relative">
    <label className="absolute -top-2 left-4 bg-white px-2 text-[10px] font-black text-gray-400 uppercase tracking-widest z-10">{label}</label>
    <input {...props} className="w-full p-4 bg-gray-50/50 rounded-2xl border-2 border-transparent focus:border-violet-200 focus:bg-white transition-all outline-none font-bold text-gray-800 placeholder:text-gray-300" />
  </div>
);
