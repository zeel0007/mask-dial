import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { getApiUrl } from "../utils/config";
import axios from "axios";

const API_URL = getApiUrl();

const Login = () => {
  const navigate = useNavigate();
  const { setUser, setMinutes } = useApp();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleLogin = async () => {
    if (!form.email || !form.password) { setError("Please enter email and password"); return; }
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, form);
      const { token, user } = res.data;
      localStorage.setItem("freecall_token", token);
      setUser({ ...user, initials: user.name.split(" ").map((n) => n[0]).join("").toUpperCase() });
      if (user.minutes !== undefined) setMinutes(user.minutes);
      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
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
          <span className="font-semibold text-lg" style={{ color: "#F3F0EE", letterSpacing: "-0.02em" }}>FreeCall</span>
        </div>
        <div>
          <p className="font-bold uppercase mb-6 flex items-center gap-2" style={{ color: "#F37338", fontSize: "13px", letterSpacing: "0.06em" }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "999px", backgroundColor: "#F37338", display: "inline-block" }}></span>
            VOICE & VIDEO CALLING
          </p>
          <h1 className="font-medium mb-6" style={{ fontSize: "52px", lineHeight: "1.05", letterSpacing: "-0.02em", color: "#F3F0EE" }}>
            Call anyone,<br />anywhere,<br />for free.
          </h1>
          <p style={{ color: "#696969", fontSize: "16px", lineHeight: "1.6", maxWidth: "360px" }}>
            Browser-based voice calls powered by WebRTC. No app needed on the other side.
          </p>
          <div className="mt-12 flex items-center gap-4">
            <div style={{ width: "80px", height: "2px", backgroundColor: "#F37338", borderRadius: "999px" }}></div>
            <div style={{ width: "40px", height: "2px", backgroundColor: "#696969", borderRadius: "999px" }}></div>
          </div>
        </div>
        <div className="flex gap-8">
          {[["Free", "Always"], ["WebRTC", "Powered"], ["Zero", "Setup"]].map(([val, label]) => (
            <div key={val}>
              <p className="font-semibold text-xl" style={{ color: "#F3F0EE", letterSpacing: "-0.02em" }}>{val}</p>
              <p className="text-sm" style={{ color: "#696969" }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="flex lg:hidden items-center gap-2 mb-10">
            <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: "#141413" }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="#F3F0EE" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
            </div>
            <span className="font-semibold" style={{ color: "#141413" }}>FreeCall</span>
          </div>

          <p className="font-bold uppercase mb-3 flex items-center gap-2" style={{ color: "#F37338", fontSize: "13px", letterSpacing: "0.06em" }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "999px", backgroundColor: "#F37338", display: "inline-block" }}></span>
            WELCOME BACK
          </p>
          <h2 className="font-medium mb-2" style={{ fontSize: "36px", letterSpacing: "-0.02em", color: "#141413", lineHeight: 1.1 }}>
            Sign in to<br />your account
          </h2>
          <p className="mb-10 text-sm" style={{ color: "#696969", lineHeight: 1.6 }}>
            Don't have an account?{" "}
            <Link to="/signup" style={{ color: "#141413", fontWeight: 600, textDecoration: "underline" }}>Register here</Link>
          </p>

          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl text-sm font-medium" style={{ backgroundColor: "rgba(207,69,0,0.08)", color: "#CF4500", border: "1px solid rgba(207,69,0,0.2)" }}>
              ⚠️ {error}
            </div>
          )}

          <div className="mb-5">
            <label className="block text-sm font-medium mb-2" style={{ color: "#141413" }}>Email address</label>
            <div className="flex items-center gap-3 px-5 py-4 rounded-xl" style={{ backgroundColor: "#FCFBFA", border: "1px solid rgba(20,20,19,0.15)" }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="#696969" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25H4.5a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5H4.5a2.25 2.25 0 00-2.25 2.25m19.5 0l-9.75 6.75L2.25 6.75" /></svg>
              <input type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} className="bg-transparent w-full outline-none text-sm" style={{ color: "#141413" }} />
            </div>
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium mb-2" style={{ color: "#141413" }}>Password</label>
            <div className="flex items-center gap-3 px-5 py-4 rounded-xl" style={{ backgroundColor: "#FCFBFA", border: "1px solid rgba(20,20,19,0.15)" }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="#696969" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
              <input type={showPassword ? "text" : "password"} name="password" placeholder="••••••••" value={form.password} onChange={handleChange} className="bg-transparent w-full outline-none text-sm" style={{ color: "#141413" }} />
              <button onClick={() => setShowPassword(!showPassword)}>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="#696969" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={showPassword ? "M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.521 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" : "M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z"} />
                </svg>
              </button>
            </div>
          </div>

          <div className="text-right mb-8">
            <span className="text-sm cursor-pointer" style={{ color: "#696969", textDecoration: "underline" }}>Forgot password?</span>
          </div>

          <button onClick={handleLogin} disabled={loading}
            className="w-full font-medium py-4 transition-all duration-200 hover:opacity-90 active:scale-95 mb-4 flex items-center justify-center gap-2"
            style={{ backgroundColor: "#141413", color: "#F3F0EE", borderRadius: "20px", fontSize: "16px", letterSpacing: "-0.02em", opacity: loading ? 0.7 : 1 }}>
            {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            {loading ? "Signing in..." : "Sign in"}
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px" style={{ backgroundColor: "rgba(20,20,19,0.12)" }}></div>
            <span className="text-xs" style={{ color: "#696969" }}>or</span>
            <div className="flex-1 h-px" style={{ backgroundColor: "rgba(20,20,19,0.12)" }}></div>
          </div>

          <button className="w-full flex items-center justify-center gap-3 font-medium py-4 transition-all duration-200 hover:opacity-80"
            style={{ backgroundColor: "#FCFBFA", border: "1px solid rgba(20,20,19,0.15)", borderRadius: "20px", color: "#141413", fontSize: "15px" }}>
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;