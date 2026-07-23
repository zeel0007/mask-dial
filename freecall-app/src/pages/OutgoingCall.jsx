import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketContext";
import { useApp } from "../context/AppContext";
import { makePSTNCall, hangupCall, setMuted } from "../utils/TwilioVoice";

const OutgoingCall = () => {
  const navigate = useNavigate();
  const {
    callState,
    currentCall,
    callDuration,
    isSpeakerOn,
    toggleSpeaker,
    endCall,
    formatTime,
    setCallState,
  } = useSocket();
  const { addCallToHistory, callerID } = useApp();
  const twilioConnRef = useRef(null);
  const [localMuted, setLocalMuted] = useState(false);

  const targetNumber = currentCall?.number;

  // Start the real Twilio PSTN call when page mounts
  useEffect(() => {
    if (targetNumber) {
      makePSTNCall(targetNumber, callerID)
        .then((conn) => {
          twilioConnRef.current = conn;
          // When Twilio connects audio, switch to active
          conn.on("accept", () => setCallState("active"));
          conn.on("disconnect", () => setCallState("ended"));
        })
        .catch((err) => {
          console.warn("Twilio Voice failed, using fallback:", err.message);
        });
    }
    return () => { /* cleanup handled by hangupCall in handleEnd */ };
  }, [targetNumber, callerID, setCallState]);

  // Navigate automatically when call becomes active or ended
  useEffect(() => {
    if (callState === "active") navigate("/call/active", { replace: true });
    if (callState === "ended") navigate("/call/ended", { replace: true });
  }, [callState, navigate]);

  const name = currentCall?.name || "Unknown";
  const number = currentCall?.number || "";
  const initials = name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const statusLabel = callState === "outgoing" ? "Ringing..." : callState === "active" ? "Connected" : "Calling...";

  const handleToggleMute = () => {
    const newMuted = !localMuted;
    setLocalMuted(newMuted);
    setMuted(newMuted); // Mute real Twilio audio
  };

  const handleEnd = () => {
    hangupCall(); // Hang up real Twilio audio connection
    endCall();
    addCallToHistory({ name, number, type: "outgoing", duration: "", minutesUsed: 0 });
    navigate("/call/ended", { replace: true });
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-between py-16 px-8"
      style={{ backgroundColor: "#141413", fontFamily: "'Sofia Sans', Arial, sans-serif" }}
    >
      {/* Top bar */}
      <div className="w-full max-w-md flex items-center justify-between">
        <button
          onClick={() => navigate("/home")}
          className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:opacity-70"
          style={{ backgroundColor: "rgba(243,240,238,0.08)" }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="#F3F0EE" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75" />
          </svg>
        </button>

        <p className="font-bold uppercase text-xs flex items-center gap-2" style={{ color: "#F37338", letterSpacing: "0.06em" }}>
          <span style={{ width: "5px", height: "5px", borderRadius: "999px", backgroundColor: "#F37338", display: "inline-block", animation: "pulse 1.5s infinite" }}></span>
          OUTGOING CALL
        </p>

        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: "rgba(243,240,238,0.08)" }}>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="#696969" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
          </svg>
        </div>
      </div>

      {/* Center */}
      <div className="flex flex-col items-center text-center">
        {/* Pulsing rings */}
        <div className="relative flex items-center justify-center mb-8">
          <div className="absolute w-48 h-48 rounded-full animate-ping" style={{ backgroundColor: "rgba(243,115,56,0.06)", animationDuration: "2s" }}></div>
          <div className="absolute w-36 h-36 rounded-full animate-ping" style={{ backgroundColor: "rgba(243,115,56,0.08)", animationDuration: "2s", animationDelay: "0.4s" }}></div>

          <div className="relative w-28 h-28 rounded-full flex items-center justify-center z-10 text-3xl font-semibold" style={{ backgroundColor: "#F3F0EE", color: "#141413", letterSpacing: "-0.02em" }}>
            {initials}
            <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: "#F37338", border: "2px solid #141413" }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="#ffffff" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
            </div>
          </div>
        </div>

        <h2 className="font-medium mb-2" style={{ fontSize: "32px", color: "#F3F0EE", letterSpacing: "-0.02em" }}>{name}</h2>
        <p className="text-sm mb-3" style={{ color: "#696969" }}>{number}</p>

        <div className="flex items-center gap-2 px-5 py-2 rounded-full" style={{ backgroundColor: "rgba(243,240,238,0.06)" }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "999px", backgroundColor: "#F37338", display: "inline-block", animation: "pulse 1.5s infinite" }}></span>
          <p className="text-sm font-medium" style={{ color: "#F37338" }}>{statusLabel}</p>
        </div>

        <p className="mt-4 font-medium text-2xl" style={{ color: "#D1CDC7", letterSpacing: "0.05em" }}>
          {formatTime(callDuration)}
        </p>
      </div>

      {/* Bottom controls */}
      <div className="w-full max-w-sm">
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: localMuted ? "Unmute" : "Mute", icon: "M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z", active: localMuted, action: handleToggleMute },
            { label: isSpeakerOn ? "Speaker On" : "Speaker", icon: "M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z", active: isSpeakerOn, action: toggleSpeaker },
            { label: "Keypad", icon: "M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5", active: false, action: () => {} },
          ].map(({ label, icon, active, action }) => (
            <div key={label} className="flex flex-col items-center gap-2">
              <button onClick={action}
                className="w-14 h-14 rounded-full flex items-center justify-center transition-all hover:opacity-70"
                style={{ backgroundColor: active ? "#F3F0EE" : "rgba(243,240,238,0.08)" }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke={active ? "#141413" : "#F3F0EE"} strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                </svg>
              </button>
              <span className="text-xs" style={{ color: "#696969" }}>{label}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-3">
            <div style={{ width: "40px", height: "1px", backgroundColor: "rgba(243,115,56,0.3)", borderRadius: "999px" }}></div>
            <div style={{ width: "20px", height: "1px", backgroundColor: "rgba(243,115,56,0.15)", borderRadius: "999px" }}></div>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="flex flex-col items-center gap-2">
            <button onClick={handleEnd}
              className="w-16 h-16 rounded-full flex items-center justify-center transition-all hover:opacity-80 active:scale-95"
              style={{ backgroundColor: "#CF4500" }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="#ffffff" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 3.75L18 6m0 0l2.25 2.25M18 6l2.25-2.25M18 6l-2.25 2.25m1.5 13.5c-8.284 0-15-6.716-15-15V4.5A2.25 2.25 0 014.5 2.25h1.372c.516 0 .966.351 1.091.852l1.106 4.423c.11.44-.054.902-.417 1.173l-1.293.97c-.363.271-.527.734-.38 1.21a12.035 12.035 0 007.143 7.143c.441.162.928-.004 1.21-.38l.97-1.293c.271-.363.734-.527 1.173-.417l4.423 1.106c.5.125.852.575.852 1.091V19.5a2.25 2.25 0 01-2.25 2.25h-2.25z" />
              </svg>
            </button>
            <span className="text-xs" style={{ color: "#696969" }}>End call</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutgoingCall;