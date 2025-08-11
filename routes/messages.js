// backend/routes/messages.js
import { Router } from "express";
import { createMessage, deleteMessage, getAllMessages } from "../controllers/messages.js";

const router = Router();

router.route("/").post(createMessage);
router.route("/").get(getAllMessages); // Protected later if needed
router.route("/:id").delete(deleteMessage);

export default router;