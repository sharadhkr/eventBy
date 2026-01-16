import React, { createContext, useState, useEffect, useContext, useRef } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { toast } from "react-hot-toast";
import { auth } from "../utils/firebase";
import { authAPI, userAPI } from "../lib/api";

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
  
  // ✅ New: Ensures we don't redirect until the cookie sync is confirmed
  const [isSyncing, setIsSyncing] = useState(false); 
  const hasShownToast = useRef(false);

  const refreshUser = async () => {
    try {
      const res = await userAPI.getProfile();
      setBackendUser(res.data.user || res.data.data || res.data);
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
        localStorage.removeItem('idToken');
        setLoading(false);
        return;
      }

      try {
        setIsSyncing(true); // 🔄 Start backend sync
        const idToken = await fbUser.getIdToken(true); 
        localStorage.setItem('idToken', idToken);

        // ✅ This call sets the 7-day cookie on your browser
        const res = await authAPI.loginOrRegister(idToken);

        setFirebaseUser(fbUser);
        setBackendUser(res.data.user || res.data);

        if (!hasShownToast.current) {
          toast.success(res.data.isNewUser ? "Welcome! 👋" : "Welcome back! ✅");
          hasShownToast.current = true;
        }
      } catch (err) {
        console.error("Auth sync failed:", err);
        // If 7-day cookie fails, clear everything
        await handleLocalLogout();
      } finally {
        setIsSyncing(false);
        setLoading(false); 
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLocalLogout = async () => {
    try {
      await authAPI.logout(); 
    } catch (e) {
      console.warn("Server session already cleared");
    } finally {
      await signOut(auth);
      setBackendUser(null);
      setFirebaseUser(null);
      localStorage.removeItem('idToken');
      hasShownToast.current = false;
      setLoading(false);
      setIsSyncing(false);
    }
  };

  const logout = async () => {
    await handleLocalLogout();
    toast.success("Logged out 👋");
  };

  return (
    <AuthContext.Provider
      value={{
        user: backendUser,
        firebaseUser,
        // ✅ Double-check: Don't mark as authenticated if we are still syncing the cookie
        isAuthenticated: !!backendUser && !isSyncing, 
        loading: loading || isSyncing,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
