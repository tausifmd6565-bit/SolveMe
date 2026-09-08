@echo off
echo =======================================================
echo   SolveMe Instant Public URL Generator
echo   (No sign-up needed - creates a public HTTPS link)
echo =======================================================
echo.
echo Ensuring frontend is reachable on port 5173...
echo.
echo Launching localtunnel on port 5173...
echo Copy the public HTTPS URL shown below to share with evaluators!
echo.
npx -y localtunnel --port 5173
pause
