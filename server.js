// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("AI Chatbot backend is running");
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/chat", require("./routes/chatRoutes"));

// Connect DB and start server
const PORT = process.env.PORT || 10000;

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});
