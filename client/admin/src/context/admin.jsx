import { createContext, useContext, useEffect, useState } from "react";
import adminAxios from "../api/api";
import toast from "react-hot-toast";

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadAdmin = async () => {
    try {
      const res = await adminAxios.get("/me");
      setAdmin(res.data.admin);
    } catch {
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdmin();
  }, []);

  /* LOGIN */
  const login = async (credentials) => {
    try {
      const res = await adminAxios.post("/login", credentials);

      localStorage.setItem("adminToken", res.data.token);
      setAdmin(res.data.admin);

      toast.success("Admin logged in");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Login failed"
      );
      throw error;
    }
  };

  /* LOGOUT */
  const logout = async () => {
    await adminAxios.post("/logout");
    localStorage.removeItem("adminToken");
    setAdmin(null);
    toast.success("Logged out");
  };

  return (
    <AdminAuthContext.Provider
      value={{ admin, loading, login, logout }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);
