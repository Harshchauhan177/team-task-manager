const express = require("express");
const authMiddleware = require("../Middlewares/auth");
const {
  createTask,
  getProjectTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getUserAssignedTasks,
} = require("../Controllers/taskController");

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Task CRUD operations
router.post("/", createTask);
router.get("/assigned", getUserAssignedTasks);
router.get("/project/:projectId", getProjectTasks);
router.get("/:taskId", getTaskById);
router.put("/:taskId", updateTask);
router.delete("/:taskId", deleteTask);

module.exports = router;
