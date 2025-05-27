const express = require("express");
const register = require("../controllers/signup");
const login = require("../controllers/login");
const logout = require("../controllers/logout");
const authMiddleware = require("../Middleware/authMiddleware");

const router = express.Router();

// Public routes - no authentication needed
router.post("/signup", register);
router.post("/login", login);

// Protected route - logout requires authentication
router.post("/logout", authMiddleware, logout);

module.exports = router;
