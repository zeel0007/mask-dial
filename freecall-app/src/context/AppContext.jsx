/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [minutes, setMinutes] = useState(12);
  const [user, setUser] = useState({
    name: "Zeel Shah",
    email: "zeel@example.com",
    phone: "+91 98765 43210",
    initials: "ZS",
  });
  const [callHistory, setCallHistory] = useState([
    { id: 1, name: "Raj Patel", number: "+91 98765 43210", type: "outgoing", date: "Today", time: "2:30 PM", duration: "3:42", minutesUsed: 4 },
    { id: 2, name: "Sneha Mehta", number: "+91 91234 56789", type: "missed", date: "Today", time: "1:15 PM", duration: "", minutesUsed: 0 },
    { id: 3, name: "Amit Kumar", number: "+91 99887 76655", type: "incoming", date: "Today", time: "11:00 AM", duration: "1:15", minutesUsed: 2 },
    { id: 4, name: "Priya Singh", number: "+91 90000 11111", type: "outgoing", date: "Yesterday", time: "6:45 PM", duration: "7:03", minutesUsed: 8 },
    { id: 5, name: "Rohan Desai", number: "+91 88888 22222", type: "missed", date: "Yesterday", time: "3:20 PM", duration: "", minutesUsed: 0 },
  ]);
  const [callerID, setCallerID] = useState("");
  const [randomNumber, setRandomNumber] = useState(true);
  const [currentCall, setCurrentCall] = useState(null);

  const addMinutes = (amount) => setMinutes((m) => m + amount);
  const deductMinutes = (amount) => setMinutes((m) => Math.max(0, m - amount));

  const addCallToHistory = (call) => {
    setCallHistory((prev) => [
      { id: Date.now(), date: "Today", time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), ...call },
      ...prev,
    ]);
  };

  return (
    <AppContext.Provider value={{
      minutes, setMinutes, addMinutes, deductMinutes,
      user, setUser,
      callHistory, addCallToHistory,
      callerID, setCallerID,
      randomNumber, setRandomNumber,
      currentCall, setCurrentCall,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);