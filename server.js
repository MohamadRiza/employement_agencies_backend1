import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors"; // ← Import cors

import messageRoutes from "./routes/messages.js";

dotenv.config();

const app = express();

// ✅ Enable CORS - Must be before any routess
app.use(cors({
  origin: "https://employement-agencies.vercel.app", // Your Vite app
  credentials: true,
}));

// Middleware
app.use(express.json()); // Parse JSON

// Routes
app.use("/api/messages", messageRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("ABC Agencies API is running...");
});

// Error handling middleware (optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Connect DB & Start Server
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log("❌ DB Connection Error:", err);
  });