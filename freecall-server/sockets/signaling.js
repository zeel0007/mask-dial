const { RtcTokenBuilder, RtcRole } = require("agora-access-token");
const onlineUsers = new Map(); // userId -> socketId

const handleSignaling = (io) => {
  io.on("connection", (socket) => {
    console.log(`🔌 New client connected to socket: ${socket.id}`);

    // Register User
    socket.on("register", ({ userId, name }) => {
      if (userId) {
        onlineUsers.set(userId, socket.id);
        // Also register normalized number/email key
        const cleanKey = String(userId).replace(/[\s\-\(\)]/g, "");
        onlineUsers.set(cleanKey, socket.id);
      }
      socket.userId = userId;
      socket.userName = name;
      console.log(`👤 User registered: ${userId} (${name}) -> ${socket.id}`);
      io.emit("users-online", Array.from(onlineUsers.keys()));
    });

    // Initiate Call (Hybrid Agora / PSTN)
    socket.on("call-user", ({ to, offer, from, name, number, callType }) => {
      const cleanTarget = String(to).replace(/[\s\-\(\)]/g, "");
      const targetSocketId = onlineUsers.get(to) || onlineUsers.get(cleanTarget);

      if (targetSocketId) {
        // Generate Agora Channel & Token for Online Recipient
        const channelName = `call_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
        const appId = process.env.AGORA_APP_ID || "bc1ffe247f1240f299dfb12d58c551a1";
        const appCertificate = process.env.AGORA_APP_CERTIFICATE || "";

        let agoraToken = null;
        if (appCertificate) {
          try {
            const expirationTimeInSeconds = 3600;
            const currentTimestamp = Math.floor(Date.now() / 1000);
            const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;
            agoraToken = RtcTokenBuilder.buildTokenWithUid(
              appId,
              appCertificate,
              channelName,
              0,
              RtcRole.PUBLISHER,
              privilegeExpiredTs
            );
          } catch (e) {
            console.warn("Agora token build fallback:", e.message);
          }
        }

        console.log(`🚀 Routing IN-APP AGORA CALL to online user ${to} on channel ${channelName}`);

        // Send Agora info to Caller
        socket.emit("call-initiated", {
          mode: "agora",
          channelName,
          token: agoraToken,
          appId,
        });

        // Ring Recipient
        io.to(targetSocketId).emit("incoming-call", {
          from: from || socket.userId,
          offer,
          callerName: name || socket.userName || "Unknown Caller",
          callerNumber: number || "",
          mode: "agora",
          channelName,
          token: agoraToken,
          appId,
        });
      } else {
        // Recipient is Offline -> Inform client to execute Twilio PSTN Fallback
        console.log(`📡 Recipient ${to} is OFFLINE -> Routing via TWILIO PSTN Fallback`);
        socket.emit("call-routing-pstn", {
          to,
          reason: "Recipient is offline, routing call to GSM mobile network",
        });
      }
    });

    // Answer Call
    socket.on("answer-call", ({ to, answer, channelName }) => {
      const cleanTarget = String(to).replace(/[\s\-\(\)]/g, "");
      const targetSocketId = onlineUsers.get(to) || onlineUsers.get(cleanTarget);
      if (targetSocketId) {
        io.to(targetSocketId).emit("call-answered", { answer, channelName });
      }
    });

    // Exchange ICE Candidates (WebRTC fallback)
    socket.on("ice-candidate", ({ to, candidate }) => {
      const cleanTarget = String(to).replace(/[\s\-\(\)]/g, "");
      const targetSocketId = onlineUsers.get(to) || onlineUsers.get(cleanTarget);
      if (targetSocketId) {
        io.to(targetSocketId).emit("ice-candidate", { candidate });
      }
    });

    // End Call
    socket.on("end-call", ({ to }) => {
      const cleanTarget = String(to).replace(/[\s\-\(\)]/g, "");
      const targetSocketId = onlineUsers.get(to) || onlineUsers.get(cleanTarget);
      if (targetSocketId) {
        io.to(targetSocketId).emit("call-ended");
      }
    });

    // Disconnect
    socket.on("disconnect", () => {
      console.log(`❌ Client disconnected: ${socket.id}`);
      if (socket.userId) {
        onlineUsers.delete(socket.userId);
        const cleanKey = String(socket.userId).replace(/[\s\-\(\)]/g, "");
        onlineUsers.delete(cleanKey);
        io.emit("users-online", Array.from(onlineUsers.keys()));
      }
    });
  });
};

module.exports = handleSignaling;
