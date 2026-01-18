import axios from "axios";

/* ===========================
   BASE URL
=========================== */
const API_BASE =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") ||
  "http://localhost:3000/api";

/* ===========================
   AXIOS INSTANCE
=========================== */
const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  withCredentials: true, // ✅ REQUIRED for session cookies
});

/* ===========================
   REQUEST INTERCEPTOR
=========================== */
/**
 * ❌ DO NOT attach idToken here
 * Auth is handled ONLY via httpOnly cookies
 */
api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

/* ===========================
   RESPONSE INTERCEPTOR
=========================== */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || "";

    // 🔐 Session expired (but NOT during login)
    if (status === 401 && !url.includes("/users/firebase")) {
      console.warn("Session expired. Redirecting to login.");

      // Clear any leftover client-side state
      localStorage.clear();
      sessionStorage.clear();

      window.location.replace("/login");
    }

    return Promise.reject(error);
  }
);

/* ===========================
   AUTH API
=========================== */
export const authAPI = {
  // idToken used ONLY here
  loginOrRegister: (idToken) =>
    api.post("/users/firebase", { idToken }),

  logout: () =>
    api.post("/users/logout"),
};

/* ===========================
   USER API
=========================== */
export const userAPI = {
  getProfile: () => api.get("/users/profile"),

  updateProfile: (formData) =>
    api.patch("/users/update-profile", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  updateResume: (url, public_id) =>
    api.patch("/users/update-resume", { url, public_id }),

  getMyEvents: () => api.get("/users/my-events"),

  createOrder: (eventId) =>
    api.post("/users/create-order", { eventId }),

  joinEvent: (eventId, data) =>
    api.post(`/users/join-event/${eventId}`, data),

  toggleSaveEvent: (eventId) =>
    api.post(`/users/save-event/${eventId}`),

  getOrganisers: () =>
    api.get("/users/organisers"),

  getAnnouncements: (eventId) =>
    api.get(`/users/events/${eventId}/announcements`),
};

/* ===========================
   EVENT API
=========================== */
export const eventAPI = {
  getAllEvents: (params) =>
    api.get("/users/events", { params }),

  getEventDetails: (id) =>
    api.get(`/users/events/${id}`),
};

/* ===========================
   TEAM API
=========================== */
export const teamAPI = {
  searchUsers: (query) =>
    api.get(`/teams/search?query=${encodeURIComponent(query)}`),

  createTeam: (teamData) =>
    api.post("/teams/create", teamData),

  getInvites: () =>
    api.get("/teams/invites"),

  respondToInvite: (teamId, action) =>
    api.post("/teams/respond", { teamId, action }),
};

export default api;
