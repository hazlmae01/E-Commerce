const jwt = require("jsonwebtoken");

const guestOnlyMiddleware = (req, res, next) => {
  const token = req.cookies.userRegistered;

  if (!token) return next();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // If verified and has an id, assume authenticated
    if (decoded?.id) return res.redirect("/homePage");
    return next();
  } catch (err) {
    // Invalid token, continue as guest
    return next();
  }
};

module.exports = guestOnlyMiddleware;
