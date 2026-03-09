// import React, { useState } from "react";
// import { organiserAPI } from "../api/api";
// import { 
//   Plus, Trash2, UploadCloud, Loader2, MapPin, 
//   Sparkles, Calendar, Users, Info, Image as ImageIcon 
// } from "lucide-react";
// import { toast } from "react-hot-toast";

// const EVENT_TYPES = ["hackathon", "workshop", "expert-talk", "competition", "meetup"];
// const TEAM_TYPES = ["solo", "duo", "squad"];

// export default function OrganiserCreateEventFull() {
//   const [loading, setLoading] = useState(false);
//   const [banner, setBanner] = useState(null);
//   const [bannerPreview, setBannerPreview] = useState(null);

//   const [form, setForm] = useState({
//     title: "",
//     description: "",
//     eventType: "hackathon",
//     rules: [""],
//     registrationDeadline: "",
//     eventStart: "",
//     eventEnd: "",
//     pricing: { isFree: true, amount: 0, currency: "INR" },
//     teamCriteria: { type: "solo", maxTeamsAllowed: 1 },
//     mode: "online",
//     lat: "",
//     lng: "",
//     venueDetails: {
//       platform: "",
//       meetingLink: "",
//       addressLine1: "",
//       city: "",
//       state: "",
//       country: "India",
//       pincode: "",
//     },
//   });

//   /* =========================
//      HELPERS
//   ========================= */
//   const update = (key, value) => setForm((p) => ({ ...p, [key]: value }));

//   const updateNested = (parent, key, value) =>
//     setForm((p) => ({
//       ...p,
//       [parent]: { ...p[parent], [key]: value },
//     }));

//   const handleBannerChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setBanner(file);
//       setBannerPreview(URL.createObjectURL(file));
//     }
//   };

//   const fetchCurrentLocation = () => {
//     if (!navigator.geolocation) return toast.error("Geolocation not supported");
//     navigator.geolocation.getCurrentPosition(
//       (pos) => {
//         setForm((p) => ({
//           ...p,
//           lat: pos.coords.latitude.toFixed(6),
//           lng: pos.coords.longitude.toFixed(6),
//         }));
//         toast.success("Location captured 📍");
//       },
//       () => toast.error("Failed to fetch location"),
//       { enableHighAccuracy: true }
//     );
//   };

//   const updateRule = (i, v) => {
//     const rules = [...form.rules];
//     rules[i] = v;
//     update("rules", rules);
//   };

//   const addRule = () => update("rules", [...form.rules, ""]);
//   const removeRule = (i) => update("rules", form.rules.filter((_, idx) => idx !== i));

//   /* =========================
//      SUBMIT
//   ========================= */
//   const submit = async (e) => {
//     e.preventDefault();
//     if (!banner) return toast.error("Banner image is required");

//     try {
//       setLoading(true);
//       const fd = new FormData();
      
//       // Append flat fields
//       fd.append("title", form.title);
//       fd.append("description", form.description);
//       fd.append("eventType", form.eventType);
//       fd.append("mode", form.mode);
//       fd.append("registrationDeadline", form.registrationDeadline);
//       fd.append("eventStart", form.eventStart);
//       fd.append("eventEnd", form.eventEnd);
//       fd.append("banner", banner);

//       // Append Objects as JSON strings
//       fd.append("rules", JSON.stringify(form.rules.filter(Boolean)));
//       fd.append("pricing", JSON.stringify(form.pricing));
//       fd.append("teamCriteria", JSON.stringify(form.teamCriteria));
//       fd.append("venueDetails", JSON.stringify(form.venueDetails));

//       if (form.mode === "offline") {
//         fd.append("lat", form.lat);
//         fd.append("lng", form.lng);
//       }

//       await organiserAPI.createEvent(fd);
//       toast.success("Event Published Successfully! 🎉");
//       navigate("/"); // Redirect to dashboard
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Creation failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#fafafa] pb-24 relative overflow-x-hidden">
//       {/* Background Aura */}
//       <div className="fixed inset-0 pointer-events-none z-0">
//         <div className="absolute top-[-5%] left-[-5%] w-[500px] h-[500px] bg-violet-100/40 rounded-full blur-[120px]" />
//         <div className="absolute bottom-[10%] right-[-5%] w-[400px] h-[400px] bg-pink-100/30 rounded-full blur-[100px]" />
//       </div>

//       <div className="relative z-10 max-w-6xl mx-auto px-4 py-12">
//         <header className="mb-12">
//           <div className="flex items-center gap-2 mb-2 text-violet-600 font-black text-[10px] uppercase tracking-[0.3em]">
//             <Sparkles size={14} />
//             <span>Event Studio</span>
//           </div>
//           <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter leading-none">
//             Create Event
//           </h1>
//         </header>

//         <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Main Form Area */}
//           <div className="lg:col-span-2 space-y-8">
            
//             <Section title="Basic Information" icon={Info}>
//               <div className="space-y-6">
//                 <FloatingInput label="Event Title" required onChange={(e) => update("title", e.target.value)} />
//                 <textarea 
//                   placeholder="Event Description..."
//                   className="w-full p-6 bg-gray-50/50 rounded-[2rem] border-none focus:ring-4 focus:ring-violet-500/10 outline-none h-40 font-medium text-gray-800"
//                   onChange={(e) => update("description", e.target.value)}
//                 />
//                 <div className="space-y-3">
//                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Category</label>
//                   <div className="flex flex-wrap gap-2">
//                     {EVENT_TYPES.map(type => (
//                       <button 
//                         key={type} type="button" 
//                         onClick={() => update("eventType", type)}
//                         className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all border-2 ${form.eventType === type ? 'bg-violet-600 text-white border-violet-600 shadow-lg' : 'bg-white text-gray-500 border-gray-100 hover:border-violet-200'}`}
//                       >
//                         {type}
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </Section>

//             <Section title="Rules & Guidelines" icon={Plus}>
//               <div className="space-y-4">
//                 {form.rules.map((r, i) => (
//                   <div key={i} className="flex gap-3">
//                     <input 
//                       className="flex-1 p-4 bg-gray-50 rounded-2xl border-none outline-none font-medium text-sm" 
//                       placeholder={`Rule #${i+1}`}
//                       value={r} 
//                       onChange={(e) => updateRule(i, e.target.value)} 
//                     />
//                     {form.rules.length > 1 && (
//                       <button type="button" onClick={() => removeRule(i)} className="p-4 text-red-400 hover:bg-red-50 rounded-2xl transition-colors">
//                         <Trash2 size={18} />
//                       </button>
//                     )}
//                   </div>
//                 ))}
//                 <button type="button" onClick={addRule} className="px-6 py-3 bg-violet-50 text-violet-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-violet-100 transition-all">
//                   + Add Rule
//                 </button>
//               </div>
//             </Section>

//             <Section title="Location & Venue" icon={MapPin}>
//               <div className="grid grid-cols-2 gap-4 p-1 bg-gray-100/50 rounded-2xl mb-8">
//                 {["online", "offline"].map(m => (
//                   <button key={m} type="button" onClick={() => update("mode", m)}
//                     className={`py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${form.mode === m ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400'}`}>
//                     {m}
//                   </button>
//                 ))}
//               </div>

//               {form.mode === "online" ? (
//                 <div className="grid md:grid-cols-2 gap-6">
//                   <FloatingInput label="Platform" onChange={(e) => updateNested("venueDetails", "platform", e.target.value)} />
//                   <FloatingInput label="Meeting Link" onChange={(e) => updateNested("venueDetails", "meetingLink", e.target.value)} />
//                 </div>
//               ) : (
//                 <div className="space-y-6">
//                   <FloatingInput label="Address Line 1" onChange={(e) => updateNested("venueDetails", "addressLine1", e.target.value)} />
//                   <div className="grid grid-cols-2 gap-6">
//                     <FloatingInput label="City" onChange={(e) => updateNested("venueDetails", "city", e.target.value)} />
//                     <FloatingInput label="State" onChange={(e) => updateNested("venueDetails", "state", e.target.value)} />
//                   </div>
//                   <div className="flex items-center gap-4 bg-violet-50 p-6 rounded-3xl border border-violet-100">
//                     <div className="flex-1 grid grid-cols-2 gap-4">
//                       <div>
//                         <p className="text-[9px] font-black text-violet-400 uppercase">Latitude</p>
//                         <p className="font-bold text-gray-900">{form.lat || "Not Set"}</p>
//                       </div>
//                       <div>
//                         <p className="text-[9px] font-black text-violet-400 uppercase">Longitude</p>
//                         <p className="font-bold text-gray-900">{form.lng || "Not Set"}</p>
//                       </div>
//                     </div>
//                     <button type="button" onClick={fetchCurrentLocation} className="p-4 bg-violet-600 text-white rounded-2xl hover:bg-violet-700 transition-shadow shadow-lg shadow-violet-200">
//                       <MapPin size={20} />
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </Section>
//           </div>

