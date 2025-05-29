const express = require("express");
const pool = require("../DB/db-config");
const router = express.Router();
const authMiddleware = require("../Middleware/authMiddleware");
const isAdminMiddleware = require("../Middleware/isAdminMiddleware");

// Import both controller functions
const { placeOrder, getAllOrders } = require("../controllers/orderController");

// Route to place an order (authenticated users only)
router.post("/place", authMiddleware, placeOrder);

// Route to get all orders
router.get("/", getAllOrders);

// PUT /api/order/:id/status
router.put('/:id/status', async (req, res) => {
    const { id } = req.params;
    const { order_status } = req.body;

    try {
        const [result] = await pool.query(
            'UPDATE orders SET orderStatus = ? WHERE order_id = ?',
            [order_status, id]
        );


        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.json({ message: 'Order status updated' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

module.exports = router;
