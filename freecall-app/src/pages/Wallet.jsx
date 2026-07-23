import { useState } from "react";
import { useNavigate } from "react-router-dom";

const plans = [
  { id: 1, minutes: 30, price: 0, label: "Free", sub: "Watch 3 ads", popular: false, color: "#696969" },
  { id: 2, minutes: 120, price: 29, label: "Basic", sub: "₹29 one-time", popular: false, color: "#141413" },
  { id: 3, minutes: 300, price: 59, label: "Popular", sub: "₹59 one-time", popular: true, color: "#F37338" },
  { id: 4, minutes: 1000, price: 149, label: "Pro", sub: "₹149 one-time", popular: false, color: "#2d6a3f" },
];

const transactions = [
  { id: 1, type: "earn", label: "Watched ad", minutes: "+10 min", time: "Today, 2:30 PM" },
  { id: 2, type: "spend", label: "Call to Raj Patel", minutes: "-3 min", time: "Today, 1:15 PM" },
  { id: 3, type: "earn", label: "Purchased Basic", minutes: "+120 min", time: "Yesterday" },
  { id: 4, type: "spend", label: "Call to Sneha Mehta", minutes: "-7 min", time: "Yesterday" },
  { id: 5, type: "earn", label: "Watched ad", minutes: "+10 min", time: "2 days ago" },
];

