#!/bin/bash

# Team Task Manager - Deployment Setup Script
# This script helps set up your application for Railway deployment

echo "🚀 Team Task Manager - Railway Deployment Setup"
echo "================================================"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Git is installed
if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ Git is not installed. Please install Git first.${NC}"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js 18+ first.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Git and Node.js found${NC}"
echo ""

# Navigate to root directory
cd "$(dirname "$0")"

# Setup Backend
echo "📦 Setting up Backend..."
cd backend

if [ ! -f .env ]; then
    cp .env.example .env
    echo -e "${YELLOW}⚠️  Created .env file. Please update it with your MongoDB URI and JWT_SECRET${NC}"
else
    echo -e "${GREEN}✓ .env file exists${NC}"
fi

npm install
echo -e "${GREEN}✓ Backend dependencies installed${NC}"

cd ..

# Setup Frontend
echo ""
echo "⚙️  Setting up Frontend..."
cd frontend

if [ ! -f .env.local ]; then
    cp .env.example .env.local
    echo -e "${YELLOW}⚠️  Created .env.local file${NC}"
else
    echo -e "${GREEN}✓ .env.local file exists${NC}"
fi

npm install
echo -e "${GREEN}✓ Frontend dependencies installed${NC}"

cd ..

# Summary
echo ""
echo "================================================"
echo -e "${GREEN}✅ Setup Complete!${NC}"
echo "================================================"
echo ""
echo "📋 Next Steps:"
echo "1. Update backend/.env with your MongoDB URI"
echo "2. Generate a strong JWT_SECRET for production"
echo "3. Update frontend/.env.local with API URL"
echo "4. Run 'docker-compose up' to test locally"
echo "5. Follow RAILWAY_DEPLOYMENT.md for production deployment"
echo ""
echo "📚 Documentation: See RAILWAY_DEPLOYMENT.md and DEPLOYMENT_CHECKLIST.md"
echo ""
