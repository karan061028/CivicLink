// 🟢 PROTECT ROUTES
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // 🔥 ADD THIS

const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ msg: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔥 FETCH FULL USER FROM DB
    const user = await User.findById(decoded.id).select("-password");

    req.user = user; // ✅ now includes flatNumber

    next();
  } catch (error) {
    return res.status(401).json({ msg: "Invalid token" });
  }
};
// 🟢 ROLE BASED AUTHORIZATION
const authorize = (...roles) => {
  return (req, res, next) => {

    // 🔥 STEP 1: Check if user exists
    if (!req.user) {
      return res.status(401).json({ msg: "Not authenticated" });
    }

    // 🔥 STEP 2: Check role
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ msg: "Access denied" });
    }

    next();
  };
};
module.exports = { protect, authorize };