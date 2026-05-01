const express = require("express");
const { signup, login } = require("../Controllers/authController");
const { validateSignup, validateLogin } = require("../Middlewares/validation");
const { signupLimiter, loginLimiter } = require("../Middlewares/rateLimiter");
const router = express.Router();

router.post("/signup", signupLimiter, validateSignup, signup);
router.post("/login", loginLimiter, validateLogin, login);

module.exports = router;
