const jwt = require("jsonwebtoken");

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
};

module.exports = guestOnlyMiddleware;
