// controllers/chatController.js
const Chat = require("../models/Chat");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// AI Setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// safe model name
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const PUBLIC_USER_ID = "public-user";

// SEND MESSAGE
exports.sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = PUBLIC_USER_ID;

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    // AI Reply
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: message }] }],
    });

    const aiReply = result.response.text();

    // Find existing chat or create new
    let chat = await Chat.findOne({ user: userId });
    if (!chat) {
      chat = await Chat.create({
        user: userId,
        messages: [],
      });
    }

    chat.messages.push({ role: "user", content: message });
    chat.messages.push({ role: "ai", content: aiReply });

    await chat.save();

    res.json({
      reply: aiReply,
      messages: chat.messages,
    });
  } catch (err) {
    console.error("AI Error:", err);
    res.status(500).json({ message: "AI server error" });
  }
};

// GET HISTORY
exports.getChatHistory = async (req, res) => {
  try {
    const userId = PUBLIC_USER_ID;
    const chat = await Chat.findOne({ user: userId });

    if (!chat) {
      return res.json({ messages: [] });
    }

    res.json({ messages: chat.messages });
  } catch (err) {
    console.error("Chat history error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// CLEAR CHAT (for New Chat)
exports.clearChatHistory = async (req, res) => {
  try {
    const userId = PUBLIC_USER_ID;
    const chat = await Chat.findOne({ user: userId });

    if (chat) {
      chat.messages = [];
      await chat.save();
    }

    res.json({ message: "Chat cleared" });
  } catch (err) {
    console.error("Clear chat error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
