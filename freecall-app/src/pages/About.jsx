import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F3F0EE", fontFamily: "'Sofia Sans', Arial, sans-serif" }}>

      {/* Header */}
      <div className="px-8 pt-10 pb-6 flex items-center gap-4">
        <button onClick={() => navigate("/home")}
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ backgroundColor: "#FCFBFA", border: "1px solid rgba(20,20,19,0.1)" }}>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="#141413" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75" />
          </svg>
        </button>
        <div>
          <p className="font-bold uppercase flex items-center gap-2" style={{ color: "#F37338", fontSize: "12px", letterSpacing: "0.06em" }}>
            <span style={{ width: "5px", height: "5px", borderRadius: "999px", backgroundColor: "#F37338", display: "inline-block" }}></span>
            SYSTEM INFO
          </p>
          <h1 className="font-medium" style={{ fontSize: "28px", letterSpacing: "-0.02em", color: "#141413" }}>
            About FreeCall
          </h1>
        </div>
      </div>

      <div className="px-8 pb-16 max-w-2xl">

        {/* Hero Branding */}
        <div className="p-8 rounded-2xl mb-8 text-center" style={{ backgroundColor: "#141413", color: "#F3F0EE" }}>
          <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold" style={{ backgroundColor: "#F37338" }}>
            📞
          </div>
          <h2 className="text-3xl font-bold mb-2">FreeCall v1.0.0</h2>
          <p className="text-xs max-w-md mx-auto leading-relaxed" style={{ color: "#696969" }}>
            A high-performance WebRTC & VoIP Calling Platform allowing browser-to-browser calls, caller ID masking, and ad-based rewarded calling minutes.
          </p>
        </div>

        {/* Technology Stack Grid */}
        <p className="font-bold uppercase mb-4 text-xs" style={{ color: "#F37338", letterSpacing: "0.06em" }}>CORE ARCHITECTURE</p>
        <div className="grid grid-cols-2 gap-3 mb-8">
          {[
            { title: "React 19 + Vite", desc: "Modern, reactive UI framework" },
            { title: "WebRTC Audio Engine", desc: "Peer-to-peer low latency voice streaming" },
            { title: "Socket.io Signaling", desc: "Real-time SDP & ICE candidate exchange" },
            { title: "Twilio Voice API", desc: "PSTN bridging & caller ID masking" },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-xl border" style={{ backgroundColor: "#FCFBFA", borderColor: "rgba(20,20,19,0.08)" }}>
              <h4 className="font-bold text-sm mb-1" style={{ color: "#141413" }}>{item.title}</h4>
              <p className="text-xs" style={{ color: "#696969" }}>{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Legal & Credits */}
        <div className="p-5 rounded-2xl border text-xs leading-relaxed" style={{ backgroundColor: "#FCFBFA", borderColor: "rgba(20,20,19,0.08)", color: "#696969" }}>
          <p className="font-semibold text-sm mb-1" style={{ color: "#141413" }}>Privacy & Compliance</p>
          Caller ID masking functionality is designed for privacy protection. Usage is governed by local telecommunication regulation standards.
        </div>

      </div>
    </div>
  );
};

export default About;