//           {/* Sidebar */}
//           <div className="space-y-8">
//             <div className="bg-white/80 backdrop-blur-md p-8 rounded-[2.5rem] border border-white shadow-xl shadow-gray-200/30">
//               <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
//                 <ImageIcon size={20} className="text-violet-600" /> Banner
//               </h3>
//               <label className="relative block group cursor-pointer">
//                 <div className="h-64 w-full rounded-[2rem] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center overflow-hidden transition-all group-hover:border-violet-400 bg-gray-50/50">
//                   {bannerPreview ? (
//                     <img src={bannerPreview} alt="Preview" className="w-full h-full object-cover" />
//                   ) : (
//                     <>
//                       <UploadCloud className="text-gray-300 mb-2" size={40} />
//                       <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center px-4">Upload Event Banner</span>
//                     </>
//                   )}
//                 </div>
//                 <input type="file" className="hidden" accept="image/*" onChange={handleBannerChange} />
//               </label>
//             </div>

//             <Section title="Scheduling" icon={Calendar}>
//               <div className="space-y-6">
//                 <FloatingInput type="datetime-local" label="Reg. Deadline" onChange={(e) => update("registrationDeadline", e.target.value)} />
//                 <FloatingInput type="datetime-local" label="Starts" onChange={(e) => update("eventStart", e.target.value)} />
//                 <FloatingInput type="datetime-local" label="Ends" onChange={(e) => update("eventEnd", e.target.value)} />
//               </div>
//             </Section>

//             <Section title="Participation" icon={Users}>
//               <div className="space-y-6">
//                 <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
//                   <span className="text-xs font-black text-gray-500 uppercase">Free Event</span>
//                   <input type="checkbox" checked={form.pricing.isFree} onChange={(e) => updateNested("pricing", "isFree", e.target.checked)} className="w-5 h-5 accent-violet-600" />
//                 </div>
//                 {!form.pricing.isFree && (
//                   <FloatingInput type="number" label="Price (INR)" onChange={(e) => updateNested("pricing", "amount", Number(e.target.value))} />
//                 )}
//                 <div className="space-y-4">
//                   <div className="space-y-1">
//                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Type</label>
//                     <select className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none font-bold text-sm appearance-none"
//                       value={form.teamCriteria.type} onChange={(e) => updateNested("teamCriteria", "type", e.target.value)}>
//                       {TEAM_TYPES.map(t => <option key={t} value={t}>{t.toUpperCase()}</option>)}
//                     </select>
//                   </div>
//                   {form.teamCriteria.type !== "solo" && (
//                     <FloatingInput type="number" label="Max Teams" onChange={(e) => updateNested("teamCriteria", "maxTeamsAllowed", Number(e.target.value))} />
//                   )}
//                 </div>
//               </div>
//             </Section>

//             <button disabled={loading} className="w-full py-5 bg-gray-900 text-white rounded-[2rem] font-black text-lg shadow-2xl hover:bg-black transition-all flex items-center justify-center gap-3">
//               {loading ? <Loader2 className="animate-spin" /> : "Launch Event"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// /* =========================
//    UI HELPERS
// ========================= */

// const Section = ({ title, icon: Icon, children }) => (
//   <section className="bg-white/80 backdrop-blur-md p-8 rounded-[3rem] border border-white shadow-xl shadow-gray-200/20 space-y-6">
//     <div className="flex items-center gap-3">
//       <div className="p-2.5 bg-violet-50 text-violet-600 rounded-xl"><Icon size={20} /></div>
//       <h3 className="text-xl font-black text-gray-900 tracking-tight">{title}</h3>
//     </div>
//     <div className="grid grid-cols-1 gap-4">{children}</div>
//   </section>
// );

// const FloatingInput = ({ label, ...props }) => (
//   <div className="relative">
//     <label className="absolute -top-2 left-4 bg-white px-2 text-[10px] font-black text-gray-400 uppercase tracking-widest z-10">{label}</label>
//     <input {...props} className="w-full p-4 bg-gray-50/50 rounded-2xl border-2 border-transparent focus:border-violet-200 focus:bg-white transition-all outline-none font-bold text-gray-800 placeholder:text-gray-300" />
//   </div>
// );
import React, { useState, useRef, useEffect } from "react";
import { organiserAPI } from "../api/api";
import {
  Plus, Trash2, UploadCloud, Loader2, MapPin,
  Sparkles, Calendar, Users, Info, Image as ImageIcon,
  ChevronRight, Clock, DollarSign, Globe, Building2,
  ArrowRight, Check, AlertCircle, X
} from "lucide-react";
import { toast } from "react-hot-toast";

const EVENT_TYPES = [
  { id: "hackathon", label: "Hackathon", emoji: "⚡" },
  { id: "workshop", label: "Workshop", emoji: "🛠" },
  { id: "expert-talk", label: "Expert Talk", emoji: "🎙" },
  { id: "competition", label: "Competition", emoji: "🏆" },
  { id: "meetup", label: "Meetup", emoji: "🤝" },
];
const TEAM_TYPES = ["solo", "duo", "squad"];

