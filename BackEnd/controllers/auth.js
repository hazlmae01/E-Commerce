const express = require("express");
const register = require("./signup")
const login = require("./login")
const logout = require("./logout")
const router = express.Router();

router.post("/signup", register)
router.post("/login", login)
// router.post("/logout", logout)

module.exports = router;