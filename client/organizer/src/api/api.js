import axios from "axios";

const organiserAPI = axios.create({
  baseURL: "http://localhost:3000/api/organiser/auth",
  withCredentials: true, // 🔥 IMPORTANT FOR COOKIES
});

export const registerOrganiser = (data) =>
  organiserAPI.post("/register", data);

export const loginOrganiser = (data) =>
  organiserAPI.post("/login", data);

export const logoutOrganiser = () =>
  organiserAPI.post("/logout");

export const getMe = () =>
  organiserAPI.get("/me");
