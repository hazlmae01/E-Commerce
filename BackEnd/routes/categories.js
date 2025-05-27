const express = require("express");
const router = express.Router();
const db = require("../DB/db-config.js");

// Get all categories
router.get("/", async (req, res) => {
  try {
    const [categories] = await db.query("SELECT category_id, name, description FROM category");
    res.json(categories);
  } catch (err) {
    console.error("Get categories error:", err);
    res.status(500).json({ status: "error", error: "Server error" });
  }
});

// Create new category
router.post("/", async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ status: "error", error: "Category name is required" });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO category (name, description) VALUES (?, ?)",
      [name, description || null]
    );
    res.status(201).json({ status: "success", category_id: result.insertId });
  } catch (err) {
    console.error("Add category error:", err);
    res.status(500).json({ status: "error", error: "Database error" });
  }
});
router.get("/name/:name/products", async (req, res) => {
  const categoryName = req.params.name;

  try {
    const [products] = await db.query(
      `SELECT p.product_id, p.name, p.description, p.price, p.image_url 
       FROM products p
       JOIN category c ON p.category_id = c.category_id
       WHERE c.name = ?`,
      [categoryName]
    );

    res.json(products);
  } catch (err) {
    console.error("Get products by category name error:", err);
    res.status(500).json({ status: "error", error: "Server error" });
  }
});

// Get category by ID
router.get("/:id", async (req, res) => {
  const db = require("../DB/db-config.js");
  const { id } = req.params;

  try {
    const [rows] = await db.query("SELECT * FROM category WHERE category_id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ status: "error", error: "Category not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error("Get category by ID error:", err);
    res.status(500).json({ status: "error", error: "Server error" });
  }
});
router.get("/name/:name/products", async (req, res) => {
  const categoryName = req.params.name;

  try {
    // Check if category exists
    const [catRows] = await db.query("SELECT category_id FROM category WHERE name = ?", [categoryName]);
    if (catRows.length === 0) {
      return res.status(404).json({ status: "error", error: `Category '${categoryName}' not found` });
    }
    const categoryId = catRows[0].category_id;

    // Fetch products under that category ID
    const [products] = await db.query(
      `SELECT product_id, name, description, price, stock_quantity, image_url
       FROM products
       WHERE category_id = ?`,
      [categoryId]
    );

    if (products.length === 0) {
      return res.status(404).json({ status: "error", error: `No products found for category '${categoryName}'` });
    }

    res.json(products);
  } catch (err) {
    console.error("Get products by category name error:", err);
    res.status(500).json({ status: "error", error: "Server error" });
  }
});
// Get products by category ID
router.get("/:id/products", async (req, res) => {
  const categoryId = req.params.id;

  try {
    const [products] = await db.query(
      `SELECT p.product_id, p.name, p.description, p.price, p.stock_quantity, p.image_url
       FROM products p
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
});


module.exports = router;

