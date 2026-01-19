const jwt = require("jsonwebtoken");
require("dotenv").config();

function authenticateToken(req, res, next) {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
      return res.status(401).json({
        message: "Authorization header missing"
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "JWT token missing"
      });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({
          message: "Invalid or expired token"
        });
      }

      req.user = decoded;
      next();
    });

  } catch (error) {
    return res.status(500).json({
      message: "Authentication failed"
    });
  }
}

module.exports = authenticateToken;
