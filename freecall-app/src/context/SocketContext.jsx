/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, useRef, useCallback } from "react";
import { io } from "socket.io-client";
import { useApp } from "./AppContext";

const SocketContext = createContext();

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:5001";

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
  const [currentCall, setCurrentCall] = useState(null); // { name, number, role: 'caller' | 'callee' }
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [incomingCall, setIncomingCall] = useState(null);

  const peerConnectionRef = useRef(null);
  const timerRef = useRef(null);
  const { user, addCallToHistory, deductMinutes } = useApp();

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Reset call timer
  const startTimer = useCallback(() => {
    stopTimer();
    setCallDuration(0);
    timerRef.current = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
  }, [stopTimer]);

  // Terminate Media & Connection
  const cleanCallMedia = useCallback(() => {
    stopTimer();
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
    });

    socketInstance.on("disconnect", () => {
      console.log("Disconnected from signaling server");
      setConnected(false);
    });

    socketInstance.on("users-online", (users) => {
      setOnlineUsers(users);
    });

    socketInstance.on("incoming-call", (data) => {
      // data: { from, offer, callerName, callerNumber }
      setIncomingCall(data);
      setCurrentCall({
        name: data.callerName,
        number: data.callerNumber,
        role: "callee",
      });
      setCallState("incoming");
    });

    socketInstance.on("call-answered", async ({ answer }) => {
      console.log("Call answered by remote peer");
      if (peerConnectionRef.current) {
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
        setCallState("active");
        startTimer();
      }
    });

    socketInstance.on("ice-candidate", async ({ candidate }) => {
      if (peerConnectionRef.current && candidate) {
        try {
          await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (e) {
          console.warn("Error adding remote ICE candidate:", e);
        }
      }
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

  // Setup local media tracks
  const setupLocalStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true },
        video: false,
      });
      setLocalStream(stream);
      return stream;
    } catch (err) {
      console.warn("Could not open mic stream:", err.message);
      // Fallback dummy audio stream for testing in environments without audio input
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const dst = osc.connect(ctx.createMediaStreamDestination());
      osc.start();
      const dummyStream = dst.stream;
      setLocalStream(dummyStream);
      return dummyStream;
    }
  };

  // Peer Connection Setup
  const initPeerConnection = (targetUserId, stream) => {
    const pc = new RTCPeerConnection(ICE_SERVERS);

    pc.onicecandidate = (event) => {
      if (event.candidate && socketInstanceActive()) {
        socket.emit("ice-candidate", { to: targetUserId, candidate: event.candidate });
      }
    };

    pc.ontrack = (event) => {
      const [remote] = event.streams;
      setRemoteStream(remote);
    };

    stream.getTracks().forEach((track) => {
      pc.addTrack(track, stream);
    });

    peerConnectionRef.current = pc;
    return pc;
  };

  const socketInstanceActive = () => socket && connected;

  // Dial out call (Outgoing Workflow)
  const startCall = async (targetNumber, targetName) => {
    setCallState("outgoing");
    setCurrentCall({ name: targetName, number: targetNumber, role: "caller" });

    const stream = await setupLocalStream();
    const pc = initPeerConnection(targetNumber, stream);

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    if (socketInstanceActive()) {
      socket.emit("call-user", {
        to: targetNumber,
        offer,
        from: user?.email,
        name: user?.name,
        number: user?.phone,
      });
    }
  };

  // Accept incoming call (Callee Workflow)
  const acceptCall = async () => {
    if (!incomingCall) return;
    setCallState("active");

    const stream = await setupLocalStream();
    const pc = initPeerConnection(incomingCall.from, stream);

    await pc.setRemoteDescription(new RTCSessionDescription(incomingCall.offer));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    if (socketInstanceActive()) {
      socket.emit("answer-call", { to: incomingCall.from, answer });
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

  // End active call (Terminator Workflow)
  const endCall = () => {
    const target = currentCall?.role === "caller" ? currentCall.number : incomingCall?.from;
    if (target && socketInstanceActive()) {
      socket.emit("end-call", { to: target });
    }

    // Update Local Call Log History & Deduct minutes
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
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsMuted((prev) => !prev);
    }
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
