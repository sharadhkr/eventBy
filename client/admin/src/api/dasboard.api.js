import adminAxios from "./api";

export const getOverview = () =>
  adminAxios.get("/dashboard/overview");

export const getGrowth = (range = 30) =>
  adminAxios.get(`/dashboard/growth?range=${range}`);

export const getEventAnalytics = () =>
  adminAxios.get("/dashboard/events");

export const getRevenue = () =>
  adminAxios.get("/dashboard/revenue");

export const getTopEntities = () =>
  adminAxios.get("/dashboard/top");
