import React, { createContext, useState, useEffect, useContext, useRef } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { toast } from "react-hot-toast";
import { auth } from "../utils/firebase";
import { authAPI } from "../lib/api";

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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setLoading(true);

      if (!fbUser) {
        setFirebaseUser(null);
        setBackendUser(null);
        setLoading(false);
        return;
      }

      try {
        const idToken = await fbUser.getIdToken(); // ✅ no force refresh

        const res = await authAPI.loginOrRegister(idToken);

        setFirebaseUser(fbUser);
        setBackendUser(res.user);

        if (!hasShownToast.current) {
          toast.success(
            res.isNewUser
              ? "Welcome! Account created 👋"
              : "Welcome back! ✅"
          );
          hasShownToast.current = true;
        }
      } catch (err) {
        console.error("Backend auth failed:", err);
        toast.error("Authentication failed");
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
