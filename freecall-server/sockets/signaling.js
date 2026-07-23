const onlineUsers = new Map(); // userId -> socketId

const handleSignaling = (io) => {
  io.on("connection", (socket) => {
    console.log(`🔌 New client connected to socket: ${socket.id}`);

    // Register User
    socket.on("register", ({ userId, name }) => {
      onlineUsers.set(userId, socket.id);
      socket.userId = userId;
      socket.userName = name;
      console.log(`👤 User registered: ${userId} (${name}) -> ${socket.id}`);
      io.emit("users-online", Array.from(onlineUsers.keys()));
    });

    // Initiate Call (Offer)
    socket.on("call-user", ({ to, offer, from, name, number }) => {
      const targetSocketId = onlineUsers.get(to);
      if (targetSocketId) {
        io.to(targetSocketId).emit("incoming-call", {
          from: from || socket.userId,
          offer,
          callerName: name || socket.userName || "Unknown Caller",
          callerNumber: number || "",
        });
      } else {
        socket.emit("call-failed", { reason: "User is offline or unavailable" });
      }
    });

    // Answer Call
    socket.on("answer-call", ({ to, answer }) => {
      const targetSocketId = onlineUsers.get(to);
      if (targetSocketId) {
        io.to(targetSocketId).emit("call-answered", { answer });
      }
    });

    // Exchange ICE Candidates
    socket.on("ice-candidate", ({ to, candidate }) => {
      const targetSocketId = onlineUsers.get(to);
      if (targetSocketId) {
        io.to(targetSocketId).emit("ice-candidate", { candidate });
      }
    });

    // End Call
    socket.on("end-call", ({ to }) => {
      const targetSocketId = onlineUsers.get(to);
      if (targetSocketId) {
        io.to(targetSocketId).emit("call-ended");
      }
    });

    // Disconnect
    socket.on("disconnect", () => {
      console.log(`❌ Client disconnected: ${socket.id}`);
      if (socket.userId) {
        onlineUsers.delete(socket.userId);
        io.emit("users-online", Array.from(onlineUsers.keys()));
      }
    });
  });
};

module.exports = handleSignaling;
