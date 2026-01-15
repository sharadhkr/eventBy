import { useEffect, useState } from "react";
import { userAPI } from "../lib/api";
import toast from "react-hot-toast";

export default function EditProfile({ user, onUpdated }) {
  const [name, setName] = useState(user?.displayName || "");
  const [skills, setSkills] = useState(user?.skills || []);
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(user?.photoURL || "");
  const [portfolio, setPortfolio] = useState({
    github: user?.portfolio?.github || "",
    linkedin: user?.portfolio?.linkedin || "",
    website: user?.portfolio?.website || "",
  });
  const [saving, setSaving] = useState(false);
useEffect(() => {
  if (!user) return;

  setName(user.displayName || "");
  setSkills(user.skills || []);
  setPreview(user.photoURL || "");
  setPortfolio({
    github: user.portfolio?.github || "",
    linkedin: user.portfolio?.linkedin || "",
    website: user.portfolio?.website || "",
  });
}, [user]);

  /* Cleanup preview URL */
  useEffect(() => {
    return () => preview && URL.revokeObjectURL(preview);
  }, [preview]);

  const handlePhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return toast.error("Please select an image file");
    }

    setPhoto(file);
    setPreview(URL.createObjectURL(file));
  };

  const addSkill = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const value = e.target.value.trim();
      if (!value || skills.includes(value)) return;
      setSkills((prev) => [...prev, value]);
      e.target.value = "";
    }
  };

  const removeSkill = (skill) => {
    setSkills((prev) => prev.filter((s) => s !== skill));
  };

  const saveProfile = async () => {
    try {
      setSaving(true);

      const form = new FormData();
      form.append("displayName", name.trim());
      form.append("skills", JSON.stringify(skills));
      form.append("portfolio", JSON.stringify(portfolio));
      if (photo) form.append("photo", photo);

      const res = await userAPI.updateProfile(form);

      toast.success("Profile updated successfully");
      onUpdated?.(res.data?.data); // optional parent refresh
    } catch (err) {
      toast.error(err.response?.data?.message || "Profile update failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6 bg-white rounded-2xl shadow">
      <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>

      {/* Avatar */}
      <div className="flex items-center gap-4">
        <img
          src={preview || "/avatar.png"}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover border"
        />
        <label className="cursor-pointer text-sm font-medium text-indigo-600">
          Change photo
          <input
            type="file"
            accept="image/*"
            onChange={handlePhoto}
            className="hidden"
          />
        </label>
      </div>

      {/* Name */}
      <div>
        <label className="text-sm font-medium text-gray-700">Full name</label>
        <input
          className="w-full border p-3 rounded-lg mt-1"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
        />
      </div>

      {/* Skills */}
      <div>
        <label className="text-sm font-medium text-gray-700">Skills</label>
        <input
          className="w-full border p-3 rounded-lg mt-1"
          placeholder="Type skill & press Enter"
          onKeyDown={addSkill}
        />
        <div className="flex flex-wrap gap-2 mt-2">
          {skills.map((skill) => (
            <span
              key={skill}
              className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
            >
              {skill}
              <button
                onClick={() => removeSkill(skill)}
                className="text-indigo-500 hover:text-indigo-700"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Portfolio */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700">Portfolio</label>

        <input
          className="w-full border p-3 rounded-lg"
          placeholder="GitHub URL"
          value={portfolio.github}
          onChange={(e) =>
            setPortfolio({ ...portfolio, github: e.target.value })
          }
        />

        <input
          className="w-full border p-3 rounded-lg"
          placeholder="LinkedIn URL"
          value={portfolio.linkedin}
          onChange={(e) =>
            setPortfolio({ ...portfolio, linkedin: e.target.value })
          }
        />

        <input
          className="w-full border p-3 rounded-lg"
          placeholder="Website URL"
          value={portfolio.website}
          onChange={(e) =>
            setPortfolio({ ...portfolio, website: e.target.value })
          }
        />
      </div>

      {/* Save */}
      <button
        onClick={saveProfile}
        disabled={saving}
        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white p-3 rounded-lg font-semibold transition"
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
}
