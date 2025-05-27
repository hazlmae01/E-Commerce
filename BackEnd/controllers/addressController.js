const db = require("../DB/db-config");

exports.getUserAddresses = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const [rows] = await db.query("SELECT * FROM addresses WHERE user_id = ?", [userId]);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching addresses:", err);
    res.status(500).json({ message: "Failed to fetch addresses." });
  }
};

exports.addUserAddress = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { addressLine1, addressLine2, city, state, zip, country } = req.body;

    await db.query(
      `INSERT INTO addresses 
       (user_id, address_line1, address_line2, city, state, zip, country) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId, addressLine1, addressLine2, city, state, zip, country]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("Error adding address:", err);
    res.status(500).json({ message: "Failed to add address." });
  }
};
