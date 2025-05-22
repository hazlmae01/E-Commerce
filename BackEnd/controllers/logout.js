const logout = (req, res) => {
    res.clearCookie("userRegistered");
    return res.json({ status: "success", success: "User has been logged out." });
};

module.exports = logout;
