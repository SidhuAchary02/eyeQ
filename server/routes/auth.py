from fastapi import APIRouter, Depends, HTTPException, Response
from utils.jwt import create_access_token
from sqlmodel import Session, select
from models.user import User
from deps import get_session
from utils.security import hash_password, verify_password
from schemas.auth import SignupRequest, LoginRequest
from utils.auth import get_current_user

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/signup")
def signup(payload: SignupRequest, session: Session = Depends(get_session)):
    try:
        password_hash = hash_password(payload.password)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    existing_user = session.exec(
        select(User).where(User.email == payload.email)
    ).first()

    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(
        full_name=payload.full_name,
        email=payload.email,
        password_hash=password_hash
    )

    session.add(user)
    session.commit()
    session.refresh(user)

    return {
        "id": user.id,
        "full_name": user.full_name,
        "email": user.email
    }


@router.post("/login")
def login(payload: LoginRequest, response: Response, session: Session = Depends(get_session)):

    user = session.exec(
        select(User).where(User.email == payload.email)
    ).first()

    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({
        "sub": str(user.id),
        "email": user.email
    })

    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=False,       # True in production (HTTPS)
        samesite="lax",
        max_age=60 * 60,
    )

    return {
        "id": user.id,
        "email": user.email,
        "full_name": user.full_name
    }


@router.get("/me")
def me(current_user: dict = Depends(get_current_user)):
    return current_user


@router.post("/logout")
def logout(response: Response):
    response.delete_cookie("access_token")
    return {"message": "Logged out"}
