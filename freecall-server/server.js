const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const handleSignaling = require("./sockets/signaling");
const authRoutes = require("./routes/authRoutes");
const callRoutes = require("./routes/callRoutes");

const app = express();
const server = http.createServer(app);

// Connect Database
connectDB();

// Middleware
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/calls", callRoutes);

app.get("/", (req, res) => {
  res.json({ status: "FreeCall Signaling & API Server is active 📞", timestamp: new Date() });
});

// Socket.io Server Setup
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Initialize Socket WebRTC Signaling
handleSignaling(io);

const INITIAL_PORT = Number(process.env.PORT) || 5001;

const startServer = (port) => {
  server.listen(port, () => {
    console.log(`🚀 FreeCall server listening on port ${port}`);
  }).on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      const nextPort = Number(port) + 1;
      console.log(`⚠️ Port ${port} is busy, trying port ${nextPort}...`);
      startServer(nextPort);
    } else {
      console.error("Server error:", err);
    }
  });
};

startServer(INITIAL_PORT);
