from fastapi import FastAPI, HTTPException
from schemas import camera
from sqlmodel import SQLModel
from db import engine
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from config import JWT_SECRET_KEY
import httpx
from pydantic import BaseModel
from routes.camera import router as camera_router
from routes.auth import router as auth_router

app = FastAPI()
app.include_router(camera_router)
app.include_router(auth_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(
    SessionMiddleware,
    secret_key=JWT_SECRET_KEY,
    same_site="none",
)


@app.on_event("startup")
def on_startup():
    SQLModel.metadata.create_all(engine)

class DetectionRequest(BaseModel):
    rtsp_url: str

AI_SERVICE_URL = "http://localhost:8001/detect"  # URL of the ai_service FastAPI server

# @app.post("/start-detection")
# async def start_detection(request: DetectionRequest):
#     """
#     Endpoint to start detection on the provided RTSP URL.
#     Calls the ai_service to perform the detection.
#     """
#     rtsp_url = request.rtsp_url
#     try:
#         async with httpx.AsyncClient(timeout=5) as client:
#             resp = await client.post(
#                 AI_SERVICE_URL,
#                 json={
#                     "rtsp_url": camera.rtsp_url,
#                     "camera_id": camera.id
#                 }
#             )

#         if resp.status_code != 200:
#             raise HTTPException(
#                 500,
#                 "Camera saved, but AI service failed to start"
#             )

#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)  # Run on port 8000