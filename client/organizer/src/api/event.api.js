import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api/organiser/event",
  withCredentials: true, // JWT cookie
});

export const getMyEvents = () => API.get("/");

export const createEvent = (data) => API.post("/", data);

export const updateEvent = (id, data) =>
  API.put(`/${id}`, data);

export const deleteEvent = (id) =>
  API.delete(`/${id}`);
