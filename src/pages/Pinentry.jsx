import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../utils/firebase/firebase";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

// ─── Admin emails — these accounts skip PIN entirely ──────────────
const ADMIN_EMAILS = ["adminacc@gmail.com"];

// ─── Firestore PIN verification ───────────────────────────────────
async function verifyPin(uid, enteredPin) {
  try {
    const snap = await getDoc(doc(db, "users", uid));
    if (!snap.exists()) return false;
    return snap.data().pin === enteredPin;
  } catch {
    return false;
  }
}

export default function PinEntry() {
  const navigate = useNavigate();

  const [pin, setPin]         = useState("");
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  // ── Guard: if no session at all, boot to login ────────────────
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }
    // Admin should never reach PIN page — redirect to dashboard
    if (ADMIN_EMAILS.includes(user.email?.toLowerCase())) {
      navigate("/admin/chat", { replace: true });
    }
  }, [navigate]);

  // ── Form submit ───────────────────────────────────────────────
  async function handleConfirm(e) {
    e.preventDefault();
    setError("");

    const user = auth.currentUser;

    // Session expired mid-way
    if (!user) {
      setError("Session expired. Please log in again.");
      navigate("/login", { replace: true });
      return;
    }

    // Validate input
    if (!pin || pin.length < 4) {
      setError("Please enter a valid PIN (4–6 digits).");
      return;
    }

    setLoading(true);
    try {
      const valid = await verifyPin(user.uid, pin);
      if (!valid) {
        setError("Incorrect PIN. Please try again.");
        setPin("");
        return;
      }
      navigate("/dashboard", { replace: true });
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // ── Sign out ──────────────────────────────────────────────────
  async function handleSignOut() {
    try {
      await signOut(auth);
      navigate("/login", { replace: true });
    } catch {
      setError("Failed to sign out. Please try again.");
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,600;9..40,700;9..40,800;9..40,900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', 'Trebuchet MS', sans-serif; }

        .pin-page {
          min-height: 100vh;
          background: #e8ecf4;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          padding-top: 60px;
          font-family: 'DM Sans', 'Trebuchet MS', sans-serif;
        }

        .pin-card {
          background: white;
          border: 1px solid #d8dde8;
          border-radius: 4px;
          width: 100%;
          max-width: 820px;
          padding: 32px 32px 28px;
        }

        .pin-logo {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-bottom: 28px;
        }

        .pin-banner {
          background: #d4f0f0;
          border-radius: 4px;
          padding: 14px 20px;
          text-align: center;
          color: #333;
          font-size: 14.5px;
          font-weight: 500;
          margin-bottom: 16px;
        }

        .pin-input {
          width: 100%;
          border: 1px solid #cdd2dc;
          border-radius: 4px;
          padding: 12px 16px;
          font-size: 14.5px;
          color: #333;
          outline: none;
          background: white;
          margin-bottom: 12px;
          font-family: 'DM Sans', 'Trebuchet MS', sans-serif;
          letter-spacing: 0.3em;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .pin-input:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37,99,235,0.10);
        }
        .pin-input::placeholder {
          letter-spacing: 0.05em;
          color: #aab0be;
        }

        .pin-error {
          font-size: 12.5px;
          color: #dc2626;
          font-weight: 600;
          margin-bottom: 10px;
          padding: 8px 12px;
          background: #fff5f5;
          border: 1px solid #fca5a5;
          border-radius: 4px;
        }

        .pin-confirm-btn {
          width: 100%;
          background: #2563eb;
          color: white;
          border: none;
          border-radius: 4px;
          padding: 13px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          font-family: 'DM Sans', 'Trebuchet MS', sans-serif;
          transition: background 0.2s, transform 0.1s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .pin-confirm-btn:hover:not(:disabled) { background: #1d4ed8; }
        .pin-confirm-btn:active:not(:disabled) { transform: scale(0.99); }
        .pin-confirm-btn:disabled { opacity: 0.7; cursor: not-allowed; }

        .pin-divider {
          height: 1px;
          background: #e5e7eb;
          margin: 18px 0 14px;
        }

        .pin-signout {
          display: block;
          text-align: center;
          color: #2563eb;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          background: none;
          border: none;
          font-family: 'DM Sans', 'Trebuchet MS', sans-serif;
          width: 100%;
          padding: 2px 0;
          transition: color 0.15s;
        }
        .pin-signout:hover { color: #1d4ed8; text-decoration: underline; }

        .pin-footer {
          width: 100%;
          max-width: 820px;
          margin-top: 32px;
          padding: 0 4px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .pin-footer-copy { color: rgba(100,110,130,0.7); font-size: 12px; }

        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.4);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          flex-shrink: 0;
        }

        @media (max-width: 600px) {
          .pin-page { padding: 20px 16px; }
          .pin-card { padding: 24px 20px 22px; border-radius: 8px; }
          .pin-footer { margin-top: 24px; }
        }
      `}</style>

      <div className="pin-page">
        <div className="pin-card">

          {/* Logo */}
          <div className="pin-logo">
            <svg width="56" height="50" viewBox="0 0 56 50" fill="none">
              <polygon points="28,2 54,16 2,16" fill="#1a1a8e" opacity="0.9"/>
              <rect x="2" y="13" width="52" height="3" fill="#cc2222" opacity="0.8"/>
              {[9,17,25,33,41].map((x, i) => (
                <rect key={i} x={x} y="16" width="4.5" height="26" fill="#1a1a8e" opacity="0.85"/>
              ))}
              <rect x="2" y="42" width="52" height="4" fill="#1a1a8e" opacity="0.9"/>
              <rect x="2" y="45" width="52" height="2" fill="#cc2222" opacity="0.7"/>
              <rect x="2" y="16" width="3" height="26" fill="#cc2222" opacity="0.6"/>
            </svg>
            <div>
              <div style={{ fontWeight: 900, fontSize: 26, color: "#1a1a8e", letterSpacing: "0.06em", lineHeight: 1.05 }}>RENEW</div>
              <div style={{ fontWeight: 900, fontSize: 26, color: "#1a1a8e", letterSpacing: "0.06em", lineHeight: 1.05 }}>PART BANK</div>
            </div>
          </div>

          {/* Banner */}
          <div className="pin-banner">
            Please enter your account PIN to proceed
          </div>

          {/* Form */}
          <form onSubmit={handleConfirm}>
            {error && <div className="pin-error">{error}</div>}

            <input
              className="pin-input"
              type="password"
              inputMode="numeric"
              maxLength={6}
              value={pin}
              onChange={e => {
                const v = e.target.value.replace(/\D/g, "");
                setPin(v);
                if (error) setError("");
              }}
              placeholder="Enter PIN"
              autoFocus
              autoComplete="off"
            />

            <button type="submit" className="pin-confirm-btn" disabled={loading || pin.length < 4}>
              {loading ? (
                <><span className="spinner" />Verifying...</>
              ) : "Confirm"}
            </button>
          </form>

          <div className="pin-divider" />
          <button className="pin-signout" type="button" onClick={handleSignOut}>
            Sign Out
          </button>
        </div>

        <div className="pin-footer">
          <p className="pin-footer-copy">© Renewpart Bank 2023 | All Rights Reserved</p>
        </div>
      </div>
    </>
  );
}