const express = require("express");
const router = express.Router();
const db = require("../DB/db-config.js");

// Get all categories
router.get("/", async (req, res) => {
  try {
    const [categories] = await db.query("SELECT category_id, name, description FROM category");
    res.json(categories);
  } catch (err) {
    console.error("Get categories error:", err);
    res.status(500).json({ status: "error", error: "Server error" });
  }
});

// Create new category
router.post("/", async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ status: "error", error: "Category name is required" });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO category (name, description) VALUES (?, ?)",
      [name, description || null]
    );
    res.status(201).json({ status: "success", category_id: result.insertId });
  } catch (err) {
    console.error("Add category error:", err);
    res.status(500).json({ status: "error", error: "Database error" });
  }
});

module.exports = router;
