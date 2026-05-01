const validator = require("validator");

// Sanitize input to prevent XSS
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return validator.trim(input).substring(0, 200);
};

// Validate signup data
const validateSignup = (req, res, next) => {
  let { name, email, password, confirmPassword } = req.body;

  // Sanitize inputs
  name = sanitizeInput(name);
  email = sanitizeInput(email).toLowerCase();
  password = sanitizeInput(password);
  confirmPassword = sanitizeInput(confirmPassword);

  // Store sanitized data back
  req.body = { name, email, password, confirmPassword };

  // Check required fields
  if (!name || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Name validation
  if (name.length < 2) {
    return res.status(400).json({ message: "Name must be at least 2 characters" });
  }

  if (name.length > 50) {
    return res.status(400).json({ message: "Name must not exceed 50 characters" });
  }

  // Email validation
  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: "Please enter a valid email address" });
  }

  // Password validation
  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }

  if (password.length > 100) {
    return res.status(400).json({ message: "Password is too long" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  next();
};

// Validate login data
const validateLogin = (req, res, next) => {
  let { email, password } = req.body;

  // Sanitize inputs
  email = sanitizeInput(email).toLowerCase();
  password = sanitizeInput(password);

  // Store sanitized data back
  req.body = { email, password };

  // Check required fields
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  // Email validation
  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: "Please enter a valid email address" });
  }

  next();
};

module.exports = { validateSignup, validateLogin, sanitizeInput };
