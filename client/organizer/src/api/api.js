import axios from "axios";

/* =========================================================
   BASE AXIOS INSTANCE
========================================================= */
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  withCredentials: true,
});

/* =========================================================
   REQUEST INTERCEPTOR (Firebase Session / JWT)
========================================================= */
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("idToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* =========================================================
   ORGANISER API
========================================================= */
export const organiserAPI = {
  /* ---------- AUTH ---------- */
  register: (data) => API.post("/organiser/auth/register", data),
  login: (data) => API.post("/organiser/auth/login", data),
  logout: () => API.post("/organiser/auth/logout"),
  getMe: () => API.get("/organiser/auth/me"),

  /* ---------- PROFILE ---------- */
  updateProfile: (data) => {
    const formData = new FormData();
    formData.append("organisationName", data.organisationName);
    formData.append("ownerName", data.ownerName);
    formData.append("phone", data.phone);
    formData.append("address", JSON.stringify(data.address));
    if (data.logo) formData.append("logo", data.logo);

    return API.put("/organiser/auth/profile", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  /* ---------- EVENTS ---------- */

  createEvent: (formData) =>
    API.post("/event", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  getMyEvents: () => API.get("/event"),

  getEventDetails: (eventId) => API.get(`/event/${eventId}`),

  updateEvent: (eventId, formData) =>
    API.put(`/event/${eventId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  deleteEvent: (eventId) => API.delete(`/event/${eventId}`),

  toggleStatus: (eventId, status) =>
    API.patch(`/event/${eventId}/status`, { status }),

  getEventAnalytics: (eventId) =>
    API.get(`/event/${eventId}/analytics`),

  /* ---------- ANNOUNCEMENTS ---------- */

  // ✅ ORGANISER: get announcements for event
  getAnnouncements: (eventId) =>
    API.get(`/event/${eventId}/announcements`),

  // ✅ ORGANISER: post announcement
  postAnnouncement: (eventId, content) =>
    API.post(`/event/${eventId}/announcements`, { content }),
};

/* =========================================================
   USER / PUBLIC EVENT API
========================================================= */
export const eventAPI = {
  getAllEvents: (params) =>
    API.get("/event/public", { params }),

  getEventDetails: (eventId) =>
    API.get(`/event/public/${eventId}`),

  createOrder: (eventId) =>
    API.post(`/user/create-order/${eventId}`),

  joinEvent: (eventId, payload) =>
    API.post(`/user/join-event/${eventId}`, payload),

  getMyEvents: () =>
    API.get("/user/my-events"),

  getAnnouncements: (eventId) =>
    API.get(`/user/events/${eventId}/announcements`),

  toggleSaveEvent: (eventId) =>
    API.post(`/user/save-event/${eventId}`),
};

export default API;
