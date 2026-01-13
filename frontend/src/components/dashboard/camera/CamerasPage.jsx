import { useEffect, useState } from "react"
import { getCameras } from "./cameraApi";
import AddCameraEmpty from "./AddCameraEmpty";
import { AddCameraForm } from "./AddCameraForm";
import CameraList from "./CameraList";

export default function CamerasPage() {
  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

 useEffect(() => {
  async function fetchCameras() {
    try {
      const res = await getCameras();   // axios response
      setCameras(res);

      if (res.length === 0) {
        setShowForm(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }
  fetchCameras();
}, []);


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

      {cameras.length > 0 && !showForm && (
        <CameraList cameras={cameras} onAdd={() => setShowForm(true)} />
      )}
    </div>
  )
}
