const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    role: {
      type: String, 
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
      type: String,     
      required: true,
    },
    messages: [messageSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chat", chatSchema);
