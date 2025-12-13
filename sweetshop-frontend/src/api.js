import axios from "axios";

const API = axios.create({
<<<<<<< HEAD
  baseURL: "https://sweet-shop-management-system-is0y.onrender.com",
});
=======
  baseURL: "http://192.168.56.1:8000",
});




>>>>>>> d713c29 (REFACTOR: clean API and database logic)
// attach token automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
