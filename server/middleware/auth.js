const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = async (req, res, next) => {
  try {
    // Try to get token from Authorization header first, then from cookies
    let token = req.header("Authorization")?.replace("Bearer ", "");

    // If no token in header, check cookies for both possible cookie names
    if (!token && req.cookies) {
      token = req.cookies["auth-token"] || req.cookies["token"];
    }

    if (!token) {
      return res
        .status(401)
        .json({ error: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user || !user.isActive) {
      return res
        .status(401)
        .json({ error: "Invalid token or user not found." });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token." });
  }
};

const sellerAuth = async (req, res, next) => {
  try {
    await auth(req, res, () => {
      if (req.user.role !== "seller") {
        return res
          .status(403)
          .json({ error: "Access denied. Seller privileges required." });
      }
      next();
    });
  } catch (error) {
    res.status(403).json({ error: "Authorization failed." });
  }
};

module.exports = { auth, sellerAuth };
