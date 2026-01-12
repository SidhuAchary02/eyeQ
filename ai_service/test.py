# test_webcam.py
from ultralytics import YOLO
import cv2

def main():
    # Load your trained model
    model = YOLO("models/weights/best.pt")  
    # If you want to test YOLOv8 default, use:
    # model = YOLO("yolov8n.pt")

    # Open webcam (0 = default camera)
    cap = cv2.VideoCapture(1)

    if not cap.isOpened():
        print("❌ Error: Could not access webcam.")
        return

    print("✅ Webcam opened. Press 'q' to quit.")

    while True:
        ret, frame = cap.read()
        if not ret:
            print("❌ Failed to read frame.")
            break

        # Run YOLO detection
        results = model(frame)

        # Draw detections on the frame
        annotated_frame = results[0].plot()

        # Show frame
        cv2.imshow("YOLOv8 Webcam", annotated_frame)

        # Press 'q' to quit
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    # Clean up
    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    main()
