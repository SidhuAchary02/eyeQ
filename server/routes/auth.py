from fastapi import APIRouter, Depends, HTTPException, Response, Request
from jose import jwt
from datetime import datetime, timedelta
from sqlmodel import Session, select
from deps import get_session
from utils.security import hash_password, verify_password
from schemas.auth import SignupRequest, LoginRequest
from models.user import User
from utils.auth import get_current_user
from config import (
    JWT_SECRET_KEY,
)

router = APIRouter(prefix="/auth", tags=["Auth"])

def create_jwt(sub: str, email: str = None):
    payload = {
        "sub": sub,
        "exp": datetime.utcnow() + timedelta(days=7)
    }
    if email:
        payload["email"] = email
    return jwt.encode(payload, JWT_SECRET_KEY, algorithm="HS256")

@router.post("/signup")
def signup(payload: SignupRequest, response: Response, session: Session = Depends(get_session)):
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

    token = create_jwt(str(user.id), user.email)

    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=60 * 60,
    )

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

    token = create_jwt(str(user.id), user.email)

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

