const db = require("../DB/db-config");

async function getProductsByCategory(req, res) {
  const { categoryId } = req.params;

  try {
    const [products] = await db.query(
      `SELECT p.product_id, p.name, p.description, p.price, p.stock_quantity, p.image_url, c.name AS category_name
       FROM products p
       LEFT JOIN category c ON p.category_id = c.category_id
       WHERE p.category_id = ?`,
      [categoryId]
    );

    if (products.length === 0) {
      return res.status(404).json({ status: "error", error: "No products found for this category" });
    }

    res.json(products);
  } catch (err) {
    console.error("Get products by category error:", err);
    res.status(500).json({ status: "error", error: "Server error" });
  }
}

module.exports = getProductsByCategory;
