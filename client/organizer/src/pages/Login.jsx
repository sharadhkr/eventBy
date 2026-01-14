// client/src/pages/Login.jsx
import { useState } from "react";
import { organiserAPI } from "../api/api";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useOrganiserAuth } from "../context/organiser.auth.context";
import { Lock, Mail, Loader2 } from "lucide-react";

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
      toast.success("Logged in!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={submit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Organiser Login</h2>
        <div className="mb-4">
          <Mail size={20} />
          <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required className="ml-2 p-2 border" />
        </div>
        <div className="mb-4">
          <Lock size={20} />
          <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required className="ml-2 p-2 border" />
        </div>
        <button disabled={loading} className="bg-blue-500 text-white p-2 rounded">
          {loading ? <Loader2 className="animate-spin" /> : "Login"}
        </button>
        <p>Don't have an account? <Link to="/register">Register</Link></p>
      </form>
    </div>
  );
};

export default Login;