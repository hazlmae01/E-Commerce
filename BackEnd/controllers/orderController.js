const pool = require("../DB/db-config");

async function placeOrder(req, res) {
  const userId = req.user.user_id;
  const { fullname, email, shippingAddress, contactNumber, items } = req.body;

  if (!fullname || !email || !shippingAddress || !items || items.length === 0) {
    return res.status(400).json({ success: false, message: "Missing order details." });
  }

  try {
    const [cartItems] = await pool.query(
      `SELECT ci.cartItem_id, ci.product_id, ci.quantity, p.price, p.stock_quantity
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.product_id
       WHERE ci.user_id = ?`,
      [userId]
    );

    const cartMap = new Map(cartItems.map(item => [item.cartItem_id, item]));

    let totalPrice = 0;
    for (const item of items) {
      const cartItem = cartMap.get(item.cartItem_id);
      if (!cartItem) {
        return res.status(400).json({ success: false, message: `Cart item ${item.cartItem_id} not found.` });
      }
      if (item.quantity > cartItem.stock_quantity) {
        return res.status(400).json({ success: false, message: `Insufficient stock for product ID ${cartItem.product_id}` });
      }
      totalPrice += cartItem.price * item.quantity;
    }

    const ShippingAddressString = `${shippingAddress.address_line1}, ${shippingAddress.city}, ${shippingAddress.state}, ${shippingAddress.country}`;

    const [orderResult] = await pool.query(
      `INSERT INTO orders (user_id, totalAmount, shippingAddress, contactNumber, orderStatus)
       VALUES (?, ?, ?, ?, 'Pending')`,
      [userId, totalPrice, ShippingAddressString, contactNumber]
    );

    const orderId = orderResult.insertId;

    const orderDetailsValues = items.map(item => {
      const cartItem = cartMap.get(item.cartItem_id);
      return [orderId, cartItem.product_id, item.quantity, cartItem.price];
    });

    await pool.query(
      `INSERT INTO order_details (order_id, product_id, quantity, price) VALUES ?`,
      [orderDetailsValues]
    );

    for (const item of items) {
      const cartItem = cartMap.get(item.cartItem_id);
      await pool.query(
        `UPDATE products 
         SET stock_quantity = stock_quantity - ?, 
             sold_count = sold_count + ? 
         WHERE product_id = ?`,
        [item.quantity, item.quantity, cartItem.product_id]
      );
    }

    const itemIdsToDelete = items.map(item => item.cartItem_id);
    await pool.query(
      `DELETE FROM cart_items WHERE cartItem_id IN (?)`,
      [itemIdsToDelete]
    );

    return res.json({ success: true, message: "Order placed successfully", orderId });

  } catch (error) {
    console.error("Order placement error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

async function getAllOrders(req, res) {
  try {
    const [rows] = await pool.query(`
      SELECT 
        o.order_id,
        o.user_id,
        u.name AS user_name,
        o.totalAmount,
        o.orderStatus,
        o.created_at AS orderDate,
        od.product_id,
        p.name AS product_name,
        od.quantity,
        od.price
      FROM orders o
      JOIN users u ON o.user_id = u.user_id
      JOIN order_details od ON o.order_id = od.order_id
      JOIN products p ON od.product_id = p.product_id
      ORDER BY o.created_at DESC
    `);

    res.json(rows);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
}

async function updateOrderStatus(req, res) {
  const orderId = req.params.orderId;
  const { order_status } = req.body;

  if (!order_status) {
    return res.status(400).json({ success: false, message: "Missing order_status in request body." });
  }

  try {
    const [result] = await pool.query(
      `UPDATE orders SET orderStatus = ? WHERE order_id = ?`,
      [order_status, orderId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Order not found." });
    }

    return res.json({ success: true, message: "Order status updated successfully." });
  } catch (error) {
    console.error("Error updating order status:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
}

module.exports = { 
  placeOrder,
  getAllOrders,
  updateOrderStatus
};

