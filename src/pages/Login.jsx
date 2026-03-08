import { useState } from "react";
import Loader from "../components/Loader";


// ─── Firebase imports ───────────────────────────────────────────
// Replace these with your actual Firebase config imports:
// import { auth } from "./firebase.js";
// import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";

// ─── Firebase error code → human-readable message map ──────────
const FIREBASE_ERRORS = {
  "auth/invalid-email":         "The email address is not valid.",
  "auth/user-disabled":         "This account has been disabled.",
  "auth/user-not-found":        "No account found with this email.",
  "auth/wrong-password":        "Incorrect password. Please try again.",
  "auth/too-many-requests":     "Too many failed attempts. Please try later.",
  "auth/network-request-failed":"Network error. Check your connection.",
  "auth/invalid-credential":    "Invalid email or password.",
};
function friendlyError(code) {
  return FIREBASE_ERRORS[code] || "An unexpected error occurred. Please try again.";
}

// ─── Shield + Bank SVG Logo ─────────────────────────────────────
function ShieldLogo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 28 }}>
      <div style={{
        width: 72, height: 72,
        background: "linear-gradient(145deg, #1a1a5e 0%, #2a3aa0 100%)",
        borderRadius: "50%",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 6px 28px rgba(26,26,94,0.22)",
        marginBottom: 14,
        position: "relative",
      }}>
        {/* Shield SVG */}
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2L3 6v6c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V6L12 2z"
            fill="rgba(255,255,255,0.15)"
            stroke="#c8a951"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          {/* Bank pillars inside shield */}
          <path d="M8 13h2v4H8zM11 13h2v4h-2zM14 13h2v4h-2z" fill="white" opacity="0.9"/>
          <path d="M7 12.5h10M12 8l-5 4.5h10L12 8z" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <div style={{ fontFamily: "'DM Sans','Trebuchet MS',sans-serif", fontWeight: 900, fontSize: 18, color: "#1a1a5e", letterSpacing: "0.04em" }}>
        RENEW PART BANK
      </div>
      <div style={{ fontFamily: "'DM Sans','Trebuchet MS',sans-serif", fontSize: 11, color: "#c8a951", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginTop: 3 }}>
        Secure Banking
      </div>
    </div>
  );
}

