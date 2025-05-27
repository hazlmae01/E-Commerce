const db = require("../DB/db-config");

async function getProducts(req, res) {
  try {
    const [rows] = await db.query(`
      SELECT p.product_id, p.name, p.description, p.price, p.stock_quantity, p.category_id, p.image_url,
             c.name AS category_name
      FROM products p
      LEFT JOIN category c ON p.category_id = c.category_id
    `);

    const products = rows.map(product => ({
      ...product,
      price: Number(product.price),
      stock_quantity: Number(product.stock_quantity),
      category_id: product.category_id !== null ? Number(product.category_id) : null,
      category_name: product.category_name || "N/A",
    }));

    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
}

module.exports = getProducts;
