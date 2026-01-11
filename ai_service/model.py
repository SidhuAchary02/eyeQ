from ultralytics import YOLO

MODEL_PATH = "models/yolov8s.pt"

def load_model():
    model = YOLO(MODEL_PATH)
    return model
