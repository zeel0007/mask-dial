import { useState } from "react";
import { useNavigate } from "react-router-dom";

const calls = [
  { id: 1, name: "Raj Patel", number: "+91 98765 43210", type: "outgoing", date: "Today", time: "2:30 PM", duration: "3:42" },
  { id: 2, name: "Sneha Mehta", number: "+91 91234 56789", type: "missed", date: "Today", time: "1:15 PM", duration: "" },
  { id: 3, name: "Amit Kumar", number: "+91 99887 76655", type: "incoming", date: "Today", time: "11:00 AM", duration: "1:15" },
  { id: 4, name: "Priya Singh", number: "+91 90000 11111", type: "outgoing", date: "Yesterday", time: "6:45 PM", duration: "7:03" },
  { id: 5, name: "Rohan Desai", number: "+91 88888 22222", type: "missed", date: "Yesterday", time: "3:20 PM", duration: "" },
  { id: 6, name: "Neha Joshi", number: "+91 77777 33333", type: "incoming", date: "Yesterday", time: "10:05 AM", duration: "12:30" },
  { id: 7, name: "Raj Patel", number: "+91 98765 43210", type: "outgoing", date: "11 Jul", time: "8:00 PM", duration: "2:10" },
  { id: 8, name: "Amit Kumar", number: "+91 99887 76655", type: "missed", date: "11 Jul", time: "5:30 PM", duration: "" },
  { id: 9, name: "Sneha Mehta", number: "+91 91234 56789", type: "incoming", date: "10 Jul", time: "9:15 AM", duration: "4:55" },
];

const bgColors = ["#141413", "#2d2d2b", "#4a4a47", "#696969", "#9A3A0A", "#2d6a3f", "#0f3460", "#7a4a00", "#3d1f6e"];
const initials = (name) => name.split(" ").map((n) => n[0]).join("").toUpperCase();

const CallTypeIcon = ({ type }) => {
  if (type === "missed") return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="#CF4500" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 4.5l-15 15M4.5 4.5l15 15" />
    </svg>
  );
  if (type === "incoming") return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="#2d6a3f" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 4.5l-15 15m0 0h11.25m-11.25 0V8.25" />
    </svg>
  );
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="#696969" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
    </svg>
  );
};

const CallHistory = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = calls.filter((c) => {
    const matchTab = activeTab === "all" || c.type === activeTab;
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.number.includes(search);
    return matchTab && matchSearch;
  });

  const grouped = filtered.reduce((acc, call) => {
    if (!acc[call.date]) acc[call.date] = [];
    acc[call.date].push(call);
    return acc;
  }, {});

  const typeColor = { outgoing: "#696969", incoming: "#2d6a3f", missed: "#CF4500" };
  const typeLabel = { outgoing: "Outgoing", incoming: "Incoming", missed: "Missed" };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F3F0EE", fontFamily: "'Sofia Sans', Arial, sans-serif" }}>

      {/* Header */}
      <div className="px-8 pt-10 pb-4 flex items-center gap-4">
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
            CALLS
          </p>
          <h1 className="font-medium" style={{ fontSize: "28px", letterSpacing: "-0.02em", color: "#141413" }}>
            Call History
          </h1>
        </div>
      </div>

      <div className="px-8 pb-16 max-w-2xl">

        {/* Search */}
        <div className="flex items-center gap-3 px-5 py-4 rounded-xl mb-5"
          style={{ backgroundColor: "#FCFBFA", border: "1px solid rgba(20,20,19,0.12)" }}>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 flex-shrink-0" fill="none"
            viewBox="0 0 24 24" stroke="#696969" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0016.803 15.803z" />
          </svg>
          <input type="text" placeholder="Search name or number..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent w-full outline-none text-sm" style={{ color: "#141413" }} />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          {["all", "outgoing", "incoming", "missed"].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className="px-4 py-2 rounded-full text-xs font-bold uppercase transition-all"
              style={{
                backgroundColor: activeTab === tab ? "#141413" : "#FCFBFA",
                color: activeTab === tab ? "#F3F0EE" : "#696969",
                border: "1px solid rgba(20,20,19,0.12)",
                letterSpacing: "0.04em"
              }}>
              {tab}
            </button>
          ))}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { label: "Total calls", value: calls.length, color: "#141413" },
            { label: "Missed", value: calls.filter(c => c.type === "missed").length, color: "#CF4500" },
            { label: "Incoming", value: calls.filter(c => c.type === "incoming").length, color: "#2d6a3f" },
          ].map(({ label, value, color }) => (
            <div key={label} className="px-5 py-4 rounded-2xl"
              style={{ backgroundColor: "#FCFBFA", border: "1px solid rgba(20,20,19,0.08)" }}>
              <p className="font-medium text-2xl mb-0.5" style={{ color, letterSpacing: "-0.02em" }}>{value}</p>
              <p className="text-xs" style={{ color: "#696969" }}>{label}</p>
            </div>
          ))}
        </div>

        {/* Grouped call list */}
        {Object.entries(grouped).map(([date, dateCalls]) => (
          <div key={date} className="mb-6">

            {/* Date label */}
            <div className="flex items-center gap-3 mb-3">
              <p className="text-xs font-bold uppercase" style={{ color: "#696969", letterSpacing: "0.06em" }}>{date}</p>
              <div className="flex-1 h-px" style={{ backgroundColor: "rgba(20,20,19,0.08)" }}></div>
            </div>

            {/* Calls */}
            <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(20,20,19,0.08)" }}>
              {dateCalls.map((call, i) => (
                <div key={call.id}
                  className="flex items-center gap-4 px-5 py-4 transition-all hover:opacity-90"
                  style={{
                    backgroundColor: "#FCFBFA",
                    borderBottom: i < dateCalls.length - 1 ? "1px solid rgba(20,20,19,0.06)" : "none"
                  }}>

                  {/* Avatar */}
                  <div className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0"
                    style={{ backgroundColor: bgColors[call.id % bgColors.length], color: "#F3F0EE" }}>
                    {initials(call.name)}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm" style={{ color: "#141413", letterSpacing: "-0.01em" }}>{call.name}</p>
                    <p className="text-xs" style={{ color: "#696969" }}>{call.number}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <CallTypeIcon type={call.type} />
                      <span className="text-xs font-medium" style={{ color: typeColor[call.type] }}>
                        {typeLabel[call.type]}
                      </span>
                      <span className="text-xs" style={{ color: "#D1CDC7" }}>· {call.time}</span>
                      {call.duration && (
                        <span className="text-xs" style={{ color: "#D1CDC7" }}>· {call.duration}</span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button onClick={() => navigate("/call/outgoing")}
                      className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:opacity-80"
                      style={{ backgroundColor: "#141413" }}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none"
                        viewBox="0 0 24 24" stroke="#F3F0EE" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round"
                          d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
              style={{ backgroundColor: "#FCFBFA", border: "1px solid rgba(20,20,19,0.1)" }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none"
                viewBox="0 0 24 24" stroke="#D1CDC7" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="font-medium text-sm" style={{ color: "#696969" }}>No calls found</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default CallHistory;