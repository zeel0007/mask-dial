import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import axios from "axios";

const API_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:5001";

const Field = ({ label, name, type = "text", placeholder, value, onChange, icon }) => (
  <div className="mb-5">
    <label className="block text-sm font-medium mb-2" style={{ color: "#141413" }}>{label}</label>
    <div className="flex items-center gap-3 px-5 py-4 rounded-xl" style={{ backgroundColor: "#FCFBFA", border: "1px solid rgba(20,20,19,0.15)" }}>
      {icon}
      <input type={type} name={name} placeholder={placeholder} value={value} onChange={onChange}
        className="bg-transparent w-full outline-none text-sm" style={{ color: "#141413" }} />
    </div>
  </div>
);

const phoneIcon = <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="#696969" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>;

const Signup = () => {
  const navigate = useNavigate();
  const { setUser, setMinutes } = useApp();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSignup = async () => {
    if (!form.name || !form.email || !form.password) { setError("Please fill all required fields"); return; }
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/auth/register`, form);
      const { token, user } = res.data;
      localStorage.setItem("freecall_token", token);
      setUser({ ...user, initials: user.name.split(" ").map((n) => n[0]).join("").toUpperCase() });
      if (user.minutes !== undefined) setMinutes(user.minutes);
      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#F3F0EE", fontFamily: "'Sofia Sans', Arial, sans-serif" }}>
      {/* Left Panel */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between p-16" style={{ backgroundColor: "#141413" }}>
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ backgroundColor: "#F3F0EE" }}>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="#141413" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
          </div>
          <span className="font-semibold text-lg" style={{ color: "#F3F0EE" }}>FreeCall</span>
        </div>
        <div>
          <p className="font-bold uppercase mb-6 flex items-center gap-2" style={{ color: "#F37338", fontSize: "13px", letterSpacing: "0.06em" }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "999px", backgroundColor: "#F37338", display: "inline-block" }}></span> JOIN FOR FREE
          </p>
          <h1 className="font-medium mb-6" style={{ fontSize: "52px", lineHeight: "1.05", letterSpacing: "-0.02em", color: "#F3F0EE" }}>
            Start calling<br />the world<br />today.
          </h1>
          <p style={{ color: "#696969", fontSize: "16px", lineHeight: "1.6", maxWidth: "360px" }}>Create your free account in seconds. No credit card needed.</p>
          <div className="mt-12 flex items-center gap-4">
            <div style={{ width: "80px", height: "2px", backgroundColor: "#F37338", borderRadius: "999px" }}></div>
            <div style={{ width: "40px", height: "2px", backgroundColor: "#696969", borderRadius: "999px" }}></div>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          {[["01", "Create your account"], ["02", "Search or dial a contact"], ["03", "Start calling instantly"]].map(([num, text]) => (
            <div key={num} className="flex items-center gap-4">
              <span className="font-bold text-xs" style={{ color: "#F37338" }}>{num}</span>
              <div className="flex-1 h-px" style={{ backgroundColor: "rgba(243,115,56,0.2)" }}></div>
              <span className="text-sm" style={{ color: "#696969" }}>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="flex lg:hidden items-center gap-2 mb-10">
            <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: "#141413" }}>
              {phoneIcon}
            </div>
            <span className="font-semibold" style={{ color: "#141413" }}>FreeCall</span>
          </div>

          <p className="font-bold uppercase mb-3 flex items-center gap-2" style={{ color: "#F37338", fontSize: "13px", letterSpacing: "0.06em" }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "999px", backgroundColor: "#F37338", display: "inline-block" }}></span> GET STARTED
          </p>
          <h2 className="font-medium mb-2" style={{ fontSize: "36px", letterSpacing: "-0.02em", color: "#141413", lineHeight: 1.1 }}>
            Create your<br />account
          </h2>
          <p className="mb-8 text-sm" style={{ color: "#696969", lineHeight: 1.6 }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "#141413", fontWeight: 600, textDecoration: "underline" }}>Sign in</Link>
          </p>

          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl text-sm font-medium" style={{ backgroundColor: "rgba(207,69,0,0.08)", color: "#CF4500", border: "1px solid rgba(207,69,0,0.2)" }}>
              ⚠️ {error}
            </div>
          )}

          <Field label="Full name" name="name" placeholder="Zeel Shah" value={form.name} onChange={handleChange}
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="#696969" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>} />
          <Field label="Email address" name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange}
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="#696969" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25H4.5a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5H4.5a2.25 2.25 0 00-2.25 2.25m19.5 0l-9.75 6.75L2.25 6.75" /></svg>} />
          <Field label="Phone number" name="phone" type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={handleChange} icon={phoneIcon} />

          <div className="mb-8">
            <label className="block text-sm font-medium mb-2" style={{ color: "#141413" }}>Password</label>
            <div className="flex items-center gap-3 px-5 py-4 rounded-xl" style={{ backgroundColor: "#FCFBFA", border: "1px solid rgba(20,20,19,0.15)" }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="#696969" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
              <input type={showPassword ? "text" : "password"} name="password" placeholder="Min. 8 characters" value={form.password} onChange={handleChange} className="bg-transparent w-full outline-none text-sm" style={{ color: "#141413" }} />
              <button onClick={() => setShowPassword(!showPassword)}>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="#696969" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={showPassword ? "M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.521 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" : "M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z"} />
                </svg>
              </button>
            </div>
          </div>

          <button onClick={handleSignup} disabled={loading}
            className="w-full font-medium py-4 transition-all duration-200 hover:opacity-90 active:scale-95 mb-4 flex items-center justify-center gap-2"
            style={{ backgroundColor: "#141413", color: "#F3F0EE", borderRadius: "20px", fontSize: "16px", letterSpacing: "-0.02em", opacity: loading ? 0.7 : 1 }}>
            {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            {loading ? "Creating account..." : "Create account"}
          </button>

          <p className="text-center text-xs mt-4" style={{ color: "#696969", lineHeight: 1.6 }}>
            By creating an account, you agree to our{" "}
            <span style={{ color: "#141413", textDecoration: "underline", cursor: "pointer" }}>Terms</span>
            {" "}and{" "}
            <span style={{ color: "#141413", textDecoration: "underline", cursor: "pointer" }}>Privacy Policy</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;