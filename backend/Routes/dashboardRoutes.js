const express = require("express");
const authMiddleware = require("../Middlewares/auth");
const {
  getDashboard,
  getProjectDashboard,
} = require("../Controllers/dashboardController");

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Dashboard endpoints
router.get("/", getDashboard);
router.get("/project/:projectId", getProjectDashboard);

module.exports = router;
