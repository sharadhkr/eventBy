import { createContext, useContext, useEffect, useState } from "react";
import adminAxios from "../api/api";
import toast from "react-hot-toast";

const AdminTopEventsContext = createContext();

export const AdminTopEventsProvider = ({ children }) => {
  const [topEvents, setTopEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadTopEvents = async () => {
  try {
    setLoading(true);

    const res = await adminAxios.get("/top-events");

    setTopEvents(res.data.data.topEvents);
    setAllEvents(res.data.data.allEvents);
  } catch (err) {
    console.error("TOP EVENTS CONTEXT ERROR:", err);
    toast.error(
      err.response?.data?.message || "Failed to load top events"
    );
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    loadTopEvents();
  }, []);

  const setTopEvent = async (eventId, position) => {
    try {
      await adminAxios.post("/top-events", { eventId, position });
      toast.success(`Top ${position} event updated`);
      await loadTopEvents();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to update top event"
      );
    }
  };

  const removeTopEvent = async (eventId) => {
    try {
      await adminAxios.delete(`/top-events/${eventId}`);
      toast.success("Top event removed");
      await loadTopEvents();
    } catch {
      toast.error("Failed to remove top event");
    }
  };

  return (
    <AdminTopEventsContext.Provider
      value={{
        topEvents,
        allEvents,
        loading,
        setTopEvent,
        removeTopEvent,
        reload: loadTopEvents,
      }}
    >
      {children}
    </AdminTopEventsContext.Provider>
  );
};

export const useAdminTopEvents = () =>
  useContext(AdminTopEventsContext);
