const rateLimit = require("express-rate-limit");

// Rate limiter for signup - 5 attempts per 15 minutes
const signupLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: "Too many signup attempts, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter for login - 10 attempts per 15 minutes
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  message: "Too many login attempts, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { signupLimiter, loginLimiter };
