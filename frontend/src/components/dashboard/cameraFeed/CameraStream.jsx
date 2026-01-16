import { useEffect, useRef } from "react";

export default function CameraStream({ cameraPath, cameraId, rtspUrl }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const wsRef = useRef(null);
  const pcRef = useRef(null);

  // Draw bounding boxes on canvas
  const drawBoxes = (detections) => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;

    const ctx = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    detections.forEach((d) => {
      const [x1, y1, x2, y2] = d.bbox;
      
      // Different colors for different detection types
      if (d.type === "weapon") {
        ctx.strokeStyle = "red";
        ctx.fillStyle = "red";
      } else {
        ctx.strokeStyle = "lime";
        ctx.fillStyle = "lime";
      }
      
      ctx.lineWidth = 2;
      ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
      ctx.font = "14px Arial";
      
      // Label based on type
      const label = d.type === "weapon" 
        ? `${d.class}` 
        : `ID ${d.id}`;
      ctx.fillText(label, x1, y1 - 5);
    });
  };

  // Setup WebRTC connection
  useEffect(() => {
    if (!cameraPath) return;

    const pc = new RTCPeerConnection();
    pcRef.current = pc;
    pc.addTransceiver("video", { direction: "recvonly" });

    pc.ontrack = (e) => {
      console.log("✅ WebRTC track received");
      videoRef.current.srcObject = e.streams[0];
    };

    pc.onerror = (e) => {
      console.error("❌ WebRTC error:", e);
    };

    async function startRTC() {
      try {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        const res = await fetch(`http://localhost:8889/${cameraPath}/whep`, {
          method: "POST",
          headers: { "Content-Type": "application/sdp" },
          body: offer.sdp,
        });

        if (!res.ok) {
          console.error("❌ WHEP server error:", res.status);
          return;
        }

        const answer = await res.text();
        await pc.setRemoteDescription({ type: "answer", sdp: answer });
        console.log("✅ WebRTC connection established");
      } catch (error) {
        console.error("❌ WebRTC setup error:", error);
      }
    }

    startRTC();

    return () => {
      pc.close();
    };
  }, [cameraPath]);

  // Setup WebSocket for detections & Start detection
  useEffect(() => {
    if (!cameraId) return;

    // Start detection on backend
    if (rtspUrl) {
      console.log("📡 Starting detection for camera:", cameraId);
      fetch("http://localhost:8001/detect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rtsp_url: rtspUrl,
          camera_id: cameraId,
        }),
      })
        .then((res) => res.json())
        .then((data) => console.log("✅ Detection started:", data))
        .catch((err) => console.error("❌ Detection start error:", err));
    }

    // Connect to WebSocket for receiving detections
    wsRef.current = new WebSocket(`ws://localhost:8001/ws/${cameraId}`);

    wsRef.current.onopen = () => {
      console.log("✅ WebSocket connected for camera:", cameraId);
    };

    wsRef.current.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data.detections) {
          drawBoxes(data.detections);
        }
      } catch (error) {
        console.error("❌ WebSocket message error:", error);
      }
    };

    wsRef.current.onerror = (error) => {
      console.error("❌ WebSocket error:", error);
    };

    wsRef.current.onclose = () => {
      console.log("⚠️ WebSocket disconnected");
    };

    return () => {
      wsRef.current?.close();
    };
  }, [cameraId, rtspUrl]);


  return (
    <div className="relative w-full bg-black">
      <video ref={videoRef} autoPlay muted playsInline className="w-full" />
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
      />
    </div>
  );
}
