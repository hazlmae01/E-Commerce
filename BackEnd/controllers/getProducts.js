const db = require("../DB/db-config");

async function getProducts(req, res) {
  try {
    const [rows] = await db.query(`
      SELECT product_id, name, description, price, stock_quantity, category_id
      FROM products
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
}

module.exports = getProducts;
