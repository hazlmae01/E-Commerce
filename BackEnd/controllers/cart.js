const pool = require("../DB/db-config");

async function addToCart(req, res) {
  const userId = req.user.user_id;
  const { product_id, quantity } = req.body;

  if (!product_id || !quantity || quantity < 1) {
    return res.status(400).json({ success: false, message: "Invalid product ID or quantity" });
  }

  try {
    const [productRows] = await pool.query(
      "SELECT stock_quantity FROM products WHERE product_id = ?",
      [product_id]
    );
    if (productRows.length === 0) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    const stock = productRows[0].stock_quantity;
    if (quantity > stock) {
      return res.status(400).json({ success: false, message: `Only ${stock} items in stock` });
    }

    const [cartRows] = await pool.query(
      "SELECT quantity FROM cart_items WHERE user_id = ? AND product_id = ?",
      [userId, product_id]
    );

    if (cartRows.length > 0) {
      let newQuantity = cartRows[0].quantity + quantity;
      if (newQuantity > stock) newQuantity = stock;

      await pool.query(
        "UPDATE cart_items SET quantity = ? WHERE user_id = ? AND product_id = ?",
        [newQuantity, userId, product_id]
      );
    } else {
      await pool.query(
        "INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)",
        [userId, product_id, quantity]
      );
    }

    return res.json({ success: true, message: "Product added to cart" });
  } catch (error) {
    console.error("Add to cart error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

async function getCartItems(req, res) {
  const userId = req.user.user_id;
  try {
    const [rows] = await pool.query(
      `SELECT c.cartItem_id, c.product_id, c.quantity, p.name, p.price, p.image_url
       FROM cart_items c
       JOIN products p ON c.product_id = p.product_id
       WHERE c.user_id = ?`, 
      [userId]
    );
    return res.json({ cartItems: rows });
  } catch (error) {
    console.error("Error fetching cart items:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

async function deleteCartItem(req, res) {
  const userId = req.user.user_id;
  const { cartItem_id } = req.params;

  try {
    const [result] = await pool.query(
      "DELETE FROM cart_items WHERE cartItem_id = ? AND user_id = ?",
      [cartItem_id, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Cart item not found or unauthorized" });
    }

    return res.json({ success: true, message: "Cart item deleted" });
  } catch (error) {
    console.error("Delete cart item error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

async function updateCartItemQuantity(req, res) {
  const userId = req.user.user_id;
  const { cartItem_id } = req.params;
  const { quantity } = req.body;

  if (!quantity || quantity < 1) {
    return res.status(400).json({ success: false, message: "Invalid quantity" });
  }

  try {
    // Get product_id from cart item to check stock
    const [cartRows] = await pool.query(
      "SELECT product_id FROM cart_items WHERE cartItem_id = ? AND user_id = ?",
      [cartItem_id, userId]
    );

    if (cartRows.length === 0) {
      return res.status(404).json({ success: false, message: "Cart item not found or unauthorized" });
    }

    const productId = cartRows[0].product_id;

    // Check stock quantity for the product
    const [productRows] = await pool.query(
      "SELECT stock_quantity FROM products WHERE product_id = ?",
      [productId]
    );

    if (productRows.length === 0) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const stock = productRows[0].stock_quantity;
    if (quantity > stock) {
      return res.status(400).json({ success: false, message: `Only ${stock} items in stock` });
    }

    // Update cart item quantity
    await pool.query(
      "UPDATE cart_items SET quantity = ? WHERE cartItem_id = ? AND user_id = ?",
      [quantity, cartItem_id, userId]
    );

    return res.json({ success: true, message: "Cart item quantity updated" });
  } catch (error) {
    console.error("Update cart item quantity error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

module.exports = {
  addToCart,
  getCartItems,
  deleteCartItem,
  updateCartItemQuantity,
};
