import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

const InputRow = ({ label, field, value, tempValue, onChange, editing, type = "text" }) => (
  <div className="mb-5">
    <label className="block text-sm font-medium mb-2"
      style={{ color: "#141413", letterSpacing: "-0.01em" }}>{label}</label>
    {editing ? (
      <div className="flex items-center gap-3 px-5 py-4 rounded-xl"
        style={{ backgroundColor: "#F3F0EE", border: "1px solid rgba(20,20,19,0.2)" }}>
        <input type={type} value={tempValue || ""}
          onChange={(e) => onChange(field, e.target.value)}
          className="bg-transparent w-full outline-none text-sm"
          style={{ color: "#141413" }} />
      </div>
    ) : (
      <div className="px-5 py-4 rounded-xl"
        style={{ backgroundColor: "#FCFBFA", border: "1px solid rgba(20,20,19,0.1)" }}>
        <p className="text-sm" style={{ color: "#141413" }}>{value}</p>
      </div>
    )}
  </div>
);

const Profile = () => {
  const navigate = useNavigate();
  const { user, setUser, minutes, callHistory } = useApp();
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [temp, setTemp] = useState({ ...user });

  const handleSave = () => {
    setUser({ ...temp, initials: temp.name.split(" ").map(n => n[0]).join("").toUpperCase() });
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleFieldChange = (field, val) => {
    setTemp((prev) => ({ ...prev, [field]: val }));
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F3F0EE", fontFamily: "'Sofia Sans', Arial, sans-serif" }}>

      {/* Header */}
      <div className="px-8 pt-10 pb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
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
              Profile
            </h1>
          </div>
        </div>
        <button onClick={editing ? handleSave : () => setEditing(true)}
          className="px-5 py-2.5 rounded-full text-sm font-medium transition-all hover:opacity-90 active:scale-95"
          style={{ backgroundColor: editing ? "#2d6a3f" : "#141413", color: "#F3F0EE", letterSpacing: "-0.01em" }}>
          {editing ? (saved ? "Saved ✓" : "Save") : "Edit"}
        </button>
      </div>

      <div className="px-8 pb-16 max-w-2xl">

        {/* Avatar card */}
        <div className="rounded-2xl p-8 mb-8 flex items-center gap-6 relative overflow-hidden"
          style={{ backgroundColor: "#141413" }}>
          <span className="absolute right-4 top-0 font-bold select-none pointer-events-none"
            style={{ fontSize: "80px", color: "rgba(243,240,238,0.04)", letterSpacing: "-0.04em" }}>
            {user.initials}
          </span>

          <div className="relative">
            <div className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-semibold flex-shrink-0"
              style={{ backgroundColor: "#F3F0EE", color: "#141413", letterSpacing: "-0.02em" }}>
              {user.initials}
            </div>
            {editing && (
              <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "#F37338", border: "2px solid #141413" }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none"
                  viewBox="0 0 24 24" stroke="#ffffff" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                </svg>
              </button>
            )}
          </div>

          <div className="relative z-10">
            <h2 className="font-medium text-xl mb-1"
              style={{ color: "#F3F0EE", letterSpacing: "-0.02em" }}>{user.name}</h2>
            <p className="text-sm mb-3" style={{ color: "#696969" }}>{user.email}</p>
            <div className="flex gap-3">
              <div className="px-3 py-1 rounded-full"
                style={{ backgroundColor: "rgba(243,240,238,0.08)" }}>
                <span className="text-xs font-medium" style={{ color: "#F3F0EE" }}>{minutes} min left</span>
              </div>
              <div className="px-3 py-1 rounded-full"
                style={{ backgroundColor: "rgba(243,115,56,0.15)", border: "1px solid rgba(243,115,56,0.3)" }}>
                <span className="text-xs font-medium" style={{ color: "#F37338" }}>{callHistory.length} calls made</span>
              </div>
            </div>
          </div>
        </div>

        <p className="font-bold uppercase mb-4 flex items-center gap-2"
          style={{ color: "#F37338", fontSize: "12px", letterSpacing: "0.06em" }}>
          <span style={{ width: "5px", height: "5px", borderRadius: "999px", backgroundColor: "#F37338", display: "inline-block" }}></span>
          PERSONAL INFO
        </p>

        <InputRow label="Full name" field="name" value={user.name} tempValue={temp.name} onChange={handleFieldChange} editing={editing} />
        <InputRow label="Email address" field="email" type="email" value={user.email} tempValue={temp.email} onChange={handleFieldChange} editing={editing} />
        <InputRow label="Phone number" field="phone" type="tel" value={user.phone} tempValue={temp.phone} onChange={handleFieldChange} editing={editing} />
        <InputRow label="Bio" field="bio" value={user.bio} tempValue={temp.bio} onChange={handleFieldChange} editing={editing} />

        <p className="font-bold uppercase mb-4 mt-8 flex items-center gap-2"
          style={{ color: "#F37338", fontSize: "12px", letterSpacing: "0.06em" }}>
          <span style={{ width: "5px", height: "5px", borderRadius: "999px", backgroundColor: "#F37338", display: "inline-block" }}></span>
          QUICK LINKS
        </p>

        <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(20,20,19,0.1)" }}>
          {[
            { label: "Call History", sub: "View all your past calls", path: "/history", icon: "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" },
            { label: "Wallet", sub: "Manage your minutes", path: "/wallet", icon: "M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18-3a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3m18-3V6" },
            { label: "Settings", sub: "Caller ID, privacy & more", path: "/settings", icon: "M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z M15 12a3 3 0 11-6 0 3 3 0 016 0z" },
          ].map(({ label, sub, path, icon }, i, arr) => (
            <button key={label} onClick={() => navigate(path)}
              className="w-full flex items-center gap-4 px-5 py-4 text-left transition-all hover:opacity-80"
              style={{ backgroundColor: "#FCFBFA", borderBottom: i < arr.length - 1 ? "1px solid rgba(20,20,19,0.06)" : "none" }}>
              <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: "#F3F0EE" }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none"
                  viewBox="0 0 24 24" stroke="#141413" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium" style={{ color: "#141413" }}>{label}</p>
                <p className="text-xs" style={{ color: "#696969" }}>{sub}</p>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none"
                viewBox="0 0 24 24" stroke="#696969" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          ))}
        </div>

        <button onClick={() => navigate("/login")}
          className="w-full py-4 rounded-full font-medium mt-8 transition-all hover:opacity-90 active:scale-95"
          style={{ backgroundColor: "#CF4500", color: "#ffffff", fontSize: "15px", letterSpacing: "-0.01em" }}>
          Log out
        </button>

      </div>
    </div>
  );
};

export default Profile;