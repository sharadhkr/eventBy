import { useState } from "react";
import { organiserAPI } from "../api/api";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Loader2, ShieldCheck, Building, User, Phone, MapPin } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    organisationName: "",
    ownerName: "",
    email: "",
    phone: "",
    password: "",
    address: { street: "", city: "", state: "", zipCode: "" }
  });

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      address: { ...prev.address, [name]: value }
    }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await organiserAPI.register(form);
      toast.success("Account created! Please login.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-2xl bg-white p-8 sm:p-12 rounded-[3rem] shadow-sm border border-slate-100">
        <header className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl mb-4">
            <ShieldCheck size={28} />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Create Organiser Account</h1>
          <p className="text-slate-500 font-medium mt-2">Start hosting and managing your events today.</p>
        </header>

        <form onSubmit={submit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Organisation Name */}
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Organisation Name</label>
              <div className="relative">
                <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input required className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl outline-none" 
                  value={form.organisationName} onChange={(e) => setForm({...form, organisationName: e.target.value})} />
              </div>
            </div>

            {/* Owner Name */}
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Owner Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input required className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl outline-none" 
                  value={form.ownerName} onChange={(e) => setForm({...form, ownerName: e.target.value})} />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
              <input type="email" required className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none" 
                value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} />
            </div>

            {/* Phone */}
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input required className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl outline-none" 
                  value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} />
              </div>
            </div>
          </div>

          {/* Address Section */}
          <div className="p-6 bg-slate-50 rounded-3xl space-y-4">
             <div className="flex items-center gap-2 text-slate-600 font-bold text-xs uppercase tracking-wider">
               <MapPin size={14} /> Business Address
             </div>
             <div className="grid grid-cols-2 gap-4">
                <input placeholder="Street" name="street" className="col-span-2 w-full p-3 bg-white rounded-xl outline-none" onChange={handleAddressChange} />
                <input placeholder="City" name="city" className="w-full p-3 bg-white rounded-xl outline-none" onChange={handleAddressChange} />
                <input placeholder="State" name="state" className="w-full p-3 bg-white rounded-xl outline-none" onChange={handleAddressChange} />
             </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password (Min 8 characters)</label>
            <input type="password" required className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none font-bold" 
              value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} />
          </div>

          <button disabled={loading} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-lg shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all disabled:opacity-50">
            {loading ? <Loader2 className="animate-spin mx-auto" /> : "Complete Registration"}
          </button>
        </form>

        <p className="text-center mt-8 text-sm text-slate-500 font-medium">
          Already have an account? <Link to="/login" className="text-indigo-600 font-bold">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;