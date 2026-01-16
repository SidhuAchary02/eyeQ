import { useContext, useState, useEffect } from "react"
import { Activity, Video, AlertCircle, TrendingUp, Menu } from "lucide-react"
import Sidebar from "./Sidebar"
import CamerasPage from "./camera/CamerasPage"
import ImagesPage from "./cameraFeed/ImagesPage"
import ModelsPage from "./ModelsPage"
import SettingsPage from "./SettingsPage"
import { AuthContext } from "../../context/AuthContext"
import { getCameras } from "./camera/cameraApi"

export default function Dashboard() {
  const [currentPage, setCurrentPage] = useState("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [cameras, setCameras] = useState([])
  const [snapshots, setSnapshots] = useState([])
  const [loadingCameras, setLoadingCameras] = useState(true)

  const {user, loading} = useContext(AuthContext);

  // Fetch cameras and snapshots
  useEffect(() => {
    async function fetchData() {
      try {
        const camerasRes = await getCameras();
        setCameras(camerasRes || []);
        
        // Fetch snapshots
        const snapshotsRes = await fetch("http://localhost:8001/snapshots");
        const snapshotsData = await snapshotsRes.json();
        setSnapshots(snapshotsData.snapshots || []);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoadingCameras(false);
      }
    }
    fetchData();
  }, []);

  const stats = [
    { label: "Active Cameras", value: cameras.length.toString(), icon: Video, color: "bg-blue-100 text-blue-600" },
    { label: "Snapshots", value: snapshots.length.toString(), icon: TrendingUp, color: "bg-green-100 text-green-600" },
    // { label: "Alerts", value: "12", icon: AlertCircle, color: "bg-red-100 text-red-600" },
  ]

  if(loading || loadingCameras) return null;

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return (
          <div className="p-6 space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
              <p className="text-gray-600 mt-1">Welcome {user?.full_name}! Here's your system overview.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, idx) => {
                const Icon = stat.icon
                return (
                  <div key={idx} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition">
                    <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center mb-4`}>
                      <Icon size={24} />
                    </div>
                    <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  </div>
                )
              })}
            </div>

            {/* Active Cameras */}
            {cameras.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Active Cameras</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {cameras.map((camera) => (
                    <div key={camera.id} className="p-4 border border-gray-100 rounded-lg hover:shadow-md transition">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <p className="font-medium text-gray-900">{camera.name || `Camera ${camera.id}`}</p>
                      </div>
                      <p className="text-xs text-gray-600">ID: {camera.id}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Snapshots */}
            {snapshots.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Person Detection Snapshots (30+ sec)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {snapshots.slice(0, 8).map((snapshot, idx) => (
                    <div key={idx} className="border border-gray-100 rounded-lg overflow-hidden hover:shadow-md transition">
                      <img 
                        src={`file://${snapshot.path}`} 
                        alt={snapshot.filename}
                        className="w-full h-32 object-cover bg-gray-100"
                        onError={(e) => e.target.src = '/placeholder.png'}
                      />
                      <div className="p-2">
                        <p className="text-xs text-gray-600 truncate">{snapshot.filename}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(snapshot.timestamp * 1000).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )
      case "cameras":
        return <CamerasPage />
      case "images":
        return <ImagesPage />
      case "models":
        return <ModelsPage />
      case "settings":
      case "subscription":
        return <SettingsPage />
      default:
        return <div>Page not found</div>
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      {sidebarOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />}
      <main className="flex-1 overflow-auto">
        <div className="md:hidden p-4 bg-white border-b border-gray-200 flex items-center">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-600 hover:text-gray-900">
            <Menu size={24} />
          </button>
          <h1 className="ml-4 text-xl font-bold text-gray-900">eyeQ</h1>
        </div>
        {renderPage()}
      </main>
    </div>
  )
}
