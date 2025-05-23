const jwt = require("jsonwebtoken");

<<<<<<< HEAD
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
=======
const guestOnlyMiddleware = async (req, res, next) => {
  const token = req.cookies.userRegistered;

  if (!token) {
    return next();
  }

  try {
    await new Promise((resolve, reject) => {
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) reject(err);
        else resolve(decoded);
      });
    });
    return res.redirect("/homePage");
  } catch {
    return next();
  }
>>>>>>> 49e592c93bc85cd00e96c96f95ee4397fec3f2d1
};

module.exports = guestOnlyMiddleware;
