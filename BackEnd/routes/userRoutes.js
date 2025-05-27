const express = require("express");
const router = express.Router();
const authMiddleware = require("../Middleware/authMiddleware");
const db = require("../DB/db-config");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, "../../FrontEnd/assets/");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `user-${req.user.user_id}-${Date.now()}${ext}`);
  }
});

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed"), false);
    }
    cb(null, true);
  }
});

// GET /api/user/profile
router.get("/profile", authMiddleware, async (req, res) => {
  const userId = req.user.user_id;

  try {
    const [[user]] = await db.query(
      "SELECT name, email, bio, contact_number, profile_image FROM users WHERE user_id = ?",
      [userId]
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      name: user.name,
      email: user.email,
      bio: user.bio,
      contact_number: user.contact_number,
      profile_photo: user.profile_image
    });
  } catch (err) {
    console.error("Fetch profile error:", err);
    res.status(500).json({ message: "Error fetching profile" });
  }
});

// POST /api/user/profile
router.post("/profile", authMiddleware, async (req, res) => {
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
});

// POST /api/user/profile/photo
router.post("/profile/photo", authMiddleware, upload.single("photo"), async (req, res) => {
  const userId = req.user.user_id;
  const imagePath = `/assets/${req.file.filename}`;

  try {
    await db.query("UPDATE users SET profile_image = ? WHERE user_id = ?", [imagePath, userId]);
    res.json({ success: true, photoUrl: imagePath });
  } catch (err) {
    console.error("Photo upload error:", err);
    res.status(500).json({ message: "Failed to save profile image." });
  }
});

// GET /api/user/addresses
router.get("/addresses", authMiddleware, async (req, res) => {
  const userId = req.user.user_id;
  try {
    const [rows] = await db.query("SELECT * FROM user_addresses WHERE user_id = ?", [userId]);
    res.json(rows);
  } catch (err) {
    console.error("Fetch addresses error:", err);
    res.status(500).json({ message: "Error fetching addresses" });
  }
});

// POST /api/user/addresses
router.post("/addresses", authMiddleware, async (req, res) => {
  const { addressLine1, addressLine2, city, state, zip, country } = req.body;
  const userId = req.user.user_id;

  try {
    await db.query(
      `INSERT INTO addresses (user_id, address_line1, address_line2, city, state, zip, country)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId, addressLine1, addressLine2, city, state, zip, country]
    );
    res.json({ success: true });
  } catch (err) {
    console.error("Add address error:", err);
    res.status(500).json({ message: "Error saving address" });
  }
});

// POST /api/user/change-password (no hashing, plain text)
router.post("/change-password", authMiddleware, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.user_id;

  try {
    const [[user]] = await db.query("SELECT password FROM users WHERE user_id = ?", [userId]);

    if (user.password !== currentPassword) {
      return res.status(400).json({ success: false, message: "Current password is incorrect" });
    }

    await db.query("UPDATE users SET password = ? WHERE user_id = ?", [newPassword, userId]);

    res.json({ success: true });
  } catch (err) {
    console.error("Change password error:", err);
    res.status(500).json({ success: false, message: "Failed to change password" });
  }
});
const addressesController = require("../controllers/addressController");

// GET user addresses
router.get("/addresses", authMiddleware, addressesController.getUserAddresses);

// POST add address
router.post("/addresses", authMiddleware, addressesController.addUserAddress);

module.exports = router;
