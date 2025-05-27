const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart");
const authMiddleware = require("../Middleware/authMiddleware");

router.post("/add", authMiddleware, cartController.addToCart);
router.get("/", authMiddleware, cartController.getCartItems);
router.delete("/:cartItem_id", authMiddleware, cartController.deleteCartItem);
router.put("/:cartItem_id", authMiddleware, cartController.updateCartItemQuantity);

module.exports = router;
