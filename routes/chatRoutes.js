const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Chat = require("../models/Chat");

// Get History
router.get("/history", authMiddleware, async (req, res) => {
  try {
    let chat = await Chat.findOne({ userId: req.user.id });

    if (!chat) return res.json({ messages: [] });

    res.json({ messages: chat.messages });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Send message
router.post("/send", authMiddleware, async (req, res) => {
  try {
    let chat = await Chat.findOne({ userId: req.user.id });
    if (!chat) chat = await Chat.create({ userId: req.user.id, messages: [] });

    chat.messages.push({ role: "user", content: req.body.message });
    chat.messages.push({ role: "assistant", content: "AI Reply..." });

    await chat.save();
    res.json({ messages: chat.messages });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// CLEAR CHAT HISTORY
router.delete("/clear", authMiddleware, async (req, res) => {
  try {
    let chat = await Chat.findOne({ userId: req.user.id });
    if (!chat) return res.json({ message: "Already empty" });

    chat.messages = [];
    await chat.save();

    res.json({ message: "Chat cleared" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
