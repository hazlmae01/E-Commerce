const jwt = require("jsonwebtoken");
const db = require("../DB/db-config");

const authMiddleware = (req, res, next) => {
    const token = req.cookies.userRegistered;

    if (!token) {
        return res.redirect(`/unauthorized?route=${encodeURIComponent(req.originalUrl)}`);
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.redirect(`/unauthorized?route=${encodeURIComponent(req.originalUrl)}`);
        }

        db.query("SELECT * FROM users WHERE user_id = ?", [decoded.id], (err, results) => {
            if (err || results.length === 0) {
                return res.redirect(`/unauthorized?route=${encodeURIComponent(req.originalUrl)}`);
            }

            const user = results[0];
            req.user = user;  
            if (req.originalUrl.startsWith("/addProduct") && user.role !== "admin") {
                return res.redirect(`/unauthorized?route=addProduct`);
            }


            next();
        });
    });
};

module.exports = authMiddleware;
