@echo off
echo Starting SIH Innovation Hub - FastAPI Backend...
cd /d "%~dp0\backend"
python -m uvicorn app.main:app --reload --port 8000
pause
