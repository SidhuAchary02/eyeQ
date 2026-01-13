from fastapi import FastAPI, HTTPException
from sqlmodel import SQLModel
from db import engine
from fastapi.middleware.cors import CORSMiddleware
import httpx
from pydantic import BaseModel
from routes.camera import router as camera_router
from routes.auth import router as auth_router

app = FastAPI()
app.include_router(camera_router)
app.include_router(auth_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    SQLModel.metadata.create_all(engine)

class DetectionRequest(BaseModel):
    rtsp_url: str

AI_SERVICE_URL = "http://localhost:8001/detect"  # URL of the ai_service FastAPI server

@app.post("/start-detection")
async def start_detection(request: DetectionRequest):
    """
    Endpoint to start detection on the provided RTSP URL.
    Calls the ai_service to perform the detection.
    """
    rtsp_url = request.rtsp_url
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(AI_SERVICE_URL, json={"rtsp_url": rtsp_url})
            if response.status_code == 200:
                return {"message": "Detection started successfully", "details": response.json()}
            else:
                raise HTTPException(status_code=response.status_code, detail="Failed to start detection")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)  # Run on port 8000