import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../context/admin";

const AdminLogin = () => {
  const { login } = useAdminAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(form);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="p-6 w-80 border rounded space-y-4"
      >
        <h2 className="text-xl font-semibold">Admin Login</h2>

        <input
          required
          placeholder="Username"
          className="w-full border p-2"
          onChange={(e) =>
            setForm({ ...form, username: e.target.value })
          }
        />

        <input
          required
          type="password"
          placeholder="Password"
          className="w-full border p-2"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button className="w-full bg-black text-white p-2">
          Login
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
