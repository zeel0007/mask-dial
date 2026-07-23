import { useState } from "react";
import { useNavigate } from "react-router-dom";

const faqs = [
  {
    q: "How does FreeCall work?",
    a: "FreeCall connects calls directly between web browsers using WebRTC peer-to-peer audio technology. For standard phone numbers, calls are routed through our Twilio Voice gateway."
  },
  {
    q: "How do I earn free calling minutes?",
    a: "Go to your Wallet and click 'Watch Ad'. Each 15-30 second ad completion instantly adds 10 free minutes to your balance!"
  },
  {
    q: "What is Caller ID Masking?",
    a: "Caller ID Masking hides your real phone number from the person you are calling. In Settings, you can enable 'Random Number' or set a custom caller ID."
  },
  {
    q: "Microphone permission issues?",
    a: "If your browser is blocking audio, click the lock icon next to the address bar, enable Microphone access, and reload the page."
  },
];

const Help = () => {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState(0);

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
            SUPPORT & KNOWLEDGE BASE
          </p>
          <h1 className="font-medium" style={{ fontSize: "28px", letterSpacing: "-0.02em", color: "#141413" }}>
            Help & FAQs
          </h1>
        </div>
      </div>

      <div className="px-8 pb-16 max-w-2xl">

        {/* Support Banner */}
        <div className="p-6 rounded-2xl mb-8 flex items-center justify-between" style={{ backgroundColor: "#141413", color: "#F3F0EE" }}>
          <div>
            <h3 className="font-bold text-lg mb-1">Need live assistance?</h3>
            <p className="text-xs text-gray-400">Our customer support team is available 24/7.</p>
          </div>
          <button onClick={() => alert("Contact support at support@freecall.app")}
            className="px-4 py-2 rounded-xl text-xs font-semibold" style={{ backgroundColor: "#F37338", color: "#fff" }}>
            Contact Us
          </button>
        </div>

        {/* FAQs */}
        <p className="font-bold uppercase mb-4 text-xs" style={{ color: "#F37338", letterSpacing: "0.06em" }}>FREQUENTLY ASKED QUESTIONS</p>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="rounded-2xl overflow-hidden border" style={{ backgroundColor: "#FCFBFA", borderColor: "rgba(20,20,19,0.08)" }}>
              <button onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
                className="w-full p-5 text-left flex items-center justify-between font-semibold text-sm" style={{ color: "#141413" }}>
                <span>{faq.q}</span>
                <span className="text-lg">{openIndex === i ? "−" : "+"}</span>
              </button>
              {openIndex === i && (
                <div className="px-5 pb-5 pt-0 text-xs leading-relaxed border-t" style={{ borderColor: "rgba(20,20,19,0.06)", color: "#696969" }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Help;
