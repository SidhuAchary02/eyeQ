import { useEffect, useState, useContext } from "react"
import { getCameras } from "./cameraApi";
import AddCameraEmpty from "./AddCameraEmpty";
import { AddCameraForm } from "./AddCameraForm";
import CameraList from "./CameraList";
import { AuthContext } from "../../../context/AuthContext";

export default function CamerasPage() {
  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    async function fetchCameras() {
      try {
        const res = await getCameras();
        setCameras(res || []);

        if (!res || res.length === 0) {
          setShowForm(true);
        } else {
          setShowForm(false);
        }
      } catch (err) {
        console.error("get camera err", err);
        setCameras([]);
        setShowForm(true);
      } finally {
        setLoading(false);
      }
    }
    fetchCameras();
  }, []);

  if (loading) return <p>Loading cameras...</p>;

  return (
    <div className="p-6 space-y-6">
      {/* Header with User Info */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Cameras</h2>
        <p className="text-gray-600 mt-1">User: <span className="font-semibold">{user?.full_name || user?.email}</span></p>
      </div>

      {cameras.length === 0 && !showForm && (
        <AddCameraEmpty onAdd={() => setShowForm(true)} />
      )}
      
      {showForm && <AddCameraForm onSaved={() => setShowForm(false)} />}

      {/* Camera Details Cards */}
      {cameras.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cameras.map((camera) => (
            <div key={camera.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition">
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-gray-900">{camera.name || `Camera ${camera.id}`}</h3>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-600">
                    <span className="font-semibold">ID:</span> {camera.id}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">RTSP URL:</span> 
                    <code className="block bg-gray-100 p-2 mt-1 rounded text-xs break-all">{camera.rtsp_url}</code>
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Status:</span> 
                    <span className="ml-2 inline-block px-2 py-1 bg-green-100 text-green-700 rounded text-xs">Active</span>
                  </p>
                  {camera.location && (
                    <p className="text-gray-600">
                      <span className="font-semibold">Location:</span> {camera.location}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* {cameras.length > 0 && !showForm && (
        <CameraList cameras={cameras} onAdd={() => setShowForm(true)} />
      )} */}
    </div>
  )
}
