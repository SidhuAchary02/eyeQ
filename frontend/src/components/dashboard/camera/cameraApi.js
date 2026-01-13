import axios from "axios";

const API_BASE = "http://127.0.0.1:8000";

export async function getCameras() {
  const res = await axios.get(`${API_BASE}/cameras`);
  return res.data;   
}
