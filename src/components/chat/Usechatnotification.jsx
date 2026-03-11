// ─────────────────────────────────────────────────────────────────
// Usechatnotification.jsx
//
// iOS-safe rewrite. Key fixes:
//  1. Never access Notification.permission at module/render time —
//     iOS Safari throws if Notification is undefined (e.g. in some
//     PWA/WKWebView contexts). Guard every access.
//  2. Removed renotify/badge/silent from Notification constructor —
//     these throw on iOS Safari's partial Notification implementation.
//  3. AudioContext only created inside a user-gesture handler,
//     never on mount.
//  4. requestNotifPermission() is no longer called automatically
//     on mount — iOS denies it immediately if not user-triggered.
// ─────────────────────────────────────────────────────────────────

import { useState, useEffect, useRef, useCallback } from "react";

// ─── Safe Notification permission check ──────────────────────────
// Never read Notification.permission outside of a try/catch —
// it throws on iOS Safari in some WKWebView contexts.
function getNotifPermission() {
  try {
    if (typeof window === "undefined") return "default";
    if (!("Notification" in window)) return "unsupported";
    return window.Notification.permission;
  } catch (_) {
    return "unsupported";
  }
}

// ─── Request permission (call only from a user gesture) ──────────
export async function requestNotifPermission() {
  try {
    if (typeof window === "undefined") return "unsupported";
    if (!("Notification" in window)) return "unsupported";
    const perm = window.Notification.permission;
    if (perm === "granted") return "granted";
    if (perm === "denied")  return "denied";
    // Must be called from a user gesture on iOS
    const result = await window.Notification.requestPermission();
    return result;
  } catch (_) {
    return "unsupported";
  }
}

// ─── Play notification sound via Web Audio ───────────────────────
// MUST only be called inside a user-gesture handler (tap/click).
// On iOS, AudioContext is suspended until user interaction — we
// resume it here each time rather than keeping a global instance.
function playNotifSound() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx  = new AudioCtx();
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.35);
    // Close context after sound finishes to free iOS audio session
    setTimeout(() => { try { ctx.close(); } catch (_) {} }, 500);
  } catch (_) {}
}

// ─── Fire a browser push notification (desktop only) ─────────────
// iOS Safari does not support the Web Notification API in WKWebView.
// We guard every step and use only the most basic constructor options
// to avoid throwing on partial implementations.
function firePushNotif(title, body) {
  try {
    if (getNotifPermission() !== "granted") return;
    // Use only basic options — iOS throws on renotify/badge/silent
    const n = new window.Notification(title, { body, icon: "/favicon.ico" });
    n.onclick = () => { try { window.focus(); n.close(); } catch (_) {} };
    setTimeout(() => { try { n.close(); } catch (_) {} }, 6000);
  } catch (_) {
    // Silently ignore — notification not supported or blocked
  }
}

// ─────────────────────────────────────────────────────────────────
// useChatNotifications
// ─────────────────────────────────────────────────────────────────
export function useChatNotifications({ messages = [], role = "user", chatOpen = false }) {
  const [toasts, setToasts] = useState([]);
  // Safe initial read — never throws
  const [permission, setPermission] = useState(() => getNotifPermission());
  const seenIds      = useRef(new Set());
  const initialised  = useRef(false);

  // Do NOT auto-request permission on mount — iOS denies immediately
  // and triggers a disruptive prompt. Permission should be requested
  // only on explicit user action (e.g. clicking a "Enable notifications" button).

  // Watch messages for new ones from the other side
  useEffect(() => {
    if (!messages.length) {
      initialised.current = true;
      return;
    }

    // Seed on first snapshot — don't notify for message history
    if (!initialised.current) {
      messages.forEach(m => seenIds.current.add(m.id));
      initialised.current = true;
      return;
    }

    messages.forEach(msg => {
      if (seenIds.current.has(msg.id)) return;
      seenIds.current.add(msg.id);

      const fromOtherSide =
        (role === "user"  && msg.senderRole === "admin") ||
        (role === "admin" && msg.senderRole === "user");
      if (!fromOtherSide) return;

      const title = role === "user"
        ? "Renew Part Bank Support"
        : `New message from ${msg.senderName || "Customer"}`;
      const body = msg.text?.length > 80 ? msg.text.slice(0, 80) + "…" : msg.text;

      // Push notification (desktop only, safe on iOS)
      firePushNotif(title, body);

      // Sound — only fires if chat is open (implies recent user interaction)
      if (chatOpen) playNotifSound();

      // In-app toast (always shown)
      const id = `toast-${Date.now()}-${Math.random()}`;
      setToasts(prev => [...prev.slice(-3), { id, title, body, role: msg.senderRole }]);
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000);
    });
  }, [messages, role, chatOpen]);

  const dismissToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const askPermission = useCallback(async () => {
    const p = await requestNotifPermission();
    setPermission(p);
    return p;
  }, []);

  return { toasts, dismissToast, permission, askPermission };
}

// ─────────────────────────────────────────────────────────────────
// ToastContainer
// ─────────────────────────────────────────────────────────────────
export function ToastContainer({ toasts, onDismiss }) {
  if (!toasts || !toasts.length) return null;

  return (
    <div style={{
      position: "fixed",
      top: 20,
      right: 20,
      zIndex: 99999,
      display: "flex",
      flexDirection: "column",
      gap: 10,
      pointerEvents: "none",
    }}>
      <style>{`
        @keyframes toastIn {
          from { opacity:0; transform:translateX(110%); }
          to   { opacity:1; transform:translateX(0); }
        }
        .notif-toast {
          animation: toastIn 0.3s cubic-bezier(0.34,1.56,0.64,1) forwards;
          pointer-events: all;
        }
        .notif-toast-close:hover { opacity:1 !important; }
      `}</style>

      {toasts.map(t => (
        <div key={t.id} className="notif-toast" style={{
          background: "white",
          borderRadius: 14,
          boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
          padding: "12px 14px",
          minWidth: 280,
          maxWidth: 340,
          display: "flex",
          gap: 12,
          alignItems: "flex-start",
          border: "1px solid rgba(0,0,0,0.06)",
          fontFamily: "'DM Sans','Trebuchet MS',sans-serif",
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
            background: t.role === "admin"
              ? "linear-gradient(135deg,#1a1a8e,#2563eb)"
              : "linear-gradient(135deg,#c8a951,#e0c060)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
            </svg>
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontWeight: 800, fontSize: 12.5, color: "#1f2937", margin: "0 0 3px" }}>{t.title}</p>
            <p style={{ fontSize: 12, color: "#6b7280", margin: 0, lineHeight: 1.4 }}>{t.body}</p>
          </div>

          <button onClick={() => onDismiss(t.id)} className="notif-toast-close"
            style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", opacity: 0.6, padding: 2, flexShrink: 0, display: "flex" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}