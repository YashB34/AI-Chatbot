const express = require("express");
const { sendMessage, getChatHistory } = require("../controllers/chatController");
const authMiddleware = require("../middleware/authMiddleware");
const Chat = require("../models/Chat");

const router = express.Router();

router.post("/send", authMiddleware, sendMessage);
router.get("/history", authMiddleware, getChatHistory);

// CLEAR CHAT (fix)
router.delete("/clear", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    await Chat.findOneAndDelete({ user: userId });

    return res.json({ message: "Chat cleared" });
  } catch (err) {
    console.error("Clear Chat Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
