// TwilioVoice.js — Manages Twilio Voice SDK Device for real PSTN calls with browser audio
import { Device } from "@twilio/voice-sdk";

const API_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:5001";

let device = null;
let currentConnection = null;

export const getTwilioDevice = () => device;
export const getCurrentConnection = () => currentConnection;

// Initialize the Twilio Device with a fresh token
export const initTwilioDevice = async () => {
  try {
    const token = localStorage.getItem("freecall_token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const res = await fetch(`${API_URL}/api/calls/voice-token`, { headers });
    const data = await res.json();

    if (!data.token) {
      console.error("No Twilio voice token received:", data);
      return null;
    }

    if (device) {
      device.destroy();
    }

    device = new Device(data.token, {
      logLevel: 1,
      codecPreferences: ["opus", "pcmu"],
      fakeLocalDTMF: true,
      enableRingingState: true,
    });

    device.on("error", (err) => {
      console.error("Twilio Device error:", err.message);
    });

    device.on("registered", () => {
      console.log("✅ Twilio Voice Device registered");
    });

    device.on("incoming", (conn) => {
      console.log("⚡ Incoming Twilio audio connection — auto accepting bridge");
      currentConnection = conn;
      conn.on("track", (track) => {
        let audioElement = document.getElementById("twilio-remote-audio");
        if (!audioElement) {
          audioElement = document.createElement("audio");
          audioElement.id = "twilio-remote-audio";
          audioElement.autoplay = true;
          document.body.appendChild(audioElement);
        }
        track.attach(audioElement);
        audioElement.play().catch((e) => console.warn("Audio play warning:", e.message));
      });
      conn.accept();
    });

    await device.register();
    return device;
  } catch (err) {
    console.error("Failed to init Twilio Device:", err);
    return null;
  }
};

// Place a real PSTN call — browser mic is bridged to the phone
export const makePSTNCall = async (toNumber, customCallerId = "") => {
  try {
    // Explicitly request microphone access from browser
    try {
      const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log("🎤 Microphone permission granted:", micStream.id);
    } catch (micErr) {
      console.warn("Microphone access denied or error:", micErr.message);
    }

    if (!device) {
      await initTwilioDevice();
    }

    if (!device) {
      throw new Error("Twilio device not initialized");
    }

    const params = { To: toNumber };
    if (customCallerId) {
      params.callerId = customCallerId;
    }
    const connection = await device.connect({ params });
    currentConnection = connection;

    // Attach remote audio track to DOM audio element when connected
    connection.on("track", (track) => {
      console.log("🔊 Remote audio track received from Twilio");
      let audioElement = document.getElementById("twilio-remote-audio");
      if (!audioElement) {
        audioElement = document.createElement("audio");
        audioElement.id = "twilio-remote-audio";
        audioElement.autoplay = true;
        document.body.appendChild(audioElement);
      }
      track.attach(audioElement);
      audioElement.play().catch((e) => console.warn("Audio play warning:", e.message));
    });

    connection.on("accept", () => console.log("✅ PSTN Call accepted — audio bridge active"));
    connection.on("disconnect", () => {
      console.log("📴 PSTN Call disconnected");
      currentConnection = null;
      const el = document.getElementById("twilio-remote-audio");
      if (el) el.remove();
    });
    connection.on("error", (err) => console.error("Connection error:", err));

    return connection;
  } catch (err) {
    console.error("PSTN call failed:", err);
    throw err;
  }
};

// Hang up the active call
export const hangupCall = () => {
  if (currentConnection) {
    currentConnection.disconnect();
    currentConnection = null;
  }
  if (device) {
    device.disconnectAll();
  }
};

// Mute / Unmute the mic
export const setMuted = (muted) => {
  if (currentConnection) {
    currentConnection.mute(muted);
  }
};

// Send DTMF digit (for keypad during call)
export const sendDigit = (digit) => {
  if (currentConnection) {
    currentConnection.sendDigits(digit);
  }
};
