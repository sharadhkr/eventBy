import { useEffect, useState } from "react";
import { organiserAPI } from "../api/api";
import { toast } from "react-hot-toast";

const OrganiserEditProfile = () => {
  const [loading, setLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);

  const [form, setForm] = useState({
    organisationName: "",
    ownerName: "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
    },
    logo: null,
  });

  // Fetch profile
  useEffect(() => {
    organiserAPI.getMe()
      .then((res) => {
        const data = res.data.data;

        setForm({
          organisationName: data.organisationName || "",
          ownerName: data.ownerName || "",
          phone: data.phone || "",
          address: {
            street: data.address?.street || "",
            city: data.address?.city || "",
            state: data.address?.state || "",
            zipCode: data.address?.zipCode || "",
          },
          logo: null,
        });

        if (data.logo) setLogoPreview(data.logo);
      })
      .catch(() => toast.error("Failed to load profile"));
  }, []);

  // Cleanup preview URL
  useEffect(() => {
    return () => {
      if (logoPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(logoPreview);
      }
    };
  }, [logoPreview]);

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      address: { ...prev.address, [name]: value },
    }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await organiserAPI.updateProfile(form);
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-black mb-6">Edit Profile</h1>

      <form onSubmit={submit} className="space-y-6 bg-white p-6 rounded-2xl">

        {/* Logo */}
        <div>
          <label className="block text-sm font-bold mb-2">
            Organisation Logo
          </label>

          {logoPreview && (
            <img
              src={logoPreview}
              alt="Logo preview"
              className="w-24 h-24 rounded-xl mb-3 object-cover"
            />
          )}

          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (!file) return;

              setForm((prev) => ({ ...prev, logo: file }));
              setLogoPreview(URL.createObjectURL(file));
            }}
          />
        </div>

        <input
          className="input"
          placeholder="Organisation Name"
          value={form.organisationName}
          onChange={(e) =>
            setForm({ ...form, organisationName: e.target.value })
          }
        />

        <input
          className="input"
          placeholder="Owner Name"
          value={form.ownerName}
          onChange={(e) =>
            setForm({ ...form, ownerName: e.target.value })
          }
        />

        <input
          className="input"
          placeholder="Phone"
          value={form.phone}
          onChange={(e) =>
            setForm({ ...form, phone: e.target.value })
          }
        />

        {/* Address */}
        <div className="grid grid-cols-2 gap-4">
          <input
            className="input col-span-2"
            name="street"
            placeholder="Street"
            value={form.address.street}
            onChange={handleAddressChange}
          />
          <input
            className="input"
            name="city"
            placeholder="City"
            value={form.address.city}
            onChange={handleAddressChange}
          />
          <input
            className="input"
            name="state"
            placeholder="State"
            value={form.address.state}
            onChange={handleAddressChange}
          />
        </div>

        <button
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold disabled:opacity-60"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default OrganiserEditProfile;
