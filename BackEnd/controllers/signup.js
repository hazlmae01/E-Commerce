const db = require("../DB/db-config");

const register = async (req, res) => {
    try {
        const { username, email, password, role_id } = req.body;

        if (!username || !email || !password || !role_id) {
            return res.json({ status: "error", error: "Please enter your username, email, password, and role ID." });
        }

        const [existingUsers] = await db.query('SELECT email FROM users WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            return res.json({ status: "error", error: "Email has already been registered." });
        }

        await db.query(
            'INSERT INTO users SET ?',
            { name: username, email, password, role_id }
        );

        return res.json({ status: "success", success: "User has been registered!" });
    } catch (err) {
        console.error(err);
        return res.json({ status: "error", error: "Database error during registration." });
    }
};

module.exports = register;
