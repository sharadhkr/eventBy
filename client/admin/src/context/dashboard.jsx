import { createContext, useContext, useEffect, useState } from "react";
import {
  getOverview,
  getGrowth,
  getRevenue,
  getEventAnalytics,
  getTopEntities,
} from "../api/dasboard.api";

const AdminDashboardContext = createContext();

export const AdminDashboardProvider = ({ children }) => {
  const [overview, setOverview] = useState(null);
  const [growth, setGrowth] = useState(null);
  const [revenue, setRevenue] = useState(null);
  const [events, setEvents] = useState(null);
  const [top, setTop] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadDashboard = async (range = 30) => {
    setLoading(true);
    const [
      o,
      g,
      r,
      e,
      t
    ] = await Promise.all([
      getOverview(),
      getGrowth(range),
      getRevenue(),
      getEventAnalytics(),
      getTopEntities()
    ]);

    setOverview(o.data.data);
    setGrowth(g.data.data);
    setRevenue(r.data.data);
    setEvents(e.data.data);
    setTop(t.data.data);

    setLoading(false);
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  return (
    <AdminDashboardContext.Provider
      value={{
        overview,
        growth,
        revenue,
        events,
        top,
        loading,
        reload: loadDashboard
      }}
    >
      {children}
    </AdminDashboardContext.Provider>
  );
};

export const useAdminDashboard = () =>
  useContext(AdminDashboardContext);
