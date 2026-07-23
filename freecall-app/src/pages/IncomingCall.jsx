import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketContext";

const IncomingCall = () => {
  const navigate = useNavigate();
  const {
    callState,
    currentCall,
    incomingCall,
    acceptCall,
    declineCall,
  } = useSocket();

  // Navigate when call is accepted (active) or declined (ended/idle)
  useEffect(() => {
    if (callState === "active") navigate("/call/active", { replace: true });
    if (callState === "ended" || callState === "idle") navigate("/home", { replace: true });
  }, [callState, navigate]);

  const name = currentCall?.name || incomingCall?.callerName || "Unknown caller";
  const number = currentCall?.number || incomingCall?.callerNumber || "";
  const initials = name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const handleAccept = async () => {
    await acceptCall();
    navigate("/call/active", { replace: true });
  };

  const handleDecline = () => {
    declineCall();
    navigate("/home", { replace: true });
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-between py-16 px-8"
      style={{ backgroundColor: "#141413", fontFamily: "'Sofia Sans', Arial, sans-serif" }}
    >
      {/* Top */}
      <div className="w-full max-w-md flex items-center justify-between">
        <div />
        <p className="font-bold uppercase text-xs flex items-center gap-2" style={{ color: "#F37338", letterSpacing: "0.06em" }}>
          <span style={{ width: "5px", height: "5px", borderRadius: "999px", backgroundColor: "#F37338", display: "inline-block", animation: "pulse 1s infinite" }}></span>
          INCOMING CALL
        </p>
        <button className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: "rgba(243,240,238,0.08)" }}>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="#696969" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
          </svg>
        </button>
      </div>

      {/* Center */}
      <div className="flex flex-col items-center text-center">
        <div className="relative flex items-center justify-center mb-8">
          <div className="absolute w-56 h-56 rounded-full animate-ping" style={{ backgroundColor: "rgba(243,240,238,0.04)", animationDuration: "1.5s" }}></div>
          <div className="absolute w-44 h-44 rounded-full animate-ping" style={{ backgroundColor: "rgba(243,240,238,0.06)", animationDuration: "1.5s", animationDelay: "0.3s" }}></div>
          <div className="absolute w-36 h-36 rounded-full animate-ping" style={{ backgroundColor: "rgba(243,240,238,0.05)", animationDuration: "1.5s", animationDelay: "0.6s" }}></div>

          <div className="relative w-28 h-28 rounded-full flex items-center justify-center z-10 text-3xl font-semibold" style={{ backgroundColor: "#F3F0EE", color: "#141413", letterSpacing: "-0.02em" }}>
            {initials}
            <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: "#F37338", border: "2px solid #141413" }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="#ffffff" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
            </div>
          </div>
        </div>

        <h2 className="font-medium mb-1" style={{ fontSize: "32px", color: "#F3F0EE", letterSpacing: "-0.02em" }}>{name}</h2>
        <p className="text-sm mb-4" style={{ color: "#696969" }}>{number}</p>

        <div className="flex items-center gap-2 px-5 py-2 rounded-full" style={{ backgroundColor: "rgba(243,240,238,0.06)" }}>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="#F37338" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm font-medium" style={{ color: "#F3F0EE" }}>FreeCall • Encrypted</p>
        </div>

        <div className="flex items-center gap-3 mt-8">
          <div style={{ width: "60px", height: "1px", backgroundColor: "rgba(243,115,56,0.3)", borderRadius: "999px" }}></div>
          <div style={{ width: "30px", height: "1px", backgroundColor: "rgba(243,115,56,0.15)", borderRadius: "999px" }}></div>
        </div>
      </div>

      {/* Bottom — Action Buttons */}
      <div className="w-full max-w-xs">
        <div className="flex justify-center gap-8 mb-10">
          {[
            { label: "Remind me", icon: "M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" },
            { label: "Message", icon: "M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" },
          ].map(({ label, icon }) => (
            <div key={label} className="flex flex-col items-center gap-2">
              <button className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: "rgba(243,240,238,0.08)" }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="#696969" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                </svg>
              </button>
              <span className="text-xs" style={{ color: "#696969" }}>{label}</span>
            </div>
          ))}
        </div>

        {/* Accept / Decline */}
        <div className="flex items-center justify-between px-4">
          {/* Decline */}
          <div className="flex flex-col items-center gap-2">
            <button onClick={handleDecline}
              className="w-16 h-16 rounded-full flex items-center justify-center transition-all hover:opacity-80 active:scale-95"
              style={{ backgroundColor: "#CF4500" }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="#ffffff" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 3.75L18 6m0 0l2.25 2.25M18 6l2.25-2.25M18 6l-2.25 2.25m1.5 13.5c-8.284 0-15-6.716-15-15V4.5A2.25 2.25 0 014.5 2.25h1.372c.516 0 .966.351 1.091.852l1.106 4.423c.11.44-.054.902-.417 1.173l-1.293.97c-.363.271-.527.734-.38 1.21a12.035 12.035 0 007.143 7.143c.441.162.928-.004 1.21-.38l.97-1.293c.271-.363.734-.527 1.173-.417l4.423 1.106c.5.125.852.575.852 1.091V19.5a2.25 2.25 0 01-2.25 2.25h-2.25z" />
              </svg>
            </button>
            <span className="text-xs" style={{ color: "#696969" }}>Decline</span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <div className="flex gap-1">
              {[1, 2, 3].map((i) => (
                <div key={i} style={{ width: "4px", height: "4px", borderRadius: "999px", backgroundColor: `rgba(243,240,238,${i * 0.2})` }}></div>
              ))}
            </div>
            <span className="text-xs" style={{ color: "#3d3d3b" }}>swipe</span>
          </div>

          {/* Accept */}
          <div className="flex flex-col items-center gap-2">
            <button onClick={handleAccept}
              className="w-16 h-16 rounded-full flex items-center justify-center transition-all hover:opacity-80 active:scale-95"
              style={{ backgroundColor: "#2d6a3f" }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="#ffffff" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
            </button>
            <span className="text-xs" style={{ color: "#696969" }}>Accept</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncomingCall;