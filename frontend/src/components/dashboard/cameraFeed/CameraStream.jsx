export default function CameraStream({ rtspUrl }) {
  const streamUrl = `http://localhost:8001/stream?rtsp_url=${encodeURIComponent(rtspUrl)}`;

  return (
    <div className="rounded overflow-hidden border">
      <img
        src={streamUrl}
        alt="Live Camera Feed"
        className="w-full"
      />
    </div>
  );
}
