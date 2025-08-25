// backend/models/Application.js
import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    dob: { type: Date, required: true },
    age: { type: Number, required: true },
    email: { type: String },
    mobile: { type: String, required: true },
    addressLine1: { type: String, required: true },
    addressLine2: { type: String },
    city: { type: String, required: true },
    isSriLankanResident: { type: Boolean, required: true },
    workExperience: {
      type: String,
      enum: ["No Experience", "Below 6 months", "1 Year", "2+ Years"],
      required: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Prefer not to say"],
      required: true,
    },
    languages: { type: String, required: true }, // Comma-separated
    isSriLankanPassportHolder: { type: Boolean, required: true },
    applyingFor: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Application", applicationSchema);