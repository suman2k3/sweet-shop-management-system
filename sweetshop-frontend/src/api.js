import axios from "axios";

const API = axios.create({
  baseURL: "https://sweet-shop-management-system-is0y.onrender.com",
});
// attach token automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
