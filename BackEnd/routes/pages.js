const express = require("express");
const router = express.Router();
const guestOnly = require("../Middleware/guestOnlyMiddleware");
const authMiddleware = require("../Middleware/authMiddleware");
const isAdmin = require("../Middleware/isAdminMiddleware");

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
    res.sendFile("cart.html", { root: "./FrontEnd/views" });
});
router.get("/unauthorized", (req, res) => {
    res.sendFile("unauthorized.html", { root: "./FrontEnd/views" });
});
router.get("/admin", authMiddleware, isAdmin, (req, res) => {
  res.sendFile("admin.html", { root: "./FrontEnd/views" });
});
router.get("/product", (req, res) => {
  res.sendFile("product.html", { root: "./FrontEnd/views" });
});
router.get("/profile", authMiddleware, (req, res) => {
  res.sendFile("user_profile.html", { root: "./FrontEnd/views" });
});
router.get("/category", (req, res) => {
  res.sendFile("category.html", { root: "./FrontEnd/views" });
});

module.exports = router;