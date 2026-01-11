import cv2

RTSP_URL = "rtsp://localhost:8554/webcam"

def get_video_stream():
    cap = cv2.VideoCapture(RTSP_URL, cv2.CAP_FFMPEG)

    # CRITICAL for smoothness
    cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)
    cap.set(cv2.CAP_PROP_FPS, 15)

    if not cap.isOpened():
        raise RuntimeError("❌ Cannot open RTSP stream")

    return cap
