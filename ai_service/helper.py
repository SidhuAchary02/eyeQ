import os
import cv2
from datetime import datetime

SNAPSHOT_DIR = "snapshots"

os.makedirs(SNAPSHOT_DIR, exist_ok=True)

def save_snapshot(frame, track_id):
    """
    Save snapshot image when alert triggers
    """
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"alert_id{track_id}_{timestamp}.jpg"
    path = os.path.join(SNAPSHOT_DIR, filename)

    cv2.imwrite(path, frame)
    print(f"📸 Snapshot saved: {path}")

    return path
