import React, { createContext, useState, useEffect, useContext, useRef } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { toast } from "react-hot-toast";
import { auth } from "../utils/firebase";
import { authAPI, userAPI } from "../lib/api"; // Added userAPI for refreshing profile

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [backendUser, setBackendUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const hasShownToast = useRef(false);

  // ✅ New: Method to manually refresh user data from DB (after joining events/updating bio)
  const refreshUser = async () => {
    try {
      const res = await userAPI.getProfile();
      setBackendUser(res.data.data);
    } catch (err) {
      console.error("Failed to refresh user data:", err);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setLoading(true);

      if (!fbUser) {
        setFirebaseUser(null);
        setBackendUser(null);
        localStorage.removeItem('idToken'); // 🗑️ Clear token
        setLoading(false);
        return;
      }

      try {
        const idToken = await fbUser.getIdToken(); 
        
        // 🗝️ Store token for Axios Interceptors to pick up
        localStorage.setItem('idToken', idToken);

        const res = await authAPI.loginOrRegister(idToken);

        setFirebaseUser(fbUser);
        // Ensure we are setting the full data object from our new production schema
        setBackendUser(res.data.user || res.data);

        if (!hasShownToast.current) {
          toast.success(
            res.data.isNewUser
              ? "Welcome! Account created 👋"
              : "Welcome back! ✅"
          );
          hasShownToast.current = true;
        }
      } catch (err) {
        console.error("Backend auth failed:", err);
        localStorage.removeItem('idToken');
        await signOut(auth);
        setFirebaseUser(null);
        setBackendUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
    setBackendUser(null);
    setFirebaseUser(null);
    localStorage.removeItem('idToken'); // 🗑️ Clean up
    hasShownToast.current = false;
    toast.success("Logged out 👋");
  };

  return (
    <AuthContext.Provider
      value={{
        user: backendUser,
        firebaseUser,
        isAuthenticated: !!backendUser,
        loading,
        logout,
        refreshUser, // 🔄 Export this so components can update profile state
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
