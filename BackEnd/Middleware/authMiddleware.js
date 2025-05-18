const jwt = require("jsonwebtoken");
const db = require("../DB/db-config");

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.userRegistered;

        if (!token) {
            return res.redirect(`/unauthorized?route=${encodeURIComponent(req.originalUrl)}`);
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const [results] = await db.query("SELECT * FROM users WHERE user_id = ?", [decoded.id]);

        if (!results || results.length === 0) {
            return res.redirect(`/unauthorized?route=${encodeURIComponent(req.originalUrl)}`);
        }

        const user = results[0];
        req.user = user;

        if (req.originalUrl.startsWith("/addProduct") && user.role !== "admin") {
            return res.redirect(`/unauthorized?route=addProduct`);
        }

        next();
    } catch (err) {
        return res.redirect(`/unauthorized?route=${encodeURIComponent(req.originalUrl)}`);
    }
};

module.exports = authMiddleware;
