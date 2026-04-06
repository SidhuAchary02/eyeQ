# EyeQ - A real-time AI-powered video monitoring system with WebSocket-based detection streaming and multi-service architecture.

This README is written as a full context handoff so an AI assistant can quickly understand what I built, what tools I used, what currently works, and what is still pending.

## 1) What I am trying to build

EyeQ is a real-time surveillance and safety monitoring platform with:
- user authentication,
- per-user camera setup,
- live video streaming in the dashboard,
- person detection + tracking,
- weapon detection,
- bounding box overlays in the frontend,
- automatic snapshot capture when a person stays in view for a threshold duration.

Primary use case:
- Connect a camera feed (RTSP),
- run AI inference continuously,
- send detection results to UI in near-real-time,
- persist snapshots for review.

## 2) High-level architecture

The project currently has 3 parts:

1. `frontend/` (React + Vite)
- Handles signup/login/dashboard.
- Lets users add a camera.
- Displays live stream and draws detection boxes on a canvas.
- Opens a WebSocket to receive live AI detections.

2. `server/` (FastAPI + SQLModel + PostgreSQL)
- Handles auth and camera APIs.
- Stores users and camera records in Postgres.
- Issues JWT token and sets cookie.
- Exposes protected routes (`/auth/me`, `/cameras/*`).

3. `ai_service/` (FastAPI + Ultralytics + OpenCV)
- Receives detection start request (`/detect`).
- Opens RTSP stream and runs detection loop in background.
- Performs person tracking and weapon detection.
- Sends detection events to frontend over WebSocket.
- Saves snapshots in `ai_service/snapshots/`.

## 3) Tech stack and libraries used

Frontend:
- React 19
- Vite 7
- React Router
- Axios
- Tailwind CSS
- Lucide React icons

Backend (`server`):
- FastAPI
- SQLModel
- PostgreSQL (`psycopg` URL in code)
- `python-jose` (JWT)
- Argon2 password hashing
- CORS middleware
- Session middleware

AI service (`ai_service`):
- FastAPI
- Ultralytics YOLO
- OpenCV
- NumPy
- WebSocket endpoint for real-time detection output

Model files currently referenced:
- Person model: `ai_service/models/yolov8s.pt`
- Weapon model: `ai_service/models/weights/best.pt`

## 4) Current folder intent

- `frontend/src/components/auth/` -> login/signup screens.
- `frontend/src/components/dashboard/` -> dashboard, camera pages, stream pages.
- `server/routes/auth.py` -> signup/login/me/logout routes.
- `server/routes/camera.py` -> camera CRUD-ish entry points (currently create + get-my-camera).
- `server/models/` -> SQLModel tables (`User`, `Camera`).
- `ai_service/main.py` -> detection orchestration + websocket + snapshot API.
- `ai_service/detector.py` -> utility to parse tracked persons from YOLO results.
- `ai_service/video.py` -> RTSP capture helper.
- `ai_service/snapshots/` -> saved alert images.

## 5) Implemented flow (end to end)

### Auth flow
1. User signs up via `/auth/signup`.
2. Password is hashed with Argon2.
3. JWT is generated and returned (also set in cookie).
4. Frontend stores user + token in localStorage and uses route protection.

### Camera flow
1. User creates camera from dashboard.
2. Camera record is stored in PostgreSQL and linked to `user_id`.
3. Frontend fetches camera via `/cameras/get-my-camera`.

### Stream + detection flow
1. Frontend loads stream component.
2. WebRTC stream is fetched from WHEP endpoint (`http://localhost:8889/{cameraPath}/whep`).
3. Frontend also calls AI service `/detect` with:
   - `rtsp_url`
   - `camera_id`
4. AI service starts background detection loop:
   - person tracking (`model.track(..., persist=True)`)
   - weapon detection (`weapon_model.predict(...)`)
5. Detections are pushed to frontend over `ws://localhost:8001/ws/{camera_id}`.
6. Frontend draws boxes:
   - green for person,
   - red for weapon.

### Snapshot flow
- AI service tracks each person ID duration.
- If a tracked person remains for >= 30 seconds:
  - one snapshot is saved for that tracked person,
  - stored under `ai_service/snapshots/`.
- `/snapshots` endpoint returns list of saved images with timestamp metadata.

## 6) APIs currently in code

Server (`:8000`):
- `POST /auth/signup`
- `POST /auth/login`
- `GET /auth/me`
- `POST /auth/logout`
- `POST /cameras`
- `GET /cameras/get-my-camera`

AI Service (`:8001`):
- `POST /detect`
- `GET /snapshots`
- `WS /ws/{camera_id}`

## 7) What works now (as implemented)

- Basic user auth endpoints and protected route behavior.
- Database table creation on startup (`SQLModel.metadata.create_all`).
- Camera retrieval for authenticated user.
- AI detection loop startup from frontend.
- Person + weapon detection output delivered by WebSocket.
- Canvas overlay rendering in frontend.
- Snapshot saving for long-duration person detection.

## 8) Known issues / rough edges

1. `POST /cameras` does not explicitly return a response body in current route implementation.
2. Server code includes commented integration to call AI service from backend but frontend currently calls AI service directly.
3. Auth token is used both in cookie and localStorage patterns; this should be unified for production security.
4. CORS and cookie settings are local-dev oriented (`secure=False` in auth cookie).
5. `server/package.json` exists but backend is Python-based; JS dependency there is likely accidental/non-essential.
6. No root-level single-command dev orchestration yet (frontend + server + ai_service + media server are separate).
7. Minimal automated tests; mostly implementation-first prototype stage.

## 9) Environment and infra assumptions

Expected local services:
- Postgres on localhost:5432 with db `eyeq`
- Backend server on `http://localhost:8000`
- AI service on `http://localhost:8001`
- Frontend on `http://localhost:5173`
- WHEP/WebRTC media endpoint on `http://localhost:8889`

Expected env vars (backend):
- `JWT_SECRET_KEY`
- `G_CLIENT_ID` (optional/for future oauth usage)
- `G_CLIENT_SECRET` (optional/for future oauth usage)
- `BACKEND_URL`
- `FRONTEND_URL`

## 10) How to run (current practical approach)

Open separate terminals:

1) Backend
```bash
cd server
uvicorn main:app --reload --port 8000
```

2) AI service
```bash
cd ai_service
uvicorn main:app --reload --port 8001
```

3) Frontend
```bash
cd frontend
npm install
npm run dev
```

4) Ensure media/WHEP source is available on port `8889` (external to this repo).

## 11) What this project is right now

Current stage:
- Functional prototype / integration stage.

It already demonstrates:
- full-stack auth + camera linkage,
- real-time AI inference events,
- live UI overlays,
- snapshot generation logic.

It still needs:
- stronger API consistency,
- production-grade security hardening,
- deployment structure,
- test coverage and reliability improvements.

## 12) Prompt-ready summary for ChatGPT

If you are ChatGPT assisting this project, assume:
- I am building an AI-powered CCTV monitoring app called EyeQ.
- Frontend is React/Vite, backend is FastAPI + Postgres, AI service is FastAPI + YOLO/OpenCV.
- I already implemented real-time websocket detections and snapshot capture.
- I need help moving from prototype to production-grade architecture.

High-priority help areas:
1. Security hardening (JWT/cookie strategy, CORS, secrets, auth flow).
2. API cleanup and service boundaries (backend vs ai_service responsibilities).
3. Reliability/performance for multi-camera real-time inference.
4. Better testing and deployment structure.
5. Logging/monitoring and failure recovery strategies.

---

This README is intentionally detailed so future AI sessions can quickly continue from this exact development state.
