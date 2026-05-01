const express = require("express");
const authMiddleware = require("../Middlewares/auth");
const {
  createProject,
  getUserProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
} = require("../Controllers/projectController");

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Project CRUD operations
router.post("/", createProject);
router.get("/", getUserProjects);
router.get("/:projectId", getProjectById);
router.put("/:projectId", updateProject);
router.delete("/:projectId", deleteProject);

// Member management (Admin only)
router.post("/:projectId/members", addMember);
router.delete("/:projectId/members/:memberId", removeMember);

module.exports = router;
