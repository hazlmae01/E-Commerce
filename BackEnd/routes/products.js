const express = require("express");
const db = require("../DB/db-config");
const addProduct = require("../controllers/addProduct.js");
const getProducts = require("../controllers/getProducts.js");
const updateProduct = require("../controllers/updateProduct.js");
const authMiddleware = require("../Middleware/authMiddleware.js");
const getProductsByCategory = require("../controllers/getProductsByCategory");
const multer = require("multer");
const path = require("path");

const router = express.Router();

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "FrontEnd/assets"); // Make sure this exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_"));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif/;
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.test(ext) && allowed.test(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"));
    }
  },
});

// Get one product by ID
router.get("/products/:id", async (req, res) => {
  const db = require("../DB/db-config.js");
  try {
    const { id } = req.params;
    const [rows] = await db.query(`
      SELECT p.*, c.name AS category_name
      FROM products p
      LEFT JOIN category c ON p.category_id = c.category_id
      WHERE p.product_id = ?
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ status: "error", error: "Product not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("Get product by ID error:", err);
    res.status(500).json({ status: "error", error: "Server error" });
  }
});

// Get all products
router.get("/products", getProducts);

// Create product with image
router.post("/products", authMiddleware, upload.single("image"), addProduct);

// Update product
router.put("/products/:id", authMiddleware, updateProduct);

router.delete("/products/:id", authMiddleware, async (req, res) => {
  const db = require("../DB/db-config.js");
  const { id } = req.params;

  try {
    const [result] = await db.query("DELETE FROM products WHERE product_id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Product not found." });
    }

    res.json({ message: "Product deleted successfully." });
  } catch (err) {
    console.error("Delete product error:", err);
    res.status(500).json({ error: "Server error deleting product." });
  }
});

// Get products by category ID
router.get("/category/:categoryId", async (req, res) => {
  const { categoryId } = req.params;

  try {
    const [products] = await db.query(
      `SELECT product_id, name, description, price, image_url 
       FROM products 
       WHERE category_id = ?`,
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

// New: Get products grouped by category
router.get("/products-by-category", async (req, res) => {
  const db = require("../DB/db-config.js");
  try {
    const [rows] = await db.query(`
      SELECT c.category_id, c.name AS category_name,
             p.product_id, p.name AS product_name, p.description, p.price, p.stock_quantity, p.image_url
      FROM category c
      LEFT JOIN products p ON c.category_id = p.category_id
      ORDER BY c.category_id, p.product_id
    `);

    const categories = {};

    rows.forEach(row => {
      const catId = row.category_id;
      if (!categories[catId]) {
        categories[catId] = {
          category_id: catId,
          category_name: row.category_name,
          products: []
        };
      }
      if (row.product_id) {
        categories[catId].products.push({
          product_id: row.product_id,
          name: row.product_name,
          description: row.description,
          price: Number(row.price),
          stock_quantity: Number(row.stock_quantity),
          image_url: row.image_url
        });
      }
    });

    const result = Object.values(categories);

    res.json(result);
  } catch (err) {
    console.error("Error fetching products grouped by category:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/category/:categoryId", getProductsByCategory);

module.exports = router;
