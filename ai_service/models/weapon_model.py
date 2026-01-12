from ultralytics import YOLO
import os

MODEL_PATH = os.path.join(os.path.dirname(__file__), "weights", "weapon.pt")

def load_model():
    model = YOLO(MODEL_PATH)
    return model
