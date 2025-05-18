const db = require("../DB/db-config");

const register = async (req, res) => {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password || !role) {
        return res.json({ status: "error", error: "Please enter your username, email, password, and role." });
    }

    db.query('SELECT email FROM users WHERE email = ?', [email], (err, result) => {
        if (err) {
            console.error(err);
            return res.json({ status: "error", error: "Database error during email check." });
        }

        if (result.length > 0) {
            return res.json({ status: "error", error: "Email has already been registered." });
        } else {
            db.query(
                'INSERT INTO users SET ?',
                { name: username, email: email, password: password, role: role },
                (error, results) => {
                    if (error) {
                        console.error(error);
                        return res.json({ status: "error", error: "Database error during registration." });
                    }

                    return res.json({ status: "success", success: "User has been registered!" });
                }
            );
        }
    });
};

module.exports = register;