// ─── Input component ─────────────────────────────────────────────
function Input({ label, type = "text", value, onChange, placeholder, required, id, autoComplete }) {
  const [focused, setFocused] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const isPassword = type === "password";
  return (
    <div style={{ marginBottom: 18 }}>
      <label htmlFor={id} style={{ display: "block", fontSize: 12.5, fontWeight: 700, color: "#1a1a5e", marginBottom: 6, letterSpacing: "0.03em" }}>
        {label} {required && <span style={{ color: "#e53e3e" }}>*</span>}
      </label>
      <div style={{ position: "relative" }}>
        <input
          id={id}
          type={isPassword && showPwd ? "text" : type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: "100%",
            padding: isPassword ? "11px 44px 11px 14px" : "11px 14px",
            fontSize: 14,
            border: `1.5px solid ${focused ? "#1a1a5e" : "#e2e6f0"}`,
            borderRadius: 10,
            outline: "none",
            background: "#fafbff",
            color: "#111",
            transition: "border 0.2s, box-shadow 0.2s",
            boxShadow: focused ? "0 0 0 3px rgba(26,26,94,0.08)" : "none",
            fontFamily: "'DM Sans','Trebuchet MS',sans-serif",
          }}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPwd(!showPwd)}
            style={{
              position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
              background: "none", border: "none", cursor: "pointer", padding: 4, color: "#888",
            }}
            tabIndex={-1}
          >
            {showPwd ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23" strokeWidth="2"/></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Error Alert ─────────────────────────────────────────────────
function ErrorAlert({ message, onClose }) {
  if (!message) return null;
  return (
    <div style={{
      background: "#fff5f5", border: "1.5px solid #fc8181", borderRadius: 10,
      padding: "12px 16px", marginBottom: 20,
      display: "flex", alignItems: "flex-start", gap: 10,
      animation: "fadeInDown 0.25s ease",
    }}>
      <style>{`@keyframes fadeInDown{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:none}}`}</style>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e53e3e" strokeWidth="2" style={{ flexShrink: 0, marginTop: 1 }}>
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      <span style={{ fontSize: 13, color: "#c53030", fontWeight: 600, lineHeight: 1.5, flex: 1 }}>{message}</span>
      <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#fc8181", padding: 0, flexShrink: 0 }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
  );
}

// ─── Success Alert ────────────────────────────────────────────────
function SuccessAlert({ message }) {
  if (!message) return null;
  return (
    <div style={{
      background: "#f0fff4", border: "1.5px solid #68d391", borderRadius: 10,
      padding: "12px 16px", marginBottom: 20,
      display: "flex", alignItems: "center", gap: 10,
    }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#38a169" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
      <span style={{ fontSize: 13, color: "#276749", fontWeight: 600 }}>{message}</span>
    </div>
  );
}

// ─── LOGIN PAGE ──────────────────────────────────────────────────
export default function Login({ onNavigateRegister }) {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [resetMsg, setResetMsg] = useState("");
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setError(""); setResetMsg("");
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setLoading(true);
    try {
      // ── FIREBASE: uncomment below ──
      // const { signInWithEmailAndPassword } = await import("firebase/auth");
      // await signInWithEmailAndPassword(auth, email, password);
      // window.location.href = "/dashboard";

      // ── DEMO: simulate delay ──
      await new Promise(r => setTimeout(r, 1500));
      alert("Login successful! (Demo mode — connect Firebase to activate)");
    } catch (err) {
      setError(friendlyError(err.code));
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword(e) {
    e.preventDefault();
    setError(""); setResetMsg("");
    if (!resetEmail) { setError("Please enter your email address."); return; }
    setLoading(true);
    try {
      // ── FIREBASE: uncomment below ──
      // const { sendPasswordResetEmail } = await import("firebase/auth");
      // await sendPasswordResetEmail(auth, resetEmail);

      await new Promise(r => setTimeout(r, 1200));
      setResetMsg("Password reset email sent! Check your inbox.");
      setShowReset(false);
    } catch (err) {
      setError(friendlyError(err.code));
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {loading && <Loader message="Signing you in..." />}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700;9..40,800;9..40,900&display=swap');
        * { box-sizing: border-box; }
        body { margin:0; background:#f4f6fb; font-family:'DM Sans','Trebuchet MS',sans-serif; }
        .auth-btn { transition: background 0.2s, transform 0.15s, box-shadow 0.2s; }
        .auth-btn:hover { background: #2a2a8e !important; transform: translateY(-1px); box-shadow: 0 6px 24px rgba(26,26,94,0.28) !important; }
        .auth-btn:active { transform: none; }
        .auth-link { cursor:pointer; color:#1a1a5e; font-weight:700; text-decoration:none; }
        .auth-link:hover { text-decoration:underline; color:#2a3aa0; }
      `}</style>

      <div style={{
        minHeight: "100vh", background: "#f4f6fb",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "24px 16px",
        fontFamily: "'DM Sans','Trebuchet MS',sans-serif",
      }}>
        <div style={{
          background: "white", borderRadius: 20, padding: "44px 40px",
          width: "100%", maxWidth: 440,
          boxShadow: "0 8px 48px rgba(26,26,94,0.10), 0 1px 4px rgba(0,0,0,0.06)",
          border: "1px solid rgba(26,26,94,0.07)",
        }}>
          <ShieldLogo />

          <h2 style={{ fontSize: 22, fontWeight: 900, color: "#111", textAlign: "center", marginBottom: 4 }}>
            Welcome Back
          </h2>
          <p style={{ textAlign: "center", color: "#888", fontSize: 13.5, marginBottom: 28 }}>
            Sign in to your Renew Part Bank account
          </p>

          <ErrorAlert message={error} onClose={() => setError("")} />
          <SuccessAlert message={resetMsg} />

          {/* Reset password panel */}
          {showReset ? (
            <form onSubmit={handleResetPassword}>
              <p style={{ fontSize: 13, color: "#555", marginBottom: 16, lineHeight: 1.6 }}>
                Enter your registered email and we'll send you a reset link.
              </p>
              <Input
                id="reset-email" label="Email Address" type="email"
                value={resetEmail} onChange={e => setResetEmail(e.target.value)}
                placeholder="you@example.com" required autoComplete="email"
              />
              <div style={{ display: "flex", gap: 10 }}>
                <button type="button" onClick={() => setShowReset(false)}
                  style={{
                    flex: 1, padding: "12px", borderRadius: 10, border: "1.5px solid #e2e6f0",
                    background: "white", color: "#555", fontWeight: 700, fontSize: 14, cursor: "pointer",
                    fontFamily: "'DM Sans','Trebuchet MS',sans-serif",
                  }}>
                  Cancel
                </button>
                <button type="submit" className="auth-btn"
                  style={{
                    flex: 2, padding: "12px", borderRadius: 10, border: "none",
                    background: "#1a1a5e", color: "white", fontWeight: 800, fontSize: 14, cursor: "pointer",
                    boxShadow: "0 4px 16px rgba(26,26,94,0.22)",
                    fontFamily: "'DM Sans','Trebuchet MS',sans-serif",
                  }}>
                  Send Reset Link
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleLogin}>
              <Input
                id="login-email" label="Email Address" type="email"
                value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com" required autoComplete="email"
              />
              <Input
                id="login-password" label="Password" type="password"
                value={password} onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password" required autoComplete="current-password"
              />

              {/* Forgot password */}
              <div style={{ textAlign: "right", marginTop: -10, marginBottom: 22 }}>
                <span
                  className="auth-link"
                  onClick={() => { setShowReset(true); setError(""); setResetEmail(email); }}
                  style={{ fontSize: 13, color: "#1a1a5e", fontWeight: 700, cursor: "pointer" }}
                >
                  Forgot Password?
                </span>
              </div>

              <button type="submit" className="auth-btn"
                style={{
                  width: "100%", padding: "13px", borderRadius: 12, border: "none",
                  background: "#1a1a5e", color: "white", fontWeight: 900,
                  fontSize: 15, cursor: "pointer", letterSpacing: "0.04em",
                  boxShadow: "0 4px 20px rgba(26,26,94,0.25)",
                  fontFamily: "'DM Sans','Trebuchet MS',sans-serif",
                  marginBottom: 20,
                }}>
                Sign In
              </button>
            </form>
          )}

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "4px 0 20px" }}>
            <div style={{ flex: 1, height: 1, background: "#eee" }}></div>
            <span style={{ fontSize: 12, color: "#ccc", fontWeight: 600 }}>OR</span>
            <div style={{ flex: 1, height: 1, background: "#eee" }}></div>
          </div>

          {/* Link to register */}
          <p style={{ textAlign: "center", fontSize: 13.5, color: "#555" }}>
            Don't have an account?{" "}
            <span
              className="auth-link"
              onClick={onNavigateRegister}
              style={{ color: "#1a1a5e", fontWeight: 800 }}
            >
                <a href="/register">
              Create Account
              </a>
            </span>
          </p>

          <p style={{ textAlign: "center", marginTop: 24, fontSize: 11, color: "#bbb", lineHeight: 1.6 }}>
            🔒 Your connection is secured with 256-bit SSL encryption
          </p>
        </div>
      </div>
    </>
  );
}