const db = require("../DB/db-config");

const addProduct = async (req, res) => {
    try {
        const { name, description, price, stock_quantity, category_id } = req.body;
        const user = req.user;

        if (!user || user.role !== "admin") {
            return res.json({ status: "error", error: "Only admins can add products." });
        }

        if (!name || !description || !price || !stock_quantity || !category_id) {
            return res.json({ status: "error", error: "All fields are required." });
        }

        const [result] = await db.query(
            "INSERT INTO products SET ?",
            { name, description, price, stock_quantity, category_id }
        );

        return res.json({ status: "success", success: "Product added successfully." });
    } catch (err) {
        console.error(err);
        return res.json({ status: "error", error: "Database error while adding product." });
    }
};

module.exports = addProduct;
