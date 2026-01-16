import axios from "axios";

/**
 * BASE URL
 */
const API_BASE =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") ||
  "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  /* ✅ REQUIRED for 7-day session cookies */
  withCredentials: true, 
});

/* ===========================
   REQUEST INTERCEPTOR
=========================== */
api.interceptors.request.use(
  (config) => {
    // We keep this as a fallback; however, the backend will now 
    // prioritize the 7-day HttpOnly cookie if present.
    const token = localStorage.getItem("idToken");
    if (token) {
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
    // 🛑 DON'T redirect if the error came from the login route itself
    if (error.response?.status === 401 && !error.config.url.includes('/users/firebase')) {
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);


/* ===========================
   AUTH API
=========================== */
export const authAPI = {
  /**
   * Firebase login/register
   * @param {string} idToken - The raw token from firebase.auth().currentUser.getIdToken()
   */
  loginOrRegister: (idToken) => api.post("/users/firebase", { idToken }),

  /**
   * Logout to clear the 7-day session cookie on the server
   */
  logout: () => api.post("/users/logout"),
};

/* ===========================
   USER API
=========================== */
export const userAPI = {
  /* -------- PROFILE -------- */
  getProfile: () => api.get("/users/profile"),

  updateProfile: (formData) =>
    api.patch("/users/update-profile", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  updateResume: (url, public_id) =>
    api.patch("/users/update-resume", { url, public_id }),

  /* -------- EVENTS -------- */
  getMyEvents: () => api.get("/users/my-events"),

  joinEvent: (eventId) =>
    api.post(`/users/join-event/${eventId}`),

  /* -------- SAVE / BOOKMARK -------- */
  toggleSaveEvent: (eventId) =>
    api.post(`/users/save-event/${eventId}`),

  /* -------- ORGANISERS -------- */
  getOrganisers: () => api.get("/users/organisers"),
};

/* ===========================
   EVENT API
=========================== */
export const eventAPI = {
  getAllEvents: (params) =>
    api.get("/users/events", { params }),

  getEventDetails: (id) =>
    api.get(`/events/${id}`),
};

export default api;
