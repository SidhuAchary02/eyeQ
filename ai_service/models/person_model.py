from ultralytics import YOLO

MODEL_PATH = "weights/yolov8s.pt"

def load_model():
    model = YOLO(MODEL_PATH)
    return model
