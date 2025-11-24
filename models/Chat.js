// models/Chat.js
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    role: {
      type: String, // "user" or "ai"
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const chatSchema = new mongoose.Schema(
  {
    user: {
      type: String,   // <-- IMPORTANT: string, not ObjectId
      required: true,
    },
    messages: [messageSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chat", chatSchema);
