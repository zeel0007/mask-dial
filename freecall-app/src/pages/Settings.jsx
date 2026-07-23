import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

const Toggle = ({ value, onChange }) => (
  <button onClick={() => onChange(!value)}
    className="w-12 h-6 rounded-full transition-all duration-300 relative flex-shrink-0"
    style={{ backgroundColor: value ? "#141413" : "#D1CDC7" }}>
    <div className="w-5 h-5 rounded-full absolute top-0.5 transition-all duration-300"
      style={{ backgroundColor: "#F3F0EE", left: value ? "26px" : "2px" }}>
    </div>
  </button>
);

const Section = ({ title, children }) => (
  <div className="mb-8">
    <p className="font-bold uppercase mb-4 flex items-center gap-2"
      style={{ color: "#F37338", fontSize: "12px", letterSpacing: "0.06em" }}>
      <span style={{ width: "5px", height: "5px", borderRadius: "999px", backgroundColor: "#F37338", display: "inline-block" }}></span>
      {title}
    </p>
    <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(20,20,19,0.1)" }}>
      {children}
    </div>
  </div>
);

const Row = ({ label, sub, children, last }) => (
  <div className="flex items-center justify-between px-5 py-4"
    style={{ backgroundColor: "#FCFBFA", borderBottom: last ? "none" : "1px solid rgba(20,20,19,0.06)" }}>
    <div>
      <p className="text-sm font-medium" style={{ color: "#141413", letterSpacing: "-0.01em" }}>{label}</p>
      {sub && <p className="text-xs mt-0.5" style={{ color: "#696969" }}>{sub}</p>}
    </div>
    {children}
  </div>
);

const Settings = () => {
  const navigate = useNavigate();
  const { callerID, setCallerID, randomNumber, setRandomNumber } = useApp();
  const [savedCallerID, setSavedCallerID] = useState("");
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSavedCallerID(callerID);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F3F0EE", fontFamily: "'Sofia Sans', Arial, sans-serif" }}>

      {/* Header */}
      <div className="px-8 pt-10 pb-6 flex items-center gap-4">
        <button onClick={() => navigate("/home")}
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ backgroundColor: "#FCFBFA", border: "1px solid rgba(20,20,19,0.1)" }}>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none"
            viewBox="0 0 24 24" stroke="#141413" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75" />
          </svg>
        </button>
        <div>
          <p className="font-bold uppercase flex items-center gap-2"
            style={{ color: "#F37338", fontSize: "12px", letterSpacing: "0.06em" }}>
            <span style={{ width: "5px", height: "5px", borderRadius: "999px", backgroundColor: "#F37338", display: "inline-block" }}></span>
            ACCOUNT
          </p>
          <h1 className="font-medium" style={{ fontSize: "28px", letterSpacing: "-0.02em", color: "#141413" }}>
            Settings
          </h1>
        </div>
      </div>

      <div className="px-8 pb-16 max-w-2xl">

        {/* CALLER ID */}
        <Section title="CALLER ID & PRIVACY">
          <Row label="Use random number" sub="Receiver will see a different number every call">
            <Toggle value={randomNumber} onChange={(v) => {
              setRandomNumber(v);
              if (v) setCallerID("");
            }} />
          </Row>
          <Row label="Custom caller ID"
            sub={savedCallerID ? `Active: ${savedCallerID}` : "Receiver will see this number"}
            last>
            <div />
          </Row>

          {!randomNumber && (
            <div className="px-5 pb-5" style={{ backgroundColor: "#FCFBFA" }}>
              <div className="flex gap-3">
                <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl"
                  style={{ backgroundColor: "#F3F0EE", border: "1px solid rgba(20,20,19,0.15)" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 flex-shrink-0" fill="none"
                    viewBox="0 0 24 24" stroke="#696969" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                  <input type="tel" placeholder="+91 98765 43210"
                    value={callerID}
                    onChange={(e) => setCallerID(e.target.value)}
                    className="bg-transparent w-full outline-none text-sm"
                    style={{ color: "#141413" }} />
                </div>
                <button onClick={handleSave}
                  className="px-5 py-3 rounded-xl font-medium text-sm transition-all hover:opacity-90 active:scale-95"
                  style={{ backgroundColor: saved ? "#2d6a3f" : "#141413", color: "#F3F0EE" }}>
                  {saved ? "Saved ✓" : "Save"}
                </button>
              </div>
              <div className="mt-3 flex items-start gap-2 px-4 py-3 rounded-xl"
                style={{ backgroundColor: "rgba(243,115,56,0.08)", border: "1px solid rgba(243,115,56,0.2)" }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none"
                  viewBox="0 0 24 24" stroke="#F37338" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
                <p className="text-xs leading-relaxed" style={{ color: "#F37338" }}>
                  Caller ID masking is powered by Twilio. The number you enter will be shown to the receiver. Use responsibly and within legal limits.
                </p>
              </div>
            </div>
          )}
        </Section>

        {/* CALL SETTINGS */}
        <Section title="CALL SETTINGS">
          <Row label="Microphone access" sub="Allow FreeCall to use your mic">
            <span className="text-xs font-medium px-3 py-1 rounded-full"
              style={{ backgroundColor: "#141413", color: "#F3F0EE" }}>Allowed</span>
          </Row>
          <Row label="Speaker output" sub="Default audio output device">
            <span className="text-xs font-medium" style={{ color: "#696969" }}>System default</span>
          </Row>
          <Row label="Echo cancellation" sub="Reduce feedback during calls" last>
            <Toggle value={true} onChange={() => {}} />
          </Row>
        </Section>

        {/* NOTIFICATIONS */}
        <Section title="NOTIFICATIONS">
          <Row label="Incoming call alerts" sub="Show notification for incoming calls">
            <Toggle value={notifications} onChange={setNotifications} />
          </Row>
          <Row label="Missed call alerts" sub="Notify when you miss a call" last>
            <Toggle value={true} onChange={() => {}} />
          </Row>
        </Section>

        {/* APPEARANCE */}
        <Section title="APPEARANCE">
          <Row label="Dark mode" sub="Switch to dark theme" last>
            <Toggle value={darkMode} onChange={setDarkMode} />
          </Row>
        </Section>

        {/* ACCOUNT */}
        <Section title="ACCOUNT">
          <Row label="Change password" sub="Update your login password">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none"
              viewBox="0 0 24 24" stroke="#696969" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </Row>
          <Row label="Privacy policy" sub="Read our data policy">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none"
              viewBox="0 0 24 24" stroke="#696969" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </Row>
          <Row label="Delete account" sub="Permanently remove your data" last>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none"
              viewBox="0 0 24 24" stroke="#CF4500" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </Row>
        </Section>

        <button onClick={() => navigate("/login")}
          className="w-full py-4 rounded-full font-medium transition-all hover:opacity-90 active:scale-95"
          style={{ backgroundColor: "#CF4500", color: "#ffffff", fontSize: "15px", letterSpacing: "-0.01em" }}>
          Log out
        </button>

      </div>
    </div>
  );
};

export default Settings;