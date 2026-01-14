// client/src/api/organiser.api.js
import axios from "axios";

const API = axios.create({
  baseURL:"http://localhost:3000/api",
  withCredentials: true,
});

export const organiserAPI = {
  register: (data) => API.post("/organiser/auth/register", data),
  login: (data) => API.post("/organiser/auth/login", data),
  logout: () => API.post("/organiser/auth/logout"),
  getMe: () => API.get("/organiser/auth/me"),
  updateProfile: (data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => formData.append(key, data[key]));
    return API.put("/organiser/auth/profile", formData, { headers: { "Content-Type": "multipart/form-data" } });
  },
  createEvent: (formData) => API.post("/events", formData, { headers: { "Content-Type": "multipart/form-data" } }),
  getMyEvents: () => API.get("/events"),
  updateEvent: (id, formData) => API.put(`/events/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } }),
  deleteEvent: (id) => API.delete(`/events/${id}`),
  getEventAnalytics: (id) => API.get(`/events/${id}/analytics`),
};