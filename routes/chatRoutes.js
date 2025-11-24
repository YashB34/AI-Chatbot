// routes/chatRoutes.js
const express = require("express");
const router = express.Router();
const {
  sendMessage,
  getChatHistory,
  clearChatHistory,
} = require("../controllers/chatController");

// get history
router.get("/history", getChatHistory);

// send message
router.post("/send", sendMessage);

// clear history
router.delete("/clear", clearChatHistory);

module.exports = router;
