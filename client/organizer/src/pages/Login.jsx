import { useState } from "react";
import { organiserAPI } from "../api/api";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useOrganiserAuth } from "../context/organiser.auth.context";
import { Lock, Mail, Loader2, ArrowRight } from "lucide-react";

const Login = () => {
  const { refetch } = useOrganiserAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await organiserAPI.login(form);
      await refetch();
      toast.success("Welcome back!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-50 relative overflow-hidden">
      {/* Decorative Gradient Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-72 h-72 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>

      <div className="z-10 w-full max-w-md p-1 px-4">
        <form 
          onSubmit={submit} 
          className="bg-white/70 backdrop-blur-xl border border-white/20 p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent">
              Organiser Login
            </h2>
            <p className="text-gray-500 mt-2 text-sm">Please enter your details to continue</p>
          </div>

          <div className="space-y-6">
            <div className="relative group">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
              <input 
                type="email" 
                placeholder="Email Address"
                value={form.email} 
                onChange={(e) => setForm({ ...form, email: e.target.value })} 
                required 
                className="w-full pl-10 pr-4 py-3 bg-white/50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-gray-400" 
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
              <input 
                type="password" 
                placeholder="Password"
                value={form.password} 
                onChange={(e) => setForm({ ...form, password: e.target.value })} 
                required 
                className="w-full pl-10 pr-4 py-3 bg-white/50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-gray-400" 
              />
            </div>
          </div>

          <button 
            disabled={loading} 
            className="w-full mt-8 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white font-semibold py-3 rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 group disabled:opacity-70"
          >
            {loading ? <Loader2 className="animate-spin" /> : (
              <>
                Sign In
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

          <p className="mt-8 text-center text-sm text-gray-600">
            New here? 
            <Link to="/register" className="ml-1 font-semibold text-indigo-600 hover:text-indigo-500 underline-offset-4 hover:underline transition-all">
              Create an account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
