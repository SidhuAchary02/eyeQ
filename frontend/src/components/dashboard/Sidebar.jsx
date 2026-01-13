import { Home, ImageIcon, Video, Zap, Settings, CreditCard, LogOut } from "lucide-react"
import logo from "../../assets/logo.png"
export default function Sidebar({ currentPage, setCurrentPage, sidebarOpen, setSidebarOpen }) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "cameras", label: "Cameras", icon: Video },
    { id: "images", label: "Images", icon: ImageIcon },
    // { id: "models", label: "Models", icon: Zap },
  ]

//   const bottomItems = [
//     { id: "settings", label: "Settings", icon: Settings },
//     { id: "subscription", label: "Subscription", icon: CreditCard },
//   ]

  const handleNavClick = (id) => {
    setCurrentPage(id)
    setSidebarOpen(false)
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-white border-r border-gray-200 flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 text-white rounded-lg flex items-center justify-center font-bold">
              <img src={logo} alt="" />
            </div>
            <span className="font-bold text-gray-900">eyeQ</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => handleNavClick(id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                currentPage === id ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{label}</span>
            </button>
          ))}
        </nav>

        {/* Bottom Menu */}
        {/* <div className="border-t border-gray-200 px-4 py-4 space-y-2">
          {bottomItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => handleNavClick(id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                currentPage === id ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{label}</span>
            </button>
          ))}
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition">
            <LogOut size={20} />
            <span className="font-medium">Sign out</span>
          </button>
        </div> */}
      </aside>

      {/* Mobile Sidebar */}
      <aside
        className={`fixed inset-0 w-64 bg-white flex flex-col z-40 transform transition-transform md:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 text-white rounded-lg flex items-center justify-center font-bold">
                <img src={logo} alt="" />
            </div>
            <span className="font-bold text-gray-900">eyeQ</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => handleNavClick(id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                currentPage === id ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{label}</span>
            </button>
          ))}
        </nav>

        {/* Bottom Menu
        <div className="border-t border-gray-200 px-4 py-4 space-y-2">
          {bottomItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => handleNavClick(id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                currentPage === id ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{label}</span>
            </button>
          ))}
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition">
            <LogOut size={20} />
            <span className="font-medium">Sign out</span>
          </button> 
        </div> */}
      </aside>
    </>
  )
}
