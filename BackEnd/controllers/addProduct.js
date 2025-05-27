const db = require("../DB/db-config");

const addProduct = async (req, res) => {
  try {
    const { name, description, price, stock_quantity, category_id } = req.body;
    const user = req.user;

    if (!user || user.role !== "admin") {
      return res.status(403).json({ status: "error", error: "Only admins can add products." });
    }

    // Validate all fields including uploaded image
    if (!name || !description || !price || !stock_quantity || !category_id || !req.file) {
      return res.status(400).json({ status: "error", error: "All fields including image are required." });
    }

    // Convert stock_quantity to integer and validate >= 0
    const stockQty = parseInt(stock_quantity, 10);
    if (isNaN(stockQty) || stockQty < 0) {
      return res.status(400).json({ status: "error", error: "Stock quantity must be a non-negative number." });
    }

    // Convert price to float and validate > 0 (optional)
    const productPrice = parseFloat(price);
    if (isNaN(productPrice) || productPrice <= 0) {
      return res.status(400).json({ status: "error", error: "Price must be a positive number." });
    }

    // Fix image path to include slash
    const imagePath = "/assets/" + req.file.filename;

    const [result] = await db.query(
      "INSERT INTO products SET ?",
      { name, description, price: productPrice, stock_quantity: stockQty, category_id, image_url: imagePath }
    );

    return res.status(201).json({ status: "success", success: "Product added successfully.", productId: result.insertId });
  } catch (err) {
    console.error("Add product error:", err);
    return res.status(500).json({ status: "error", error: "Database error while adding product." });
  }
};

module.exports = addProduct;
