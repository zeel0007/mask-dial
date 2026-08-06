const express = require("express");
const router = express.Router();
const { getHistory, logCall, addMinutes, initiatePSTNCall, getVoiceToken, twimlVoice, getAgoraToken, triggerAgoraCall, initiatePlivoCall, plivoVoiceResponse, initiateTelnyxCall, telnyxVoiceResponse } = require("../controllers/callController");
const authMiddleware = require("../middleware/auth");

router.get("/history", authMiddleware, getHistory);
router.post("/log", authMiddleware, logCall);
router.post("/wallet/add", authMiddleware, addMinutes);
router.post("/pstn", authMiddleware, initiatePSTNCall);

// Telnyx Voice endpoints
router.post("/telnyx", initiateTelnyxCall);
router.get("/telnyx", initiateTelnyxCall);
router.post("/telnyx/answer", telnyxVoiceResponse);
router.get("/telnyx/answer", telnyxVoiceResponse);

// Plivo Voice endpoints
router.post("/plivo", initiatePlivoCall);
router.get("/plivo", initiatePlivoCall);
router.post("/plivo/answer", plivoVoiceResponse);
router.get("/plivo/answer", plivoVoiceResponse);

// Agora RTC Token & Browser Call Trigger endpoints
router.get("/agora-token", getAgoraToken);
router.post("/agora-token", getAgoraToken);
router.post("/trigger-agora", triggerAgoraCall);
router.get("/trigger-agora", triggerAgoraCall);

// Twilio Voice SDK endpoints
router.get("/voice-token", authMiddleware, getVoiceToken);
router.post("/twiml", twimlVoice);  // No auth — called directly by Twilio
router.get("/twiml", twimlVoice);   // GET fallback

module.exports = router;
