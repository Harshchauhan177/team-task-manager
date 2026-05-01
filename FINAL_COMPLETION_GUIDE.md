# Team Task Manager - Final Completion Guide

## ✅ Project Status: NEARLY COMPLETE

All core features have been implemented. This guide provides final fixes and setup instructions.

---

## 🔧 Remaining Fixes Needed

### 1. Update Frontend API Configuration

The frontend currently has hardcoded API URLs. Update all pages to use the centralized API configuration:

**File: `/frontend/src/utils/api.js`** (Already created)
```javascript
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
```

### 2. Fix Tasks.js - Add Status Field to Form Data

In `/frontend/src/pages/Tasks.js`, update the handleEditClick function:

```javascript
const handleEditClick = (task) => {
  setEditingTask(task._id);
  setFormData({
    title: task.title,
    description: task.description,
    priority: task.priority,
    dueDate: task.dueDate?.split("T")[0] || "",
    assignedTo: task.assignedTo?._id || "",
    status: task.status,  // ADD THIS LINE
  });
};
```

Also initialize formData with status:
```javascript
const [formData, setFormData] = useState({
  title: "",
  description: "",
  priority: "Medium",
  dueDate: "",
  assignedTo: "",
  status: "To Do",  // ADD THIS LINE
});
```

Reset formData after operations:
```javascript
const resetFormData = () => {
  setFormData({
    title: "",
    description: "",
    priority: "Medium",
    dueDate: "",
    assignedTo: "",
    status: "To Do",  // ADD THIS LINE
  });
};
```

### 3. Update Backend User Model for Password Hashing

The User model needs to hash passwords before saving. Update `/backend/Models/User.js`:

```javascript
const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  role: {
    type: String,
    enum: ["Admin", "Member"],
    default: "Member",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) {
      return next();
    }
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcryptjs.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
```

### 4. Update Auth Controller to Remove Manual Hashing

Update `/backend/Controllers/authController.js` to remove manual password hashing:

```javascript
const User = require("../Models/User");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "your_jwt_secret_key", {
    expiresIn: "7d",
  });
};

const signup = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Password will be hashed by the pre-save middleware
    const user = new User({ 
      name, 
      email, 
      password,
      role: 'Member'
    });
    await user.save();

    const token = generateToken(user._id);

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ... rest of the file remains the same
```

### 5. Add .env Files

**Backend: `/backend/.env`**
```
PORT=8080
MONGO_URI=mongodb://localhost:27017/team-task-manager
JWT_SECRET=team_task_manager_super_secret_jwt_key_2026_change_in_production
NODE_ENV=development
```

**Frontend: `/frontend/.env`**
```
REACT_APP_API_URL=http://localhost:8080/api
```

### 6. Add Missing CSS Styles

Add to `/frontend/src/pages/Projects.css`:
```css
.btn-info {
  background: #17a2b8;
  color: white;
}

.btn-info:hover {
  background: #138496;
  transform: translateY(-2px);
}
```

---

## 📋 Feature Checklist

### User Authentication ✅
- [x] Signup with Name, Email, Password
- [x] Secure login with JWT
- [x] Password hashing with bcrypt
- [x] Login validation and error handling
- [x] Rate limiting on auth endpoints

### Project Management ✅
- [x] Create projects (creator becomes Admin)
- [x] Admin can add members via email
- [x] Admin can remove members
- [x] Members can view assigned projects
- [x] Member management UI with modal

### Task Management ✅
- [x] Create tasks with Title, Description, Due Date, Priority
- [x] Assign tasks to users
- [x] Update task status (To Do, In Progress, Done)
- [x] Update task details
- [x] Delete tasks (Admin only)

### Dashboard ✅
- [x] Total tasks count
- [x] Tasks by status breakdown
- [x] Tasks per user distribution
- [x] Overdue tasks list
- [x] User's assigned tasks overview

### Role-Based Access ✅
- [x] Admin: Full control over project and tasks
- [x] Member: View and update only assigned tasks
- [x] Admin: Manage team members
- [x] Member: Cannot create/delete tasks

### Security ✅
- [x] JWT authentication
- [x] Password hashing with bcrypt
- [x] Input validation and sanitization
- [x] Rate limiting on sensitive endpoints
- [x] CORS protection

---

## 🚀 Complete Setup Instructions

