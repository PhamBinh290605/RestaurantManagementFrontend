import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5268/api/v1",
});

// Tự động gắn token cho mọi request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
