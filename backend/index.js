const path = require("path");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
require("./Models/db");

const authRoutes = require("./Routes/authRoutes");
const projectRoutes = require("./Routes/projectRoutes");
const taskRoutes = require("./Routes/taskRoutes");
const dashboardRoutes = require("./Routes/dashboardRoutes");

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/ping", (req, res) => {
  res.send("PONG");
});

// Catch-all route for SPA client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
