# MongoDB Atlas Setup Instructions

## Quick Setup Guide

### 1. Get Your Connection String
- Go to: https://www.mongodb.com/cloud/atlas
- Sign up or login
- Create a free cluster
- Click "Connect" → "Drivers" → "Node.js"
- Copy the connection string

### 2. Format Your Connection String
Your connection string should look like:
```
mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/task-manager?retryWrites=true&w=majority
```

### 3. Update Your .env File
Replace the MONGO_URI in `/backend/.env` with your actual connection string:

```env
PORT=8080
MONGO_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/task-manager?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_change_in_production
```

### Important Notes:
- Replace YOUR_USERNAME with your database user
- Replace YOUR_PASSWORD with your database password
- Replace cluster0.xxxxx with your actual cluster name
- Make sure "Allow Access from Anywhere" is enabled in Network Access

### 4. Test the Connection
After updating .env, restart your backend:
- Stop the running backend (Ctrl+C)
- Run: npm start
- You should see "MongoDB Connected" in the console

That's it! Your data will now be saved to MongoDB Atlas online.
