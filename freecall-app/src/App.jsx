import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

import Splash from "./pages/Splash";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Contacts from "./pages/Contacts";
import CallHistory from "./pages/CallHistory";
import OutgoingCall from "./pages/OutgoingCall";
import IncomingCall from "./pages/IncomingCall";
import ActiveCall from "./pages/ActiveCall";
import CallEnded from "./pages/CallEnded";
import Wallet from "./pages/Wallet";
import WalletBuy from "./pages/WalletBuy";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Notifications from "./pages/Notifications";
import Help from "./pages/Help";
import About from "./pages/About";
import Navbar from "./components/Navbar";
import { useSocket } from "./context/SocketContext";

import { initTwilioDevice } from "./utils/TwilioVoice";

// Helper layout component to conditionally render Navbar on main app views
const AppLayout = ({ children }) => {
  const location = useLocation();
  const showNavPages = ["/home", "/contacts", "/history", "/wallet", "/profile", "/settings", "/notifications"];
  const shouldShowNav = showNavPages.includes(location.pathname);

  useEffect(() => {
    initTwilioDevice().catch((err) => console.warn("Auto init Twilio Device:", err.message));
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {shouldShowNav && <Navbar />}
      <div className={shouldShowNav ? "pb-16 lg:pb-0 flex-1" : "flex-1"}>
        {children}
      </div>
    </div>
  );
};

// Global call state navigator — listens to SocketContext and redirects when call state changes
const CallNavigator = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { callState } = useSocket();

  useEffect(() => {
    const path = location.pathname;

    if (callState === "incoming" && path !== "/call/incoming") {
      navigate("/call/incoming");
    }
    // Don't auto-navigate away from call screens; each page handles its own transitions
  }, [callState, navigate, location.pathname]);

  return null;
};

function App() {
  return (
    <BrowserRouter>
      <CallNavigator />
      <AppLayout>
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<Home />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/history" element={<CallHistory />} />
          <Route path="/call/outgoing" element={<OutgoingCall />} />
          <Route path="/call/incoming" element={<IncomingCall />} />
          <Route path="/call/active" element={<ActiveCall />} />
          <Route path="/call/ended" element={<CallEnded />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/wallet/buy" element={<WalletBuy />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/help" element={<Help />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;