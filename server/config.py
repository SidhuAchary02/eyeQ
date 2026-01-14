import os
from dotenv import load_dotenv

load_dotenv()  # reads .env file

JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")

G_CLIENT_ID = os.getenv("G_CLIENT_ID")
G_CLIENT_SECRET = os.getenv("G_CLIENT_SECRET")

BACKEND_URL = os.getenv("BACKEND_URL")
FRONTEND_URL = os.getenv("FRONTEND_URL")

if not JWT_SECRET_KEY:
    raise RuntimeError("JWT_SECRET_KEY not set")
