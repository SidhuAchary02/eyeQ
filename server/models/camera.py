from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime

class Camera(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    room: str
    location_type: str
    lighting: str
    source_type: str
    rtsp_url: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
