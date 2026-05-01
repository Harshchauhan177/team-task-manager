# Railway Deployment Checklist

Complete this checklist to ensure your application is fully ready for production deployment.

## ✅ Pre-Deployment Checklist

### Code Preparation
- [ ] All code committed to GitHub main branch
- [ ] No sensitive data in code (API keys, passwords, etc.)
- [ ] `.env.example` files created for both backend and frontend
- [ ] `.gitignore` configured properly
- [ ] Docker files created for both services
- [ ] `.dockerignore` files created for both services

### Backend Configuration
- [ ] `package.json` has correct start script: `"start": "node index.js"`
- [ ] `PORT` environment variable set to 8080
- [ ] MongoDB connection string prepared (MongoDB Atlas or Railway MongoDB)
- [ ] JWT_SECRET generated (use strong random key)
- [ ] `NODE_ENV=production` will be set in Railway
- [ ] CORS configured for frontend domain
- [ ] All dependencies properly installed (`npm install`)

### Frontend Configuration
- [ ] `package.json` build script works: `npm run build`
- [ ] `REACT_APP_API_URL` environment variable configured
- [ ] API client uses environment variable for base URL
- [ ] Authentication token handling implemented
- [ ] All dependencies properly installed (`npm install`)

### MongoDB Setup
- [ ] MongoDB Atlas account created OR Railway MongoDB service ready
- [ ] Database user created with strong password
- [ ] Connection string obtained and ready to add to Railway
- [ ] IP whitelist configured (if using MongoDB Atlas)
- [ ] Test database connection from local machine

### Security
- [ ] Generate strong JWT_SECRET (at least 32 characters)
- [ ] All passwords hashed with bcryptjs
- [ ] Rate limiting middleware configured
- [ ] Input validation enabled
- [ ] CORS headers configured properly
- [ ] No API keys or secrets in code

---

## 🚀 Deployment Steps

### Step 1: Prepare Repository
- [ ] Push all code to GitHub
- [ ] Verify all files are in repository
- [ ] Check branch is main/master

### Step 2: Railway Project Setup
- [ ] Create Railway account at https://railway.app
- [ ] Create new Railway project
- [ ] Connect GitHub account to Railway

### Step 3: Deploy Backend
- [ ] Add service → GitHub repo
- [ ] Select backend directory
- [ ] Set Root Directory: `backend`
- [ ] Set environment variables:
  - [ ] `PORT=8080`
  - [ ] `MONGO_URI=your_connection_string`
  - [ ] `JWT_SECRET=your_secure_key`
  - [ ] `NODE_ENV=production`
- [ ] Wait for deployment to complete
- [ ] Verify `/ping` endpoint returns PONG
- [ ] Copy Railway-assigned domain URL

### Step 4: Deploy Frontend
- [ ] Add service → GitHub repo
- [ ] Select frontend directory
- [ ] Set Root Directory: `frontend`
- [ ] Set Build Command: `npm run build`
- [ ] Set Start Command: `serve -s build -l 3000`
- [ ] Set environment variables:
  - [ ] `REACT_APP_API_URL=https://{backend-domain}/api`
- [ ] Wait for deployment to complete
- [ ] Test frontend loads in browser

### Step 5: Database Connection
- [ ] Backend can connect to MongoDB
- [ ] Check backend logs for connection confirmation
- [ ] Test database queries work

### Step 6: Service Linking
- [ ] Backend service public URL accessible
- [ ] Frontend service public URL accessible
- [ ] Frontend can communicate with backend
- [ ] No CORS errors in browser console

---

## 🧪 Post-Deployment Testing

### Backend API Tests
- [ ] Health check: `GET /ping` returns PONG
- [ ] Login endpoint works
- [ ] Signup endpoint works
- [ ] Authentication token generation works
- [ ] Protected routes require valid token
- [ ] Database queries return data

### Frontend Tests
- [ ] Page loads without errors
- [ ] No console errors
- [ ] Can navigate between pages
- [ ] Login page accessible
- [ ] API calls successful
- [ ] User data displays correctly
- [ ] Create task functionality works
- [ ] Projects display correctly

### Integration Tests
- [ ] Login with valid credentials works
- [ ] Login with invalid credentials fails
- [ ] Create new task successful
- [ ] Update task successful
- [ ] Delete task successful
- [ ] Create project successful
- [ ] Logout clears token

---

## 📊 Monitoring & Verification

### Railway Dashboard Checks
- [ ] Backend service shows "✓ Running"
- [ ] Frontend service shows "✓ Running"
- [ ] No error logs in either service
- [ ] Memory usage is reasonable
- [ ] CPU usage is normal

### Browser/Client Checks
- [ ] Frontend domain loads
- [ ] No 404 errors
- [ ] No CORS errors
- [ ] No network errors in DevTools
- [ ] Application functions as expected

### Database Checks
- [ ] MongoDB connection logs present
- [ ] Collections created successfully
- [ ] Sample data visible
- [ ] Queries execute properly

---

## 🔧 Troubleshooting Quick Reference

| Issue | Solution |
|-------|----------|
| Backend won't start | Check MONGO_URI and JWT_SECRET in Railway env vars |
| Frontend blank page | Clear cache, check REACT_APP_API_URL |
| API connection errors | Verify backend domain in frontend env vars |
| CORS errors | Update backend CORS configuration |
| 502 Bad Gateway | Check backend logs, ensure port is 8080 |
| Build fails | Check build command, verify package.json |

---

## 📝 Important URLs to Save

```
Backend Domain:     https://__________________.up.railway.app
Frontend Domain:    https://__________________.up.railway.app
MongoDB Connection: mongodb+srv://________________
GitHub Repository:  https://github.com/________________
Railway Project:    https://railway.app/project/________________
```

---

## ✨ Final Steps

- [ ] Test all critical user flows
- [ ] Share application with team
- [ ] Monitor logs for first 24 hours
- [ ] Set up monitoring/alerts
- [ ] Document any custom configurations
- [ ] Create backup strategy for database

---

## 🎉 Deployment Complete!

Your application is now live on Railway. Monitor it regularly and keep dependencies updated.

**Need Help?** Refer to RAILWAY_DEPLOYMENT.md for detailed troubleshooting.
