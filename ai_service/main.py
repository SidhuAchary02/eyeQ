from fastapi import FastAPI, BackgroundTasks
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
import cv2
import time
import os
from datetime import datetime
from pydantic import BaseModel
from helper import save_snapshot
from video import get_video_stream
from model import load_model
from detector import get_tracked_persons
from models.weapon_model import load_model as load_weapon_model

# ---------------- CONFIG ----------------
PERSON_ALERT_SECONDS = 30
TRACK_DISAPPEAR_RESET = 5
WEAPON_DETECTION_FPS = 2   
WEAPON_CONF = 0.3

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
class DetectionRequest(BaseModel):
    rtsp_url: str
# ---------------- DETECTION FUNCTION ----------------
def run_detection(rtsp_url: str):
    print(f"🔌 Connecting to RTSP stream: {rtsp_url}...")
    cap = get_video_stream(rtsp_url)

    print("🧠 Loading YOLO person model...")
    model = load_model()
    print("✅ Person model loaded")

    print("🔪 Loading weapon model...")
    weapon_model = load_weapon_model()
    print("✅ Weapon model loaded")

    first_seen = {}
    last_seen = {}
    alerted = set()
    weapon_boxes = []
    last_weapon_check = 0

    while True:
        ret, frame = cap.read()
        if not ret:
            print("❌ Failed to read frame")
            break

        now = time.time()

        # ---------------- PERSON TRACKING ----------------
        results = model.track(
            frame,
            persist=True,
            conf=0.5,
            verbose=False
        )

        tracked_persons = get_tracked_persons(results)
        active_ids = set()

        for track_id, x1, y1, x2, y2, conf in tracked_persons:
            active_ids.add(track_id)

            if track_id not in first_seen:
                first_seen[track_id] = now
                print(f"👤 Person ID {track_id} appeared")

            last_seen[track_id] = now
            elapsed = now - first_seen[track_id]

            # Draw person box (GREEN)
            cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
            cv2.putText(
                frame,
                f"ID {track_id} | {int(elapsed)}s",
                (x1, y1 - 10),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.6,
                (0, 255, 0),
                2
            )

            # Loitering alert (already working)
            if elapsed >= PERSON_ALERT_SECONDS and track_id not in alerted:
                print(f"🚨 ALERT: Person ID {track_id} loitering {int(elapsed)}s")
                save_snapshot(frame, track_id)
                alerted.add(track_id)

        # ---------------- WEAPON DETECTION (LOW FPS) ----------------
        if now - last_weapon_check >= 1 / WEAPON_DETECTION_FPS:
            weapon_boxes.clear()

            weapon_results = weapon_model(frame, conf=WEAPON_CONF, verbose=False)

            for r in weapon_results:
                for box in r.boxes:
                    cls_id = int(box.cls[0])
                    label = r.names[cls_id].lower()

                    if label in ["knife", "gun", "handgun", "weapon"]:
                        x1, y1, x2, y2 = map(int, box.xyxy[0])
                        conf = float(box.conf[0])
                        weapon_boxes.append((label, x1, y1, x2, y2, conf))
                        print(f"🔫 Weapon detected: {label} ({conf:.2f})")

            last_weapon_check = now

        # ---------------- DRAW WEAPON BOXES (RED) ----------------
        for label, x1, y1, x2, y2, conf in weapon_boxes:
            cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 0, 255), 2)
            cv2.putText(
                frame,
                f"{label.upper()} {conf:.2f}",
                (x1, y1 - 10),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.6,
                (0, 0, 255),
                2
            )

        # ---------------- CLEANUP DISAPPEARED PERSONS ----------------
        for track_id in list(last_seen.keys()):
            if track_id not in active_ids:
                if now - last_seen[track_id] > TRACK_DISAPPEAR_RESET:
                    first_seen.pop(track_id, None)
                    last_seen.pop(track_id, None)
                    alerted.discard(track_id)
                    print(f"👋 Person ID {track_id} left")

        # cv2.imshow("AI Camera - Tracked Persistence", frame)  # Commented out for headless server
        # if cv2.waitKey(1) & 0xFF == ord("q"):
        #     break

    cap.release()
    cv2.destroyAllWindows()

@app.post("/detect")
async def start_detection(request: DetectionRequest, background_tasks: BackgroundTasks):
    background_tasks.add_task(run_detection, request.rtsp_url)
    return {"message": f"Detection started for {request.rtsp_url}"}

@app.get("/stream")
async def stream(rtsp_url: str):
    def generate():
        cap = get_video_stream(rtsp_url)
        model = load_model()
        weapon_model = load_weapon_model()
        first_seen = {}
        last_seen = {}
        alerted = set()
        weapon_boxes = []
        last_weapon_check = 0

        while True:
            ret, frame = cap.read()
            if not ret:
                break

            now = time.time()

            # Person tracking
            results = model.track(frame, persist=True)
            # ... (add the rest of the detection logic here, similar to run_detection)
            # For brevity, assume we process and draw on frame

            # Encode frame
            ret, buffer = cv2.imencode('.jpg', frame)
            if not ret:
                continue
            frame_bytes = buffer.tobytes()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

        cap.release()

    return StreamingResponse(generate(), media_type='multipart/x-mixed-replace; boundary=frame')

# ---------------- RUN ----------------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
