// backend/controllers/applications.js
import Application from "../models/Application.js";
import Vacancy from "../models/Vacancy.js";

export const createApplication = async (req, res) => {
  try {
    const application = await Application.create(req.body);
    res.status(201).json({
      success: true,
      data: application,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// GET /api/applications/vacancies - Get unique job titles from vacancies
export const getVacancyTypes = async (req, res) => {
  try {
    const vacancies = await Vacancy.find().select("title");
    const titles = [...new Set(vacancies.map(v => v.title))];
    res.status(200).json({ success: true, data: titles });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to load job types" });
  }
};