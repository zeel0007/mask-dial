const express = require("express");
const router = express.Router();
const { getHistory, logCall, addMinutes, initiatePSTNCall, getVoiceToken, twimlVoice } = require("../controllers/callController");
const authMiddleware = require("../middleware/auth");

router.get("/history", authMiddleware, getHistory);
router.post("/log", authMiddleware, logCall);
router.post("/wallet/add", authMiddleware, addMinutes);
router.post("/pstn", authMiddleware, initiatePSTNCall);

// Twilio Voice SDK endpoints
router.get("/voice-token", authMiddleware, getVoiceToken);
router.post("/twiml", twimlVoice);  // No auth — called directly by Twilio
router.get("/twiml", twimlVoice);   // GET fallback

module.exports = router;
