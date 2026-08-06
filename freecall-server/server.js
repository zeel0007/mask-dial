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

const path = require("path");

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/calls", callRoutes);

// Serve React Frontend static build files
const distPath = path.join(__dirname, "../freecall-app/dist");
app.use(express.static(distPath));

// SPA Fallback Route for non-API requests
app.use((req, res, next) => {
  if (req.method === "GET" && !req.path.startsWith("/api")) {
    return res.sendFile(path.join(distPath, "index.html"));
  }
  next();
});

// Socket.io Server Setup
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.set("io", io);

// Initialize Socket WebRTC Signaling
handleSignaling(io);

const INITIAL_PORT = Number(process.env.PORT) || 5001;

const startServer = (port) => {
  server.listen(port, "0.0.0.0", () => {
    console.log(`🚀 FreeCall server listening on 0.0.0.0:${port}`);
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
