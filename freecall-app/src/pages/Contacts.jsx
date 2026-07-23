import { useState } from "react";
import { useNavigate } from "react-router-dom";

const allContacts = [
  { id: 1, name: "Amit Kumar", number: "+91 99887 76655", favorite: true },
  { id: 2, name: "Anjali Verma", number: "+91 91111 22222", favorite: false },
  { id: 3, name: "Deepak Sharma", number: "+91 82222 33333", favorite: false },
  { id: 4, name: "Kavya Nair", number: "+91 73333 44444", favorite: true },
  { id: 5, name: "Mohit Singh", number: "+91 64444 55555", favorite: false },
  { id: 6, name: "Neha Joshi", number: "+91 77777 33333", favorite: true },
  { id: 7, name: "Priya Singh", number: "+91 90000 11111", favorite: false },
  { id: 8, name: "Raj Patel", number: "+91 98765 43210", favorite: true },
  { id: 9, name: "Rohan Desai", number: "+91 88888 22222", favorite: false },
  { id: 10, name: "Sneha Mehta", number: "+91 91234 56789", favorite: false },
  { id: 11, name: "Vikram Rao", number: "+91 85555 66666", favorite: false },
  { id: 12, name: "Zara Khan", number: "+91 76666 77777", favorite: false },
];

const bgColors = ["#141413", "#2d2d2b", "#4a4a47", "#9A3A0A", "#2d6a3f", "#0f3460", "#7a4a00", "#3d1f6e"];
const initials = (name) => name.split(" ").map((n) => n[0]).join("").toUpperCase();

