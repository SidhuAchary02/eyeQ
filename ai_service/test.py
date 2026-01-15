# test_detection.py - Test person and weapon detection
from ultralytics import YOLO
import cv2
import sys
sys.path.insert(0, 'models')
from weapon_model import load_model as load_weapon_model

def main():
    print("🧠 Loading person model...")
    person_model = YOLO("models/yolov8s.pt")
    print("✅ Person model loaded")
    
    print("🔪 Loading weapon model...")
    weapon_model = load_weapon_model()
    print("✅ Weapon model loaded")
    print(f"   Model names: {weapon_model.names}")

    # Open webcam (1 = second camera, or 0 for default)
    cap = cv2.VideoCapture(1)

    if not cap.isOpened():
        print("❌ Error: Could not access webcam. Trying camera 0...")
        cap = cv2.VideoCapture(0)
        if not cap.isOpened():
            print("❌ Error: Could not access any webcam.")
            return

    print("✅ Webcam opened. Press 'q' to quit, 'p' for person only, 'w' for weapon only, 'b' for both.")
    
    detection_mode = "both"  # "person", "weapon", or "both"
    weapon_detections_found = 0

    while True:
        ret, frame = cap.read()
        if not ret:
            print("❌ Failed to read frame.")
            break

        # Person detection & tracking
        if detection_mode in ["person", "both"]:
            person_results = person_model.track(frame, persist=True, conf=0.5, verbose=False)
            
            for r in person_results:
                if r.boxes.id is not None:
                    for box, track_id in zip(r.boxes, r.boxes.id):
                        cls_id = int(box.cls[0])
                        label = r.names[cls_id]
                        
                        if label == "person":
                            x1, y1, x2, y2 = map(int, box.xyxy[0])
                            conf = float(box.conf[0])
                            track_id = int(track_id)
                            
                            # Draw GREEN box for person
                            cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
                            cv2.putText(
                                frame,
                                f"Person ID {track_id} {conf:.2f}",
                                (x1, y1 - 10),
                                cv2.FONT_HERSHEY_SIMPLEX,
                                0.6,
                                (0, 255, 0),
                                2
                            )

        # Weapon detection
        if detection_mode in ["weapon", "both"]:
            weapon_results = weapon_model(frame, conf=0.1, verbose=False)  # Lowered to 0.1
            
            for r in weapon_results:
                print(f"🔍 Weapon model found {len(r.boxes)} detections")
                print(f"   Class names available: {r.names}")
                
                for box in r.boxes:
                    cls_id = int(box.cls[0])
                    label = r.names[cls_id].lower()
                    conf = float(box.conf[0])
                    x1, y1, x2, y2 = map(int, box.xyxy[0])
                    
                    print(f"   → Detected: {label} (confidence: {conf:.2f})")
                    weapon_detections_found += 1
                    
                    # Draw RED box for ANY detection from weapon model
                    cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 0, 255), 3)
                    cv2.putText(
                        frame,
                        f"{label.upper()} {conf:.2f}",
                        (x1, y1 - 10),
                        cv2.FONT_HERSHEY_SIMPLEX,
                        0.7,
                        (0, 0, 255),
                        2
                    )
                    print(f"🔫 Detection drawn: {label} ({conf:.2f})")

        # Add mode indicator
        mode_text = f"Mode: {detection_mode.upper()} | Weapon Detections: {weapon_detections_found}"
        cv2.putText(frame, mode_text, (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
        cv2.putText(frame, "Press q=quit, p=person, w=weapon, b=both", (10, 60), 
                   cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)

        # Show frame
        cv2.imshow("Detection Test - GREEN=Person, RED=Weapon", frame)

        # Handle key presses
        key = cv2.waitKey(1) & 0xFF
        if key == ord('q'):
            break
        elif key == ord('p'):
            detection_mode = "person"
            print("🔄 Switched to PERSON detection only")
        elif key == ord('w'):
            detection_mode = "weapon"
            print("🔄 Switched to WEAPON detection only")
        elif key == ord('b'):
            detection_mode = "both"
            print("🔄 Switched to BOTH detection modes")

    # Clean up
    cap.release()
    cv2.destroyAllWindows()
    print(f"✅ Test completed. Total weapon detections: {weapon_detections_found}")

if __name__ == "__main__":
    main()