const Wallet = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(3);
  const [adWatching, setAdWatching] = useState(false);
  const [adDone, setAdDone] = useState(false);

  const handleWatchAd = () => {
    setAdWatching(true);
    setTimeout(() => {
      setAdWatching(false);
      setAdDone(true);
    }, 3000);
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
            BALANCE
          </p>
          <h1 className="font-medium" style={{ fontSize: "28px", letterSpacing: "-0.02em", color: "#141413" }}>
            My Wallet
          </h1>
        </div>
      </div>

      <div className="px-8 pb-16 max-w-2xl">

        {/* Balance card */}
        <div className="rounded-2xl p-8 mb-8 relative overflow-hidden"
          style={{ backgroundColor: "#141413" }}>

          {/* Watermark */}
          <span className="absolute right-4 top-2 font-bold select-none pointer-events-none"
            style={{ fontSize: "80px", color: "rgba(243,240,238,0.04)", letterSpacing: "-0.04em" }}>FC</span>

          <p className="font-bold uppercase mb-2 flex items-center gap-2"
            style={{ color: "#F37338", fontSize: "12px", letterSpacing: "0.06em" }}>
            <span style={{ width: "5px", height: "5px", borderRadius: "999px", backgroundColor: "#F37338", display: "inline-block" }}></span>
            FREE MINUTES
          </p>

          <div className="flex items-end gap-2 mb-1">
            <span className="font-medium" style={{ fontSize: "64px", color: "#F3F0EE", letterSpacing: "-0.04em", lineHeight: 1 }}>
              {adDone ? 22 : 12}
            </span>
            <span className="text-lg mb-2" style={{ color: "#696969" }}>min left</span>
          </div>

          <p className="text-sm mb-6" style={{ color: "#696969" }}>
            Approx. {adDone ? "22" : "12"} minutes of calling remaining
          </p>

          {/* Decorative arc */}
          <div className="flex items-center gap-3 mb-6">
            <div style={{ width: "60px", height: "2px", backgroundColor: "#F37338", borderRadius: "999px" }}></div>
            <div style={{ width: "30px", height: "2px", backgroundColor: "#3d3d3b", borderRadius: "999px" }}></div>
          </div>

          {/* Watch ad button */}
          {!adDone ? (
            <button onClick={handleWatchAd}
              disabled={adWatching}
              className="flex items-center gap-3 px-6 py-3 rounded-full font-medium text-sm transition-all hover:opacity-90 active:scale-95"
              style={{ backgroundColor: adWatching ? "#3d3d3b" : "#F37338", color: "#ffffff" }}>
              {adWatching ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                  Watching ad... +10 min
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                  </svg>
                  Watch ad • Earn 10 min free
                </>
              )}
            </button>
          ) : (
            <div className="flex items-center gap-2 px-6 py-3 rounded-full"
              style={{ backgroundColor: "rgba(45,106,63,0.3)", width: "fit-content" }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none"
                viewBox="0 0 24 24" stroke="#4ade80" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium" style={{ color: "#4ade80" }}>+10 minutes added!</span>
            </div>
          )}
        </div>

        {/* Plans */}
        <p className="font-bold uppercase mb-4 flex items-center gap-2"
          style={{ color: "#F37338", fontSize: "12px", letterSpacing: "0.06em" }}>
          <span style={{ width: "5px", height: "5px", borderRadius: "999px", backgroundColor: "#F37338", display: "inline-block" }}></span>
          BUY MINUTES
        </p>

        <div className="grid grid-cols-2 gap-3 mb-8">
          {plans.map((plan) => (
            <button key={plan.id}
              onClick={() => setSelected(plan.id)}
              className="text-left p-5 rounded-2xl transition-all"
              style={{
                backgroundColor: selected === plan.id ? "#141413" : "#FCFBFA",
                border: selected === plan.id
                  ? `2px solid ${plan.color}`
                  : "1px solid rgba(20,20,19,0.1)",
              }}>

              {plan.popular && (
                <span className="inline-block text-xs font-bold px-2 py-0.5 rounded-full mb-2"
                  style={{ backgroundColor: "#F37338", color: "#ffffff", letterSpacing: "0.04em" }}>
                  POPULAR
                </span>
              )}

              <p className="font-medium text-2xl mb-0.5"
                style={{ color: selected === plan.id ? "#F3F0EE" : "#141413", letterSpacing: "-0.02em" }}>
                {plan.minutes}
                <span className="text-sm font-normal ml-1"
                  style={{ color: selected === plan.id ? "#696969" : "#696969" }}>min</span>
              </p>

              <p className="text-sm font-medium mb-1"
                style={{ color: selected === plan.id ? "#F3F0EE" : "#141413" }}>{plan.label}</p>
              <p className="text-xs" style={{ color: "#696969" }}>{plan.sub}</p>
            </button>
          ))}
        </div>

        {/* Buy button */}
        {selected !== 1 ? (
          <button
            onClick={() => navigate("/wallet/buy")}
            className="w-full py-4 rounded-full font-medium text-base transition-all hover:opacity-90 active:scale-95 mb-8"
            style={{ backgroundColor: "#141413", color: "#F3F0EE", letterSpacing: "-0.02em" }}>
            Buy {plans.find(p => p.id === selected)?.minutes} min
            — ₹{plans.find(p => p.id === selected)?.price}
          </button>
        ) : (
          <button
            onClick={handleWatchAd}
            className="w-full py-4 rounded-full font-medium text-base transition-all hover:opacity-90 active:scale-95 mb-8"
            style={{ backgroundColor: "#F37338", color: "#ffffff", letterSpacing: "-0.02em" }}>
            Watch ad • Get 30 min free
          </button>
        )}

        {/* Transaction history */}
        <p className="font-bold uppercase mb-4 flex items-center gap-2"
          style={{ color: "#F37338", fontSize: "12px", letterSpacing: "0.06em" }}>
          <span style={{ width: "5px", height: "5px", borderRadius: "999px", backgroundColor: "#F37338", display: "inline-block" }}></span>
          TRANSACTION HISTORY
        </p>

        <div className="rounded-2xl overflow-hidden"
          style={{ border: "1px solid rgba(20,20,19,0.1)" }}>
          {transactions.map((tx, i) => (
            <div key={tx.id}
              className="flex items-center gap-4 px-5 py-4"
              style={{
                backgroundColor: "#FCFBFA",
                borderBottom: i < transactions.length - 1 ? "1px solid rgba(20,20,19,0.06)" : "none"
              }}>
              {/* Icon */}
              <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: tx.type === "earn" ? "rgba(45,106,63,0.1)" : "rgba(207,69,0,0.1)" }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none"
                  viewBox="0 0 24 24"
                  stroke={tx.type === "earn" ? "#2d6a3f" : "#CF4500"} strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d={tx.type === "earn"
                      ? "M12 4.5v15m7.5-7.5h-15"
                      : "M19.5 12h-15"} />
                </svg>
              </div>

              {/* Info */}
              <div className="flex-1">
                <p className="text-sm font-medium" style={{ color: "#141413" }}>{tx.label}</p>
                <p className="text-xs" style={{ color: "#696969" }}>{tx.time}</p>
              </div>

              {/* Minutes */}
              <span className="text-sm font-semibold"
                style={{ color: tx.type === "earn" ? "#2d6a3f" : "#CF4500" }}>
                {tx.minutes}
              </span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Wallet;