from ultralytics import YOLO

MODEL_PATH = "yolov8n.pt"

def load_model():
    model = YOLO(MODEL_PATH)
    return model
