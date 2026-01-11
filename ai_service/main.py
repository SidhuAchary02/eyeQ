import cv2
import time
import os
from datetime import datetime
from helper import save_snapshot
from video import get_video_stream
from model import load_model
from detector import get_tracked_persons

PERSON_ALERT_SECONDS = 30
TRACK_DISAPPEAR_RESET = 5   # tolerate brief loss

def main():
    print("🔌 Connecting to RTSP stream...")
    cap = get_video_stream()

    print("🧠 Loading YOLO model...")
    model = load_model()
    print("✅ Model loaded")

    first_seen = {}   # track_id -> timestamp
    last_seen = {}    # track_id -> timestamp
    alerted = set()   # track_ids already alerted

    while True:
        ret, frame = cap.read()
        if not ret:
            print("❌ Failed to read frame")
            break

        now = time.time()

        # YOLO tracking (THIS IS THE KEY LINE)
        results = model.track(
            frame,
            persist=True,
            conf=0.5,
            verbose=False
        )

        tracked_persons = get_tracked_persons(results)

        # Update tracking info
        active_ids = set()

        for track_id, x1, y1, x2, y2, conf in tracked_persons:
            active_ids.add(track_id)

            if track_id not in first_seen:
                first_seen[track_id] = now
                print(f"👤 Person ID {track_id} appeared")

            last_seen[track_id] = now
            elapsed = now - first_seen[track_id]

            # Draw bounding box
            cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
            label = f"ID {track_id} | {int(elapsed)}s"
            cv2.putText(
                frame, label, (x1, y1 - 10),
                cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2
            )

            # ALERT logic
            if elapsed >= PERSON_ALERT_SECONDS and track_id not in alerted:
                print(f"🚨 ALERT: Person ID {track_id} loitering {int(elapsed)}s")

                # Save snapshot
                snapshot_path = save_snapshot(frame, track_id)

                alerted.add(track_id)


        # Cleanup disappeared tracks
        for track_id in list(last_seen.keys()):
            if track_id not in active_ids:
                if now - last_seen[track_id] > TRACK_DISAPPEAR_RESET:
                    first_seen.pop(track_id, None)
                    last_seen.pop(track_id, None)
                    alerted.discard(track_id)
                    print(f"👋 Person ID {track_id} left")

        cv2.imshow("AI Camera - Tracked Persistence", frame)
        if cv2.waitKey(1) & 0xFF == ord("q"):
            break

    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    main()
