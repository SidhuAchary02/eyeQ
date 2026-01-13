import { useState } from 'react'
import { Camera, Cctv, ChevronDown, Webcam } from "lucide-react"


export const AddCameraForm = () => {
  const [sourceType, setSourceType] = useState("rtsp");
  const [formData, setFormData] = useState({
    name: "",
    room: "",
    location_type: "Indoor",
    lighting: "Day",
    rtspUrl: "",
    webcamIndex: "0",
  })
  const [annotations, setAnnotations] = useState({
    person: true,
    face: true,
    pistol: true,
    knife: false,
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (key) => {
    setAnnotations((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSave = async () => {
    try {
      const payload = {
        name: formData.name,
        room: formData.room,
        location_type: formData.location_type,
        lighting: formData.lighting,
        source_type: sourceType,
        rtsp_url: sourceType === "rtsp" ? formData.rtsp_url : null,
      };

      const res = await fetch("http://127.0.0.1:8000/cameras", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Failed to save camera");
      }

      const data = await res.json();
      console.log("Saved camera:", data);
      alert("Camera saved successfully!");
    } catch (err) {
      console.error(err);
      alert("Error saving camera");
    }
  };

  return (
    
      <div className="bg-white rounded-lg border border-gray-200 p-8 max-w-3xl">
        {/* Camera Name */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-900 mb-2">Camera Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Lobby Camera 1"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">unique identifier, will be shown in UI</p>
        </div>

        {/* Room Name */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-900 mb-2">Camera Room Name</label>
          <input
            type="text"
            name="room"
            value={formData.room}
            onChange={handleInputChange}
            placeholder="1st Floor Lobby Area"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">In which Room is the camera installed</p>
        </div>

        {/* Scene Dropdown */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-900 mb-2">Location Type</label>
          <div className="relative">
            <select
              name="location_type"
              value={formData.location_type}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:border-blue-500 bg-white cursor-pointer"
            >
              <option value="indoor">Indoor</option>
              <option value="outdoor">Outdoor</option>
              <option value="public">Public place</option>
              <option value="private">Private property</option>
            </select>
            <ChevronDown className="absolute right-3 top-3 text-gray-400 pointer-events-none" size={20} />
          </div>
          <p className="text-xs text-gray-500 mt-1">Select the most appropriate scene.</p>
        </div>

        {/* Night Mode Dropdown */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-900 mb-2">Lighting Condition</label>
          <div className="relative">
            <select
              name="lighting"
              value={formData.lighting}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:border-blue-500 bg-white cursor-pointer"
            >
              <option value="day">Day</option>
              <option value="night">Night</option>
              <option value="infrared">Infrared</option>
            </select>
            <ChevronDown className="absolute right-3 top-3 text-gray-400 pointer-events-none" size={20} />
          </div>
          <p className="text-xs text-gray-500 mt-1">Select the most appropriate lighting condition.</p>
        </div>

        {/* Camera Source section with styled UI for RTSP and Webcam options */}
        <div className="mb-8 pb-8 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Camera Source</h3>
          <p className="text-sm text-gray-600 mb-6">Select how your camera will be connected to Frigate.</p>

          {/* Source Type Toggle */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={() => setSourceType("rtsp")}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 transition ${sourceType === "rtsp"
                ? "border-blue-500 bg-blue-50 text-blue-700"
                : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                }`}
            >
              <Cctv size={20} />
              <span className="font-medium">RTSP Stream</span>
            </button>
            <button
              onClick={() => setSourceType("webcam")}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 transition ${sourceType === "webcam"
                ? "border-blue-500 bg-blue-50 text-blue-700"
                : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                }`}
            >
              <Webcam size={20} />
              <span className="font-medium">Webcam</span>
            </button>
          </div>

          {/* RTSP Configuration */}
          {sourceType === "rtsp" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">RTSP URL</label>
                <input
                  type="text"
                  name="rtspUrl"
                  value={formData.rtspUrl}
                  onChange={handleInputChange}
                  placeholder="rtsp://username:password@ip:port/stream"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 font-mono text-sm"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Enter the complete RTSP URL including protocol, credentials, IP address, port, and stream path.
                </p>
              </div>
            </div>
          )}

          {/* Webcam Configuration */}
          {sourceType === "webcam" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Webcam Device</label>
                <div className="relative">
                  <select
                    name="webcamIndex"
                    value={formData.webcamIndex}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:border-blue-500 bg-white cursor-pointer"
                  >
                    <option value="0">Webcam 0 (Default)</option>
                    <option value="1">Webcam 1</option>
                    <option value="2">Webcam 2</option>
                    <option value="3">Webcam 3</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-3 text-gray-400 pointer-events-none" size={20} />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Select the webcam device connected to your system. Device index 0 is typically the default camera.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Annotation Labels */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Annotation Labels</h3>
          <p className="text-sm text-gray-600 mb-4">Choose the labels available for this camera when annotating.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* People Column */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">People</h4>
              <div className="space-y-2">
                {["person", "face"].map((key) => (
                  <label key={key} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={annotations[key]}
                      onChange={() => handleCheckboxChange(key)}
                      className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                    />
                    <span className="text-gray-700 capitalize">{key}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Weapons Column */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Weapons</h4>
              <div className="space-y-2">
                {["pistol", "knife"].map((key) => (
                  <label key={key} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={annotations[key]}
                      onChange={() => handleCheckboxChange(key)}
                      className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                    />
                    <span className="text-gray-700 capitalize">{key}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
          Save
        </button>
      </div>
  )
}
