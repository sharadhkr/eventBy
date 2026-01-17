import axios from "axios";

// Base Axios Instance
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  withCredentials: true,
});

/**
 * ============================
 * ORGANISER EVENT APIs
 * ============================
 */
export const organiserEventAPI = {
  // GET: Organiser's own events
  getMyEvents: () => API.get("/event"),

  // POST: Create Event (multipart/form-data)
  createEvent: (formData) =>
    API.post("/event", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  // PUT: Update Event (multipart/form-data)
  updateEvent: (id, formData) =>
    API.put(`/event/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  // DELETE: Remove Event
  deleteEvent: (id) => API.delete(`/event/${id}`),

  // PATCH: Publish / Pause Event
  toggleStatus: (id) => API.patch(`/event/${id}/status`),

  // GET: Event analytics
  getAnalytics: (id) => API.get(`/event/${id}/analytics`),
};

/**
 * ============================
 * PUBLIC EVENT APIs
 * ============================
 * (Optional – for landing page later)
 */
export const publicEventAPI = {
  getAllEvents: () => API.get("/event/public"),
  getEventDetails: (id) => API.get(`/event/public/${id}`),
};

export default API;