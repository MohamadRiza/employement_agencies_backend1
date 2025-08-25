// backend/routes/applications.js
import { Router } from "express";
import {
  createApplication,
  getAllApplications,
  getVacancyTypes,
} from "../controllers/applications.js";
import protect from "../middleware/authMiddleware.js";

const router = Router();

router.post("/", createApplication);
router.get("/vacancies", getVacancyTypes);

// 🔐 Protected route
router.get("/", protect, getAllApplications); // Only admin can access

export default router;