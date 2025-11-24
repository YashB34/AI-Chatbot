const express = require("express");
const router = express.Router();
const { sendMessage, getChatHistory } = require("../controllers/chatController");

// NO AUTH → Public mode
// If you want login-system then add authMiddleware again

// Get chat history
router.get("/history", async (req, res) => {
  try {
    await getChatHistory(req, res);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Send message
router.post("/send", async (req, res) => {
  try {
    await sendMessage(req, res);
  } catch (error) {
    res.status(500).json({ message: "AI Error", error: error.message });
  }
});

// Clear chat (for new chat)
router.delete("/clear", async (req, res) => {
  try {
    const Chat = require("../models/Chat");
    await Chat.findOneAndDelete({ user: "public-user" });
    res.json({ message: "Chat cleared" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
