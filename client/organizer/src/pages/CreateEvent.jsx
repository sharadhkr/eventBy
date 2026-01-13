import { useState } from "react";
import { organiserAPI  } from "../api/event.api"; // Using the standardized API file we built
import EventCard from "../components/EventCard";
import { toast } from "react-hot-toast";
import { Loader2, UploadCloud } from "lucide-react";

const CreateEvent = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    eventDate: "",
    registrationDeadline: "",
    location: { address: "" }, // Matches production schema
    ticketPrice: 0,
    totalCapacity: 0,
    banner: "sharad.img",
    mode: "individual"
  });

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "address") {
      setForm({ ...form, location: { address: value } });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

const handleImageUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // 1. HARDCODE YOUR CLOUD NAME FOR TESTING (To rule out variable issues)
  const CLOUD_NAME = "dyiceeiua"; 
  const UPLOAD_PRESET = "eventrix"; // Your Unsigned preset name

  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", UPLOAD_PRESET);

  try {
    setUploading(true);
    
    // 2. Log the URL being hit
    const url = `api.cloudinary.com{CLOUD_NAME}/image/upload`;
    console.log("Uploading to:", url);

    const res = await fetch(url, {
      method: "POST",
      body: data,
    });

    // 3. CRITICAL: Check response text BEFORE parsing JSON
    const responseText = await res.text();
    console.log("Raw Server Response:", responseText); // <--- CHECK THIS LOG

    if (!res.ok) {
      throw new Error(`Upload failed: ${res.status} - ${responseText}`);
    }

    // Only parse if we know it's valid JSON
    const result = JSON.parse(responseText);
    
    setForm((prev) => ({ ...prev, banner: result.secure_url }));
    toast.success("Image uploaded!");

  } catch (err) {
    console.error("Upload Error:", err);
    toast.error(err.message);
  } finally {
    setUploading(false);
  }
};



  const submit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      // Using the centralized API client we updated earlier
      await organiserAPI .createEvent(form); 
      toast.success("Event published successfully! 🎉");
    } catch (err) {
      toast.error(err.response?.data?.message || "Creation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 p-6 bg-slate-50 min-h-screen">
      {/* FORM SECTION */}
      <div className="space-y-6">
        <header>
          <h2 className="text-3xl font-black text-slate-800">Create New Event</h2>
          <p className="text-slate-500">Fill in the details for your upcoming event</p>
        </header>

        <form onSubmit={submit} className="space-y-4 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-xs font-bold uppercase text-slate-400 ml-1">Event Title</label>
              <input name="title" className="w-full p-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-purple-500" onChange={handleChange} required />
            </div>

            <div className="col-span-2">
              <label className="text-xs font-bold uppercase text-slate-400 ml-1">Description</label>
              <textarea name="description" rows="3" className="w-full p-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-purple-500" onChange={handleChange} />
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-slate-400 ml-1">Event Date</label>
              <input type="datetime-local" name="eventDate" className="w-full p-3 bg-slate-50 rounded-xl border-none" onChange={handleChange} required />
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-slate-400 ml-1">Deadline</label>
              <input type="datetime-local" name="registrationDeadline" className="w-full p-3 bg-slate-50 rounded-xl border-none" onChange={handleChange} required />
            </div>

            <div className="col-span-2">
              <label className="text-xs font-bold uppercase text-slate-400 ml-1">Full Address</label>
              <input name="address" className="w-full p-3 bg-slate-50 rounded-xl border-none" onChange={handleChange} required />
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-slate-400 ml-1">Ticket Price ($)</label>
              <input type="number" name="ticketPrice" className="w-full p-3 bg-slate-50 rounded-xl border-none" onChange={handleChange} />
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-slate-400 ml-1">Max Capacity</label>
              <input type="number" name="totalCapacity" className="w-full p-3 bg-slate-50 rounded-xl border-none" onChange={handleChange} required />
            </div>
          </div>

          <div className="relative">
             <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-50 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <UploadCloud className="text-slate-400 mb-2" />
                  <p className="text-sm text-slate-500 font-medium">{uploading ? "Uploading..." : "Click to upload banner"}</p>
                </div>
                <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
             </label>
          </div>

          <button disabled={loading || uploading} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold text-lg hover:bg-black transition-all disabled:opacity-50">
            {loading ? <Loader2 className="animate-spin mx-auto" /> : "Publish Event"}
          </button>
        </form>
      </div>

      {/* PREVIEW SECTION */}
      <div className="relative">
        <div className="sticky top-10">
          <div className="flex items-center gap-2 mb-6">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <h3 className="font-bold text-slate-800">Live Card Preview</h3>
          </div>
          <div className="flex justify-center">
            <EventCard 
              image={form.banner}
              title={form.title || "Your Event Title"}
              price={form.ticketPrice}
              date={form.eventDate ? new Date(form.eventDate).toDateString() : "Date not set"}
              location={form.location.address || "Location not set"}
              mode={form.mode}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;
