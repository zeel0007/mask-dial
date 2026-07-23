const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    // Attach default dev guest user if no token provided
    req.user = { id: "guest_user", email: "guest@example.com", name: "Guest User" };
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "freecall_secret_key");
    req.user = decoded;
    next();
  } catch (err) {
    // Fallback to guest user on expired/invalid token
    req.user = { id: "guest_user", email: "guest@example.com", name: "Guest User" };
    next();
  }
};

module.exports = authMiddleware;
