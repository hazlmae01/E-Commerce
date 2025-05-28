const express = require("express");
const multer = require("multer");
const path = require("path");
const db = require("../DB/db-config.js");

const router = express.Router();

// Multer storage setup for category images
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "Frontend/assets/categories"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// Get all categories
router.get("/", async (req, res) => {
  try {
    const [categories] = await db.query("SELECT category_id, name, description, image_url FROM category");

    // Add full URL or relative frontend-safe path
    const categoriesWithImages = categories.map(cat => ({
      ...cat,
      image_url: cat.image_url
        ? `/${cat.image_url.replace(/^Frontend\//, "")}` // Remove "Frontend/" and prepend "/" for correct URL
        : null,
    }));

    res.json(categoriesWithImages);
  } catch (err) {
    console.error("Get categories error:", err);
    res.status(500).json({ status: "error", error: "Server error" });
  }
});


// Create new category with image upload
router.post("/", upload.single("image"), async (req, res) => {
  const { name, description } = req.body;
  const imagePath = req.file ? `Frontend/assets/categories/${req.file.filename}` : null;

  if (!name || !imagePath) {
    return res.status(400).json({ status: "error", error: "Name and image required" });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO category (name, description, image_url) VALUES (?, ?, ?)",
      [name, description || null, imagePath]
    );
    res.status(201).json({ status: "success", category_id: result.insertId });
  } catch (err) {
    console.error("Add category error:", err);
    res.status(500).json({ status: "error", error: "Database error" });
  }
});

// Get category by ID
router.get("/:id", async (req, res) => {
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

// Get products by category name (with category existence check)
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

module.exports = router;
