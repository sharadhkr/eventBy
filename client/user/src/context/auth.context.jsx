import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "react-hot-toast";
import { authAPI, userAPI } from "../lib/api";
import socket from "../lib/socket"; // ✅ ADD THIS

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
useEffect(() => {
  const initAuth = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await userAPI.getProfile();
      setUser(res.data.user || res.data.data || res.data);
    } catch (err) {
      console.warn("JWT invalid or expired");
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };

  initAuth();
}, []);
useEffect(() => {
  if (user?._id) {
    socket.connect();
    socket.emit("join:user", user._id);
  }

  return () => {
    socket.disconnect();
  };
}, [user]);

  /* ===========================
     INIT AUTH FROM JWT
  =========================== */
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await userAPI.getProfile();
        setUser(res.data.user || res.data.data || res.data);
      } catch (err) {
        console.warn("JWT invalid or expired");
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  /* ===========================
     LOGIN (called after Firebase login)
  =========================== */
  const login = async (idToken) => {
    try {
      const res = await authAPI.loginOrRegister(idToken);
      setUser(res.user || res.data?.user || res);
      toast.success("Welcome 🎉");
      return true;
    } catch (err) {
      toast.error("Login failed");
      return false;
    }
  };

  /* ===========================
     LOGOUT
  =========================== */
  const logout = async () => {
    try {
      await authAPI.logout();
    } catch {
      // ignore
    } finally {
      localStorage.removeItem("token");
      setUser(null);
      toast.success("Logged out 👋");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
        refreshUser: async () => {
          const res = await userAPI.getProfile();
          setUser(res.data.user || res.data.data || res.data);
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
