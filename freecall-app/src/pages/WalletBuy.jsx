import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useApp } from "../context/AppContext";

const plans = [
  { id: 2, minutes: 120, price: 29, label: "Basic", sub: "₹29 one-time" },
  { id: 3, minutes: 300, price: 59, label: "Popular", sub: "₹59 one-time" },
  { id: 4, minutes: 1000, price: 149, label: "Pro", sub: "₹149 one-time" },
];

const WalletBuy = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const planIdParam = Number(searchParams.get("plan")) || 3;
  const [selectedPlanId, setSelectedPlanId] = useState(planIdParam);
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const { addMinutes } = useApp();

  const activePlan = plans.find((p) => p.id === selectedPlanId) || plans[1];

  const handlePayment = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setSuccess(true);
      addMinutes(activePlan.minutes);
      setTimeout(() => {
        navigate("/wallet");
      }, 1500);
    }, 1500);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F3F0EE", fontFamily: "'Sofia Sans', Arial, sans-serif" }}>

      {/* Top Bar */}
      <div className="px-8 pt-10 pb-6 flex items-center gap-4">
        <button onClick={() => navigate("/wallet")}
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
            CHECKOUT
          </p>
          <h1 className="font-medium" style={{ fontSize: "28px", letterSpacing: "-0.02em", color: "#141413" }}>
            Complete Purchase
          </h1>
        </div>
      </div>

      <div className="px-8 pb-16 max-w-xl">

        {/* Selected Plan Summary */}
        <div className="p-6 rounded-2xl mb-6 relative overflow-hidden" style={{ backgroundColor: "#141413" }}>
          <p className="text-xs uppercase font-bold text-gray-400 mb-1" style={{ color: "#F37338" }}>SELECTED PACKAGE</p>
          <div className="flex items-baseline justify-between mb-2">
            <h2 className="text-3xl font-bold" style={{ color: "#F3F0EE" }}>{activePlan.minutes} Minutes</h2>
            <span className="text-2xl font-bold" style={{ color: "#F37338" }}>₹{activePlan.price}</span>
          </div>
          <p className="text-xs text-gray-400">One-time payment • No expiration • High quality voice channels</p>
        </div>

        {/* Change Plan Selector */}
        <p className="font-bold uppercase mb-3 text-xs" style={{ color: "#F37338", letterSpacing: "0.06em" }}>SELECT PLAN</p>
        <div className="grid grid-cols-3 gap-3 mb-6">
          {plans.map((p) => (
            <button key={p.id} onClick={() => setSelectedPlanId(p.id)}
              className="p-4 rounded-xl text-left transition-all"
              style={{
                backgroundColor: selectedPlanId === p.id ? "#141413" : "#FCFBFA",
                color: selectedPlanId === p.id ? "#F3F0EE" : "#141413",
                border: selectedPlanId === p.id ? "2px solid #F37338" : "1px solid rgba(20,20,19,0.1)",
              }}>
              <p className="font-bold text-lg">{p.minutes} min</p>
              <p className="text-xs text-gray-400">₹{p.price}</p>
            </button>
          ))}
        </div>

        {/* Payment Methods */}
        <p className="font-bold uppercase mb-3 text-xs" style={{ color: "#F37338", letterSpacing: "0.06em" }}>PAYMENT METHOD</p>
        <div className="space-y-3 mb-8">
          {[
            { id: "upi", name: "Google Pay / PhonePe / Paytm UPI", icon: "⚡" },
            { id: "card", name: "Credit or Debit Card", icon: "💳" },
            { id: "netbanking", name: "Net Banking", icon: "🏦" },
          ].map((m) => (
            <button key={m.id} onClick={() => setPaymentMethod(m.id)}
              className="w-full flex items-center justify-between p-4 rounded-xl transition-all"
              style={{
                backgroundColor: "#FCFBFA",
                border: paymentMethod === m.id ? "2px solid #141413" : "1px solid rgba(20,20,19,0.1)",
              }}>
              <div className="flex items-center gap-3">
                <span className="text-xl">{m.icon}</span>
                <span className="font-medium text-sm text-gray-900">{m.name}</span>
              </div>
              <div className="w-5 h-5 rounded-full border flex items-center justify-center"
                style={{ borderColor: paymentMethod === m.id ? "#F37338" : "#ccc" }}>
                {paymentMethod === m.id && <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#F37338" }} />}
              </div>
            </button>
          ))}
        </div>

        {/* Pay Button */}
        {success ? (
          <div className="p-4 rounded-xl text-center bg-green-900 text-green-200 font-semibold text-sm">
            ✓ Payment Successful! Adding {activePlan.minutes} minutes to your wallet...
          </div>
        ) : (
          <button onClick={handlePayment} disabled={processing}
            className="w-full py-4 rounded-full font-bold text-base transition-all hover:opacity-90 active:scale-95 flex items-center justify-center gap-2"
            style={{ backgroundColor: "#141413", color: "#F3F0EE" }}>
            {processing ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing Payment...
              </>
            ) : (
              `Pay ₹${activePlan.price} & Add Minutes`
            )}
          </button>
        )}

      </div>
    </div>
  );
};

export default WalletBuy;
