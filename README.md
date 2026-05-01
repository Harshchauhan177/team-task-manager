# Team Task Manager

A full-stack web application for managing team projects and tasks efficiently. Built with React for the frontend and Express.js with MongoDB for the backend.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [Docker Setup](#docker-setup)
- [Deployment](#deployment)
- [Contributing](#contributing)

## 🎯 Overview

Team Task Manager is a collaborative project and task management application that allows teams to:

- Create and manage projects
- Assign and track tasks
- Manage team members
- View project dashboards and analytics
- Handle user authentication and authorization

## ✨ Features

### Authentication

- User signup and login with JWT authentication
- Secure password hashing with bcryptjs
- Rate limiting on authentication endpoints
- Token-based session management

### Project Management

- Create, read, update, and delete projects
- Assign team members to projects
- Track project progress
- Project-level statistics

### Task Management

- Create tasks within projects
- Assign tasks to team members
- Update task status and progress
- Track task deadlines
- Task filtering and sorting

### Dashboard

- Overview of all projects and tasks
- Team member management
- Project statistics and analytics
- Quick access to important information

### Security

- JWT-based authentication
- Rate limiting to prevent abuse
- Input validation using Joi
- CORS support for cross-origin requests

## 🛠 Tech Stack

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT)
- **Password Hashing**: bcryptjs
- **Validation**: Joi
- **Rate Limiting**: express-rate-limit
- **Environment**: dotenv

### Frontend

- **Library**: React 19
- **Routing**: React Router DOM v7
- **HTTP Client**: Axios
- **Build Tool**: Create React App
- **Styling**: CSS

### DevOps

- **Containerization**: Docker & Docker Compose
- **Deployment**: Railway

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** (v7 or higher)
- **MongoDB** (v7 or higher) - or use MongoDB Atlas cloud service
- **Docker** and **Docker Compose** (for containerized setup)
- **Git**

## 📁 Project Structure

```
team-task-manager/
├── backend/                          # Express.js backend
│   ├── Controllers/
│   │   ├── authController.js        # Authentication logic
│   │   ├── dashboardController.js   # Dashboard statistics
│   │   ├── projectController.js     # Project CRUD operations
│   │   └── taskController.js        # Task CRUD operations
│   ├── Middlewares/
│   │   ├── auth.js                  # JWT verification middleware
│   │   ├── rateLimiter.js           # Rate limiting middleware
│   │   └── validation.js            # Input validation middleware
│   ├── Models/
│   │   ├── db.js                    # Database connection
│   │   ├── User.js                  # User schema
│   │   ├── Project.js               # Project schema
│   │   └── Task.js                  # Task schema
│   ├── Routes/
│   │   ├── authRoutes.js            # Auth endpoints
│   │   ├── dashboardRoutes.js       # Dashboard endpoints
│   │   ├── projectRoutes.js         # Project endpoints
│   │   └── taskRoutes.js            # Task endpoints
│   ├── index.js                     # Express app entry point
│   ├── package.json
│   ├── Dockerfile
│   └── Procfile                     # Railway deployment config
├── frontend/                         # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── AppLayout.js         # Main layout component
│   │   │   ├── ProtectedLayout.js   # Protected route wrapper
│   │   │   └── PageLoading.js       # Loading indicator
│   │   ├── pages/
│   │   │   ├── Login.js             # Login page
│   │   │   ├── Signup.js            # Signup page
│   │   │   ├── Dashboard.js         # Dashboard page
│   │   │   ├── Projects.js          # Projects page
│   │   │   ├── Tasks.js             # Tasks page
│   │   │   └── MemberManagement.js  # Team members page
│   │   ├── utils/
│   │   │   └── api.js               # Axios API client
│   │   ├── App.js                   # Root component
│   │   └── index.js                 # React entry point
│   ├── public/
│   ├── build/                       # Production build
│   ├── package.json
│   ├── Dockerfile
│   └── README.md
├── docker-compose.yml               # Multi-container setup
├── railway.json                     # Railway deployment config
├── setup.sh                         # Setup script for macOS/Linux
└── setup.bat                        # Setup script for Windows
```

## 🚀 Setup Instructions

### Option 1: Manual Setup (Development)

#### 1. Clone the Repository

```bash
git clone https://github.com/Harshchauhan177/team-task-manager.git
cd team-task-manager
```

#### 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in the backend directory:

```bash
cat > .env << EOF
PORT=8080
MONGO_URI=mongodb://localhost:27017/task-manager
JWT_SECRET=your-secret-key-here
NODE_ENV=development
EOF
```

Start the backend server:

```bash
npm start
```

The backend will run on `http://localhost:8080`

#### 3. Frontend Setup

Open a new terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in the frontend directory:

```bash
cat > .env << EOF
REACT_APP_API_URL=http://localhost:8080/api
EOF
```

Start the development server:

```bash
npm start
```

The frontend will run on `http://localhost:3000`

### Option 2: Using Automated Setup Scripts

#### macOS/Linux

```bash
chmod +x setup.sh
./setup.sh
```

#### Windows

```bash
setup.bat
```

## 🐳 Docker Setup

### Prerequisites

- Docker and Docker Compose installed

### Running with Docker Compose

1. Clone the repository:

```bash
git clone https://github.com/yourusername/team-task-manager.git
cd team-task-manager
```

2. Create a `.env` file in the project root:

```bash
cat > .env << EOF
MONGO_URI=mongodb://mongo:27017/task-manager
JWT_SECRET=your-secret-key-here
REACT_APP_API_URL=http://localhost:8080/api
EOF
```

3. Build and run the containers:

```bash
docker-compose up --build
```

Access the application:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **MongoDB**: localhost:27017

To stop the containers:

```bash
docker-compose down
```

To view logs:

```bash
docker-compose logs -f
```

## 🌐 Running the Application

### Development Mode

**Terminal 1 - Backend:**

```bash
cd backend
npm install
npm start
```

**Terminal 2 - Frontend:**

```bash
cd frontend
npm install
npm start
```

### Production Mode

**Build Frontend:**

```bash
cd frontend
npm run build
```

**Run Backend in Production:**

```bash
cd backend
NODE_ENV=production npm start
```

### Testing Backend Connection

Test if the backend is running:

```bash
curl http://localhost:8080/ping
```

Expected response: `PONG`

## 📡 API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint  | Description                  |
| ------ | --------- | ---------------------------- |
| POST   | `/signup` | Register a new user          |
| POST   | `/login`  | Login user and get JWT token |
| POST   | `/logout` | Logout user (if applicable)  |

**Signup Request:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Login Request:**

```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

### Projects (`/api/projects`)

| Method | Endpoint | Description          | Auth Required |
| ------ | -------- | -------------------- | ------------- |
| GET    | `/`      | Get all projects     | Yes           |
| POST   | `/`      | Create a new project | Yes           |
| GET    | `/:id`   | Get project by ID    | Yes           |
| PUT    | `/:id`   | Update project       | Yes           |
| DELETE | `/:id`   | Delete project       | Yes           |

**Create Project Request:**

```json
{
  "name": "Project Alpha",
  "description": "Description of the project",
  "dueDate": "2024-12-31"
}
```

### Tasks (`/api/tasks`)

| Method | Endpoint | Description       | Auth Required |
| ------ | -------- | ----------------- | ------------- |
| GET    | `/`      | Get all tasks     | Yes           |
| POST   | `/`      | Create a new task | Yes           |
| GET    | `/:id`   | Get task by ID    | Yes           |
| PUT    | `/:id`   | Update task       | Yes           |
| DELETE | `/:id`   | Delete task       | Yes           |

**Create Task Request:**

```json
{
  "title": "Task Title",
  "description": "Task description",
  "projectId": "project_id",
  "assignedTo": "user_id",
  "status": "pending",
  "priority": "high",
  "dueDate": "2024-12-25"
}
```

### Dashboard (`/api/dashboard`)

| Method | Endpoint            | Description              | Auth Required |
| ------ | ------------------- | ------------------------ | ------------- |
| GET    | `/stats`            | Get dashboard statistics | Yes           |
| GET    | `/projects-summary` | Get projects summary     | Yes           |
| GET    | `/tasks-summary`    | Get tasks summary        | Yes           |

## 🔐 Environment Variables

### Backend `.env`

```
PORT=8080                                    # Server port
MONGO_URI=mongodb://localhost:27017/task-manager  # MongoDB connection string
JWT_SECRET=your-secret-key-here             # JWT secret key (change in production)
NODE_ENV=development                        # Environment (development/production)
```

### Frontend `.env`

```
REACT_APP_API_URL=http://localhost:8080/api # Backend API URL
```

## 🔧 Configuration Files

### docker-compose.yml

Defines the multi-container setup with backend, frontend, and MongoDB services.

### railway.json

Configuration for deploying to Railway platform.

### Procfile

Specifies how to run the application on Railway.

## 🚢 Deployment

### Deploy to Railway

1. Install Railway CLI:

```bash
npm i -g @railway/cli
```

2. Login to Railway:

```bash
railway login
```

3. Link your project:

```bash
railway link
```

4. Set environment variables:

```bash
railway variables set MONGO_URI=your_mongodb_uri
railway variables set JWT_SECRET=your_secret_key
```

5. Deploy:

```bash
railway up
```

### Deploy to Other Platforms

The application can also be deployed to:

- **Heroku**: Using Procfile
- **Vercel** (Frontend only): `npm run build` and deploy the `build/` folder
- **AWS/Azure/Google Cloud**: Using Docker containers

## 📝 Development Workflow

1. **Create a feature branch:**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**

3. **Test your changes:**

   - Backend: Run tests with appropriate test files
   - Frontend: `npm test`

4. **Commit your changes:**

   ```bash
   git commit -m "feat: add your feature description"
   ```

5. **Push to GitHub:**

   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**

## 🧪 Testing

### Backend Testing

```bash
cd backend
node test-mongodb.js
```

### Frontend Testing

```bash
cd frontend
npm test
```

## 🐛 Troubleshooting

### MongoDB Connection Error

- Ensure MongoDB is running on `localhost:27017`
- Or use MongoDB Atlas and update `MONGO_URI` in `.env`
- Check if the `MONGO_URI` environment variable is set correctly

### Port Already in Use

```bash
# macOS/Linux - Find process on port 8080
lsof -i :8080
# Kill the process
kill -9 <PID>

# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

### CORS Issues

- Ensure `REACT_APP_API_URL` in frontend `.env` points to correct backend URL
- Check CORS configuration in backend `index.js`

### Build Errors

- Clear node_modules and reinstall:
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [JWT Guide](https://jwt.io/)
- [Docker Documentation](https://docs.docker.com/)

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 👥 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📞 Support

For support and questions, please open an issue on GitHub or contact the development team.

---

**Last Updated**: May 1, 2026
