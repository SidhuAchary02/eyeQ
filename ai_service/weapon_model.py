from ultralytics import YOLO

MODEL_PATH = "models/weights/best.pt"

def load_model():
    model = YOLO(MODEL_PATH)
    return model
