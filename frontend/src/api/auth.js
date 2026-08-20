import api from "./axios.js";

export const getMe = () => api.get("/api/auth/me");

export const login = (email, password) =>
  api.post("/api/auth/login", { email, password });

export const register = (name, email, password) =>
  api.post("/api/auth/register", { name, email, password });

export const logout = () => api.post("/api/auth/logout");

export const getUsers = () => api.get("/api/auth/users");
