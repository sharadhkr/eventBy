import { useEffect, useState } from "react";
// Assuming organiserAPI and toast are imported from your project
// import { organiserAPI } from "../api/api"; 
// import { toast } from "react-hot-toast";

// Placeholder for API and Toast function for demonstration purposes
const organiserAPI = {
  getMe: () => Promise.resolve({ data: { data: { organisationName: "EventCo LLC", ownerName: "Jane Doe", phone: "123-456-7890", address: { street: "123 Main St", city: "Cityville", state: "ST", zipCode: "12345" }, logo: "https://images.unsplash.com" } } }),
  updateProfile: (form) => Promise.resolve(form)
};
const toast = {
  success: (msg) => console.log(`Success: ${msg}`),
  error: (msg) => console.error(`Error: ${msg}`)
};


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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

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

  // Define a reusable input component for styling consistency
  const StyledInput = ({ name, placeholder, value, onChange, className = '' }) => (
    <input
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition duration-150 ease-in-out shadow-sm ${className}`}
    />
  );

  return (
    // Outer container with a subtle background and padding
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {/* Form container with soft styling and gentle gradient */}
      <div className="max-w-xl w-full">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">Edit Profile</h1>

        <form onSubmit={submit} className="space-y-6 bg-white p-6 sm:p-8 rounded-3xl shadow-xl border border-gray-100">

          {/* Logo Upload Section */}
          <div className="flex flex-col items-center">
            <label className="block text-sm font-semibold text-gray-600 mb-3">
              Organisation Logo
            </label>

            <div className="mb-4">
              {logoPreview ? (
                <img
                  src={logoPreview}
                  alt="Logo preview"
                  className="w-32 h-32 rounded-full object-cover shadow-lg border-4 border-white ring-1 ring-gray-200"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-blue-50 flex items-center justify-center border-2 border-dashed border-blue-300 text-blue-500">
                  No Logo
                </div>
              )}
            </div>

            <label htmlFor="logo-upload" className="cursor-pointer bg-blue-100 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-200 transition duration-150 text-sm font-medium">
              Upload New Logo
              <input
                id="logo-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (!file) return;

                  setForm((prev) => ({ ...prev, logo: file }));
                  setLogoPreview(URL.createObjectURL(file));
                }}
              />
            </label>
          </div>

          {/* General Information Fields */}
          <StyledInput
            name="organisationName"
            placeholder="Organisation Name"
            value={form.organisationName}
            onChange={handleChange}
          />

          <StyledInput
            name="ownerName"
            placeholder="Owner Name"
            value={form.ownerName}
            onChange={handleChange}
          />

          <StyledInput
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
          />

          {/* Address Section */}
          <div className="space-y-4">
            <p className="text-sm font-semibold text-gray-600 pt-2">Organisation Address</p>
            <StyledInput
              className="col-span-2"
              name="street"
              placeholder="Street Address"
              value={form.address.street}
              onChange={handleAddressChange}
            />
            {/* Mobile friendly: stacked inputs for city/state */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <StyledInput
                name="city"
                placeholder="City"
                value={form.address.city}
                onChange={handleAddressChange}
              />
              <StyledInput
                name="state"
                placeholder="State"
                value={form.address.state}
                onChange={handleAddressChange}
              />
            </div>
            {/* Added Zip Code field which was missing in original form */}
            <StyledInput
                name="zipCode"
                placeholder="Zip Code"
                value={form.address.zipCode}
                onChange={handleAddressChange}
              />
          </div>

          {/* Submit Button with soft gradient and hover effect */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-4 rounded-lg font-bold shadow-md hover:from-blue-600 hover:to-indigo-700 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
          >
            {loading ? "Saving Changes..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OrganiserEditProfile;