/* ─── tiny style injector ─── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300&display=swap');

  *, *::before, *::after { box-sizing: border-box; }

  :root {
    --ink: #0e0e11;
    --ink-soft: #4a4a5a;
    --ink-muted: #9898aa;
    --surface: #ffffff;
    --surface-2: #f5f4f2;
    --surface-3: #eeecea;
    --accent: #ff4d1c;
    --accent-soft: #fff0ec;
    --accent-2: #1c1cff;
    --line: rgba(14,14,17,0.08);
    --radius-card: 1.75rem;
    --radius-input: 0.875rem;
    --shadow-card: 0 4px 40px rgba(14,14,17,0.06), 0 1px 3px rgba(14,14,17,0.04);
    --shadow-hover: 0 12px 60px rgba(14,14,17,0.12), 0 2px 6px rgba(14,14,17,0.06);
    --transition: 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .ce-root {
    font-family: 'DM Sans', sans-serif;
    background: #f5f4f2;
    min-height: 100vh;
    color: var(--ink);
    overflow-x: hidden;
  }

  .ce-root * { font-family: inherit; }

  /* noise texture overlay */
  .ce-root::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
    opacity: 0.025;
    pointer-events: none;
    z-index: 0;
  }

  .ce-header-eyebrow {
    font-family: 'Syne', sans-serif;
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--accent);
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .ce-title {
    font-family: 'Syne', sans-serif;
    font-size: clamp(2.8rem, 7vw, 5.5rem);
    font-weight: 800;
    line-height: 0.95;
    letter-spacing: -0.03em;
    color: var(--ink);
  }

  .ce-title span {
    color: var(--accent);
    display: inline-block;
  }

  .ce-card {
    background: var(--surface);
    border-radius: var(--radius-card);
    padding: 2.25rem;
    box-shadow: var(--shadow-card);
    border: 1px solid var(--line);
    transition: box-shadow var(--transition);
  }

  .ce-card:hover { box-shadow: var(--shadow-hover); }

  .ce-section-label {
    font-family: 'Syne', sans-serif;
    font-size: 0.6rem;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--ink-muted);
    margin-bottom: 1rem;
  }

  .ce-section-title {
    font-family: 'Syne', sans-serif;
    font-size: 1.1rem;
    font-weight: 800;
    color: var(--ink);
    letter-spacing: -0.02em;
  }

  .ce-section-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1.75rem;
    padding-bottom: 1.25rem;
    border-bottom: 1px solid var(--line);
  }

  .ce-section-icon {
    width: 2.25rem;
    height: 2.25rem;
    background: var(--accent-soft);
    color: var(--accent);
    border-radius: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  /* Inputs */
  .ce-field {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .ce-label {
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--ink-muted);
    padding-left: 0.125rem;
  }

  .ce-input {
    width: 100%;
    padding: 0.875rem 1.125rem;
    background: var(--surface-2);
    border: 1.5px solid transparent;
    border-radius: var(--radius-input);
    font-size: 0.95rem;
    font-weight: 500;
    color: var(--ink);
    outline: none;
    transition: all var(--transition);
    appearance: none;
  }

  .ce-input::placeholder { color: var(--ink-muted); font-weight: 400; }

  .ce-input:focus {
    background: var(--surface);
    border-color: var(--accent);
    box-shadow: 0 0 0 4px rgba(255, 77, 28, 0.08);
  }

  .ce-textarea {
    resize: none;
    min-height: 10rem;
    line-height: 1.7;
  }

  /* Pill toggle group */
  .ce-tab-group {
    display: flex;
    background: var(--surface-2);
    border-radius: 0.875rem;
    padding: 0.25rem;
    gap: 0.25rem;
  }

  .ce-tab {
    flex: 1;
    padding: 0.625rem 1rem;
    border: none;
    background: transparent;
    border-radius: 0.625rem;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--ink-muted);
    cursor: pointer;
    transition: all var(--transition);
  }

  .ce-tab.active {
    background: var(--surface);
    color: var(--ink);
    box-shadow: 0 2px 8px rgba(14,14,17,0.1);
  }

  /* Event type chips */
  .ce-chip {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.5rem 1rem;
    border-radius: 100px;
    font-size: 0.78rem;
    font-weight: 600;
    border: 1.5px solid var(--line);
    background: var(--surface);
    color: var(--ink-soft);
    cursor: pointer;
    transition: all var(--transition);
  }

  .ce-chip:hover { border-color: var(--accent); color: var(--accent); }

  .ce-chip.active {
    background: var(--accent);
    border-color: var(--accent);
    color: #fff;
  }

  /* Rule row */
  .ce-rule-row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    animation: slideIn 0.2s ease;
  }

  @keyframes slideIn {
    from { opacity: 0; transform: translateY(-6px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .ce-rule-num {
    width: 2rem;
    height: 2rem;
    border-radius: 0.5rem;
    background: var(--surface-2);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.7rem;
    font-weight: 800;
    color: var(--ink-muted);
    flex-shrink: 0;
    font-family: 'Syne', sans-serif;
  }

  .ce-rule-delete {
    width: 2rem;
    height: 2rem;
    border: none;
    background: transparent;
    color: var(--ink-muted);
    cursor: pointer;
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all var(--transition);
    flex-shrink: 0;
  }

  .ce-rule-delete:hover { background: #fff0ee; color: var(--accent); }

  .ce-add-rule {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.5rem 1rem;
    background: none;
    border: 1.5px dashed var(--line);
    border-radius: 0.625rem;
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--ink-muted);
    cursor: pointer;
    transition: all var(--transition);
    letter-spacing: 0.05em;
  }

  .ce-add-rule:hover { border-color: var(--accent); color: var(--accent); background: var(--accent-soft); }

  /* Coord card */
  .ce-coord-card {
    display: flex;
    align-items: center;
    gap: 1rem;
    background: var(--surface-2);
    border: 1px solid var(--line);
    border-radius: var(--radius-input);
    padding: 1.125rem 1.25rem;
  }

  .ce-coord-btn {
    width: 2.75rem;
    height: 2.75rem;
    background: var(--accent);
    border: none;
    border-radius: 0.75rem;
    color: #fff;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: all var(--transition);
    box-shadow: 0 4px 14px rgba(255,77,28,0.35);
  }

  .ce-coord-btn:hover { transform: scale(1.06); box-shadow: 0 6px 20px rgba(255,77,28,0.45); }

  .ce-coord-val { font-size: 0.8rem; font-weight: 600; color: var(--ink); }
  .ce-coord-key { font-size: 0.65rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--ink-muted); margin-bottom: 0.15rem; }

  /* Toggle switch */
  .ce-toggle-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.875rem 1.125rem;
    background: var(--surface-2);
    border-radius: var(--radius-input);
  }

  .ce-toggle-label { font-size: 0.85rem; font-weight: 600; color: var(--ink); }
  .ce-toggle-sub { font-size: 0.7rem; color: var(--ink-muted); margin-top: 0.1rem; }

  .ce-switch { position: relative; width: 2.5rem; height: 1.375rem; flex-shrink: 0; }
  .ce-switch input { opacity: 0; width: 0; height: 0; }
  .ce-switch-slider {
    position: absolute; inset: 0;
    background: var(--surface-3);
    border-radius: 100px;
    cursor: pointer;
    transition: background var(--transition);
  }
  .ce-switch-slider::before {
    content: '';
    position: absolute;
    left: 3px; top: 3px;
    width: 1.1rem; height: 1.1rem;
    background: #fff;
    border-radius: 50%;
    transition: transform var(--transition);
    box-shadow: 0 1px 4px rgba(0,0,0,0.2);
  }
  .ce-switch input:checked + .ce-switch-slider { background: var(--accent); }
  .ce-switch input:checked + .ce-switch-slider::before { transform: translateX(1.125rem); }

  /* Banner upload */
  .ce-banner-zone {
    position: relative;
    height: 16rem;
    border-radius: 1.25rem;
    border: 2px dashed var(--line);
    overflow: hidden;
    cursor: pointer;
    background: var(--surface-2);
    transition: all var(--transition);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .ce-banner-zone:hover { border-color: var(--accent); background: var(--accent-soft); }

  .ce-banner-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    pointer-events: none;
  }

  .ce-banner-icon {
    width: 3.5rem; height: 3.5rem;
    background: var(--surface);
    border-radius: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--ink-muted);
    box-shadow: var(--shadow-card);
  }

  .ce-banner-hint { font-size: 0.75rem; font-weight: 600; color: var(--ink-muted); text-align: center; }
  .ce-banner-sub { font-size: 0.65rem; color: var(--ink-muted); opacity: 0.6; }

  /* Submit button */
  .ce-submit {
    width: 100%;
    padding: 1.125rem 2rem;
    background: var(--ink);
    color: #fff;
    border: none;
    border-radius: 1rem;
    font-family: 'Syne', sans-serif;
    font-size: 1rem;
    font-weight: 800;
    letter-spacing: 0.02em;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    transition: all var(--transition);
    position: relative;
    overflow: hidden;
  }

  .ce-submit::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, var(--accent) 0%, #ff8c42 100%);
    opacity: 0;
    transition: opacity var(--transition);
  }

  .ce-submit:hover::before { opacity: 1; }
  .ce-submit:hover { transform: translateY(-1px); box-shadow: 0 8px 30px rgba(255,77,28,0.4); }
  .ce-submit:active { transform: translateY(0); }
  .ce-submit:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

  .ce-submit span, .ce-submit svg { position: relative; z-index: 1; }

  /* Step indicator */
  .ce-steps {
    display: flex;
    gap: 0.375rem;
    align-items: center;
    margin-bottom: 0.75rem;
  }

  .ce-step-dot {
    width: 0.375rem; height: 0.375rem;
    border-radius: 50%;
    background: var(--surface-3);
    transition: all var(--transition);
  }
  .ce-step-dot.done { background: var(--accent); }
  .ce-step-dot.active { background: var(--accent); width: 1.25rem; border-radius: 100px; }

  /* Datetime input fix */
  input[type="datetime-local"]::-webkit-calendar-picker-indicator {
    opacity: 0.4;
    cursor: pointer;
  }

  /* Grid helpers */
  .ce-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
  @media (max-width: 640px) { .ce-grid-2 { grid-template-columns: 1fr; } }

  /* Price badge */
  .ce-price-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    padding: 0.3rem 0.75rem;
    background: #e6f9f0;
    color: #0a8a4a;
    border-radius: 100px;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.05em;
  }

  .ce-divider {
    height: 1px;
    background: var(--line);
    margin: 1.5rem 0;
  }

  .ce-select-wrapper { position: relative; }
  .ce-select-wrapper::after {
    content: '▾';
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    font-size: 0.75rem;
    color: var(--ink-muted);
    pointer-events: none;
  }
