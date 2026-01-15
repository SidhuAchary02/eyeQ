import { useContext, useState } from "react"
import { Activity, Video, AlertCircle, TrendingUp, Menu } from "lucide-react"
import Sidebar from "./Sidebar"
import CamerasPage from "./camera/CamerasPage"
import ImagesPage from "./cameraFeed/ImagesPage"
import ModelsPage from "./ModelsPage"
import SettingsPage from "./SettingsPage"
import { AuthContext } from "../../context/AuthContext"

export default function Dashboard() {
  const [currentPage, setCurrentPage] = useState("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const {user, loading} = useContext(AuthContext);

  const stats = [
    { label: "Active Cameras", value: "4", icon: Video, color: "bg-blue-100 text-blue-600" },
    // { label: "Detections Today", value: "1,234", icon: TrendingUp, color: "bg-green-100 text-green-600" },
    { label: "Alerts", value: "12", icon: AlertCircle, color: "bg-red-100 text-red-600" },
    // { label: "System Status", value: "Healthy", icon: Activity, color: "bg-emerald-100 text-emerald-600" },
  ]

  if(loading) return null;

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

            {/* Recent Activity */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Detections</h3>
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((item) => (
                  <div key={item} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                    <div>
                      <p className="font-medium text-gray-900">Person detected - Backyard</p>
                      <p className="text-sm text-gray-600">2 minutes ago</p>
                    </div>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">Person</span>
                  </div>
                ))}
              </div>
            </div>
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
