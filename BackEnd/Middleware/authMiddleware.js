const jwt = require("jsonwebtoken");
const db = require("../DB/db-config");

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.userRegistered;

        if (!token) {
            return res.redirect("/unauthorized");
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const [results] = await db.query(
            `SELECT u.*, r.name AS role
             FROM users u
             LEFT JOIN roles r ON u.role_id = r.role_id
             WHERE u.user_id = ?`,
            [decoded.id]
        );

        if (!results || results.length === 0) {
            return res.redirect("/unauthorized");
        }

        req.user = results[0];
        next();
    } catch (err) {
        return res.redirect("/unauthorized");
    }
};

module.exports = authMiddleware;
