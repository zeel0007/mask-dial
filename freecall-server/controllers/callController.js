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
