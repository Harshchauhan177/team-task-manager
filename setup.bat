@echo off
REM Team Task Manager - Deployment Setup Script for Windows
REM This script helps set up your application for Railway deployment

echo.
echo 🚀 Team Task Manager - Railway Deployment Setup
echo ================================================
echo.

REM Check if Git is installed
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Git is not installed. Please install Git first.
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    exit /b 1
)

echo ✓ Git and Node.js found
echo.

REM Setup Backend
echo 📦 Setting up Backend...
cd backend

if not exist .env (
    copy .env.example .env
    echo ⚠️  Created .env file. Please update it with your MongoDB URI and JWT_SECRET
) else (
    echo ✓ .env file exists
)

call npm install
echo ✓ Backend dependencies installed

cd ..

REM Setup Frontend
echo.
echo ⚙️  Setting up Frontend...
cd frontend

if not exist .env.local (
    copy .env.example .env.local
    echo ⚠️  Created .env.local file
) else (
    echo ✓ .env.local file exists
)

call npm install
echo ✓ Frontend dependencies installed

cd ..

REM Summary
echo.
echo ================================================
echo ✅ Setup Complete!
echo ================================================
echo.
echo 📋 Next Steps:
echo 1. Update backend/.env with your MongoDB URI
echo 2. Generate a strong JWT_SECRET for production
echo 3. Update frontend/.env.local with API URL
echo 4. Run 'docker-compose up' to test locally
echo 5. Follow RAILWAY_DEPLOYMENT.md for production deployment
echo.
echo 📚 Documentation: See RAILWAY_DEPLOYMENT.md and DEPLOYMENT_CHECKLIST.md
echo.
