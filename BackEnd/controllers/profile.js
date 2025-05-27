const db = require("../DB/db-config");
const path = require("path");

exports.updateProfile = async (req, res) => {
  const { name, email, bio, contact_number } = req.body;
  const userId = req.user.user_id;

  try {
    await db.query(
      "UPDATE users SET name = ?, email = ?, bio = ?, contact_number = ? WHERE user_id = ?",
      [name, email, bio, contact_number, userId]
    );
    res.json({ success: true });
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ message: "Database error while updating profile." });
  }
};

exports.uploadProfilePhoto = async (req, res) => {
  const userId = req.user.user_id;
  const imagePath = `/assets/${req.file.filename}`;

  try {
    await db.query("UPDATE users SET profile_image = ? WHERE user_id = ?", [imagePath, userId]);
    res.json({ success: true, imageUrl: imagePath });
  } catch (err) {
    console.error("Photo upload error:", err);
    res.status(500).json({ message: "Failed to save profile image." });
  }
};