### Prerequisites
- Node.js v14+
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cat > .env << 'ENVEOF'
PORT=8080
MONGO_URI=mongodb://localhost:27017/team-task-manager
JWT_SECRET=team_task_manager_super_secret_jwt_key_2026_change_in_production
NODE_ENV=development
ENVEOF

# Start MongoDB (if local)
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongod
# Or use MongoDB Atlas

# Start backend server
npm start
```

Backend will run on: `http://localhost:8080`

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
cat > .env << 'ENVEOF'
REACT_APP_API_URL=http://localhost:8080/api
ENVEOF

# Start React development server
npm start
```

Frontend will run on: `http://localhost:3000`

---

## 📝 Manual Code Updates Needed

Before starting the application, manually apply these code changes:

### Change 1: Update `/backend/Models/User.js`
Replace the entire file with the code shown in section 3 above.

### Change 2: Update `/backend/Controllers/authController.js`
Update the signup function to remove manual bcryptjs.genSalt and bcryptjs.hash calls.

### Change 3: Update `/frontend/src/pages/Tasks.js`
1. Add `status: "To Do"` to initial formData state
2. Add `status: task.status` in handleEditClick function
3. Add `status: "To Do"` to all resetFormData calls

### Change 4: Create `/backend/.env`
```
PORT=8080
MONGO_URI=mongodb://localhost:27017/team-task-manager
JWT_SECRET=team_task_manager_super_secret_jwt_key_2026_change_in_production
NODE_ENV=development
```

### Change 5: Create `/frontend/.env`
```
REACT_APP_API_URL=http://localhost:8080/api
```

### Change 6: Add to `/frontend/src/pages/Projects.css`
```css
.btn-info {
  background: #17a2b8;
  color: white;
}

.btn-info:hover {
  background: #138496;
  transform: translateY(-2px);
}
```

---

## 🧪 Testing the Application

### Test Signup & Login
1. Go to `http://localhost:3000/signup`
2. Create account: John Doe, john@example.com, password123
3. Should redirect to Dashboard
4. Click Logout
5. Login with same credentials

### Test Project Management
1. Go to Projects page
2. Create a new project: "Website Redesign"
3. Click "Members" button on project card
4. Add team member: jane@example.com (Member role)
5. Create another account for jane@example.com
6. Login as Jane - should see the project

### Test Task Management
1. Login as John (Project Admin)
2. Click "View Tasks" on project
3. Click "Create Task"
4. Create task: "Design Homepage", assign to Jane, set due date
5. Task appears in "To Do" column
6. Click "Edit" → Change status to "In Progress" → Save
7. Task moves to "In Progress" column

### Test Dashboard
1. Go to Dashboard
2. See total tasks, status breakdown
3. See overdue tasks (if any with past due dates)
4. See tasks per team member

---

## 🔍 API Endpoints Reference

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login to account

### Projects
- `POST /api/projects` - Create project
- `GET /api/projects` - Get user's projects
- `GET /api/projects/:projectId` - Get project details
- `PUT /api/projects/:projectId` - Update project
- `DELETE /api/projects/:projectId` - Delete project
- `POST /api/projects/:projectId/members` - Add member
- `DELETE /api/projects/:projectId/members/:memberId` - Remove member

### Tasks
- `POST /api/tasks` - Create task
- `GET /api/tasks/project/:projectId` - Get project tasks
- `GET /api/tasks/assigned` - Get user's assigned tasks
- `GET /api/tasks/:taskId` - Get task details
- `PUT /api/tasks/:taskId` - Update task
- `DELETE /api/tasks/:taskId` - Delete task

### Dashboard
- `GET /api/dashboard` - Get user's dashboard stats
- `GET /api/dashboard/project/:projectId` - Get project dashboard

---

## 🐛 Troubleshooting

### "Cannot reach backend"
- Check backend is running: `npm start` in backend folder
- Check MongoDB is running
- Verify PORT=8080 in .env

### "User already exists" error on signup
- This user email is already registered
- Try with a different email address

### "Invalid credentials" on login
- Double-check email and password
- Password is case-sensitive
- Ensure you've created account first

### Tasks not showing status update
- Make sure you added `status` field to formData state
- Refresh the page after updating
- Check browser console for errors (F12)

### Member cannot see project
- Admin must add member using "Members" button
- Member must have account with same email used to add them
- Member should refresh after being added

