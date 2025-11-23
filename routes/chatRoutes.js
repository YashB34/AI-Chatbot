
const express = require("express");
const { sendMessage, getChatHistory } = require("../controllers/chatController");
// const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Protected routes
router.post("/send",  sendMessage);
router.get("/history",  getChatHistory);

router.delete("/clear", async (req, res) => {
  try {
    const userId = req.userId;
    await Chat.findOneAndDelete({ user: userId });
    return res.json({ message: "Chat cleared" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
