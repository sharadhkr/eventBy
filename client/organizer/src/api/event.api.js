import axios from "axios";

// Base instance
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  withCredentials: true, 
});

/**
 * ORGANISER EVENT ACTIONS
 */
export const organiserAPI = {
  // GET: Organiser's own events
  getMyEvents: () => API.get("/event/"),

  // POST: Create Event (Supports Multipart/Form-Data for Banner)
  createEvent: (formData) => API.post("/event/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }),

  // PATCH: Update Event (Supports Multipart/Form-Data for Banner update)
  updateEvent: (id, formData) => API.patch(`/event/update/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }),

  // DELETE: Remove Event
  deleteEvent: (id) => API.delete(`/event/delete/${id}`),
};

/**
 * PUBLIC EVENT ACTIONS
 */
export const publicEventAPI = {
  // GET: Fetch all published events
  getAllEvents: () => API.get("/event"), // Note: Ensure this matches your route name (e.g. /event/all)
  
  // GET: Single event details
  getEventDetails: (id) => API.get(`/event/${id}`),
};

export default API;