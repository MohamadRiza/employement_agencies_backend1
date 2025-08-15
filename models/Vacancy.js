// backend/models/Vacancy.js
import mongoose from "mongoose";

const vacancySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    salary: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    imagePublicId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Adds createdAt & updatedAt
  }
);

export default mongoose.model("Vacancy", vacancySchema);