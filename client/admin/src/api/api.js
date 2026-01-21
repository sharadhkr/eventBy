import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_API_BASE || "http://localhost:3000";

const adminAxios = axios.create({
  baseURL: `${BASE_URL}/api/admin`,
  withCredentials: true,
});

adminAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default adminAxios;
