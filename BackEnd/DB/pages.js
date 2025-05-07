const express = require("express");
const router = express.Router();

router.get("/", (req, res)=> {
    res.render("index");
})
router.get("/signup", (req, res)=> {
    res.sendFile("signup.html", {root: "./FrontEnd/views"});
})
router.get("/login", (req, res)=> {
    res.sendFile("login.html", {root: "./FrontEnd/views"});

})
router.get("/homePage", (req, res)=> {
    res.sendFile("index.html", {root: "./FrontEnd/views"});

})
module.exports = router;