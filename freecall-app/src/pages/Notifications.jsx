import { useState } from "react";
import { useNavigate } from "react-router-dom";

const initialNotifications = [
  { id: 1, title: "10 Minutes Rewarded!", desc: "You earned 10 free minutes by watching an ad.", time: "10 mins ago", type: "wallet", unread: true },
  { id: 2, title: "Missed Call from Sneha Mehta", desc: "Sneha Mehta (+91 91234 56789) tried calling you.", time: "1 hour ago", type: "call", unread: true },
  { id: 3, title: "Caller ID Verified", desc: "Your custom Caller ID +91 98765 43210 is active.", time: "Yesterday", type: "system", unread: false },
  { id: 4, title: "Free Call Minutes Low", desc: "You have 12 minutes remaining. Watch ads or top up.", time: "2 days ago", type: "wallet", unread: false },
];

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState("all");

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const clearNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const filtered = notifications.filter((n) => filter === "all" || n.type === filter);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F3F0EE", fontFamily: "'Sofia Sans', Arial, sans-serif" }}>

      {/* Top Bar */}
      <div className="px-8 pt-10 pb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
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
              ALERTS & UPDATES
            </p>
            <h1 className="font-medium" style={{ fontSize: "28px", letterSpacing: "-0.02em", color: "#141413" }}>
              Notifications
            </h1>
          </div>
        </div>

        {notifications.some((n) => n.unread) && (
          <button onClick={markAllRead} className="text-xs font-semibold px-3 py-1.5 rounded-full"
            style={{ backgroundColor: "#141413", color: "#F3F0EE" }}>
            Mark all read
          </button>
        )}
      </div>

      <div className="px-8 pb-16 max-w-2xl">

        {/* Filter Pills */}
        <div className="flex gap-2 mb-6">
          {["all", "call", "wallet", "system"].map((type) => (
            <button key={type} onClick={() => setFilter(type)}
              className="px-4 py-2 rounded-full text-xs font-bold uppercase transition-all"
              style={{
                backgroundColor: filter === type ? "#141413" : "#FCFBFA",
                color: filter === type ? "#F3F0EE" : "#696969",
                border: "1px solid rgba(20,20,19,0.12)", letterSpacing: "0.04em"
              }}>
              {type}
            </button>
          ))}
        </div>

        {/* List */}
        {filtered.length === 0 ? (
          <div className="p-8 text-center rounded-2xl" style={{ backgroundColor: "#FCFBFA", border: "1px solid rgba(20,20,19,0.1)" }}>
            <p className="text-sm font-medium" style={{ color: "#696969" }}>No notifications available</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((n) => (
              <div key={n.id} className="p-5 rounded-2xl flex items-start gap-4 transition-all relative"
                style={{
                  backgroundColor: n.unread ? "#FCFBFA" : "rgba(252,251,250,0.6)",
                  border: n.unread ? "1px solid rgba(243,115,56,0.3)" : "1px solid rgba(20,20,19,0.08)"
                }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-lg"
                  style={{ backgroundColor: n.type === "wallet" ? "rgba(45,106,63,0.1)" : n.type === "call" ? "rgba(207,69,0,0.1)" : "rgba(20,20,19,0.08)" }}>
                  {n.type === "wallet" ? "💰" : n.type === "call" ? "📞" : "⚙️"}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-sm" style={{ color: "#141413" }}>{n.title}</h3>
                    <span className="text-[11px]" style={{ color: "#696969" }}>{n.time}</span>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: "#696969" }}>{n.desc}</p>
                </div>
                <button onClick={() => clearNotification(n.id)} className="text-gray-400 hover:text-red-500 text-xs">✕</button>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default Notifications;
