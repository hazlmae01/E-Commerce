const db = require("../DB/db-config");

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock_quantity, category_id } = req.body;
    const user = req.user;

    if (!user || user.role !== "admin") {
      return res.status(403).json({ status: "error", error: "Only admins can update products." });
    }

    // Validate stock_quantity
    const stockQty = parseInt(stock_quantity, 10);
    if (isNaN(stockQty) || stockQty < 0) {
      return res.status(400).json({ status: "error", error: "Stock quantity must be a non-negative number." });
    }

    // Validate price
    const productPrice = parseFloat(price);
    if (isNaN(productPrice) || productPrice <= 0) {
      return res.status(400).json({ status: "error", error: "Price must be a positive number." });
    }

    // Optionally validate other fields (name, description, category_id) here as well
    if (!name || !description || !category_id) {
      return res.status(400).json({ status: "error", error: "Name, description and category_id are required." });
    }

    await db.query(
      `UPDATE products SET name = ?, description = ?, price = ?, stock_quantity = ?, category_id = ? WHERE product_id = ?`,
      [name, description, productPrice, stockQty, category_id, id]
    );

    res.json({ status: "success", message: "Product updated successfully." });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ status: "error", error: "Failed to update product." });
  }
};

module.exports = updateProduct;
