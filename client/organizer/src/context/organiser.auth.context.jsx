import { createContext, useContext, useEffect, useState } from "react";
import { getMe, logoutOrganiser } from "../api/api";

const OrganiserAuthContext = createContext(null);

export const useOrganiserAuth = () => {
  const ctx = useContext(OrganiserAuthContext);
  if (!ctx) {
    throw new Error(
      "useOrganiserAuth must be used inside OrganiserAuthProvider"
    );
  }
  return ctx;
};

export const OrganiserAuthProvider = ({ children }) => {
  const [organiser, setOrganiser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = async () => {
    try {
      const res = await getMe();
      setOrganiser(res.data.organiser);
    } catch (error) {
      console.error("AUTH CHECK FAILED:", error?.response?.data || error);
      setOrganiser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMe();
  }, []);

  const logout = async () => {
    try {
      await logoutOrganiser();
    } catch (err) {
      console.error("LOGOUT ERROR:", err);
    } finally {
      setOrganiser(null);
    }
  };

  const value = {
    organiser,
    loading,
    isAuth: !!organiser,
    logout,
    refetchAuth: fetchMe, // 🔥 useful after login/register
  };

  return (
    <OrganiserAuthContext.Provider value={value}>
      {children}
    </OrganiserAuthContext.Provider>
  );
};
