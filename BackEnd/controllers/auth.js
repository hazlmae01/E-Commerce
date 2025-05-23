const express = require("express");
const register = require("./signup");
const login = require("./login");
const logout = require("./logout");
const authMiddleware = require("../Middleware/authMiddleware");

const router = express.Router();

// Public routes - no authentication needed
router.post("/signup", register);
router.post("/login", login);

// Protected route - logout requires authentication
router.post("/logout", authMiddleware, logout);

module.exports = router;
