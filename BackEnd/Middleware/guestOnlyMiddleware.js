const jwt = require("jsonwebtoken");

const guestOnlyMiddleware = (req, res, next) => {
    const token = req.cookies.userRegistered;

    if (!token) {
        // No token, allow access to guest routes
        return next();
    }

    // Verify token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return next(); // Invalid token, treat as guest
        }

        // User is logged in, redirect to homePage
        return res.redirect("/homePage");
    });
};

module.exports = guestOnlyMiddleware;
