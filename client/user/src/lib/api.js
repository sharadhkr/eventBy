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
});

/* ===========================
   REQUEST INTERCEPTOR
=========================== */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    // 🔐 Attach JWT to all protected requests
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
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

    /**
     * ❗ DO NOT redirect on auth endpoints
     * otherwise login → 401 → redirect loop
     */
    const isAuthRoute =
      url.includes("/users/firebase") ||
      url.includes("/users/logout");

    if (status === 401 && !isAuthRoute) {
      console.warn("JWT expired or invalid. Redirecting to login.");

      localStorage.removeItem("token");
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
  loginOrRegister: async (idToken) => {
    const res = await api.post("/users/firebase", { idToken });

    // 🔥 Store JWT securely
    if (res.data?.token) {
      localStorage.setItem("token", res.data.token);
    }

    return res.data;
  },

  logout: async () => {
    localStorage.removeItem("token");
    sessionStorage.clear();
    return api.post("/users/logout");
  },
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
   DASHBOARD API
=========================== */
export const dashboardAPI = {
  getDashboardEvents: () =>
    api.get("/users/dashboard/events"),

  getRecommendedEvents: () =>
    api.get("/users/dashboard/recommended"),

  getDashboardAnnouncements: () =>
    api.get("/users/dashboard/announcements"),
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
/* ===========================
   DASHBOARD HOME API
=========================== */
export const homeAPI = {
  getHome: () => api.get("/users/home/details"),
};

export default api;
