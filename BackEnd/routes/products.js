const express = require("express");
const addProduct = require("../controllers/addProduct.js");
const getProducts = require("../controllers/getProducts.js");
const updateProduct = require("../controllers/updateProduct.js");
const authMiddleware = require("../Middleware/authMiddleware.js");
const multer = require("multer");
const path = require("path");

const router = express.Router();

// Setup multer storage for images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "FrontEnd/assets"); // Make sure this folder exists!
  },
  filename: function (req, file, cb) {
    // Use timestamp + original filename with spaces replaced by _
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_"));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // max 5MB file size
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif/;
    const ext = path.extname(file.originalname).toLowerCase();
    const mime = file.mimetype;
    if (allowed.test(ext) && allowed.test(mime)) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"));
    }
  },
});

router.get("/products/:id", async (req, res) => {
  const db = require("../DB/db-config.js");
  try {
    const { id } = req.params;
    const [rows] = await db.query("SELECT * FROM products WHERE product_id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ status: "error", error: "Product not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error("Get product by ID error:", err);
    res.status(500).json({ status: "error", error: "Server error" });
  }
});


router.get("/products", getProducts);


router.post("/products", authMiddleware, upload.single("image"), addProduct);
router.put("/products/:id", authMiddleware, updateProduct);
module.exports = router;
