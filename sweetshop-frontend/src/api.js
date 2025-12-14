import axios from "axios";

const API = axios.create({
  // change this depending on environment
  baseURL: "http://127.0.0.1:8000", // local backend
  // baseURL: "https://sweet-shop-management-system-is0y.onrender.com", // production
});

// attach token automatically
API.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem("token");
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
  },
  (error) => Promise.reject(error)
);

export default API;
