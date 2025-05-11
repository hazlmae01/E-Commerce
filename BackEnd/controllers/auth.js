const express = require("express");
const register = require("./signup");
const login = require("./login");
const logout = require("./logout");
const addProduct = require("./addProduct");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.post("/signup", register);
router.post("/login", login);
router.post("/logout", logout);

// Protected route: only accessible if authenticated and an admin
router.post("/products", authMiddleware, addProduct);

module.exports = router;
