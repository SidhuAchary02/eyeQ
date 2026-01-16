from pydantic import BaseModel
from typing import Optional

class CameraCreate(BaseModel):
    name: str
    room: str
    location_type: str
    lighting: str
    source_type: str
    rtsp_url: Optional[str] = None
