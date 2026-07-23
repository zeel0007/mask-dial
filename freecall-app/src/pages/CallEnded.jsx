import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { useSocket } from "../context/SocketContext";

const CallEnded = () => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [rating, setRating] = useState(null);
  const { minutes } = useApp();
  const { currentCall, callDuration, formatTime, setCallState } = useSocket();

  const name = currentCall?.name || "Unknown";
  const number = currentCall?.number || "";
  const durationStr = callDuration > 0 ? formatTime(callDuration) : "0:00";
  const minutesUsed = callDuration > 0 ? Math.max(1, Math.ceil(callDuration / 60)) : 0;

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

  const handleCallAgain = () => {
    // Reset to idle before navigating so context is fresh
    setCallState("idle");
    navigate("/home");
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-between py-16 px-8"
      style={{ backgroundColor: "#F3F0EE", fontFamily: "'Sofia Sans', Arial, sans-serif" }}
    >
      {/* Top */}
      <div className="w-full max-w-md flex items-center justify-between">
        <button onClick={() => navigate("/home")}
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ backgroundColor: "#FCFBFA", border: "1px solid rgba(20,20,19,0.1)" }}>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="#141413" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75" />
          </svg>
        </button>
        <p className="font-bold uppercase text-xs flex items-center gap-2" style={{ color: "#F37338", letterSpacing: "0.06em" }}>
          <span style={{ width: "5px", height: "5px", borderRadius: "999px", backgroundColor: "#F37338", display: "inline-block" }}></span>
          CALL SUMMARY
        </p>
        <div className="w-10" />
      </div>

      {/* Center */}
      <div
        className="flex flex-col items-center text-center w-full max-w-md"
        style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)", transition: "all 0.5s ease" }}
      >
        <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6 relative" style={{ backgroundColor: "#141413" }}>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="#F3F0EE" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: "#F37338", border: "2px solid #F3F0EE" }}>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="#ffffff" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
            </svg>
          </div>
        </div>

        <p className="font-bold uppercase mb-2 flex items-center gap-2" style={{ color: "#F37338", fontSize: "12px", letterSpacing: "0.06em" }}>
          <span style={{ width: "5px", height: "5px", borderRadius: "999px", backgroundColor: "#F37338", display: "inline-block" }}></span>
          CALL ENDED
        </p>
        <h2 className="font-medium mb-1" style={{ fontSize: "32px", letterSpacing: "-0.02em", color: "#141413" }}>{name}</h2>
        <p className="text-sm mb-8" style={{ color: "#696969" }}>{number}</p>

        {/* Real stats from SocketContext */}
        <div className="grid grid-cols-3 gap-3 w-full mb-8">
          {[
            { label: "Duration", value: durationStr },
            { label: "Minutes used", value: minutesUsed > 0 ? `${minutesUsed}` : "—" },
            { label: "Remaining", value: `${minutes} min` },
          ].map(({ label, value }) => (
            <div key={label} className="px-4 py-5 rounded-2xl text-center" style={{ backgroundColor: "#FCFBFA", border: "1px solid rgba(20,20,19,0.08)" }}>
              <p className="font-medium text-xl mb-1" style={{ color: "#141413", letterSpacing: "-0.02em" }}>{value}</p>
              <p className="text-xs" style={{ color: "#696969" }}>{label}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 mb-8">
          <div style={{ width: "60px", height: "2px", backgroundColor: "#F37338", borderRadius: "999px" }}></div>
          <div style={{ width: "30px", height: "2px", backgroundColor: "#D1CDC7", borderRadius: "999px" }}></div>
          <div style={{ width: "12px", height: "2px", backgroundColor: "#D1CDC7", borderRadius: "999px" }}></div>
        </div>

        {/* Rating */}
        <div className="w-full px-5 py-4 rounded-2xl" style={{ backgroundColor: "#FCFBFA", border: "1px solid rgba(20,20,19,0.08)" }}>
          <p className="text-sm font-medium mb-3" style={{ color: "#141413" }}>Rate call quality</p>
          <div className="flex gap-2 justify-center">
            {["😞", "😐", "🙂", "😊", "🤩"].map((emoji, i) => (
              <button key={i} onClick={() => setRating(i)}
                className="w-11 h-11 rounded-full flex items-center justify-center text-xl transition-all hover:scale-110 active:scale-95"
                style={{
                  backgroundColor: rating === i ? "#141413" : "#F3F0EE",
                  border: "1px solid rgba(20,20,19,0.08)",
                  transform: rating === i ? "scale(1.15)" : "scale(1)",
                }}>
                {emoji}
              </button>
            ))}
          </div>
          {rating !== null && (
            <p className="text-xs text-center mt-3" style={{ color: "#696969" }}>Thanks for your feedback! ✓</p>
          )}
        </div>
      </div>

      {/* Bottom */}
      <div className="w-full max-w-md flex flex-col gap-3">
        <button onClick={handleCallAgain}
          className="w-full py-4 rounded-full font-medium text-base transition-all hover:opacity-90 active:scale-95 flex items-center justify-center gap-3"
          style={{ backgroundColor: "#141413", color: "#F3F0EE", letterSpacing: "-0.02em" }}>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
          </svg>
          Call again
        </button>
        <button onClick={() => navigate("/home")}
          className="w-full py-4 rounded-full font-medium text-base transition-all hover:opacity-80"
          style={{ backgroundColor: "#FCFBFA", color: "#141413", border: "1px solid rgba(20,20,19,0.12)", letterSpacing: "-0.02em" }}>
          Back to home
        </button>
      </div>
    </div>
  );
};

export default CallEnded;