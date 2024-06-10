const jwt = require("jsonwebtoken");
const config = require("../config");

function verifyToken(req, res, next) {
  const header = req.header("Authorization");
  if (!header)
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });

  const parts = header.split(" ");
  if (parts.length === 2 && parts[0] === "Bearer") {
    try {
      const decoded = jwt.verify(parts[1], config.JWT_SECRET);
      req.userId = decoded.userId;
      next();
    } catch (error) {
      res.status(401).json({ message: "Invalid token." });
    }
  } else {
    res
      .status(401)
      .json({ message: "Token format is incorrect. Use 'Bearer <token>'." });
  }
}

module.exports = verifyToken;
