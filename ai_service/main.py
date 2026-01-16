from fastapi import FastAPI, WebSocket, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import asyncio, time, os
import cv2
from video import get_video_stream
from model import load_model
from models.weapon_model import load_model as load_weapon_model
from detector import get_tracked_persons

app = FastAPI()

# ✅ Enable CORS for frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

main_loop: asyncio.AbstractEventLoop | None = None
connections = {}  # camera_id -> WebSocket

# Snapshot directory
SNAPSHOTS_DIR = "snapshots"
os.makedirs(SNAPSHOTS_DIR, exist_ok=True)

# ✅ REQUIRED MODEL
class DetectionRequest(BaseModel):
    rtsp_url: str
    camera_id: int

@app.on_event("startup")
async def startup_event():
    global main_loop
    main_loop = asyncio.get_running_loop()


@app.websocket("/ws/{camera_id}")
async def ws_endpoint(ws: WebSocket, camera_id: int):
    await ws.accept()
    connections[camera_id] = ws
    try:
        while True:
            await asyncio.sleep(10)
    finally:
        connections.pop(camera_id, None)

@app.post("/detect")
async def start_detection(req: DetectionRequest, bg: BackgroundTasks):
    print("🚀 /detect called", req.rtsp_url, req.camera_id)
    bg.add_task(run_detection, req.rtsp_url, req.camera_id)
    return {"status": "started"}


@app.get("/snapshots")
async def get_snapshots():
    """Get all saved snapshots"""
    import glob
    snapshots = []
    for filepath in glob.glob(f"{SNAPSHOTS_DIR}/*.jpg"):
        snapshots.append({
            "filename": os.path.basename(filepath),
            "path": filepath,
            "timestamp": os.path.getmtime(filepath)
        })
    # Sort by timestamp descending
    snapshots.sort(key=lambda x: x["timestamp"], reverse=True)
    return {"snapshots": snapshots}


def run_detection(rtsp_url: str, camera_id: int):
    print("🔥 run_detection STARTED", rtsp_url, camera_id)

    cap = get_video_stream(rtsp_url)
    model = load_model()
    weapon_model = load_weapon_model()
    
    # Track person detection duration
    person_detection_start = {}  # track_id -> start_time
    snapshotted_persons = set()  # track_ids that already have snapshots

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        # ✅ Person detection with tracking
        results = model.track(frame, persist=True, conf=0.5)
        tracked = get_tracked_persons(results)
        current_time = time.time()

        # Combine detections
        detections = []
        current_person_ids = set()
        
        # Add person detections
        for track_id, x1, y1, x2, y2, conf in tracked:
            current_person_ids.add(track_id)
            
            # Track detection start time
            if track_id not in person_detection_start:
                person_detection_start[track_id] = current_time
            
            # Check if person detected for 30+ seconds
            detection_duration = current_time - person_detection_start[track_id]
            if detection_duration >= 30 and track_id not in snapshotted_persons:
                # Save snapshot
                snapshot_filename = f"{SNAPSHOTS_DIR}/camera_{camera_id}_person_{track_id}_{int(current_time)}.jpg"
                cv2.imwrite(snapshot_filename, frame)
                print(f"📸 Snapshot saved: {snapshot_filename}")
                snapshotted_persons.add(track_id)
            
            detections.append({
                "type": "person",
                "id": track_id,
                "bbox": [x1, y1, x2, y2],
                "conf": round(conf, 2),
                "duration": round(detection_duration, 1),
            })

        # Remove persons that are no longer detected
        for track_id in list(person_detection_start.keys()):
            if track_id not in current_person_ids:
                del person_detection_start[track_id]
                if track_id in snapshotted_persons:
                    snapshotted_persons.discard(track_id)

        # Add weapon detections
        if tracked and len(tracked) > 0:  # Only check weapons when persons detected
            weapon_results = weapon_model.predict(frame, conf=0.5)
            
            if weapon_results and len(weapon_results) > 0:
                for result in weapon_results:
                    for box in result.boxes:
                        x1, y1, x2, y2 = box.xyxy[0].tolist()
                        conf = float(box.conf[0])
                        class_id = int(box.cls[0])
                        class_name = result.names[class_id]
                        
                        detections.append({
                            "type": "weapon",
                            "class": class_name,
                            "bbox": [x1, y1, x2, y2],
                            "conf": round(conf, 2),
                        })

        ws = connections.get(camera_id)
        if ws and main_loop:
            asyncio.run_coroutine_threadsafe(
                ws.send_json({
                    "timestamp": time.time(),
                    "detections": detections
                }),
                main_loop
            )

    cap.release()

