// backend/utils/turnstile.js
import axios from "axios";

export const verifyTurnstile = async (token) => {
  try {
    const response = await axios.post(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      null,
      {
        params: {
          secret: process.env.TURNSTILE_SECRET_KEY,
          response: token,
        },
      }
    );
    return response.data.success;
  } catch (err) {
    console.error("Turnstile verification error:", err.message);
    return false;
  }
};