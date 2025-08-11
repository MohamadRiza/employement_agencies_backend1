// backend/middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

const protect = async (req, res, next) => {
  let token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Not authorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "abc123secret");
    req.admin = await Admin.findById(decoded.id).select("-password");
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

export default protect;