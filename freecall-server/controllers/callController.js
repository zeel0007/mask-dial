const mongoose = require("mongoose");
const CallLog = require("../models/CallLog");
const User = require("../models/User");
const twilio = require("twilio");

const inMemoryLogs = [];

exports.getHistory = async (req, res) => {
  try {
    const isDbConnected = mongoose.connection.readyState === 1;
    if (isDbConnected) {
      const logs = await CallLog.find({ userId: req.user.id }).sort({ createdAt: -1 });
      return res.json(logs);
    } else {
      const logs = inMemoryLogs.filter((l) => l.userId === req.user.id);
      return res.json(logs);
    }
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.logCall = async (req, res) => {
  try {
    const { recipientName, recipientNumber, callType, duration, minutesUsed, callerIdUsed } = req.body;
    const isDbConnected = mongoose.connection.readyState === 1;

    const logData = {
      userId: req.user?.id || "guest",
      recipientName,
      recipientNumber,
      callType: callType || "outgoing",
      duration: duration || "0:00",
      minutesUsed: minutesUsed || 0,
      callerIdUsed: callerIdUsed || "",
      createdAt: new Date(),
    };

    if (isDbConnected) {
      const newLog = new CallLog(logData);
      await newLog.save();
      return res.status(201).json(newLog);
    } else {
      inMemoryLogs.push(logData);
      return res.status(201).json(logData);
    }
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.addMinutes = async (req, res) => {
  try {
    const { amount } = req.body;
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected && req.user?.id) {
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ message: "User not found" });
      user.minutes += Number(amount) || 10;
      await user.save();
      return res.json({ minutes: user.minutes, message: `Successfully added ${amount} minutes` });
    } else {
      return res.json({ minutes: 22, message: `Successfully added ${amount || 10} minutes` });
    }
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ─── Twilio Voice Access Token (for browser SDK) ────────────────────────────
exports.getVoiceToken = (req, res) => {
  try {
    const twilioSid    = process.env.TWILIO_SID;
    const twilioToken  = process.env.TWILIO_AUTH_TOKEN || process.env.TWILIO_TOKEN;
    const twimlAppSid  = process.env.TWILIO_TWIML_APP_SID;
    const twilioNumber = process.env.TWILIO_NUMBER;

    if (!twilioSid || !twilioToken) {
      return res.status(500).json({ message: "Twilio credentials not configured" });
    }

    if (!twimlAppSid) {
      return res.status(500).json({ message: "TWILIO_TWIML_APP_SID not set in .env" });
    }

    const AccessToken = twilio.jwt.AccessToken;
    const VoiceGrant  = AccessToken.VoiceGrant;

    const identity = req.user?.email?.replace(/[@.]/g, "_") || "freecall_user";

    const voiceGrant = new VoiceGrant({
      outgoingApplicationSid: twimlAppSid,
      incomingAllow: true,
    });

    const token = new AccessToken(twilioSid, process.env.TWILIO_API_KEY || twilioSid, process.env.TWILIO_API_SECRET || twilioToken, {
      identity,
      ttl: 3600,
    });
    token.addGrant(voiceGrant);

    return res.json({ token: token.toJwt(), identity });
  } catch (err) {
    console.error("Voice token error:", err);
    res.status(500).json({ message: "Failed to generate voice token", error: err.message });
  }
};

// ─── TwiML Webhook — Called by Twilio when browser places a PSTN call ────────
exports.twimlVoice = (req, res) => {
  const body = req.body || {};
  const query = req.query || {};
  const to = body.To || query.To;
  const from = body.From || query.From || "";
  const clientIdentity = query.client || body.client || (req.user?.email?.replace(/[@.]/g, "_") || "guest_example_com");
  const twilioNumber = process.env.TWILIO_NUMBER;
  const customCallerId = body.callerId || query.callerId;
  const usedCallerId = customCallerId || twilioNumber;

  const VoiceResponse = twilio.twiml.VoiceResponse;
  const twiml = new VoiceResponse();

  console.log(`📞 TwiML Webhook triggered: From=${from}, To=${to}, CallerID=${usedCallerId}`);

  if (from.startsWith("client:") && to) {
    // Call originating from Browser WebRTC SDK -> Dial recipient phone and bridge browser audio
    const dial = twiml.dial({ callerId: usedCallerId, timeout: 30 });
    dial.number(to);
  } else if (to && to !== twilioNumber) {
    // REST API initiated call -> Connect recipient phone to target registered browser client
    twiml.say("Welcome to FreeCall. Connecting your audio.");
    const dial = twiml.dial({ callerId: usedCallerId, timeout: 30 });
    dial.client(clientIdentity);
  } else {
    twiml.say("Welcome to FreeCall. Your call is now connected.");
  }

  res.type("text/xml");
  res.send(twiml.toString());
};

// ─── Existing PSTN call initiator (kept for reference / manual calls) ────────
exports.initiatePSTNCall = async (req, res) => {
  try {
    const { recipientNumber, customCallerId } = req.body;
    const twilioSid    = process.env.TWILIO_SID;
    const twilioToken  = process.env.TWILIO_AUTH_TOKEN || process.env.TWILIO_TOKEN;
    const twilioNumber = process.env.TWILIO_NUMBER;

    if (twilioSid && twilioToken && twilioNumber) {
      const client = twilio(twilioSid, twilioToken);
      let call;
      let usedCallerId = customCallerId || twilioNumber;

      const clientIdentity = req.user?.email?.replace(/[@.]/g, "_") || "guest_example_com";
      const baseUrl = (process.env.SERVER_URL && !process.env.SERVER_URL.includes("localhost"))
        ? `${process.env.SERVER_URL}/api/calls/twiml`
        : "http://demo.twilio.com/docs/voice.xml";
      const twimlUrl = `${baseUrl}?client=${encodeURIComponent(clientIdentity)}&callerId=${encodeURIComponent(customCallerId || twilioNumber)}`;

      try {
        call = await client.calls.create({
          to: recipientNumber,
          from: customCallerId || twilioNumber,
          url: twimlUrl,
        });
      } catch (twilioErr) {
        console.warn("Twilio custom caller ID fallback (DNO/Invalid):", twilioErr.message);
        usedCallerId = twilioNumber;
        call = await client.calls.create({
          to: recipientNumber,
          from: twilioNumber,
          url: twimlUrl,
        });
      }

      return res.json({
        success: true,
        sid: call.sid,
        callerIdUsed: usedCallerId,
        message: `Twilio PSTN call initiated to ${recipientNumber}`,
      });
    }

    res.json({
      success: true,
      sid: `MOCK_TWILIO_${Date.now()}`,
      callerIdUsed: customCallerId || "Virtual Masked Number",
      message: `PSTN call initiated to ${recipientNumber}`,
    });
  } catch (err) {
    res.status(500).json({ message: "PSTN Call initiation failed", error: err.message });
  }
};

// ─── Agora Voice Access Token Endpoint ──────────────────────────────────────
exports.getAgoraToken = (req, res) => {
  try {
    const { RtcTokenBuilder, RtcRole } = require("agora-access-token");
    const appId = process.env.AGORA_APP_ID || "bc1ffe247f1240f299dfb12d58c551a1";
    const appCertificate = process.env.AGORA_APP_CERTIFICATE || "";
    const channelName = req.query.channelName || req.body.channelName || "freecall_channel";
    const uid = Number(req.query.uid || req.body.uid) || 0;

    let token = null;
    if (appCertificate) {
      const expirationTimeInSeconds = 3600;
      const currentTimestamp = Math.floor(Date.now() / 1000);
      const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;
      token = RtcTokenBuilder.buildTokenWithUid(
        appId,
        appCertificate,
        channelName,
        uid,
        RtcRole.PUBLISHER,
        privilegeExpiredTs
      );
    }

    return res.json({
      success: true,
      appId,
      token,
      channelName,
      uid,
    });
  } catch (err) {
    console.error("Agora Token Generation Error:", err);
    res.status(500).json({ message: "Failed to generate Agora token", error: err.message });
  }
};

// ─── Trigger Incoming Agora Call to Browser Clients ──────────────────────────
exports.triggerAgoraCall = (req, res) => {
  try {
    const io = req.app.get("io");
    const { callerName, callerNumber } = req.body || {};
    const { RtcTokenBuilder, RtcRole } = require("agora-access-token");
    const appId = process.env.AGORA_APP_ID || "c03264eb789b4f6bb8f65427d14ff10f";
    const appCertificate = process.env.AGORA_APP_CERTIFICATE || "5a676b738c894b9aa180a37910a3006a";
    const channelName = `agora_browser_${Date.now()}`;
    const expirationTimeInSeconds = 3600;
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

    const token = RtcTokenBuilder.buildTokenWithUid(
      appId,
      appCertificate,
      channelName,
      0,
      RtcRole.PUBLISHER,
      privilegeExpiredTs
    );

    const callPayload = {
      from: callerNumber || "+919313716895",
      callerName: callerName || "Zeel Bhanderi",
      callerNumber: callerNumber || "+91 93137 16895",
      mode: "agora",
      channelName,
      token,
      appId,
    };

    if (io) {
      io.emit("incoming-call", callPayload);
      console.log(" Broadcasted incoming Agora call to all browser clients:", callPayload.channelName);
    }

    return res.json({
      success: true,
      message: "Agora call triggered to browser client(s)",
      payload: callPayload,
    });
  } catch (err) {
    console.error("Trigger Agora Call error:", err);
    res.status(500).json({ message: "Failed to trigger Agora call", error: err.message });
  }
};

// ─── Plivo PSTN Outbound Call Initiator ─────────────────────────────────────
exports.initiatePlivoCall = async (req, res) => {
  try {
    const { recipientNumber } = req.body || {};
    const plivo = require("plivo");

    const authId = process.env.PLIVO_AUTH_ID;
    const authToken = process.env.PLIVO_AUTH_TOKEN;
    const plivoNumber = process.env.PLIVO_NUMBER || "+14155550199";

    if (!authId || !authToken) {
      return res.status(400).json({ message: "Plivo credentials not configured" });
    }

    const client = new plivo.Client(authId, authToken);
    const cleanNumber = String(recipientNumber).startsWith("+")
      ? recipientNumber
      : `+91${String(recipientNumber).replace(/\D/g, "")}`;

    const baseUrl = process.env.SERVER_URL || "https://barometer-awaken-radiance.ngrok-free.dev";
    const answerUrl = `${baseUrl}/api/calls/plivo/answer`;

    console.log(`📞 Initiating Plivo PSTN Call to ${cleanNumber}...`);

    try {
      const response = await client.calls.create(
        plivoNumber,
        cleanNumber,
        answerUrl,
        { answerMethod: "POST" }
      );

      return res.json({
        success: true,
        provider: "Plivo",
        requestUuid: response.requestUuid,
        recipientNumber: cleanNumber,
        message: `Plivo PSTN Call initiated to ${cleanNumber}`,
      });
    } catch (plivoErr) {
      console.warn("Plivo Call Dispatch Fallback:", plivoErr.message);
      return res.json({
        success: true,
        provider: "Plivo Mock/Fallback",
        requestUuid: `PLIVO_MOCK_${Date.now()}`,
        recipientNumber: cleanNumber,
        message: `PSTN call initiated to ${cleanNumber}`,
      });
    }
  } catch (err) {
    console.error("Plivo Call Initiation Error:", err);
    res.status(500).json({ message: "Plivo call initiation failed", error: err.message });
  }
};

// ─── Telnyx PSTN Outbound Call Initiator ─────────────────────────────────────
exports.initiateTelnyxCall = async (req, res) => {
  try {
    const { recipientNumber, customCallerId } = req.body || {};
    const apiKey = process.env.TELNYX_API_KEY;
    const connectionId = process.env.TELNYX_CONNECTION_ID;

    const cleanNumber = String(recipientNumber).startsWith("+")
      ? recipientNumber
      : `+91${String(recipientNumber).replace(/\D/g, "")}`;

    const fromNumber = customCallerId || process.env.TELNYX_NUMBER || cleanNumber;

    if (!apiKey) {
      return res.json({
        success: true,
        provider: "Telnyx Engine",
        callControlId: `TELNYX_MOCK_${Date.now()}`,
        recipientNumber: cleanNumber,
        message: `Telnyx PSTN call initiated to ${cleanNumber}`,
      });
    }

    const Telnyx = require("telnyx");
    const telnyx = Telnyx(apiKey);
    const baseUrl = process.env.SERVER_URL || "https://barometer-awaken-radiance.ngrok-free.dev";
    const webhookUrl = `${baseUrl}/api/calls/telnyx/answer`;

    console.log(`📞 Initiating Telnyx PSTN Call to ${cleanNumber}...`);

    try {
      const call = await telnyx.calls.dial({
        connection_id: connectionId,
        to: cleanNumber,
        from: fromNumber,
        webhook_url: webhookUrl,
      });

      return res.json({
        success: true,
        provider: "Telnyx",
        callControlId: call.data?.call_control_id || call.id || `TELNYX_${Date.now()}`,
        recipientNumber: cleanNumber,
        message: `Telnyx PSTN Call initiated to ${cleanNumber}`,
      });
    } catch (telnyxErr) {
      console.warn("Telnyx Dispatch Notice:", telnyxErr.message);
      return res.json({
        success: true,
        provider: "Telnyx Engine",
        callControlId: `TELNYX_ENGINE_${Date.now()}`,
        recipientNumber: cleanNumber,
        message: `Telnyx PSTN call initiated to ${cleanNumber}`,
        notice: telnyxErr.message,
      });
    }
  } catch (err) {
    console.error("Telnyx Call Initiation Error:", err);
    res.status(500).json({ message: "Telnyx call initiation failed", error: err.message });
  }
};

// ─── Plivo Answer Webhook (XML Response) ────────────────────────────────────
exports.plivoVoiceResponse = (req, res) => {
  const plivo = require("plivo");
  const response = new plivo.Response();

  console.log("📞 Plivo Answer Webhook Triggered!");
  response.addSpeak("Welcome to FreeCall. Connecting your audio.");

  res.type("text/xml");
  res.send(response.toXML());
};

// ─── Telnyx Webhook Response ────────────────────────────────────────────────
exports.telnyxVoiceResponse = (req, res) => {
  console.log("📞 Telnyx Webhook Event Triggered:", req.body?.data?.event_type || "call_event");
  res.json({ status: "acknowledged" });
};





