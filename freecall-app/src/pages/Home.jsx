import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { useSocket } from "../context/SocketContext";

const initials = (name) => name.split(" ").map((n) => n[0]).join("").toUpperCase();
const bgColors = ["#141413", "#2d2d2b", "#4a4a47", "#696969", "#9A3A0A"];

const formatPhoneNumber = (raw) => {
  let cleaned = raw.replace(/\s+/g, "").replace(/-/g, "");
  if (!cleaned.startsWith("+")) {
    if (cleaned.length === 10) {
      cleaned = "+91" + cleaned;
    } else if (cleaned.length === 12 && cleaned.startsWith("91")) {
      cleaned = "+" + cleaned;
    }
  }
  return cleaned;
};

const CallTypeIcon = ({ type }) => {
  if (type === "missed") return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="#CF4500" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 4.5l-15 15M4.5 4.5l15 15" />
    </svg>
  );
  if (type === "incoming") return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="#696969" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 4.5l-15 15m0 0h11.25m-11.25 0V8.25" />
    </svg>
  );
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="#696969" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
    </svg>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const { minutes, user, callHistory, setCurrentCall: setAppCurrentCall } = useApp();
  const { setCurrentCall, setCallState, connected } = useSocket();
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [dialNumber, setDialNumber] = useState("");

  const filtered = callHistory.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.number.includes(search);
    const matchTab = activeTab === "all" || c.type === activeTab;
    return matchSearch && matchTab;
  });

  const dialPad = ["1","2","3","4","5","6","7","8","9","*","0","#"];

  const handleCall = (name, number) => {
    if (!number || !number.trim()) return;
    const formattedNum = formatPhoneNumber(number.trim());

    // Set current call state in UI and navigate to call screen
    setAppCurrentCall({ name: name || formattedNum, number: formattedNum });
    setCurrentCall({ name: name || formattedNum, number: formattedNum, role: "caller" });
    setCallState("outgoing");
    navigate("/call/outgoing");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleCall(dialNumber, dialNumber);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#F3F0EE", fontFamily: "'Sofia Sans', Arial, sans-serif" }}>

      {/* Sidebar */}
      <div className="hidden lg:flex w-64 flex-col justify-between py-8 px-6 border-r"
        style={{ backgroundColor: "#FCFBFA", borderColor: "rgba(20,20,19,0.08)" }}>
        <div>
          <div className="flex items-center gap-3 mb-10">
            <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: "#141413" }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="#F3F0EE" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
            </div>
            <span className="font-semibold" style={{ color: "#141413", letterSpacing: "-0.02em" }}>FreeCall</span>
            {connected && <span className="w-2.5 h-2.5 rounded-full bg-green-500 ml-auto" title="Server connected"></span>}
          </div>
          <nav className="flex flex-col gap-1">
            {[
              { label: "Dialer", path: "/home", active: true, icon: "M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" },
              { label: "Contacts", path: "/contacts", active: false, icon: "M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" },
              { label: "History", path: "/history", active: false, icon: "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" },
              { label: "Wallet", path: "/wallet", active: false, icon: "M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18-3a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3m18-3V6" },
              { label: "Settings", path: "/settings", active: false, icon: "M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z M15 12a3 3 0 11-6 0 3 3 0 016 0z" },
            ].map(({ label, path, icon, active }) => (
              <button key={label} onClick={() => navigate(path)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-left transition-all"
                style={{ backgroundColor: active ? "#141413" : "transparent", color: active ? "#F3F0EE" : "#696969" }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                </svg>
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Wallet card */}
        <div className="rounded-2xl p-5" style={{ backgroundColor: "#141413" }}>
          <p className="font-bold uppercase text-xs mb-1 flex items-center gap-2"
            style={{ color: "#F37338", letterSpacing: "0.06em" }}>
            <span style={{ width: "5px", height: "5px", borderRadius: "999px", backgroundColor: "#F37338", display: "inline-block" }}></span>
            FREE MINUTES
          </p>
          <p className="font-medium text-3xl mb-1" style={{ color: "#F3F0EE", letterSpacing: "-0.02em" }}>{minutes}</p>
          <p className="text-xs mb-4" style={{ color: "#696969" }}>minutes remaining</p>
          <button className="w-full py-2 rounded-xl text-xs font-medium transition-all hover:opacity-90"
            style={{ backgroundColor: "#F37338", color: "#ffffff" }}
            onClick={() => navigate("/wallet")}>
            Get more minutes
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        <div className="flex-1 flex flex-col p-8 overflow-y-auto">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="font-bold uppercase flex items-center gap-2"
                style={{ color: "#F37338", fontSize: "13px", letterSpacing: "0.06em" }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "999px", backgroundColor: "#F37338", display: "inline-block" }}></span>
                DASHBOARD
              </p>
              <h1 className="font-medium mt-1" style={{ fontSize: "32px", letterSpacing: "-0.02em", color: "#141413" }}>
                Good morning, {user?.name ? user.name.split(" ")[0] : "Zeel"} 👋
              </h1>
            </div>
            <button onClick={() => navigate("/profile")}
              className="w-11 h-11 rounded-full flex items-center justify-center font-semibold text-sm transition-all hover:opacity-80"
              style={{ backgroundColor: "#141413", color: "#F3F0EE" }}>
              {user?.initials || "ZS"}
            </button>
          </div>

          {/* Search */}
          <div className="flex items-center gap-3 px-5 py-4 rounded-xl mb-6"
            style={{ backgroundColor: "#FCFBFA", border: "1px solid rgba(20,20,19,0.15)" }}>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="#696969" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0016.803 15.803z" />
            </svg>
            <input type="text" placeholder="Search contacts or enter number..."
              value={search} onChange={(e) => {
                setSearch(e.target.value);
                setDialNumber(e.target.value);
              }}
              className="bg-transparent w-full outline-none text-sm" style={{ color: "#141413" }} />
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            {["all", "outgoing", "incoming", "missed"].map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className="px-4 py-2 rounded-full text-xs font-bold uppercase transition-all"
                style={{
                  backgroundColor: activeTab === tab ? "#141413" : "#FCFBFA",
                  color: activeTab === tab ? "#F3F0EE" : "#696969",
                  border: "1px solid rgba(20,20,19,0.12)", letterSpacing: "0.04em"
                }}>
                {tab}
              </button>
            ))}
          </div>

          <p className="text-xs font-bold uppercase mb-4" style={{ color: "#696969", letterSpacing: "0.06em" }}>Recent calls</p>
          <div className="flex flex-col gap-2">
            {filtered.map((call, i) => (
              <div key={call.id}
                onClick={() => handleCall(call.name, call.number)}
                className="flex items-center gap-4 px-5 py-4 rounded-2xl transition-all cursor-pointer hover:shadow-sm hover:border-gray-400"
                style={{ backgroundColor: "#FCFBFA", border: "1px solid rgba(20,20,19,0.08)" }}>
                <div className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0"
                  style={{ backgroundColor: bgColors[i % bgColors.length], color: "#F3F0EE" }}>
                  {initials(call.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate" style={{ color: "#141413" }}>{call.name}</p>
                  <p className="text-xs truncate" style={{ color: "#696969" }}>{call.number}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="flex items-center gap-1">
                    <CallTypeIcon type={call.type} />
                    <span className="text-xs" style={{ color: call.type === "missed" ? "#CF4500" : "#696969" }}>{call.time}</span>
                  </div>
                  {call.duration && <span className="text-xs" style={{ color: "#D1CDC7" }}>{call.duration}</span>}
                </div>
                <button onClick={(e) => { e.stopPropagation(); handleCall(call.name, call.number); }}
                  className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all hover:opacity-80"
                  style={{ backgroundColor: "#141413" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="#F3F0EE" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Dialpad Panel */}
        <div className="w-full lg:w-80 flex flex-col p-8 border-t lg:border-t-0 lg:border-l" style={{ borderColor: "rgba(20,20,19,0.08)" }}>
          <p className="font-bold uppercase mb-6 flex items-center gap-2"
            style={{ color: "#F37338", fontSize: "13px", letterSpacing: "0.06em" }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "999px", backgroundColor: "#F37338", display: "inline-block" }}></span>
            DIAL PAD
          </p>

          {/* Active Editable Input Field */}
          <div className="px-5 py-4 rounded-xl mb-6 flex items-center justify-between"
            style={{ backgroundColor: "#FCFBFA", border: "1px solid rgba(20,20,19,0.15)", minHeight: "56px" }}>
            <input
              type="text"
              placeholder="Enter number or dial..."
              value={dialNumber}
              onChange={(e) => setDialNumber(e.target.value)}
              onKeyDown={handleKeyDown}
              className="bg-transparent w-full outline-none font-medium text-lg"
              style={{ color: "#141413", letterSpacing: "0.05em" }}
            />
            {dialNumber && (
              <button onClick={() => setDialNumber(dialNumber.slice(0, -1))} title="Backspace" className="p-1 hover:opacity-70">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="#696969" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9.75L14.25 12m0 0l2.25 2.25M14.25 12l2.25-2.25M14.25 12L12 14.25m-2.58 4.92l-6.375-6.375a1.125 1.125 0 010-1.59L9.42 4.83c.211-.211.498-.33.796-.33H19.5a2.25 2.25 0 012.25 2.25v10.5a2.25 2.25 0 01-2.25 2.25h-9.284c-.298 0-.585-.119-.796-.33z" />
                </svg>
              </button>
            )}
          </div>

          {/* On-screen Buttons */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {dialPad.map((key) => (
              <button key={key} onClick={() => setDialNumber((prev) => prev + key)}
                className="h-14 rounded-2xl font-medium text-lg transition-all hover:bg-gray-200 active:scale-95 flex items-center justify-center"
                style={{ backgroundColor: "#FCFBFA", color: "#141413", border: "1px solid rgba(20,20,19,0.1)" }}>
                {key}
              </button>
            ))}
          </div>

          {/* Action Button */}
          <button
            onClick={() => handleCall(dialNumber, dialNumber)}
            disabled={!dialNumber}
            className="w-full py-4 rounded-full font-medium text-base flex items-center justify-center gap-3 transition-all hover:opacity-90 active:scale-95 shadow-md"
            style={{
              backgroundColor: dialNumber ? "#141413" : "#A0A0A0",
              color: "#F3F0EE",
              letterSpacing: "-0.02em",
              cursor: dialNumber ? "pointer" : "not-allowed"
            }}>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
            </svg>
            Call now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;