`;

export default function OrganiserCreateEventFull() {
  const [loading, setLoading] = useState(false);
  const [banner, setBanner] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [activeStep, setActiveStep] = useState(0);

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

  const update = (key, value) => setForm((p) => ({ ...p, [key]: value }));
  const updateNested = (parent, key, value) =>
    setForm((p) => ({ ...p, [parent]: { ...p[parent], [key]: value } }));

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (file) { setBanner(file); setBannerPreview(URL.createObjectURL(file)); }
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
        toast.success("Location captured");
      },
      () => toast.error("Failed to fetch location"),
      { enableHighAccuracy: true }
    );
  };

  const updateRule = (i, v) => {
    const rules = [...form.rules]; rules[i] = v; update("rules", rules);
  };
  const addRule = () => update("rules", [...form.rules, ""]);
  const removeRule = (i) => update("rules", form.rules.filter((_, idx) => idx !== i));

  const submit = async (e) => {
    e.preventDefault();
    if (!banner) return toast.error("Banner image is required");
    try {
      setLoading(true);
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("description", form.description);
      fd.append("eventType", form.eventType);
      fd.append("mode", form.mode);
      fd.append("registrationDeadline", form.registrationDeadline);
      fd.append("eventStart", form.eventStart);
      fd.append("eventEnd", form.eventEnd);
      fd.append("banner", banner);
      fd.append("rules", JSON.stringify(form.rules.filter(Boolean)));
      fd.append("pricing", JSON.stringify(form.pricing));
      fd.append("teamCriteria", JSON.stringify(form.teamCriteria));
      fd.append("venueDetails", JSON.stringify(form.venueDetails));
      if (form.mode === "offline") { fd.append("lat", form.lat); fd.append("lng", form.lng); }
      await organiserAPI.createEvent(fd);
      toast.success("Event launched successfully! 🎉");
    } catch (err) {
      toast.error(err.response?.data?.message || "Creation failed");
    } finally {
      setLoading(false);
    }
  };

  // Track progress for step dots
  const filled = [
    form.title,
    form.description,
    bannerPreview,
    form.registrationDeadline,
    form.eventStart,
    form.eventEnd,
  ];
  const progress = filled.filter(Boolean).length;

  return (
    <>
      <style>{STYLES}</style>
      <div className="ce-root">
        <div style={{ position: "relative", zIndex: 1, maxWidth: "1100px", margin: "0 auto", padding: "3rem 1.5rem 6rem" }}>

          {/* Header */}
          <header style={{ marginBottom: "3.5rem" }}>
            <div className="ce-header-eyebrow" style={{ marginBottom: "0.875rem" }}>
              <Sparkles size={12} /> Event Studio
            </div>
            <h1 className="ce-title">
              Create<br /><span>Your Event.</span>
            </h1>
            <p style={{ marginTop: "1.25rem", fontSize: "1rem", color: "var(--ink-soft)", maxWidth: "380px", lineHeight: 1.6 }}>
              Fill in the details below to publish your event and start collecting registrations.
            </p>
            {/* Progress dots */}
            <div className="ce-steps" style={{ marginTop: "1.5rem" }}>
              {[0,1,2,3,4,5].map(i => (
                <div key={i} className={`ce-step-dot ${i < progress ? "done" : ""} ${i === progress ? "active" : ""}`} />
              ))}
              <span style={{ fontSize: "0.7rem", color: "var(--ink-muted)", fontWeight: 600, marginLeft: "0.25rem" }}>
                {progress}/6 fields
              </span>
            </div>
          </header>

          <div style={{ display: "grid", gridTemplateColumns: "1fr minmax(0, 340px)", gap: "1.5rem", alignItems: "start" }}>

            {/* ── LEFT COLUMN ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

              {/* Basic Info */}
              <Card>
                <SectionHeader icon={Info} label="Step 01" title="Basic Information" />
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  <Field label="Event Title *">
                    <input
                      className="ce-input"
                      placeholder="e.g. HackFest 2025"
                      onChange={(e) => update("title", e.target.value)}
                    />
                  </Field>
                  <Field label="Description *">
                    <textarea
                      className="ce-input ce-textarea"
                      placeholder="Tell participants what this event is about…"
                      onChange={(e) => update("description", e.target.value)}
                    />
                  </Field>
                  <Field label="Category">
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                      {EVENT_TYPES.map(({ id, label, emoji }) => (
                        <button
                          key={id} type="button"
                          onClick={() => update("eventType", id)}
                          className={`ce-chip ${form.eventType === id ? "active" : ""}`}
                        >
                          <span>{emoji}</span> {label}
                        </button>
                      ))}
                    </div>
                  </Field>
                </div>
              </Card>

              {/* Rules */}
              <Card>
                <SectionHeader icon={AlertCircle} label="Step 02" title="Rules & Guidelines" />
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {form.rules.map((r, i) => (
                    <div key={i} className="ce-rule-row">
                      <div className="ce-rule-num">{String(i + 1).padStart(2, "0")}</div>
                      <input
                        className="ce-input"
                        style={{ flex: 1 }}
                        placeholder={`Rule ${i + 1}`}
                        value={r}
                        onChange={(e) => updateRule(i, e.target.value)}
                      />
                      {form.rules.length > 1 && (
                        <button type="button" className="ce-rule-delete" onClick={() => removeRule(i)}>
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button type="button" className="ce-add-rule" onClick={addRule}>
                    <Plus size={13} /> Add Rule
                  </button>
                </div>
              </Card>

              {/* Location */}
              <Card>
                <SectionHeader icon={MapPin} label="Step 03" title="Location & Venue" />
                <Field label="Event Mode">
                  <div className="ce-tab-group">
                    {["online", "offline"].map(m => (
                      <button key={m} type="button"
                        className={`ce-tab ${form.mode === m ? "active" : ""}`}
                        onClick={() => update("mode", m)}>
                        {m === "online" ? "🌐 Online" : "📍 In-Person"}
                      </button>
                    ))}
                  </div>
                </Field>

                {form.mode === "online" ? (
                  <div className="ce-grid-2" style={{ marginTop: "1rem" }}>
                    <Field label="Platform">
                      <input className="ce-input" placeholder="Zoom, Discord…" onChange={(e) => updateNested("venueDetails", "platform", e.target.value)} />
                    </Field>
                    <Field label="Meeting Link">
                      <input className="ce-input" placeholder="https://…" onChange={(e) => updateNested("venueDetails", "meetingLink", e.target.value)} />
                    </Field>
                  </div>
                ) : (
                  <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <Field label="Address">
                      <input className="ce-input" placeholder="Street address" onChange={(e) => updateNested("venueDetails", "addressLine1", e.target.value)} />
                    </Field>
                    <div className="ce-grid-2">
                      <Field label="City">
                        <input className="ce-input" placeholder="Mumbai" onChange={(e) => updateNested("venueDetails", "city", e.target.value)} />
                      </Field>
                      <Field label="State">
                        <input className="ce-input" placeholder="Maharashtra" onChange={(e) => updateNested("venueDetails", "state", e.target.value)} />
                      </Field>
                    </div>
                    <div className="ce-coord-card">
                      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                        <div>
                          <div className="ce-coord-key">Latitude</div>
                          <div className="ce-coord-val">{form.lat || "—"}</div>
                        </div>
                        <div>
                          <div className="ce-coord-key">Longitude</div>
                          <div className="ce-coord-val">{form.lng || "—"}</div>
                        </div>
                      </div>
                      <button type="button" className="ce-coord-btn" onClick={fetchCurrentLocation} title="Use my location">
                        <MapPin size={18} />
                      </button>
                    </div>
                  </div>
                )}
              </Card>
            </div>

            {/* ── RIGHT SIDEBAR ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", position: "sticky", top: "1.5rem" }}>

              {/* Banner */}
              <Card>
                <SectionHeader icon={ImageIcon} label="Required" title="Event Banner" />
                <label style={{ display: "block", cursor: "pointer" }}>
                  <div className="ce-banner-zone">
                    {bannerPreview ? (
                      <>
                        <img src={bannerPreview} alt="Banner preview" style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 }} />
                        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.35)", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0, transition: "opacity 0.2s" }}
                          onMouseEnter={e => e.currentTarget.style.opacity = 1}
                          onMouseLeave={e => e.currentTarget.style.opacity = 0}>
                          <span style={{ color: "#fff", fontSize: "0.75rem", fontWeight: 700 }}>Change image</span>
                        </div>
                      </>
                    ) : (
                      <div className="ce-banner-empty">
                        <div className="ce-banner-icon"><UploadCloud size={22} /></div>
                        <div>
                          <div className="ce-banner-hint">Drop your banner here</div>
                          <div className="ce-banner-sub" style={{ textAlign: "center", marginTop: "0.2rem" }}>PNG, JPG up to 5MB</div>
                        </div>
                      </div>
                    )}
                  </div>
                  <input type="file" style={{ display: "none" }} accept="image/*" onChange={handleBannerChange} />
                </label>
              </Card>

              {/* Scheduling */}
              <Card>
                <SectionHeader icon={Calendar} label="Step 04" title="Scheduling" />
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <Field label="Registration Deadline *">
                    <input type="datetime-local" className="ce-input" onChange={(e) => update("registrationDeadline", e.target.value)} />
                  </Field>
                  <Field label="Starts *">
                    <input type="datetime-local" className="ce-input" onChange={(e) => update("eventStart", e.target.value)} />
                  </Field>
                  <Field label="Ends *">
                    <input type="datetime-local" className="ce-input" onChange={(e) => update("eventEnd", e.target.value)} />
                  </Field>
                </div>
              </Card>

              {/* Participation */}
              <Card>
                <SectionHeader icon={Users} label="Step 05" title="Participation" />
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div className="ce-toggle-row">
                    <div>
                      <div className="ce-toggle-label">Free Event</div>
                      <div className="ce-toggle-sub">No registration fee</div>
                    </div>
                    <label className="ce-switch">
                      <input type="checkbox" checked={form.pricing.isFree}
                        onChange={(e) => updateNested("pricing", "isFree", e.target.checked)} />
                      <span className="ce-switch-slider" />
                    </label>
                  </div>

                  {!form.pricing.isFree && (
                    <Field label="Entry Fee (INR)">
                      <input type="number" className="ce-input" placeholder="0" onChange={(e) => updateNested("pricing", "amount", Number(e.target.value))} />
                    </Field>
                  )}

                  <Field label="Participation Type">
                    <div className="ce-tab-group">
                      {TEAM_TYPES.map(t => (
                        <button key={t} type="button"
                          className={`ce-tab ${form.teamCriteria.type === t ? "active" : ""}`}
                          onClick={() => updateNested("teamCriteria", "type", t)}>
                          {t.charAt(0).toUpperCase() + t.slice(1)}
                        </button>
                      ))}
                    </div>
                  </Field>

                  {form.teamCriteria.type !== "solo" && (
                    <Field label="Max Teams Allowed">
                      <input type="number" className="ce-input" placeholder="10"
                        onChange={(e) => updateNested("teamCriteria", "maxTeamsAllowed", Number(e.target.value))} />
                    </Field>
                  )}
                </div>
              </Card>

              {/* Submit */}
              <button type="button" onClick={submit} className="ce-submit" disabled={loading}>
                {loading ? (
                  <><Loader2 className="animate-spin" size={18} /><span>Publishing…</span></>
                ) : (
                  <><span>Launch Event</span><ArrowRight size={18} /></>
                )}
              </button>

              <p style={{ textAlign: "center", fontSize: "0.7rem", color: "var(--ink-muted)", marginTop: "-0.5rem" }}>
                Your event will be visible to participants immediately after launch.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ── Small composable UI pieces ── */

const Card = ({ children }) => (
  <div className="ce-card">{children}</div>
);

const SectionHeader = ({ icon: Icon, label, title }) => (
  <div className="ce-section-header">
    <div className="ce-section-icon"><Icon size={17} /></div>
    <div>
      <div className="ce-section-label">{label}</div>
      <div className="ce-section-title">{title}</div>
    </div>
  </div>
);

const Field = ({ label, children }) => (
  <div className="ce-field">
    {label && <label className="ce-label">{label}</label>}
    {children}
  </div>
);