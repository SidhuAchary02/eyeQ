import { useState } from "react";
import { Plus, Camera, Settings, Trash2 } from "lucide-react";

export default function CameraList({ cameras, onAdd }) {
  const [selectedCamera, setSelectedCamera] = useState(null);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Your Cameras</h3>
          <p className="text-gray-600">Manage and monitor your camera feeds</p>
        </div>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <Plus size={20} />
          Add Camera
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cameras.map((camera) => (
          <div
            key={camera.id}
            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition cursor-pointer"
            onClick={() => setSelectedCamera(camera)}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Camera size={20} className="text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">{camera.name}</h4>
                <p className="text-sm text-gray-600">{camera.location || "No location"}</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                camera.status === 'online' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {camera.status || 'Unknown'}
              </span>
              <div className="flex gap-2">
                <button className="p-1 text-gray-400 hover:text-gray-600">
                  <Settings size={16} />
                </button>
                <button className="p-1 text-gray-400 hover:text-red-600">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedCamera && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold mb-4">{selectedCamera.name}</h3>
            <p><strong>URL:</strong> {selectedCamera.url}</p>
            <p><strong>Status:</strong> {selectedCamera.status}</p>
            {/* Add more details as needed */}
            <button
              onClick={() => setSelectedCamera(null)}
              className="mt-4 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}