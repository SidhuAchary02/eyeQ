export default function AddCameraEmpty({ onAdd }) {
  return (
    <div className="text-center p-10">
      <h2 className="text-xl font-semibold">No cameras added yet</h2>
      <p className="text-gray-600 mt-2">
        Add your first camera to start monitoring
      </p>
      <button
        onClick={onAdd}
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg"
      >
        Add Camera
      </button>
    </div>
  );
}
