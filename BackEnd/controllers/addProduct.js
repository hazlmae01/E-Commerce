const db = require("../DB/db-config");

<<<<<<< HEAD
const addProduct = (req, res) => {
    const { name, description, price, stock_quantity, category_id } = req.body;
    const user = req.user; 

    if (!user || user.role !== "admin") {
        return res.json({ status: "error", error: "Only admins can add products." });
    }

    if (!name || !description || !price || !stock_quantity || !category_id) {
        return res.json({ status: "error", error: "All fields are required." });
    }

    db.query(
        "INSERT INTO products SET ?",
        { name, description, price, stock_quantity, category_id },
        (err, result) => {
            if (err) {
                console.error(err);
                return res.json({ status: "error", error: "Database error while adding product." });
            }
            res.json({ status: "success", success: "Product added successfully." });
        }
    );
=======
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
>>>>>>> 49e592c93bc85cd00e96c96f95ee4397fec3f2d1
};

module.exports = addProduct;
