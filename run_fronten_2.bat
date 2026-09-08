@echo off
echo =======================================================
echo   SolveGrid Professional Portal (fronten_2)
echo   SIH 2026 - Problem Statement ID: SIH26043
echo =======================================================
echo.
echo Starting local web server on port 3000...
cd /d "%~dp0\fronten_2"
python -m http.server 3000 --bind 127.0.0.1
pause
