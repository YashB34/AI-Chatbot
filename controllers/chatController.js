const Chat = require("../models/Chat");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// AI Setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash"});


exports.sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.userId;

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

  //  AI Reply 
 const result = await model.generateContent({
  contents: [{ role: "user", parts: [{ text: message }] }]
});

const aiReply = result.response.text();


    // chat or create new
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


exports.getChatHistory = async (req, res) => {
  try {
    const userId = req.userId;

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
