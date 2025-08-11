// backend/routes/admin.js
import { Router } from "express";
import Admin from "../models/Admin.js";
import jwt from "jsonwebtoken";
import protect from "../middleware/authMiddleware.js";

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || "abc123secret";

// POST /api/admin/login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await admin.matchPassword(password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: admin._id }, JWT_SECRET, { expiresIn: "1h" }); //expiry time admin credentials

    res.json({ token, admin: { username: admin.username } });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/admin/profile (protected)
router.get("/profile", protect, async (req, res) => {
  res.json({ admin: req.admin });
});

// PUT /api/admin/password (protected)
router.put("/password", protect, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const admin = await Admin.findById(req.admin.id);
    const isMatch = await admin.matchPassword(currentPassword);
    if (!isMatch) return res.status(401).json({ message: "Current password is incorrect" });

    admin.password = newPassword;
    await admin.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;