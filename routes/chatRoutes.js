
const express = require("express");
const { sendMessage, getChatHistory } = require("../controllers/chatController");
// const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Protected routes
router.post("/send",  sendMessage);
router.get("/history",  getChatHistory);

module.exports = router;
