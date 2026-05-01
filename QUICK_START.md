# Team Task Manager - Quick Start Guide

## 🚀 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or Atlas)
- Git

---

## 📥 Installation & Setup

### 1. Clone Repository
```bash
cd /Users/harsh/Documents/GitHub/team-task-manager
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cat > .env << 'ENVEOF'
PORT=8080
MONGODB_URI=mongodb://localhost:27017/team-task-manager
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
NODE_ENV=development
ENVEOF

# Start MongoDB (if local)
# On macOS: brew services start mongodb-community
# Or use MongoDB Atlas for cloud database

# Start backend server
npm start
```

**Backend runs on:** `http://localhost:8080`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file (optional)
cat > .env << 'ENVEOF'
REACT_APP_API_URL=http://localhost:8080/api
ENVEOF

# Start React development server
npm start
```

**Frontend runs on:** `http://localhost:3000`

---

## 🔐 Default Login Flow

1. **Signup New Account**
   - Navigate to `http://localhost:3000`
   - Click "Sign Up"
   - Enter: Name, Email, Password (min 6 chars), Confirm Password
   - Click "Sign Up"
   - Auto-redirects to Dashboard as 'Member' role

2. **Login**
   - Use the email and password you just created
   - Auto-redirects to Dashboard

3. **Logout**
   - Click "Logout" button on Dashboard
   - Returns to Login page

---

## 📱 Application Navigation

### Dashboard (`/dashboard`)
- View all statistics
- See task overview
- Check overdue tasks
- Navigate to projects

### Projects (`/projects`)
- View all your projects
- Create new project
- Click "View Tasks" to manage project tasks
- Delete project (Admin only)

### Tasks (`/projects/:projectId`)
- Kanban board with three columns
- Create tasks (Admin only)
- Edit/update tasks
- Drag to change status (or use edit modal)
- View task details

---

## 🎯 Core Features to Try

### 1. Create Your First Project
- Go to `/projects`
- Click "Create Project"
- Enter name and description
- You become the Admin automatically

