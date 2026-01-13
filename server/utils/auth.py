from fastapi import Depends, HTTPException, Cookie
from jose import jwt, JWTError

SECRET_KEY = "CHANGE_THIS_TO_ENV_VAR"
ALGORITHM = "HS256"

def get_current_user(access_token: str = Cookie(None)):
    if not access_token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    try:
        payload = jwt.decode(access_token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