---

## 📚 File Structure Summary

```
team-task-manager/
├── backend/
│   ├── .env (CREATE THIS)
│   ├── Controllers/
│   │   ├── authController.js ✏️ (UPDATE)
│   │   ├── projectController.js ✅
│   │   ├── taskController.js ✅
│   │   └── dashboardController.js ✅
│   ├── Models/
│   │   ├── User.js ✏️ (UPDATE)
│   │   ├── Project.js ✅
│   │   ├── Task.js ✅
│   │   └── db.js ✅
│   ├── Middlewares/
│   │   ├── auth.js ✅
│   │   ├── validation.js ✅
│   │   └── rateLimiter.js ✅
│   ├── Routes/ ✅
│   ├── index.js ✅
│   └── package.json ✅
├── frontend/
│   ├── .env (CREATE THIS)
│   ├── src/
│   │   ├── utils/
│   │   │   └── api.js ✅ (CREATED)
│   │   ├── pages/
│   │   │   ├── Signup.js ✅
│   │   │   ├── Login.js ✅
│   │   │   ├── Dashboard.js ✅
│   │   │   ├── Projects.js ✅
│   │   │   ├── Tasks.js ✏️ (UPDATE)
│   │   │   ├── MemberManagement.js ✅ (CREATED)
│   │   │   ├── Auth.css ✅
│   │   │   ├── Dashboard.css ✅
│   │   │   ├── Projects.css ✏️ (UPDATE)
│   │   │   ├── Tasks.css ✅
│   │   │   └── MemberManagement.css ✅ (CREATED)
│   │   ├── App.js ✅
│   │   ├── App.css ✅ (UPDATED)
│   │   └── index.css ✅
│   └── package.json ✅

✅ = Complete
✏️ = Needs updates
```

---

## ✨ Key Features Implemented

1. **User Authentication**
   - Secure JWT-based authentication
   - Password hashing with bcryptjs
   - Rate limiting on auth endpoints
   - Input validation and sanitization

2. **Project Management**
   - Create, read, update, delete projects
   - Role-based access (Admin/Member)
   - Member management with add/remove functionality
   - Visual member list with role badges

3. **Task Management**
   - Kanban board with three columns (To Do, In Progress, Done)
   - Create, update, delete tasks
   - Assign tasks to team members
   - Priority levels (Low, Medium, High)
   - Due date tracking

4. **Dashboard Analytics**
   - Total projects and tasks overview
   - Task status breakdown
   - Overdue tasks tracking
   - Tasks per team member distribution
   - User-specific task statistics

5. **Role-Based Access Control**
   - Admin: Full control over projects and tasks
   - Member: Limited to viewing and updating assigned tasks
   - Admin-only operations clearly marked in UI

6. **Security**
   - JWT token validation on all protected routes
   - Password hashing before storage
   - CORS protection
   - Rate limiting on sensitive endpoints
   - Input sanitization to prevent XSS

---

## �� Next Steps After Setup

1. **Verify Everything Works**
   - Create test account
   - Create test project
   - Add team members
   - Create and manage tasks
   - Check dashboard

2. **Customize (Optional)**
   - Update colors in CSS files
   - Add company logo
   - Modify validation rules
   - Add custom fields

3. **Deploy**
   - Backend: Heroku, Railway, AWS Lambda, or DigitalOcean
   - Frontend: Vercel, Netlify, or GitHub Pages
   - Database: MongoDB Atlas (free tier available)

4. **Extend Features**
   - Add task comments
   - Add file attachments
   - Add email notifications
   - Add real-time updates with WebSockets
   - Add task time tracking
   - Add activity logs

---

## ✅ Verification Checklist

After completing all setup:

- [ ] Backend starts without errors
- [ ] Frontend loads at localhost:3000
- [ ] Can create account
- [ ] Can login
- [ ] Can create project
- [ ] Can add team members
- [ ] Can create tasks
- [ ] Can update task status
- [ ] Can see dashboard stats
- [ ] Can logout
- [ ] Member cannot create tasks
- [ ] Admin can manage members

---

**Your Team Task Manager is now ready to use! 🚀**

For detailed documentation, see:
- `QUICK_START.md` - Quick setup guide
- `COMPLETE_IMPLEMENTATION.md` - Full feature documentation
- `MONGODB_SETUP.md` - Database setup guide

