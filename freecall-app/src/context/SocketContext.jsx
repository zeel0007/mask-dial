/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, useRef, useCallback } from "react";
import { io } from "socket.io-client";
import AgoraRTC from "agora-rtc-sdk-ng";
import axios from "axios";
import { useApp } from "./AppContext";
import { getApiUrl } from "../utils/config";

const SocketContext = createContext();
const SERVER_URL = getApiUrl();

const ICE_SERVERS = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
  ],
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  
  // Call State Manager
  const [callState, setCallState] = useState("idle"); // idle | outgoing | incoming | active | ended
  const [currentCall, setCurrentCall] = useState(null); // { name, number, role: 'caller' | 'callee', mode: 'agora' | 'pstn' }
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [incomingCall, setIncomingCall] = useState(null);
  const [callMode, setCallMode] = useState("agora"); // 'agora' | 'pstn'
  const [statusMessage, setStatusMessage] = useState("");

  const peerConnectionRef = useRef(null);
  const agoraClientRef = useRef(null);
  const agoraLocalTrackRef = useRef(null);
  const timerRef = useRef(null);
  const { user, addCallToHistory, deductMinutes } = useApp();

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    stopTimer();
    setCallDuration(0);
    timerRef.current = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
  }, [stopTimer]);

  // Terminate All Media & Connections
  const cleanCallMedia = useCallback(() => {
    stopTimer();

    // Clean Agora
    if (agoraLocalTrackRef.current) {
      agoraLocalTrackRef.current.stop();
      agoraLocalTrackRef.current.close();
      agoraLocalTrackRef.current = null;
    }
    if (agoraClientRef.current) {
      agoraClientRef.current.leave().catch((e) => console.warn("Agora leave warning:", e));
      agoraClientRef.current = null;
    }

    // Clean WebRTC
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      setLocalStream(null);
    }
    if (remoteStream) {
      remoteStream.getTracks().forEach((track) => track.stop());
      setRemoteStream(null);
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    setIsMuted(false);
    setIsSpeakerOn(false);
    setStatusMessage("");
  }, [localStream, remoteStream, stopTimer]);

  // Handle Socket Init
  useEffect(() => {
    const socketInstance = io(SERVER_URL, {
      autoConnect: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      transports: ["websocket", "polling"],
    });

    socketInstance.on("connect", () => {
      console.log("Connected to FreeCall signaling server:", socketInstance.id);
      setConnected(true);
      if (user?.email) {
        socketInstance.emit("register", { userId: user.email, name: user.name });
      }
      if (user?.phone) {
        socketInstance.emit("register", { userId: user.phone, name: user.name });
      }
    });

    socketInstance.on("disconnect", () => {
      console.log("Disconnected from signaling server");
      setConnected(false);
    });

    socketInstance.on("users-online", (users) => {
      setOnlineUsers(users);
    });

    // Handle Call Initiated (Caller side - Agora Mode)
    socketInstance.on("call-initiated", async (data) => {
      console.log("Agora call channel generated:", data);
      setCallMode("agora");
      try {
        const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
        agoraClientRef.current = client;

        client.on("user-published", async (remoteUser, mediaType) => {
          await client.subscribe(remoteUser, mediaType);
          if (mediaType === "audio") {
            remoteUser.audioTrack.play();
            setCallState("active");
            startTimer();
          }
        });

        await client.join(data.appId, data.channelName, data.token || null, null);
        const micTrack = await AgoraRTC.createMicrophoneAudioTrack({
          encoderConfig: "high_quality",
        });
        agoraLocalTrackRef.current = micTrack;
        await client.publish([micTrack]);
        console.log("Joined Agora channel and published mic track!");
      } catch (err) {
        console.warn("Agora initialization fallback:", err.message);
      }
    });

    // Handle Incoming Call (Callee side)
    socketInstance.on("incoming-call", (data) => {
      setIncomingCall(data);
      setCallMode(data.mode || "agora");
      setCurrentCall({
        name: data.callerName,
        number: data.callerNumber || data.from,
        role: "callee",
        channelName: data.channelName,
        token: data.token,
        appId: data.appId,
      });
      setCallState("incoming");
    });

    // Handle PSTN Fallback Routing (When target user is offline)
    socketInstance.on("call-routing-pstn", async ({ to, reason }) => {
      console.log("Executing Twilio PSTN Mobile Fallback:", reason);
      setStatusMessage("Routing call via Twilio Mobile Network...");
      setCallMode("pstn");

      try {
        const token = localStorage.getItem("token");
        const cleanNumber = String(to).startsWith("+") ? to : `+91${to.replace(/\D/g, "")}`;
        
        await axios.post(
          `${SERVER_URL}/api/calls/pstn`,
          { recipientNumber: cleanNumber },
          { headers: token ? { Authorization: `Bearer ${token}` } : {} }
        );

        setStatusMessage("Calling GSM Mobile Number (Twilio)...");
        setCallState("active");
        startTimer();
      } catch (err) {
        console.warn("Twilio PSTN Fallback error:", err.message);
        setStatusMessage("Calling GSM Mobile Number...");
        setCallState("active");
        startTimer();
      }
    });

    socketInstance.on("call-answered", async () => {
      console.log("Call answered by remote peer");
      setCallState("active");
      startTimer();
    });

    socketInstance.on("call-ended", () => {
      console.log("Call ended by remote peer");
      setCallState("ended");
      cleanCallMedia();
      setIncomingCall(null);
    });

    queueMicrotask(() => {
      setSocket(socketInstance);
    });

    return () => {
      socketInstance.disconnect();
      cleanCallMedia();
    };
  }, [user, cleanCallMedia, startTimer]);

  const socketInstanceActive = () => socket && connected;

  // Dial out call (Hybrid Logic)
  const startCall = async (targetNumber, targetName) => {
    setCallState("outgoing");
    setStatusMessage("Connecting...");
    setCurrentCall({ name: targetName, number: targetNumber, role: "caller" });

    if (socketInstanceActive()) {
      socket.emit("call-user", {
        to: targetNumber,
        from: user?.email || user?.phone || "guest",
        name: user?.name || "Caller",
        number: user?.phone || "",
      });
    } else {
      // Direct PSTN Fallback if offline
      setStatusMessage("Routing call to Mobile Network...");
      try {
        const token = localStorage.getItem("token");
        const cleanNumber = String(targetNumber).startsWith("+") ? targetNumber : `+91${targetNumber.replace(/\D/g, "")}`;
        await axios.post(
          `${SERVER_URL}/api/calls/pstn`,
          { recipientNumber: cleanNumber },
          { headers: token ? { Authorization: `Bearer ${token}` } : {} }
        );
      } catch (e) {
        console.warn("Direct PSTN trigger:", e.message);
      }
      setCallState("active");
      startTimer();
    }
  };

  // Accept incoming call (Agora Callee Workflow)
  const acceptCall = async () => {
    if (!incomingCall) return;
    setCallState("active");

    if (incomingCall.mode === "agora" && incomingCall.appId) {
      try {
        const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
        agoraClientRef.current = client;

        client.on("user-published", async (remoteUser, mediaType) => {
          await client.subscribe(remoteUser, mediaType);
          if (mediaType === "audio") {
            remoteUser.audioTrack.play();
          }
        });

        await client.join(incomingCall.appId, incomingCall.channelName, incomingCall.token || null, null);
        const micTrack = await AgoraRTC.createMicrophoneAudioTrack({
          encoderConfig: "high_quality",
        });
        agoraLocalTrackRef.current = micTrack;
        await client.publish([micTrack]);
      } catch (err) {
        console.warn("Callee Agora join error:", err.message);
      }
    }

    if (socketInstanceActive()) {
      socket.emit("answer-call", {
        to: incomingCall.from,
        channelName: incomingCall.channelName,
      });
    }

    startTimer();
  };

  // Decline Call
  const declineCall = () => {
    if (incomingCall && socketInstanceActive()) {
      socket.emit("end-call", { to: incomingCall.from });
    }
    setCallState("ended");
    cleanCallMedia();
    setIncomingCall(null);
  };

  // End active call
  const endCall = () => {
    const target = currentCall?.role === "caller" ? currentCall.number : incomingCall?.from;
    if (target && socketInstanceActive()) {
      socket.emit("end-call", { to: target });
    }

    if (callState === "active" && currentCall) {
      const durationStr = formatTime(callDuration);
      const minutesUsed = Math.ceil(callDuration / 60) || 1;
      deductMinutes(minutesUsed);
      addCallToHistory({
        name: currentCall.name,
        number: currentCall.number,
        type: currentCall.role === "caller" ? "outgoing" : "incoming",
        duration: durationStr,
        minutesUsed,
      });
    }

    setCallState("ended");
    cleanCallMedia();
    setIncomingCall(null);
  };

  // Toggle Mute
  const toggleMute = () => {
    if (agoraLocalTrackRef.current) {
      agoraLocalTrackRef.current.setEnabled(isMuted);
    }
    setIsMuted((prev) => !prev);
  };

  // Toggle Speaker
  const toggleSpeaker = () => {
    setIsSpeakerOn((prev) => !prev);
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        connected,
        onlineUsers,
        callState,
        setCallState,
        currentCall,
        setCurrentCall,
        incomingCall,
        setIncomingCall,
        localStream,
        remoteStream,
        isMuted,
        isSpeakerOn,
        callDuration,
        callMode,
        statusMessage,
        startCall,
        acceptCall,
        declineCall,
        endCall,
        toggleMute,
        toggleSpeaker,
        formatTime,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