const Contacts = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [contacts, setContacts] = useState(allContacts);
  const [activeTab, setActiveTab] = useState("all");
  const [showAdd, setShowAdd] = useState(false);
  const [newContact, setNewContact] = useState({ name: "", number: "" });

  const toggleFavorite = (id) => {
    setContacts(contacts.map(c => c.id === id ? { ...c, favorite: !c.favorite } : c));
  };

  const handleAdd = () => {
    if (!newContact.name || !newContact.number) return;
    setContacts([...contacts, { id: Date.now(), ...newContact, favorite: false }]);
    setNewContact({ name: "", number: "" });
    setShowAdd(false);
  };

  const filtered = contacts.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.number.includes(search);
    const matchTab = activeTab === "all" || (activeTab === "favorites" && c.favorite);
    return matchSearch && matchTab;
  });

  // Group alphabetically
  const grouped = filtered.reduce((acc, contact) => {
    const letter = contact.name[0].toUpperCase();
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(contact);
    return acc;
  }, {});

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F3F0EE", fontFamily: "'Sofia Sans', Arial, sans-serif" }}>

      {/* Header */}
      <div className="px-8 pt-10 pb-4 flex items-center justify-between">
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
              DIRECTORY
            </p>
            <h1 className="font-medium" style={{ fontSize: "28px", letterSpacing: "-0.02em", color: "#141413" }}>
              Contacts
            </h1>
          </div>
        </div>

        {/* Add button */}
        <button onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all hover:opacity-90"
          style={{ backgroundColor: "#141413", color: "#F3F0EE" }}>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none"
            viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add
        </button>
      </div>

      <div className="px-8 pb-16 max-w-2xl">

        {/* Add Contact form */}
        {showAdd && (
          <div className="rounded-2xl p-6 mb-6"
            style={{ backgroundColor: "#141413", border: "1px solid rgba(243,115,56,0.3)" }}>
            <p className="font-bold uppercase mb-4 flex items-center gap-2"
              style={{ color: "#F37338", fontSize: "12px", letterSpacing: "0.06em" }}>
              <span style={{ width: "5px", height: "5px", borderRadius: "999px", backgroundColor: "#F37338", display: "inline-block" }}></span>
              NEW CONTACT
            </p>
            <div className="flex flex-col gap-3 mb-4">
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl"
                style={{ backgroundColor: "rgba(243,240,238,0.06)", border: "1px solid rgba(243,240,238,0.1)" }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 flex-shrink-0" fill="none"
                  viewBox="0 0 24 24" stroke="#696969" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
                <input type="text" placeholder="Full name"
                  value={newContact.name}
                  onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                  className="bg-transparent w-full outline-none text-sm"
                  style={{ color: "#F3F0EE" }} />
              </div>
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl"
                style={{ backgroundColor: "rgba(243,240,238,0.06)", border: "1px solid rgba(243,240,238,0.1)" }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 flex-shrink-0" fill="none"
                  viewBox="0 0 24 24" stroke="#696969" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
                <input type="tel" placeholder="+91 98765 43210"
                  value={newContact.number}
                  onChange={(e) => setNewContact({ ...newContact, number: e.target.value })}
                  className="bg-transparent w-full outline-none text-sm"
                  style={{ color: "#F3F0EE" }} />
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={handleAdd}
                className="flex-1 py-3 rounded-xl text-sm font-medium transition-all hover:opacity-90"
                style={{ backgroundColor: "#F37338", color: "#ffffff" }}>
                Save contact
              </button>
              <button onClick={() => setShowAdd(false)}
                className="px-5 py-3 rounded-xl text-sm font-medium transition-all hover:opacity-70"
                style={{ backgroundColor: "rgba(243,240,238,0.08)", color: "#696969" }}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="flex items-center gap-3 px-5 py-4 rounded-xl mb-5"
          style={{ backgroundColor: "#FCFBFA", border: "1px solid rgba(20,20,19,0.12)" }}>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 flex-shrink-0" fill="none"
            viewBox="0 0 24 24" stroke="#696969" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0016.803 15.803z" />
          </svg>
          <input type="text" placeholder="Search contacts..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent w-full outline-none text-sm" style={{ color: "#141413" }} />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {["all", "favorites"].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className="px-4 py-2 rounded-full text-xs font-bold uppercase transition-all"
              style={{
                backgroundColor: activeTab === tab ? "#141413" : "#FCFBFA",
                color: activeTab === tab ? "#F3F0EE" : "#696969",
                border: "1px solid rgba(20,20,19,0.12)",
                letterSpacing: "0.04em"
              }}>
              {tab === "favorites" ? "⭐ Favorites" : "All"}
            </button>
          ))}
          <div className="ml-auto flex items-center px-4 py-2 rounded-full"
            style={{ backgroundColor: "#FCFBFA", border: "1px solid rgba(20,20,19,0.12)" }}>
            <span className="text-xs font-bold" style={{ color: "#696969" }}>{filtered.length} contacts</span>
          </div>
        </div>

        {/* Grouped contacts */}
        {Object.entries(grouped).sort().map(([letter, letterContacts]) => (
          <div key={letter} className="mb-5">
            {/* Letter header */}
            <div className="flex items-center gap-3 mb-2">
              <span className="font-bold text-sm w-6" style={{ color: "#F37338" }}>{letter}</span>
              <div className="flex-1 h-px" style={{ backgroundColor: "rgba(20,20,19,0.08)" }}></div>
            </div>

            {/* Contacts in group */}
            <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(20,20,19,0.08)" }}>
              {letterContacts.map((contact, i) => (
                <div key={contact.id}
                  className="flex items-center gap-4 px-5 py-4"
                  style={{
                    backgroundColor: "#FCFBFA",
                    borderBottom: i < letterContacts.length - 1 ? "1px solid rgba(20,20,19,0.06)" : "none"
                  }}>

                  {/* Avatar */}
                  <div className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0"
                    style={{ backgroundColor: bgColors[contact.id % bgColors.length], color: "#F3F0EE" }}>
                    {initials(contact.name)}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm" style={{ color: "#141413", letterSpacing: "-0.01em" }}>{contact.name}</p>
                    <p className="text-xs" style={{ color: "#696969" }}>{contact.number}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {/* Favorite */}
                    <button onClick={() => toggleFavorite(contact.id)}
                      className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:opacity-70">
                      <svg xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4"
                        fill={contact.favorite ? "#F37338" : "none"}
                        viewBox="0 0 24 24"
                        stroke={contact.favorite ? "#F37338" : "#D1CDC7"}
                        strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round"
                          d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                      </svg>
                    </button>

                    {/* Call */}
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
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </div>
            <p className="font-medium text-sm" style={{ color: "#696969" }}>No contacts found</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default Contacts;