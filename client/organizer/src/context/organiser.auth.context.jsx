// client/src/context/OrganiserAuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { organiserAPI } from "../api/api";

const OrganiserAuthContext = createContext(null);

export const useOrganiserAuth = () => useContext(OrganiserAuthContext);

export const OrganiserAuthProvider = ({ children }) => {
  const [organiser, setOrganiser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = async () => {
    try {
      const { data } = await organiserAPI.getMe();
      setOrganiser(data.data);
    } catch {
      setOrganiser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMe();
  }, []);

  const logout = async () => {
    await organiserAPI.logout();
    setOrganiser(null);
  };

  const value = { organiser, loading, logout, refetch: fetchMe };

  return (
    <OrganiserAuthContext.Provider value={value}>
      {children}
    </OrganiserAuthContext.Provider>
  );
};