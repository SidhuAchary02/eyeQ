"use client"

import { Bell, Lock, Wifi } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="p-6 space-y-6 max-w-3xl">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Settings</h2>
        <p className="text-gray-600 mt-1">Manage your account and system preferences</p>
      </div>

      {/* System Settings */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Wifi size={20} /> System Configuration
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Timezone</label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">
              <option>America/New_York</option>
              <option>Europe/London</option>
              <option>Asia/Tokyo</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Recording Quality</label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">
              <option>1080p</option>
              <option>720p</option>
              <option>480p</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Bell size={20} /> Notifications
        </h3>
        <div className="space-y-4">
          {["Person detected", "Vehicle detected", "Package detected", "Unknown motion"].map((item) => (
            <label key={item} className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded cursor-pointer" />
              <span className="text-gray-700">{item}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Security */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Lock size={20} /> Security
        </h3>
        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium text-gray-900">
          Change Password
        </button>
      </div>

      {/* Save Button */}
      <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
        Save Changes
      </button>
    </div>
  )
}
