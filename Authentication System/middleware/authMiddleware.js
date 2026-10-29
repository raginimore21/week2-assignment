
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const RevokedToken = require("../models/RevokedToken");

async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Please log in first."
      });
    }

    const token = authHeader.slice(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Reject tokens that have been revoked by logout.
    const revoked = await RevokedToken.exists({ token });

    if (revoked) {
      return res.status(401).json({
        message: "Session has been logged out. Please log in again."
      });
    }

    const user = await User.findById(decoded.sub);

    if (!user) {
      return res.status(401).json({
        message: "User not found."
      });
    }

    req.user = {
      id: user._id,
      username: user.username,
      email: user.email
    };

    req.token = token;
    req.tokenExpiresAt = new Date(decoded.exp * 1000);

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token."
    });
  }
}

module.exports = authMiddleware;
