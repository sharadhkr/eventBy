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
      console.warn("Session expired. Redirecting to login...");
      localStorage.removeItem("idToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);


/* ===========================
   AUTH API
=========================== */
export const authAPI = {
  loginOrRegister: (idToken) => api.post("/users/firebase", { idToken }),
  logout: () => api.post("/users/logout"),
};

/* ===========================
   USER API
=========================== */
/* ===========================
   USER API (Updated)
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
  
  // STEP 1: Create Razorpay Order
  createOrder: (eventId) => api.post("/users/create-order", { eventId }),
  
  // STEP 2: Finalize Join (Passes teamId and Payment details)
  joinEvent: (eventId, data) => api.post(`/users/join-event/${eventId}`, data),
  
  toggleSaveEvent: (eventId) => api.post(`/users/save-event/${eventId}`),
  getOrganisers: () => api.get("/users/organisers"),
  
  // Announcements
  getAnnouncements: (eventId) => api.get(`/users/events/${eventId}/announcements`),
};

/* ===========================
   EVENT API
=========================== */
/* ===========================
   EVENT API
=========================== */
export const eventAPI = {
  getAllEvents: (params) => api.get("/users/events", { params }),
  
  // ✅ FIXED: Added /users prefix to match your auth.routes.js
  getEventDetails: (id) => api.get(`/users/events/${id}`), 
};

/* ===========================
   TEAM API (Functional)
=========================== */
export const teamAPI = {
  // Uses encodeURIComponent to handle emails/special characters in search
  searchUsers: (query) => api.get(`/teams/search?query=${encodeURIComponent(query)}`),
  
  // Creates team and triggers backend invite logic
  createTeam: (teamData) => api.post('/teams/create', teamData),
  
  // Fetches pending invites for the user's notification center
  getInvites: () => api.get('/teams/invites'),
  
  // Handles 'accept' or 'reject' actions
  respondToInvite: (teamId, action) => api.post('/teams/respond', { teamId, action }),
};

export default api;
