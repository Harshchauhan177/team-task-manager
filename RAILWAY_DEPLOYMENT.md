# Team Task Manager - Railway Deployment Guide

## Overview
This guide will help you deploy both the backend and frontend of your Team Task Manager application on Railway.

## Prerequisites
- Railway account (sign up at https://railway.app)
- GitHub repository with your code
- MongoDB Atlas account (or use Railway's MongoDB service)
- Git installed locally

## Part 1: Prepare Your Code

### Step 1: Create .gitignore (Root Level)
Create a `.gitignore` file in your project root:
```
node_modules/
*.log
.env
.env.local
.DS_Store
```

### Step 2: Update Environment Variables
- Backend: Copy `.env.example` to `.env` and set your production values
- Frontend: Copy `.env.example` to `.env.production` for production builds

## Part 2: Deploy Backend on Railway

### Step 1: Create a New Railway Project
1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Connect your GitHub account and select your repository

### Step 2: Add Backend Service
1. In Railway dashboard, add a new service
2. Select "GitHub Repo" and configure to point to `./backend` directory
3. Set the following environment variables in Railway:
   - `PORT=8080`
   - `MONGO_URI=your_mongodb_connection_string` (from MongoDB Atlas)
   - `JWT_SECRET=your_secure_jwt_secret_key` (generate a strong secret)
   - `NODE_ENV=production`

### Step 3: Configure Port Exposure
1. In the Backend service settings, ensure port 8080 is exposed
2. Railway will automatically assign a domain (e.g., `https://team-task-manager-backend-prod.up.railway.app`)

## Part 3: Deploy Frontend on Railway

### Step 1: Add Frontend Service
1. In your Railway project, add another service
2. Select "GitHub Repo" and configure to point to `./frontend` directory
3. Set the following environment variables:
   - `REACT_APP_API_URL=https://your-backend-domain/api` (use your Railway backend URL)

### Step 2: Configure Build Settings
1. Set Build Command: `npm run build`
2. Set Start Command: `serve -s build -l 3000`
3. Set Port: 3000
4. Ensure `package.json` has the serve dependency (should already be added via install-script)

### Step 3: Add Serve Dependency to Frontend
If not already present, update your frontend `package.json`:
```json
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "serve": "serve -s build -l 3000"
  },
  "devDependencies": {
    "serve": "^14.2.0"
  }
}
```

## Part 4: Setup MongoDB on Railway (Alternative to Atlas)

### Option A: Use MongoDB Atlas (Recommended)
1. Create a free MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Create a database user and get the connection string
4. Add the connection string to your backend environment variables as `MONGO_URI`

### Option B: Use Railway's MongoDB Service
1. In your Railway project, click "Add Service" → "Database"
2. Select "MongoDB"
3. Railway will automatically populate `MONGO_URI` in the backend service

## Part 5: Connect Services in Railway

### Link Frontend to Backend
1. In Frontend service settings, add a reference to the Backend service
2. Set environment variable: `REACT_APP_API_URL=${RAILWAY_PUBLIC_DOMAIN_BACKEND}/api`

### Link Backend to MongoDB
1. If using Railway MongoDB, it will auto-connect
2. If using Atlas, ensure the connection string is in Backend environment variables

## Part 6: Final Deployment Steps

### Step 1: Push Code to GitHub
```bash
git add .
git commit -m "Add Docker and deployment configuration"
git push origin main
```

### Step 2: Monitor Deployment
1. Go to Railway dashboard
2. Watch the build logs for both services
3. Both services should show "✓ Running" when ready

### Step 3: Test the Application
1. Get the Frontend URL from Railway dashboard
2. Open it in your browser
3. Try logging in and creating a task to verify everything works

### Step 4: Update API URLs (if needed)
If the backend domain changes, update the Frontend `REACT_APP_API_URL` environment variable in Railway.

## Troubleshooting

### Backend won't start
- Check logs: Railway → Backend service → Logs
- Verify `MONGO_URI` is correct
- Ensure `NODE_ENV=production` is set
- Check that port is set to 8080

### Frontend shows blank page
- Check browser console for errors
- Verify `REACT_APP_API_URL` environment variable
- Check that backend service is running
- Clear browser cache

### Database connection errors
- Verify MongoDB connection string in environment variables
- Check IP whitelist in MongoDB Atlas (add Railway IP)
- Ensure JWT_SECRET is set and consistent

### CORS errors
- Verify frontend URL is allowed in backend CORS settings
- Update backend `cors()` middleware if needed

## Environment Variables Summary

### Backend (.env)
```
PORT=8080
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/task-manager
JWT_SECRET=your-super-secret-key-change-in-production
NODE_ENV=production
```

### Frontend (.env.production)
```
REACT_APP_API_URL=https://your-railway-backend-domain/api
```

## Monitoring & Maintenance

1. **View Logs**: Railway → Service → Logs
2. **Monitor Performance**: Railway → Service → Metrics
3. **Manage Environment Variables**: Railway → Service → Variables
4. **View Network**: Railway → Service → Networking
5. **Restart Service**: Railway → Service → Settings → Restart

## Auto-Deploy on Push
Railway automatically redeploys when you push to your GitHub repository. No additional action needed!

## Next Steps
- Monitor your application regularly
- Set up alerts for failures
- Keep dependencies updated
- Consider adding CI/CD pipelines for testing
- Regular database backups if using Atlas

---

For more help, visit:
- Railway Documentation: https://docs.railway.app
- MongoDB Atlas: https://www.mongodb.com/cloud/atlas/documentation
