from sqlmodel import select
from fastapi import APIRouter, Depends
from sqlmodel import Session
from models.camera import Camera
from deps import get_session

router = APIRouter()

@router.post("/cameras")
def create_camera(camera: Camera, session: Session = Depends(get_session)):
    session.add(camera)
    session.commit()
    session.refresh(camera)
    return camera

@router.get("/cameras")
def list_cameras(session: Session = Depends(get_session)):
    return session.exec(select(Camera)).all()
