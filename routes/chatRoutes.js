const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Chat = require("../models/Chat");
const { sendAIResponse } = require("../controllers/aiController");

// Get chat history
router.get("/history", authMiddleware, async (req, res) => {
  try {
    const chat = await Chat.findOne({ userId: req.user });
    res.json(chat || { messages: [] });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Send message
router.post("/send", authMiddleware, async (req, res) => {
  try {
    const userMessage = req.body.message;

    const reply = await sendAIResponse(userMessage);

    const chat = await Chat.findOneAndUpdate(
      { userId: req.user },
      {
        $push: {
          messages: [
            { role: "user", content: userMessage },
            { role: "assistant", content: reply },
          ],
        },
      },
      { upsert: true, new: true }
    );

    res.json(chat);
  } catch (error) {
    res.status(500).json({ message: "AI Error", error: error.message });
  }
});

// Clear history
router.delete("/clear", authMiddleware, async (req, res) => {
  try {
    await Chat.findOneAndDelete({ userId: req.user });
    res.json({ message: "Chat cleared" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
