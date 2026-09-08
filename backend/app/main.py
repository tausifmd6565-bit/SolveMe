from fastapi import FastAPI, Request, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from jose import jwt, JWTError
from sqlalchemy.orm import Session
import os

from .database import engine, Base, get_db
from .models import User
from .routers import auth, problems, validations, solvers, dashboard
from .seed_data import seed_database

# Create all tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="SolveMe API",
    description="From Problems to Solutions. Crowdsourced civic problem-solving platform.",
    version="1.0.0-prototype"
)

# CORS — allow local dev and any hosted deployment domain
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"],
    allow_origin_regex=r"https?://.*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount uploads directory
UPLOAD_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# Mount fronten_2 as /portal
FRONTEN_2_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "fronten_2")
if os.path.exists(FRONTEN_2_DIR):
    app.mount("/portal", StaticFiles(directory=FRONTEN_2_DIR, html=True), name="portal")

# Mount built React frontend (frontend/dist) under /app
FRONTEND_DIST = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "frontend", "dist")
if os.path.exists(FRONTEND_DIST):
    app.mount("/app", StaticFiles(directory=FRONTEND_DIST, html=True), name="frontend_app")

# Include routers
app.include_router(auth.router)
app.include_router(problems.router)
app.include_router(validations.router)
app.include_router(solvers.router)
app.include_router(dashboard.router)


@app.on_event("startup")
def on_startup():
    """Seed database on first run."""
    seed_database()


@app.get("/")
def root():
    return {
        "name": "SIH Innovation Hub API",
        "version": "1.0.0-prototype",
        "docs": "/docs",
        "description": "A digital platform to crowdsource societal challenges"
    }


@app.get("/api/health")
def health_check():
    return {"status": "healthy", "version": "1.0.0-prototype"}
