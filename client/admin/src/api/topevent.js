import adminAxios from "./api";

export const fetchTopEvents = () =>
  adminAxios.get("/top-events");

export const setTopEvent = (payload) =>
  adminAxios.post("/top-events", payload);

export const removeTopEvent = (eventId) =>
  adminAxios.delete(`/top-events/${eventId}`);
