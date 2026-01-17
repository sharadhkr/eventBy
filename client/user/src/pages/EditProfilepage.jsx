import React, { useEffect, useState } from "react";
import { userAPI, authAPI } from "../lib/api"; // ✅ Import authAPI for logout
import { useAuth } from "../context/auth.context"; // ✅ Import context to trigger global logout
import EditProfile from "../components/Editprofile";
import { motion } from "framer-motion";
import { LogOut, ArrowLeft, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";

export default function EditProfilepage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { logout: contextLogout } = useAuth(); // ✅ Get logout from context
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await userAPI.getProfile();
        setUser(res.data.data);
      } catch (err) {
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await contextLogout(); 
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  if (loading) {
    return (
      <Loading/>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      {/* --- HEADER DASHBOARD --- */}
      <div className="max-w-5xl mx-auto px-6 pt-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/70 backdrop-blur-xl border border-white p-6 rounded-[2.5rem] shadow-sm mb-8"
        >
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 transition-colors text-slate-600"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900">Edit Profile</h1>
              <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest flex items-center gap-1">
                <ShieldCheck size={12} /> Privacy & Identity
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-red-50 hover:bg-red-100 text-red-600 font-bold text-sm transition-all border border-red-100 shadow-sm active:scale-95"
          >
            <LogOut size={18} />
            End Session
          </button>
        </motion.div>

        {/* --- MAIN EDIT FORM BENTO --- */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-[3rem] shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100"
        >
          <EditProfile
            user={user}
            onUpdated={(updatedUser) => setUser(updatedUser)}
          />
        </motion.div>
      </div>
    </div>
  );
}
