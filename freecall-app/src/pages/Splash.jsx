import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Splash = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => navigate("/login"), 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-between py-16 px-8"
      style={{ backgroundColor: "#F3F0EE", fontFamily: "'Sofia Sans', Arial, sans-serif" }}>

      {/* Top — Logo pill */}
      <div className="flex items-center gap-3 px-6 py-3 rounded-full shadow-sm"
        style={{ backgroundColor: "#ffffff", border: "1px solid rgba(20,20,19,0.08)" }}>
        <div className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{ backgroundColor: "#141413" }}>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none"
            viewBox="0 0 24 24" stroke="#F3F0EE" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
          </svg>
        </div>
        <span className="font-semibold text-sm" style={{ color: "#141413", letterSpacing: "-0.02em" }}>
          FreeCall
        </span>
      </div>

      {/* Center */}
      <div className="flex flex-col items-center text-center">

        {/* Eyebrow */}
        <p className="font-bold uppercase mb-8 flex items-center gap-2"
          style={{ color: "#F37338", fontSize: "13px", letterSpacing: "0.06em" }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "999px", backgroundColor: "#F37338", display: "inline-block" }}></span>
          FREE VOICE & VIDEO CALLING
        </p>

        {/* Ghost watermark behind headline */}
        <div className="relative flex items-center justify-center mb-6">
          <span className="absolute font-bold select-none pointer-events-none"
            style={{ fontSize: "120px", color: "#E8E2DA", letterSpacing: "-0.04em", lineHeight: 1, zIndex: 0 }}>
            FC
          </span>

          {/* Circle icon */}
          <div className="relative z-10 w-28 h-28 rounded-full flex items-center justify-center shadow-lg"
            style={{ backgroundColor: "#141413" }}>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="none"
              viewBox="0 0 24 24" stroke="#F3F0EE" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
            </svg>

            {/* Satellite CTA */}
            <div className="absolute -bottom-3 -right-3 w-10 h-10 rounded-full flex items-center justify-center shadow-md"
              style={{ backgroundColor: "#ffffff", border: "1.5px solid rgba(20,20,19,0.1)" }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none"
                viewBox="0 0 24 24" stroke="#141413" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
              </svg>
            </div>
          </div>
        </div>

        <h1 className="font-medium mb-4"
          style={{ fontSize: "64px", lineHeight: "1", letterSpacing: "-0.02em", color: "#141413" }}>
          FreeCall
        </h1>

        <p style={{ color: "#696969", fontSize: "18px", lineHeight: 1.5, maxWidth: "380px" }}>
          Call Anyone. Anytime. Free.<br />
          No app needed on the other side.
        </p>

        {/* Decorative arc */}
        <div className="flex items-center gap-3 mt-8">
          <div style={{ width: "60px", height: "2px", backgroundColor: "#F37338", borderRadius: "999px" }}></div>
          <div style={{ width: "30px", height: "2px", backgroundColor: "#D1CDC7", borderRadius: "999px" }}></div>
          <div style={{ width: "12px", height: "2px", backgroundColor: "#D1CDC7", borderRadius: "999px" }}></div>
        </div>
      </div>

      {/* Bottom — Loading bar */}
      <div className="flex flex-col items-center gap-4 w-full max-w-xs">
        <div className="w-full h-1 rounded-full overflow-hidden" style={{ backgroundColor: "#E8E2DA" }}>
          <div className="h-full rounded-full" style={{
            backgroundColor: "#141413",
            animation: "loading 3s ease-in-out forwards"
          }}></div>
        </div>
        <p className="text-xs font-bold uppercase" style={{ color: "#696969", letterSpacing: "0.06em" }}>
          Loading
        </p>
      </div>

    </div>
  );
};

export default Splash;