const db = require("../DB/db-config");

const addProduct = async (req, res) => {
  try {
    const { name, description, price, stock_quantity, category_id } = req.body;
    const user = req.user;

    // Check user role
    if (!user || user.role !== "admin") {
      return res.status(403).json({ status: "error", error: "Only admins can add products." });
    }

    // Validate all required fields
    if (!name || !description || !price || !stock_quantity || !category_id) {
      return res.status(400).json({ status: "error", error: "All fields are required." });
    }

    // Insert product into database
    const [result] = await db.query(
      "INSERT INTO products SET ?",
      { name, description, price, stock_quantity, category_id }
    );

    // Return success response with inserted product ID
    return res.status(201).json({ status: "success", success: "Product added successfully.", productId: result.insertId });
  } catch (err) {
    console.error("Database error while adding product:", err);
    return res.status(500).json({ status: "error", error: "Database error while adding product." });
  }
};

module.exports = addProduct;
