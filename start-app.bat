@echo off
echo ========================================================
echo        STARTING LIFE RPG FULL STACK APPLICATION
echo ========================================================
echo.
echo [1/2] Checking Local PostgreSQL Database (Port 5433)...
node backend/src/db/init-local-db.js
echo.
echo [2/2] Launching Backend API (Port 5000) and Frontend Vite (Port 5173)...
echo.
echo ========================================================
echo App URL: http://localhost:5173
echo API URL: http://localhost:5000
echo ========================================================
echo.
call npm run dev
pause
