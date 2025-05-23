const express = require("express");
const register = require("./signup");
const login = require("./login");
const logout = require("./logout");
<<<<<<< HEAD
const addProduct = require("./addProduct");
=======
>>>>>>> 49e592c93bc85cd00e96c96f95ee4397fec3f2d1
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

<<<<<<< HEAD
// Public routes
router.post("/signup", register);
router.post("/login", login);
router.post("/logout", logout);

// Protected route: only accessible if authenticated and an admin
router.post("/products", authMiddleware, addProduct);
=======
// Public routes - no authentication needed
router.post("/signup", register);
router.post("/login", login);

// Protected route - logout requires authentication
router.post("/logout", authMiddleware, logout);
>>>>>>> 49e592c93bc85cd00e96c96f95ee4397fec3f2d1

module.exports = router;
