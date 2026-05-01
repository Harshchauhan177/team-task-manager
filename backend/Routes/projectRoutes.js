const express = require("express");
const authMiddleware = require("../Middlewares/auth");
const {
  createProject,
  getUserProjects,
  getProjectById,
  updateProject,
  deleteProject,
  getEligibleUsersForProject,
  addMember,
  removeMember,
} = require("../Controllers/projectController");

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Project CRUD operations
router.post("/", createProject);
router.get("/", getUserProjects);

// Member management (Admin only) — register before GET /:projectId
router.get("/:projectId/eligible-members", getEligibleUsersForProject);
router.post("/:projectId/members", addMember);
router.delete("/:projectId/members/:memberId", removeMember);

router.get("/:projectId", getProjectById);
router.put("/:projectId", updateProject);
router.delete("/:projectId", deleteProject);

module.exports = router;
