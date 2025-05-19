const db = require("../DB/db-config");

const register = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        if (!username || !email || !password || !role) {
            return res.json({ status: "error", error: "Please enter your username, email, password, and role." });
        }

        // Check if email already exists
        const [existingUsers] = await db.query('SELECT email FROM users WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            return res.json({ status: "error", error: "Email has already been registered." });
        }

        // Insert new user
        await db.query(
            'INSERT INTO users SET ?',
            { name: username, email: email, password: password, role: role }
        );

        return res.json({ status: "success", success: "User has been registered!" });
    } catch (err) {
        console.error(err);
        return res.json({ status: "error", error: "Database error during registration." });
    }
};

module.exports = register;
