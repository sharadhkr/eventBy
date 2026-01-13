import axios from "axios";

// Base instance
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  withCredentials: true, // Crucial for sending JWT Cookies
});

/**
 * ORGANISER EVENT ACTIONS
 */
export const organiserAPI = {
  // GET: /api/organiser/event/my-events
  getMyEvents: () => API.get("/organiser/event/my-events"),

  // POST: /api/organiser/event/create
  createEvent: (data) => API.post("/event", data),

  // PATCH: /api/organiser/event/update/:id
  // Changed from PUT to PATCH for partial updates (Production Standard)
  updateEvent: (id, data) => API.patch(`/organiser/event/update/${id}`, data),

  // DELETE: /api/organiser/event/delete/:id
  deleteEvent: (id) => API.delete(`/organiser/event/delete/${id}`),
};

/**
 * PUBLIC EVENT ACTIONS (For AnalogDatePicker)
 */
export const publicEventAPI = {
  // GET: /api/events (Fetch all published events)
  getAllEvents: () => API.get("/events"),
  
  // GET: /api/events/:id
  getEventDetails: (id) => API.get(`/events/${id}`),
};

export default API;
