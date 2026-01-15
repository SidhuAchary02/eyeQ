"use client"

import { Grid, Search } from "lucide-react"

export default function ImagesPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Images</h2>
        <p className="text-gray-600 mt-1">Browse captured camera frames and snapshots</p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search images..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
          Filter
        </button>
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div
            key={item}
            className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition"
          >
            <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <Grid size={48} className="text-gray-400" />
            </div>
            <div className="p-4">
              <p className="font-medium text-gray-900">Camera Feed {item}</p>
              <p className="text-sm text-gray-600 mt-1">2024-01-{String(item).padStart(2, "0")} 14:30</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
