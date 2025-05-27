const express = require("express");
const addProduct = require("../controllers/addProduct.js");
const getProducts = require("../controllers/getProducts.js");
const updateProduct = require("../controllers/updateProduct.js");
const authMiddleware = require("../Middleware/authMiddleware.js");
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
module.exports = router;
