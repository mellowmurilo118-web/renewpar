import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../utils/firebase/firebase";

// ─── Full-page loader shown while Firebase resolves the session ───
function AuthLoader() {
    
  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "#e8ecf4",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'DM Sans', 'Trebuchet MS', sans-serif",
      zIndex: 9999,
    }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .auth-loader-wrap { animation: fadeIn 0.3s ease forwards; display: flex; flex-direction: column; align-items: center; gap: 20px; }
        .auth-spinner-ring {
          width: 52px; height: 52px;
          border: 3px solid rgba(26,26,142,0.12);
          border-top-color: #1a1a8e;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
      `}</style>
      <div className="auth-loader-wrap">
        {/* Logo mark */}
        <svg width="48" height="42" viewBox="0 0 56 50" fill="none">
          <polygon points="28,2 54,16 2,16" fill="#1a1a8e" opacity="0.9"/>
          <rect x="2" y="13" width="52" height="3" fill="#cc2222" opacity="0.8"/>
          {[9,17,25,33,41].map((x, i) => (
            <rect key={i} x={x} y="16" width="4.5" height="26" fill="#1a1a8e" opacity="0.85"/>
          ))}
          <rect x="2" y="42" width="52" height="4" fill="#1a1a8e" opacity="0.9"/>
          <rect x="2" y="45" width="52" height="2" fill="#cc2222" opacity="0.7"/>
          <rect x="2" y="16" width="3" height="26" fill="#cc2222" opacity="0.6"/>
        </svg>
        <div className="auth-spinner-ring" />
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "#1a1a8e", fontWeight: 800, fontSize: 13, letterSpacing: "0.12em", textTransform: "uppercase" }}>
            Renew Part Bank
          </p>
          <p style={{ color: "#9ca3af", fontSize: 12, marginTop: 4, fontWeight: 500 }}>
            Verifying your session...
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── useAuth hook — single source of truth for auth state ─────────
// Returns: { user, checking }
// checking = true  → Firebase hasn't resolved yet, show loader
// checking = false → Firebase has resolved, user is null or a User object
export function useAuth() {
  const [user, setUser]         = useState(undefined); // undefined = not yet resolved
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // onAuthStateChanged fires once immediately with the current user
    // (or null if not logged in), then on every subsequent change.
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setChecking(false);
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  return { user, checking };
}

// ─── ProtectedRoute ───────────────────────────────────────────────
// Wrap any route that requires the user to be logged in.
// Usage in App.jsx:
//   <Route path="/pin"       element={<ProtectedRoute><PinEntry /></ProtectedRoute>} />
//   <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
export function ProtectedRoute({ children, redirectTo = "/login" }) {
  const { user, checking } = useAuth();

  // Still waiting for Firebase — show loader, render nothing else
  if (checking) return <AuthLoader />;

  // Firebase resolved: no user → redirect to login
  if (!user) return <Navigate to={redirectTo} replace />;

  // Firebase resolved: user exists → render the page
  return children;
}

// ─── GuestRoute ───────────────────────────────────────────────────
// Wrap routes that logged-in users should NOT see (login, register).
// If already logged in, redirects to /pin instead of showing login again.
// Usage in App.jsx:
//   <Route path="/login"    element={<GuestRoute><Login /></GuestRoute>} />
//   <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
export function GuestRoute({ children, redirectTo = "/pin" }) {
  const { user, checking } = useAuth();

  if (checking) return <AuthLoader />;

  // Already logged in → send to pin/dashboard
  if (user) return <Navigate to={redirectTo} replace />;

  return children;
}