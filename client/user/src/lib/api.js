import axios from "axios";

/**
 * BASE URL
 * Example:
 * VITE_API_URL=http://localhost:3000/api
 * VITE_API_URL=https://api.eventrix.com/api
 */
const API_BASE =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") ||
  "http://localhost:3000/";

const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
});

/**
 * AUTH INTERCEPTOR
 * Automatically attaches Firebase ID token
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("idToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * RESPONSE INTERCEPTOR (optional safety)
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized – token expired");
      // optional: logout / redirect
    }
    return Promise.reject(error);
  }
);

/* ===========================
   AUTH API
=========================== */
export const authAPI = {
  // Firebase login/register
  loginOrRegister: () => api.post("/users/firebase"),
};

/* ===========================
   USER API
=========================== */
export const userAPI = {
  // Full user profile
  getProfile: () => api.get("/users/profile"),

  // Update profile (name, skills, portfolio, photo)
  updateProfile: (formData) =>
    api.patch("/users/update-profile", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  // Update resume
  updateResume: (url, public_id) =>
    api.patch("/users/update-resume", { url, public_id }),

  // Joined events
  getMyEvents: () => api.get("/users/my-events"),

  // Top organisers
  getOrganisers: () => api.get("/users/organisers"),

  // Join event
  joinEvent: (eventId) =>
    api.post(`/users/join-event/${eventId}`),
};

/* ===========================
   EVENT API
=========================== */
export const eventAPI = {
  // All published events
  getAllEvents: (params) =>
    api.get("/users/events", { params }),
};

export default api;
