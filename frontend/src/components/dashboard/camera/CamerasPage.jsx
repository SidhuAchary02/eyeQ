import { useEffect, useState } from "react"
import { getCameras } from "./cameraApi";
import AddCameraEmpty from "./AddCameraEmpty";
import { AddCameraForm } from "./AddCameraForm";
import CameraList from "./CameraList";
import CameraStream from "../cameraFeed/CameraStream";

export default function CamerasPage() {
  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

 useEffect(() => {
  async function fetchCameras() {
    try {
      const res = await getCameras();   // axios response
      setCameras(res || []);

      // Only show form if no cameras exist
      if (!res || res.length === 0) {
        setShowForm(true);
      } else {
        setShowForm(false);
      }
    } catch (err) {
      console.error("get camera err",err);
      setCameras([]);
      setShowForm(true);
    } finally {
      setLoading(false);
    }
  }
  fetchCameras();
}, []);

console.log("cameras", cameras)

  if (loading) return <p>Loadin cameras...</p>;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Camera</h2>
        <p className="text-gray-600 mt-1">Configure a new camera for monitoring</p>
      </div>
      {cameras.length === 0 && !showForm && (
        <AddCameraEmpty onAdd={() => setShowForm(true)} />
      )}
      {showForm && <AddCameraForm onSaved={() => setShowForm(false)} />}
        <CameraStream rtspUrl="rtsp://localhost:8554/webcam" />


      {cameras.length > 0 && !showForm && (
        <CameraList cameras={cameras} onAdd={() => setShowForm(true)} />
      )}
    </div>
  )
}
