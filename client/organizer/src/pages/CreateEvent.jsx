import { useState, useEffect } from "react";
import { organiserAPI } from "../api/event.api"; // Ensure this uses axios and supports multipart/form-data
import EventCard from "../components/EventCard";
import { toast } from "react-hot-toast";
import { Loader2, UploadCloud, MapPin, Trophy, Users, Calendar, Info } from "lucide-react";

const CreateEvent = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    eventDate: "",
    registrationDeadline: "",
    mode: "individual",
    minGroupSize: 1,
    maxGroupSize: 1,
    totalCapacity: 1,
    ticketPrice: 0,
    currency: "INR",
    winningPrize: { pool: 0, description: "" },
    location: { type: "Point", address: "", coordinates: [0, 0] },
    banner: "https://placehold.co/600x400/EEE/31343C?text=Event+Banner",
  });

  const [selectedFile, setSelectedFile] = useState(null); // Local state for the image file
  const [loading, setLoading] = useState(false);

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "address") {
      setForm((prev) => ({ ...prev, location: { ...prev.location, address: value } }));
    } else if (name === "prizePool" || name === "prizeDesc") {
      setForm((prev) => ({
        ...prev,
        winningPrize: {
          ...prev.winningPrize,
          [name === "prizePool" ? "pool" : "description"]: value,
        },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle File Selection (No more direct Cloudinary fetch here)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Create a temporary URL for the Preview Card
      const previewUrl = URL.createObjectURL(file);
      setForm((prev) => ({ ...prev, banner: previewUrl }));
    }
  };

  const submit = async (e) => {
  e.preventDefault();
  
  if (form.title.length < 5) return toast.error("Title must be at least 5 characters");
  if (!selectedFile) return toast.error("Please upload an event banner");

  try {
    setLoading(true);

    const formData = new FormData();
    formData.append("banner", selectedFile);

    Object.keys(form).forEach((key) => {
      if (key === "location" || key === "winningPrize") {
        formData.append(key, JSON.stringify(form[key]));
      } else if (key !== "banner") {
        formData.append(key, form[key]);
      }
    });

    // ✅ FIX: Use the specific method from your API object
    await organiserAPI.createEvent(formData); 
    
    toast.success("Event Published Successfully! 🚀");
  } catch (err) {
    console.error(err);
    toast.error(err.response?.data?.message || "Internal Server Error");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 sm:p-8 pb-32">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-5 gap-10">
        
        {/* Left: Form Section */}
        <div className="lg:col-span-3">
          <form onSubmit={submit} className="bg-white p-6 sm:p-10 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-8">
            <header>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Launch Event</h2>
              <p className="text-slate-500 font-medium">Setup your event details and banner.</p>
            </header>

            <div className="space-y-6">
              {/* Title & Description */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Event Title</label>
                  <input name="title" className="w-full p-4 bg-slate-50 border border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl transition-all outline-none font-semibold text-slate-700" onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
                  <textarea name="description" rows="3" className="w-full p-4 bg-slate-50 border border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl transition-all outline-none font-medium text-slate-600" onChange={handleChange} required />
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Event Date</label>
                  <input type="datetime-local" name="eventDate" className="w-full p-4 bg-slate-50 rounded-2xl outline-none" onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Reg. Deadline</label>
                  <input type="datetime-local" name="registrationDeadline" className="w-full p-4 bg-slate-50 rounded-2xl outline-none" onChange={handleChange} required />
                </div>
              </div>

              {/* Price & Capacity */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Ticket Price (INR)</label>
                  <input type="number" name="ticketPrice" className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold" onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Total Capacity</label>
                  <input type="number" name="totalCapacity" className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold" onChange={handleChange} required />
                </div>
              </div>

              {/* Mode & Group Logic */}
              <div className="p-6 bg-slate-50 rounded-3xl space-y-4">
                <div className="flex items-center gap-2 text-slate-600 font-bold text-sm">
                  <Users size={16} /> Team Settings
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <select name="mode" className="flex-1 p-3 bg-white border border-slate-200 rounded-xl outline-none font-bold" onChange={handleChange}>
                    <option value="individual">Individual Entry</option>
                    <option value="group">Group / Team</option>
                  </select>
                  {form.mode === "group" && (
                    <div className="flex gap-2">
                      <input type="number" name="minGroupSize" placeholder="Min" className="w-20 p-3 bg-white border border-slate-200 rounded-xl" onChange={handleChange} />
                      <input type="number" name="maxGroupSize" placeholder="Max" className="w-20 p-3 bg-white border border-slate-200 rounded-xl" onChange={handleChange} />
                    </div>
                  )}
                </div>
              </div>

              {/* Banner Upload UI */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Event Banner</label>
                <label className="relative flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-200 rounded-[2rem] cursor-pointer hover:bg-slate-100 hover:border-indigo-400 transition-all group overflow-hidden">
                  <div className="z-10 flex flex-col items-center">
                    <UploadCloud className={`transition-colors ${selectedFile ? "text-indigo-600" : "text-slate-400"}`} size={32} />
                    <span className="mt-2 text-xs font-bold text-slate-500">
                      {selectedFile ? selectedFile.name : "Click to select banner"}
                    </span>
                  </div>
                  <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                </label>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Venue Address</label>
                <input name="address" className="w-full p-4 bg-slate-50 rounded-2xl outline-none" placeholder="Enter physical or virtual location" onChange={handleChange} required />
              </div>
            </div>

            <button 
              disabled={loading} 
              className="w-full bg-slate-900 text-white py-5 rounded-[2rem] font-black text-lg shadow-xl hover:bg-black transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin mx-auto" /> : "Create Event"}
            </button>
          </form>
        </div>

        {/* Right: Sticky Preview */}
        <div className="lg:col-span-2">
          <div className="sticky top-10 space-y-6">
            <p className="font-black text-slate-400 uppercase text-[10px] tracking-[0.2em] ml-2">Real-time Preview</p>
            <EventCard 
              image={form.banner}
              title={form.title || "Your Event Title"}
              price={form.ticketPrice}
              date={form.eventDate || "Date TBD"}
              location={form.location.address || "Location TBD"}
              mode={form.mode}
            />
            <div className="bg-indigo-600 p-6 rounded-[2rem] text-white shadow-lg shadow-indigo-100">
                <div className="flex items-center gap-2 mb-2 font-bold italic">
                    <Info size={16}/> Tips
                </div>
                <p className="text-[11px] leading-relaxed opacity-90">
                    Banners with less text and high resolution (16:9) perform better. Make sure your registration deadline is at least 24 hours before the event starts.
                </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;