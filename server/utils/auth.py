from fastapi import Depends, HTTPException, Cookie, Header
from jose import jwt, JWTError
from sqlmodel import Session, select
from deps import get_session
from models.user import User
from config import JWT_SECRET_KEY

ALGORITHM = "HS256"

def get_current_user(
    access_token: str | None = Cookie(default=None),
    authorization: str | None = Header(default=None),
    session: Session = Depends(get_session)
):
    token = access_token
    
    # If not in cookie, try Authorization header
    if not token and authorization:
        if authorization.startswith("Bearer "):
            token = authorization[7:]
    
    if not token:
        raise HTTPException(status_code=401, detail="No token provided")

    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=["HS256"])
        user_id = int(payload["sub"])
    except JWTError as e:
        raise HTTPException(status_code=401, detail="Invalid token")
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))

    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return user
