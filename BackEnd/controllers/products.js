const express = require("express");
const addProduct = require("./addProduct");
const getProducts = require("./getProducts");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


router.get("/products", getProducts);


router.post("/products", authMiddleware, addProduct);

module.exports = router;