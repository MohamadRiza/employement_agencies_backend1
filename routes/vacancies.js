// backend/routes/vacancies.js
import { Router } from "express";
import protect from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";
import Vacancy from "../models/Vacancy.js";

const router = Router();

/**
 * POST /api/vacancies
 * @access Admin only
 * @desc Create a new vacancy
 */
router.post("/", protect, upload.single("image"), async (req, res) => {
  try {
    const { title, country, salary, description } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const vacancy = new Vacancy({
      title,
      country,
      salary,
      description,
      imageUrl: req.file.path,
      imagePublicId: req.file.filename,
    });

    const saved = await vacancy.save();
    res.status(201).json({
      success: true,
      data: saved,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/**
 * GET /api/vacancies
 * @access Public (or protect if you want)
 * @desc Get all vacancies (latest first)
 */
router.get("/", async (req, res) => {
  try {
    const vacancies = await Vacancy.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: vacancies.length,
      data: vacancies,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

/**
 * GET /api/vacancies/:id
 * @access Public
 * @desc Get single vacancy by ID
 */
router.get("/:id", async (req, res) => {
  try {
    const vacancy = await Vacancy.findById(req.params.id);
    if (!vacancy) {
      return res.status(404).json({ message: "Vacancy not found" });
    }
    res.status(200).json({
      success: true,
      data: vacancy,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

/**
 * PUT /api/vacancies/:id
 * @access Admin only
 * @desc Update a vacancy (with optional new image)
 */
router.put("/:id", protect, upload.single("image"), async (req, res) => {
  try {
    const { title, country, salary, description } = req.body;

    let vacancy = await Vacancy.findById(req.params.id);
    if (!vacancy) {
      return res.status(404).json({ message: "Vacancy not found" });
    }

    // If new image uploaded, delete old one from Cloudinary
    if (req.file) {
      const cloudinary = require("../config/cloudinary");
      await cloudinary.uploader.destroy(vacancy.imagePublicId);
      vacancy.imageUrl = req.file.path;
      vacancy.imagePublicId = req.file.filename;
    }

    // Update fields
    vacancy.title = title || vacancy.title;
    vacancy.country = country || vacancy.country;
    vacancy.salary = salary || vacancy.salary;
    vacancy.description = description || vacancy.description;

    const updated = await vacancy.save();
    res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/**
 * DELETE /api/vacancies/:id
 * @access Admin only
 * @desc Delete a vacancy (and image from Cloudinary)
 */
router.delete("/:id", protect, async (req, res) => {
  try {
    const vacancy = await Vacancy.findById(req.params.id);
    if (!vacancy) {
      return res.status(404).json({ message: "Vacancy not found" });
    }

    // Delete image from Cloudinary
    const cloudinary = require("../config/cloudinary");
    await cloudinary.uploader.destroy(vacancy.imagePublicId);

    // Delete from DB
    await Vacancy.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Vacancy deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

export default router;