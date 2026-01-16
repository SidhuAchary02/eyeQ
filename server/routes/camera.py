from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from models.camera import Camera
from schemas.camera import CameraCreate
from models.user import User
from deps import get_session
from utils.auth import get_current_user

router = APIRouter(prefix="/cameras", tags=["Camera"])

AI_SERVICE_URL = "http://localhost:8001/detect"



@router.post("")
async def create_camera(
    payload: CameraCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    existing = session.exec(
        select(Camera).where(Camera.user_id == current_user.id)
    ).first()

    if existing:
        raise HTTPException(400, "User already has a camera")

    camera = Camera(
        **payload.dict(),
        user_id=current_user.id
    )

    session.add(camera)
    session.commit()
    session.refresh(camera)

@router.get("/get-my-camera")
def get_my_camera(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    camera = session.exec(
        select(Camera).where(Camera.user_id == current_user.id)
    ).first()
    
    # Return as array for consistency with API expectations
    return [camera] if camera else []