// backend/routes/messages.js
import { Router } from "express";
import { createMessage, getAllMessages } from "../controllers/messages.js";

const router = Router();

router.route("/").post(createMessage);
router.route("/").get(getAllMessages); // Protected later if needed

export default router;