// backend/routes/ai.js
import { Router } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Vacancy from "../models/Vacancy.js";
import Message from "../models/Message.js"; // Optional: for testimonials

const router = Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// POST /api/ai/customer - Answer customer questions with DB data
router.post("/customer", async (req, res) => {
  try {
    const { message } = req.body;

    // Fetch real data from DB
    const vacancies = await Vacancy.find().select("title country salary").limit(10);
    const messages = await Message.find().select("name message").limit(5); // Use as testimonials

    const formattedVacancies = vacancies.length > 0
      ? vacancies.map(v => `- ${v.title} in ${v.country} - Salary: ${v.salary}`).join("\n")
      : "No current job vacancies available.";

    const formattedTestimonials = messages.length > 0
      ? messages.map(m => `- "${m.message}" - ${m.name}`).join("\n")
      : "Many clients have successfully placed abroad with us.";

    // Dynamic company info
    const companyInfo = `
ABC Agencies (PVT) LTD - Sri Lanka's trusted manpower agency with 40+ years of excellence.
Services: Overseas recruitment, visa processing, training for housemaids, nannies, stewards, cooks, caregivers.
Contact: +94 11 234 5678 | riza@gmail.com
Head Office: No: 01, Colombo Road, Narammala, Sri Lanka
Colombo Branch: 123 Galle Road, Colombo 03
Current Job Openings:
${formattedVacancies}

Client Testimonials:
${formattedTestimonials}

Additional Info:
- All staff are trained and certified.
- Visa processing support provided.
- 24/7 customer support available.
    `.trim();

    const prompt = `
You are "Riza", the AI assistant for ABC Agencies (PVT) LTD, a leading Sri Lankan manpower agency with over 40 years of experience.
Answer the user's question clearly, professionally, and based **only** on the information below.

${companyInfo}

User Question: "${message}"
Answer as a helpful, friendly assistant. Keep it concise and accurate.
If you don't have enough information, say: "I don't have enough information to answer that. Please call us at +94 11 234 5678."
    `.trim();

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ reply: text });
  } catch (err) {
    console.error("AI Error:", err);
    res.status(500).json({
      reply: "Sorry, I'm unable to process your request right now. Please call us at +94 11 234 5678."
    });
  }
});

// POST /api/ai/admin - Generate vacancy description
router.post("/admin", async (req, res) => {
  const { title, country, salary } = req.body;

  try {
    const prompt = `
Write a professional and engaging job vacancy description for:
- Job: ${title}
- Country: ${country}
- Salary: ${salary}

Include:
- A welcoming introduction
- Key responsibilities
- Requirements
- Why join ABC Agencies?
Keep it under 150 words, persuasive, and suitable for a global audience.
    `.trim();

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ description: text });
  } catch (err) {
    console.error("AI Generation Error:", err);
    res.status(500).json({ description: "Failed to generate description." });
  }
});

export default router;