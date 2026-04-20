import axios from "axios";

const API = axios.create({
  baseURL: "/api", // proxied by Vite → http://localhost:3000 (bypasses CORS)
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = token; // server reads raw token, no "Bearer" prefix
  }
  return req;
});

export default API;
