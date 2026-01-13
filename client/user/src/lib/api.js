import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

/**
 * AUTH INTERCEPTOR
 * Automatically attaches the Firebase Token to every request
 */
api.interceptors.request.use(async (config) => {
  // You can get this from your AuthContext or Firebase directly
  const token = localStorage.getItem('idToken'); 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const authAPI = {
  // Initial sync with backend
  loginOrRegister: (idToken) => api.post('/auth/firebase', {}),
};

export const userAPI = {
  // Get full profile with populated events
  getProfile: () => api.get('/auth/profile'),

  // Update bio, social links, skills
  updateProfile: (data) => api.patch('/auth/update-profile', data),

  // Update resume URL (from Cloudinary/S3)
  updateResume: (url, public_id) => api.patch('/auth/update-resume', { url, public_id }),

  // Get only user's joined events
  getMyEvents: () => api.get('/auth/my-events'),
  
  // Join an event (Triggers validations on backend)
  joinEvent: (eventId) => api.post(`/auth/join-event/${eventId}`),
};

export const eventAPI = {
  // Fetch all published events
  getAllEvents: (params) => api.get('auth/events', { params }),
  
  // Get single event details
  getEventDetails: (id) => api.get(`auth/events/${id}`),
};

export default api;
