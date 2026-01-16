"use client"

import { useEffect, useState } from "react";
import { Grid, Search } from "lucide-react";
import CameraStream from "./CameraStream";
import { getCameras } from "../camera/cameraApi";

export default function ImagesPage() {
  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCameras() {
      try {
        const res = await getCameras();
        setCameras(res || []);
        if (res && res.length > 0) {
          setSelectedCamera(res[0]);
        }
      } catch (err) {
        console.error("Error fetching cameras:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCameras();
  }, []);

  if (loading) return <p>Loading cameras...</p>;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Video Stream</h2>
        <p className="text-gray-600 mt-1">Live camera feed and detections</p>
      </div>

      {/* Camera Selection */}
      {cameras.length > 1 && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Camera</label>
          <select
            value={selectedCamera?.id || ""}
            onChange={(e) => {
              const camera = cameras.find((c) => c.id === parseInt(e.target.value));
              setSelectedCamera(camera);
            }}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
          >
            {cameras.map((camera) => (
              <option key={camera.id} value={camera.id}>
                {camera.name || `Camera ${camera.id}`}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Video Stream */}
      {selectedCamera && (
        <div className="bg-black rounded-lg overflow-hidden border border-gray-300">
          <CameraStream
            cameraPath="webcam"
            cameraId={selectedCamera.id}
            rtspUrl={selectedCamera.rtsp_url}
          />
        </div>
      )}

      {cameras.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <p className="text-gray-600">No cameras configured. Please add a camera first.</p>
        </div>
      )}
    </div>
  );
}
 