### 2. Create Tasks
- Open a project
- Click "Create Task" (only visible if you're Admin)
- Fill in details: Title, Description, Priority, Due Date, Assign To
- Click "Create Task"

### 3. Manage Task Status
- View tasks in kanban board (To Do, In Progress, Done)
- Click "Edit" on a task
- Change status
- Save changes

### 4. View Dashboard Analytics
- Go to `/dashboard`
- See:
  - Total projects and tasks
  - Task status breakdown
  - Overdue tasks list
  - Team member task distribution

---

## 🧪 Test Scenarios

### Scenario 1: Single User Project Management
1. Create project
2. Create 3-5 tasks with different priorities
3. Update task statuses
4. Check dashboard statistics

### Scenario 2: Team Collaboration
1. Create project
2. Add team members by their email
3. Assign tasks to different members
4. Login as different users to see their perspective
5. Check dashboard for task distribution

### Scenario 3: Role-Based Access
1. Create project (you're Admin)
2. Invite someone else (they're Member)
3. Login as Member:
   - Can view project and tasks
   - Can update status of assigned tasks
   - Cannot create or delete tasks
4. Login back as Admin:
   - Full control over everything

### Scenario 4: Overdue Task Tracking
1. Create tasks with past due dates
2. Leave them in "To Do" or "In Progress" status
3. Check dashboard - they appear in "Overdue Tasks"
4. Complete them (mark as Done) - they disappear from overdue

---

## 🛠️ API Testing with cURL

### Authentication

**Signup:**
```bash
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

Response includes JWT token - use in Authorization header for other requests.

### Projects

**Create Project:**
```bash
curl -X POST http://localhost:8080/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "My Project",
    "description": "Project description"
  }'
```

**Get All Projects:**
```bash
curl http://localhost:8080/api/projects \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Tasks

**Create Task:**
```bash
curl -X POST http://localhost:8080/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "projectId": "PROJECT_ID_HERE",
    "title": "Task Title",
    "description": "Task description",
    "priority": "High",
    "dueDate": "2026-05-15",
    "assignedTo": "USER_ID_HERE"
  }'
```

**Get Project Tasks:**
```bash
curl http://localhost:8080/api/tasks/project/PROJECT_ID_HERE \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 📊 Database Structure

### Collections Created

1. **users** - User accounts with hashed passwords
2. **projects** - Projects with creator and members
3. **tasks** - Tasks assigned to projects and users

### Viewing Data (MongoDB)

```bash
# Connect to MongoDB
mongo

# Switch to database
use team-task-manager

# View collections
show collections

# View sample data
db.users.find().pretty()
db.projects.find().pretty()
db.tasks.find().pretty()
```

---

## 🐛 Common Issues & Solutions

### "CORS Error" or "Cannot reach backend"
- ✅ Check backend is running: `npm start` in backend folder
- ✅ Check URL is correct: `http://localhost:8080`
- ✅ Check MongoDB is running: `brew services list`

### "MongoDB connection error"
- ✅ Start MongoDB: `brew services start mongodb-community`
- ✅ Or use MongoDB Atlas: Update MONGODB_URI in .env
- ✅ Check connection string format

### "Authentication failed"
- ✅ Clear localStorage: Open DevTools → Application → Clear storage
- ✅ Try logging in again
- ✅ Check JWT_SECRET in .env matches backend

### "Rate limit exceeded"
- ✅ Wait 15 minutes before retrying
- ✅ Or change IP address (restart network)

### "Task not showing in kanban"
- ✅ Refresh page (F5)
- ✅ Check you have permission to view project
- ✅ Check task status matches column

---

## 🔧 Environment Variables Reference

### Backend (.env)
```
PORT=8080                                                  # Server port
MONGODB_URI=mongodb://localhost:27017/team-task-manager   # MongoDB connection
JWT_SECRET=your_secret_key_here                           # JWT signing key
NODE_ENV=development                                        # Environment mode
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:8080/api               # Backend API URL
```

---

## 📝 Project File Structure

```
team-task-manager/
├── backend/
│   ├── Controllers/        # Business logic
│   ├── Models/            # Database schemas
│   ├── Middlewares/       # Auth, validation, rate limiting
│   ├── Routes/            # API endpoints
│   ├── index.js           # Server entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/         # React components
│   │   ├── App.js         # Main app with routing
│   │   └── index.js       # React entry point
│   └── package.json
├── COMPLETE_IMPLEMENTATION.md    # Full documentation
└── QUICK_START.md                # This file
```

---

## ✅ Verification Checklist

After setup, verify everything works:

- [ ] Backend starts without errors
- [ ] Frontend loads at localhost:3000
- [ ] Can sign up new account
- [ ] Can login with created account
- [ ] Dashboard loads with empty stats
- [ ] Can create project
- [ ] Can create task in project
- [ ] Can update task status
- [ ] Can see updated dashboard stats
- [ ] Can logout successfully

---

## 🚀 Next Steps

1. **Explore Features**
   - Create multiple projects
   - Invite team members
   - Create and manage tasks
   - Monitor dashboard analytics

2. **Customize**
   - Update colors in CSS files
   - Add your company logo
   - Modify form fields
   - Add new task properties

3. **Deploy**
   - Backend: Deploy to Heroku, Railway, or AWS
   - Frontend: Deploy to Vercel, Netlify, or GitHub Pages

4. **Extend Features**
   - Add task comments
   - Add file attachments
   - Add email notifications
   - Add real-time updates with WebSockets

---

## 📚 Additional Resources

- **Complete Implementation Guide:** `COMPLETE_IMPLEMENTATION.md`
- **Authentication Guide:** `AUTHENTICATION_FIXES.md`
- **Backend Controllers:** `/backend/Controllers/`
- **Frontend Components:** `/frontend/src/pages/`
- **API Routes:** `/backend/Routes/`

---

## 💡 Tips & Tricks

1. **Enable Browser DevTools**
   - Press F12 to see console
   - Check "Application" tab for localStorage
   - Check "Network" tab for API calls

2. **MongoDB GUI Tools**
   - Use MongoDB Compass for visual database management
   - Or use MongoDB Atlas web interface

3. **API Testing**
   - Use Postman or Insomnia for testing APIs
   - Copy token from login response
   - Add to Authorization header as "Bearer TOKEN"

4. **Development Tips**
   - Use `console.log()` to debug
   - Use React DevTools browser extension
   - Check browser console for errors

---

## 🆘 Need Help?

If something isn't working:

1. Check console for error messages (F12)
2. Verify all prerequisites are installed
3. Ensure MongoDB is running
4. Check .env files are correct
5. Review COMPLETE_IMPLEMENTATION.md for more details

---

**Happy Task Managing! 🎉**

