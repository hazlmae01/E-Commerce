const express = require("express");
const router = express.Router();
const guestOnly = require("../middleware/guestOnlyMiddleware");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", guestOnly, (req, res) => {
    res.render("index");
});
router.get("/signup", guestOnly, (req, res) => {
    res.sendFile("signup.html", { root: "./FrontEnd/views" });
});

router.get("/login", guestOnly, (req, res) => {
    res.sendFile("login.html", { root: "./FrontEnd/views" });
});

router.get("/homePage", authMiddleware, (req, res) => {
    res.sendFile("index.html", { root: "./FrontEnd/views" });
});

router.get("/addProduct", authMiddleware, (req, res) => {
    res.sendFile("addProduct.html", { root: "./FrontEnd/views" });
});

router.get("/cart", authMiddleware, (req, res) => {
    res.sendFile("order.html", { root: "./FrontEnd/views" });
});
router.get("/unauthorized", (req, res) => {
    res.sendFile("unauthorized.html", { root: "./FrontEnd/views" });
});
module.exports = router;