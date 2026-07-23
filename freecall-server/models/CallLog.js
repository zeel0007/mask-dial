const mongoose = require("mongoose");

const callLogSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  recipientName: { type: String, required: true },
  recipientNumber: { type: String, required: true },
  callType: { type: String, enum: ["outgoing", "incoming", "missed"], required: true },
  duration: { type: String, default: "0:00" },
  minutesUsed: { type: Number, default: 0 },
  callerIdUsed: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("CallLog", callLogSchema);
