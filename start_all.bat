@echo off
echo =======================================================
echo   SIH Innovation Hub - Smart India Hackathon 2026
echo   Team SolveGrid (Problem Statement ID: SIH26043)
echo =======================================================
echo.
echo Launching FastAPI Backend (Port 8000)...
start "SIH Backend (FastAPI)" cmd /k "cd /d %~dp0\backend && python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000"

echo Launching Professional Portal (fronten_2 on Port 3000)...
start "SIH Portal (fronten_2)" cmd /k "cd /d %~dp0\fronten_2 && python -m http.server 3000 --bind 127.0.0.1"

echo Launching React/Vite Frontend (Port 5173)...
start "SIH Frontend (Vite)" cmd /k "cd /d %~dp0\frontend && npm run dev -- --host 127.0.0.1 --port 5173"

echo.
echo All services launched!
echo.
echo 1. Professional Portal (fronten_2):  http://127.0.0.1:3000/
echo    Also embedded inside Backend at:   http://127.0.0.1:8000/portal/
echo 2. React Vite Portal (frontend):     http://127.0.0.1:5173/
echo 3. FastAPI Interactive API Docs:     http://127.0.0.1:8000/docs
echo.
pause
