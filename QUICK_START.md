# Quick Start Guide - Railway Deployment

## 🎯 What You Have

Your project is now fully configured for Railway deployment with:
- ✅ Docker configurations for both backend and frontend
- ✅ Environment templates (.env.example files)
- ✅ Docker Compose for local testing
- ✅ Health checks and production optimizations
- ✅ Setup scripts for easy initialization

---

## 🚀 5-Minute Quick Start

### 1. **Initial Setup (Local Machine)**

**macOS/Linux:**
```bash
chmod +x setup.sh
./setup.sh
```

**Windows:**
```bash
setup.bat
```

This automatically:
- Installs dependencies for both services
- Creates `.env` files from examples
- Checks Node.js and Git installation

### 2. **Configure Environment Variables**

**Backend** (`backend/.env`):
```bash
PORT=8080
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/task-manager
JWT_SECRET=generate-a-strong-random-key-here
NODE_ENV=production
```

**Frontend** (`frontend/.env.local`):
```bash
REACT_APP_API_URL=http://localhost:8080/api
```

### 3. **Test Locally with Docker**

```bash
docker-compose up -d
```

Then visit:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080/ping

Stop with:
```bash
docker-compose down
```

---

## 📱 Deploy to Railway

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Add deployment configuration"
git push origin main
```

### Step 2: Create Railway Project
1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Connect your account and select your repository

### Step 3: Add Backend Service
1. Click "Add Service" → "GitHub Repo"
2. Configure settings:
   - **Root Directory**: `backend`
   - **Install Command**: `npm install`
   - **Build Command**: `npm install` (or leave empty)
   - **Start Command**: `node index.js`

3. Add Environment Variables:
   ```
   PORT=8080
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secure_secret_key
   NODE_ENV=production
   ```

4. Wait for deployment ✓

### Step 4: Add Frontend Service
1. Click "Add Service" → "GitHub Repo"
2. Configure settings:
   - **Root Directory**: `frontend`
   - **Install Command**: `npm install`
   - **Build Command**: `npm run build`
   - **Start Command**: `serve -s build -l 3000`

3. Add Environment Variables:
   ```
   REACT_APP_API_URL=https://<backend-domain>/api
   ```
   (Replace `<backend-domain>` with your Railway backend URL)

4. Wait for deployment ✓

### Step 5: Add MongoDB
**Option A: Railway MongoDB (Recommended)**
- Click "Add Service" → "Database" → "MongoDB"
- Railway auto-populates `MONGO_URI` in backend

**Option B: MongoDB Atlas**
- Create free cluster at https://www.mongodb.com/cloud/atlas
- Copy connection string to backend `MONGO_URI`

### Step 6: Test Deployment
1. Open your frontend Railway URL in browser
2. Test login/signup
3. Create a task
4. Verify everything works

---

## 📋 File Reference

### Key Files Created

| File | Purpose |
|------|---------|
| `backend/Dockerfile` | Production Docker build for backend |
| `frontend/Dockerfile` | Production Docker build for frontend |
| `docker-compose.yml` | Local development with all services |
| `backend/.env.example` | Template for backend config |
| `frontend/.env.example` | Template for frontend config |
| `setup.sh` / `setup.bat` | Automatic project setup |
| `RAILWAY_DEPLOYMENT.md` | Detailed deployment guide |
| `DEPLOYMENT_CHECKLIST.md` | Pre-deployment checklist |

### Project Structure
```
team-task-manager/
├── backend/                 # Express API server
│   ├── Dockerfile          # Production build
│   ├── Procfile            # Process file for Railway
│   ├── .dockerignore       # Docker exclusions
│   ├── .env.example        # Config template
│   └── ...other files
│
├── frontend/               # React web app
│   ├── Dockerfile          # Production build
│   ├── .dockerignore       # Docker exclusions
│   ├── .env.example        # Config template
│   └── ...other files
│
├── docker-compose.yml      # Local dev setup
├── setup.sh               # macOS/Linux setup
├── setup.bat              # Windows setup
├── README.md              # Project overview
├── RAILWAY_DEPLOYMENT.md  # Detailed guide
└── DEPLOYMENT_CHECKLIST.md # Pre-deploy checklist
```

---

## 🔧 Common Commands

### Local Development

```bash
# Start all services locally
docker-compose up

# Start specific service
docker-compose up backend
docker-compose up frontend

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Stop all services
docker-compose down

# Rebuild images
docker-compose build --no-cache
```

### Backend Development

```bash
cd backend
npm run dev      # With nodemon (hot reload)
npm start        # Production mode
npm test         # Run tests (if available)
```

### Frontend Development

```bash
cd frontend
npm start        # Dev server on port 3000
npm run build    # Production build
npm test         # Run tests
```

---

## 🚨 Troubleshooting Quick Tips

### Backend Issues
| Problem | Solution |
|---------|----------|
| Port already in use | Change PORT in .env or `docker-compose down` |
| MongoDB connection error | Verify MONGO_URI, check IP whitelist (Atlas) |
| Node modules missing | Run `npm install` in backend directory |

### Frontend Issues
| Problem | Solution |
|---------|----------|
| Cannot find module | Run `npm install` in frontend directory |
| API calls failing | Check REACT_APP_API_URL in .env.local |
| Build fails | Clear node_modules: `rm -rf node_modules && npm install` |

### Docker Issues
| Problem | Solution |
|---------|----------|
| Container won't start | Check logs: `docker-compose logs` |
| Port conflicts | Stop other services or change ports |
| Image build fails | Rebuild: `docker-compose build --no-cache` |

---

## 📊 Performance Tips

1. **Backend Optimization**
   - Keep Node.js dependencies minimal
   - Use connection pooling for MongoDB
   - Enable caching for frequently accessed data

2. **Frontend Optimization**
   - Build produces optimized bundles automatically
   - Use React DevTools to check for re-renders
   - Consider lazy loading for large components

3. **Database Optimization**
   - Create indexes for frequently queried fields
   - Monitor database performance in MongoDB Atlas

---

## 🔐 Security Checklist

- [ ] JWT_SECRET is strong (32+ characters)
- [ ] Never commit `.env` files to Git
- [ ] Use HTTPS URLs in production
- [ ] Enable MongoDB IP whitelist
- [ ] Update dependencies regularly
- [ ] Review API rate limiting settings
- [ ] Check CORS configuration

---

## 📞 Getting Help

1. **For Railway Issues**: https://docs.railway.app
2. **For MongoDB Help**: https://www.mongodb.com/docs
3. **For Express.js**: https://expressjs.com/en/api.html
4. **For React**: https://react.dev/learn
5. **Check Docker Logs**: `docker-compose logs service-name`

---

## ✅ Deployment Verification Checklist

After deploying to Railway, verify:

- [ ] Backend service shows "Running" in Railway
- [ ] Frontend service shows "Running" in Railway
- [ ] Frontend URL loads in browser
- [ ] Login page displays
- [ ] Can create an account
- [ ] Can log in
- [ ] Can create a project
- [ ] Can create a task
- [ ] Task appears in task list
- [ ] Can update task
- [ ] Can delete task
- [ ] No console errors in browser

---

## 🎉 You're Ready!

Your application is now fully configured and ready for production deployment on Railway. 

**Next steps:**
1. Run `./setup.sh` (or `setup.bat` on Windows)
2. Test locally with `docker-compose up`
3. Push code to GitHub
4. Follow the Railway deployment steps above
5. Monitor your application

**Questions?** Refer to `RAILWAY_DEPLOYMENT.md` for comprehensive documentation.

Happy deploying! 🚀
