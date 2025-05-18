const jwt = require("jsonwebtoken");
const db = require("../DB/db-config");

const login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.json({ status: "error", error: "Please enter your username and password." });
    }

    db.query('SELECT * FROM users WHERE name = ?', [username], (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.json({ status: "error", error: "Database error during login." });
        }

        const user = result[0];

        if (!user || user.password !== password) {
            return res.json({ status: "error", error: "Incorrect username or password." });
        }

        const token = jwt.sign({ id: user.user_id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES, 
        });

        const cookieExpiryDays = Number(process.env.COOKIE_EXPIRES) || 1;

        const cookieOptions = {
            expires: new Date(Date.now() + cookieExpiryDays * 24 * 60 * 60 * 1000),
            httpOnly: true,
        };

        // Set cookie
        res.cookie("userRegistered", token, cookieOptions);

        return res.json({ status: "success", success: "User has been logged in" });
    });
};

module.exports = login;
