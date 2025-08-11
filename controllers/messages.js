// backend/controllers/messages.js
import Message from "../models/Message.js";

// POST /api/messages
export const createMessage = async (req, res) => {
  try {
    const message = await Message.create(req.body);
    res.status(201).json({
      success: true,
      data: message,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// GET /api/messages (Admin route)
export const getAllMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
 
// DELETE /api/messages/:id
export const deleteMessage = async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Message deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};