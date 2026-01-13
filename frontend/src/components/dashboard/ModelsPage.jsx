"use client"

import { Download } from "lucide-react"

export default function ModelsPage() {
  const models = [
    { name: "Default Detection", version: "1.0", size: "124 MB", status: "Active" },
    { name: "Compact Model", version: "2.1", size: "48 MB", status: "Available" },
    { name: "High Accuracy", version: "3.0", size: "256 MB", status: "Available" },
  ]

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Models</h2>
        <p className="text-gray-600 mt-1">Manage detection models for eyeQ</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Model Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Version</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Size</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Action</th>
              </tr>
            </thead>
            <tbody>
              {models.map((model, idx) => (
                <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-gray-900 font-medium">{model.name}</td>
                  <td className="px-6 py-4 text-gray-600">{model.version}</td>
                  <td className="px-6 py-4 text-gray-600">{model.size}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        model.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {model.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {model.status === "Available" && (
                      <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition font-medium">
                        <Download size={18} />
                        Download
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
