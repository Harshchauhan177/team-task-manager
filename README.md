# Team Task Manager - Deployment Configuration

This repository contains a full-stack Task Management application ready for deployment on Railway.

## 📁 Project Structure

```
team-task-manager/
├── backend/                 # Express.js API server
│   ├── Controllers/        # API controllers
│   ├── Models/             # MongoDB schemas
│   ├── Routes/             # API routes
│   ├── Middlewares/        # Auth, validation, rate limiting
│   ├── Dockerfile          # Production Docker build
│   ├── .dockerignore        # Docker build exclusions
│   ├── package.json         # Backend dependencies
│   └── index.js             # Server entry point
│
├── frontend/               # React.js web application
│   ├── public/             # Static assets
│   ├── src/                # React components & pages
│   ├── Dockerfile          # Production Docker build
│   ├── .dockerignore        # Docker build exclusions
│   ├── package.json         # Frontend dependencies
│   └── build/              # Production build (generated)
│
├── docker-compose.yml      # Local development setup
└── RAILWAY_DEPLOYMENT.md   # Detailed deployment guide

```

## 🚀 Quick Start - Local Development

### Prerequisites
- Node.js 18+
- MongoDB running locally or MongoDB Atlas account
- Docker (optional, for containerized development)

### Option 1: Docker Compose (Easiest)
```bash
# Start all services (Backend, Frontend, MongoDB)
docker-compose up -d

# Services will be available at:
# Frontend: http://localhost:3000
# Backend API: http://localhost:8080
# MongoDB: mongodb://localhost:27017
```

### Option 2: Manual Setup

**Backend:**
```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB connection string
npm install
npm run dev  # Runs with nodemon for hot reload
```

**Frontend (in another terminal):**
```bash
cd frontend
cp .env.example .env.local
npm install
npm start
```

## 🌐 Deployment on Railway

### Quick Deploy (Recommended)
1. Read the complete guide: [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md)
2. Follow the step-by-step instructions
3. All Docker configurations are already in place

### What's Already Configured

✅ **Backend Dockerfile** - Multi-stage build optimized for production
✅ **Frontend Dockerfile** - React build with serve for production serving
✅ **Environment Files** - `.env.example` files for both services
✅ **Docker Compose** - For local testing
✅ **Health Checks** - Both services have health checks configured
✅ **Port Configuration** - Backend on 8080, Frontend on 3000

### Required Environment Variables

**Backend:**
- `PORT=8080`
- `MONGO_URI=mongodb+srv://...` (from MongoDB Atlas)
- `JWT_SECRET=your-secure-secret-key`
- `NODE_ENV=production`

**Frontend:**
- `REACT_APP_API_URL=https://your-railway-backend-url/api`

## 📦 Technology Stack

- **Backend**: Express.js, MongoDB, JWT Authentication
- **Frontend**: React 19, Axios, React Router
- **Database**: MongoDB
- **Containerization**: Docker & Docker Compose
- **Deployment**: Railway

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Rate limiting middleware
- Input validation with Joi
- CORS configuration
- Environment-based secrets

## 📝 API Endpoints

All endpoints prefixed with `/api`:

- `/auth` - Authentication (login, signup, profile)
- `/projects` - Project management
- `/tasks` - Task management
- `/dashboard` - Dashboard data

## 🛠️ Development Commands

**Backend:**
```bash
npm run dev      # Development with hot reload
npm start        # Production
```

**Frontend:**
```bash
npm start        # Development server
npm run build    # Production build
npm test         # Run tests
```

## 📖 Additional Resources

- [Railway Documentation](https://docs.railway.app)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Express.js Documentation](https://expressjs.com)
- [React Documentation](https://react.dev)

## 🐛 Troubleshooting

See [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md#troubleshooting) for detailed troubleshooting steps.

## 📞 Support

For deployment issues, refer to the comprehensive guide in `RAILWAY_DEPLOYMENT.md`.

---

**Last Updated**: May 1, 2026
**Deployment Platform**: Railway
**Node Version**: 18.x
