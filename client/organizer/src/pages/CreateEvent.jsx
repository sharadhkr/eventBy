import React, { useState } from "react";
import { organiserAPI } from "../api/api";
import { Plus, Trash2, UploadCloud, Loader2, MapPin } from "lucide-react";
import { toast } from "react-hot-toast";

const EVENT_TYPES = ["hackathon", "workshop", "expert-talk", "competition", "meetup"];
const TEAM_TYPES = ["solo", "duo", "squad"];

export default function OrganiserCreateEventFull() {
  const [loading, setLoading] = useState(false);
  const [banner, setBanner] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    eventType: "hackathon",

    rules: [""],

    registrationDeadline: "",
    eventStart: "",
    eventEnd: "",

    pricing: {
      isFree: true,
      amount: 0,
      currency: "INR",
    },

    teamCriteria: {
      type: "solo",
      maxTeamsAllowed: 1,
    },

    mode: "online",

    // 🔥 ROOT GEO (BACKEND EXPECTS THIS)
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

  const update = (key, value) =>
    setForm((p) => ({ ...p, [key]: value }));

  const updateNested = (parent, key, value) =>
    setForm((p) => ({
      ...p,
      [parent]: { ...p[parent], [key]: value },
    }));

  /* =========================
     GEO LOCATION
  ========================= */

  const fetchCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported");
      return;
    }

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
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  /* =========================
     RULES
  ========================= */

  const updateRule = (i, v) => {
    const rules = [...form.rules];
    rules[i] = v;
    update("rules", rules);
  };

  const addRule = () => update("rules", [...form.rules, ""]);
  const removeRule = (i) =>
    update("rules", form.rules.filter((_, idx) => idx !== i));

  /* =========================
     SUBMIT
  ========================= */

  const submit = async (e) => {
    e.preventDefault();

    if (!banner) return toast.error("Banner required");

    if (form.mode === "offline" && (!form.lat || !form.lng)) {
      return toast.error("Latitude & Longitude required");
    }

    try {
      setLoading(true);

      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("description", form.description);
      fd.append("eventType", form.eventType);
      fd.append("rules", JSON.stringify(form.rules.filter(Boolean)));
      fd.append("registrationDeadline", form.registrationDeadline);
      fd.append("eventStart", form.eventStart);
      fd.append("eventEnd", form.eventEnd);
      fd.append("pricing", JSON.stringify(form.pricing));
      fd.append("teamCriteria", JSON.stringify(form.teamCriteria));
      fd.append("mode", form.mode);
      fd.append("venueDetails", JSON.stringify(form.venueDetails));
      fd.append("banner", banner);

      // 🔥 GEO
      if (form.mode === "offline") {
        fd.append("lat", form.lat);
        fd.append("lng", form.lng);
      }

      await organiserAPI.createEvent(fd);
      toast.success("Event created 🎉");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     UI
  ========================= */

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10">
      <header>
        <h1 className="text-3xl font-black">Create Event</h1>
        <p className="text-slate-500">Professional event creation</p>
      </header>

      <form onSubmit={submit} className="space-y-10">

        {/* BASIC */}
        <Section title="Basic Information">
          <Input label="Event Title" required onChange={(e) => update("title", e.target.value)} />
          <Textarea label="Description" onChange={(e) => update("description", e.target.value)} />
          <Select label="Event Type" options={EVENT_TYPES} value={form.eventType} onChange={(e) => update("eventType", e.target.value)} />
        </Section>

        {/* RULES */}
        <Section title="Rules">
          {form.rules.map((r, i) => (
            <div key={i} className="flex gap-2">
              <input className="input" value={r} onChange={(e) => updateRule(i, e.target.value)} />
              {form.rules.length > 1 && (
                <button type="button" onClick={() => removeRule(i)} className="icon-btn">
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={addRule} className="text-purple-600 text-sm flex gap-1">
            <Plus size={16} /> Add Rule
          </button>
        </Section>

        {/* DATES */}
        <Section title="Dates">
          <Input type="datetime-local" label="Registration Deadline" required onChange={(e) => update("registrationDeadline", e.target.value)} />
          <Input type="datetime-local" label="Event Start" required onChange={(e) => update("eventStart", e.target.value)} />
          <Input type="datetime-local" label="Event End" required onChange={(e) => update("eventEnd", e.target.value)} />
        </Section>

        {/* PRICING */}
        <Section title="Pricing">
          <label className="flex gap-2 items-center">
            <input type="checkbox" checked={form.pricing.isFree} onChange={(e) => updateNested("pricing", "isFree", e.target.checked)} />
            Free Event
          </label>
          {!form.pricing.isFree && (
            <Input type="number" label="Ticket Price (INR)" onChange={(e) => updateNested("pricing", "amount", Number(e.target.value))} />
          )}
        </Section>

        {/* TEAM */}
        <Section title="Participation">
          <Select label="Type" options={TEAM_TYPES} value={form.teamCriteria.type} onChange={(e) => updateNested("teamCriteria", "type", e.target.value)} />
          {form.teamCriteria.type !== "solo" && (
            <Input type="number" label="Max Teams" onChange={(e) => updateNested("teamCriteria", "maxTeamsAllowed", Number(e.target.value))} />
          )}
        </Section>

        {/* VENUE */}
        <Section title="Venue">
          <Select label="Mode" options={["online", "offline"]} value={form.mode} onChange={(e) => update("mode", e.target.value)} />

          {form.mode === "online" ? (
            <>
              <Input label="Platform" onChange={(e) => updateNested("venueDetails", "platform", e.target.value)} />
              <Input label="Meeting Link" onChange={(e) => updateNested("venueDetails", "meetingLink", e.target.value)} />
            </>
          ) : (
            <>
              <Input label="Address Line 1" onChange={(e) => updateNested("venueDetails", "addressLine1", e.target.value)} />
              <Input label="City" onChange={(e) => updateNested("venueDetails", "city", e.target.value)} />
              <Input label="State" onChange={(e) => updateNested("venueDetails", "state", e.target.value)} />

              <div className="grid grid-cols-2 gap-4">
                <Input label="Latitude" value={form.lat} onChange={(e) => update("lat", e.target.value)} />
                <Input label="Longitude" value={form.lng} onChange={(e) => update("lng", e.target.value)} />
              </div>

              <button type="button" onClick={fetchCurrentLocation} className="flex items-center gap-2 text-purple-600 font-semibold">
                <MapPin size={16} /> Use current location
              </button>
            </>
          )}
        </Section>

        {/* BANNER */}
        <Section title="Banner">
          <label className="flex flex-col items-center justify-center h-36 border-2 border-dashed rounded-2xl cursor-pointer">
            <UploadCloud />
            <span>Upload Banner</span>
            <input type="file" className="hidden" accept="image/*" onChange={(e) => setBanner(e.target.files[0])} />
          </label>
        </Section>

        <button disabled={loading} className="w-full bg-black text-white py-4 rounded-2xl font-bold">
          {loading ? <Loader2 className="animate-spin mx-auto" /> : "Create Event"}
        </button>
      </form>
    </div>
  );
}

/* =========================
   UI HELPERS
========================= */

const Section = ({ title, children }) => (
  <section className="bg-white p-6 rounded-3xl shadow-sm space-y-4">
    <h3 className="text-lg font-bold">{title}</h3>
    <div className="grid md:grid-cols-2 gap-4">{children}</div>
  </section>
);

const Input = ({ label, ...props }) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-semibold text-slate-500">{label}</label>
    <input {...props} className="input" />
  </div>
);

const Textarea = ({ label, ...props }) => (
  <div className="flex flex-col gap-1 md:col-span-2">
    <label className="text-xs font-semibold text-slate-500">{label}</label>
    <textarea {...props} rows={4} className="input" />
  </div>
);

const Select = ({ label, options, ...props }) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-semibold text-slate-500">{label}</label>
    <select {...props} className="input">
      {options.map((o) => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  </div>
);
