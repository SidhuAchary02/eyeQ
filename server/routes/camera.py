from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from models.camera import Camera
from models.user import User
from deps import get_session
from utils.auth import get_current_user

router = APIRouter(prefix="/cameras", tags=["Camera"])

@router.post("")
def create_camera(
    camera: Camera,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    # Check if user already has a camera
    existing = session.exec(
        select(Camera).where(Camera.user_id == current_user.id)
    ).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="User already has a camera"
        )

    camera.user_id = current_user.id
    session.add(camera)
    session.commit()
    session.refresh(camera)
    return camera

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