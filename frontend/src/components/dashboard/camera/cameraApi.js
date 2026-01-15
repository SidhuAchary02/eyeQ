import axios from "axios";

const API_BASE = "http://127.0.0.1:8000";

// Create axios instance with credentials
const apiClient = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

// Add token from localStorage to Authorization header if available
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function getCameras() {
  const res = await apiClient.get("/cameras/get-my-camera");
  return res.data;   
}

export async function createCamera(payload) {
  const res = await apiClient.post("/cameras", payload);
  return res.data;
}

