import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

export const authAPI = {
  loginOrRegister: async (idToken) => {
    const response = await api.post('/auth/firebase', {}, {
      headers: {
        Authorization: `Bearer ${idToken}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  },
};

export default api;