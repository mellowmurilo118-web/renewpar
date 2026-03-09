// ─────────────────────────────────────────────────────────────────
// useChatNotifications.js
// Handles:
//  1. Browser Push Notifications (Notification API)
//  2. In-app toast queue (returned as `toasts` array)
//  3. Notification sound
// ─────────────────────────────────────────────────────────────────

import { useState, useEffect, useRef, useCallback } from "react";

// ── Tiny audio beep via Web Audio API (no external file needed) ──
function playNotifSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.3);
  } catch (_) {}
}

// ── Request browser notification permission ───────────────────────
export async function requestNotifPermission() {
  if (!("Notification" in window)) return "unsupported";
  if (Notification.permission === "granted") return "granted";
  if (Notification.permission === "denied") return "denied";
  const result = await Notification.requestPermission();
  return result;
}

// ── Fire a browser push notification ─────────────────────────────
function firePushNotif(title, body, icon = "/favicon.ico") {
  if (!("Notification" in window)) return;
  if (Notification.permission !== "granted") return;
  try {
    const n = new Notification(title, {
      body,
      icon,
      badge: "/favicon.ico",
      tag: "renewpar-chat",       // replaces previous notification of same tag
      renotify: true,
      silent: false,
    });
    n.onclick = () => { window.focus(); n.close(); };
    setTimeout(() => n.close(), 6000);
  } catch (_) {}
}

// ─────────────────────────────────────────────────────────────────
// useChatNotifications
//
// Pass in `messages` array from useUserChat / useAdminChat.
// It watches for NEW messages (not seen before) and fires:
//   - Browser push notification
//   - In-app toast
//   - Sound
//
// role: "user" | "admin"
// chatOpen: boolean — if chat is open, don't notify for own side
// ─────────────────────────────────────────────────────────────────
export function useChatNotifications({ messages = [], role = "user", chatOpen = false }) {
  const [toasts, setToasts]           = useState([]);
  const [permission, setPermission]   = useState(Notification?.permission || "default");
  const seenIds                       = useRef(new Set());
  const initialised                   = useRef(false);

  // Request permission on mount
  useEffect(() => {
    requestNotifPermission().then(p => setPermission(p));
  }, []);

  // Watch messages for new ones
  useEffect(() => {
    if (!messages.length) {
      // Mark first load as done once we get an empty resolved list
      initialised.current = true;
      return;
    }

    // On very first snapshot, just seed seenIds — don't notify for history
    if (!initialised.current) {
      messages.forEach(m => seenIds.current.add(m.id));
      initialised.current = true;
      return;
    }

    messages.forEach(msg => {
      if (seenIds.current.has(msg.id)) return;
      seenIds.current.add(msg.id);

      // Only notify if the message is from the OTHER side
      const fromOtherSide =
        (role === "user"  && msg.senderRole === "admin") ||
        (role === "admin" && msg.senderRole === "user");

      if (!fromOtherSide) return;

      const title = role === "user"
        ? "Renew Part Bank Support"
        : `New message from ${msg.senderName || "Customer"}`;
      const body = msg.text?.length > 80
        ? msg.text.slice(0, 80) + "…"
        : msg.text;

      // 1. Push notification (even if tab is in background)
      firePushNotif(title, body);

      // 2. Sound
      playNotifSound();

      // 3. In-app toast (always shown)
      const id = `toast-${Date.now()}-${Math.random()}`;
      const toast = { id, title, body, role: msg.senderRole, timestamp: Date.now() };
      setToasts(prev => [...prev.slice(-3), toast]); // max 4 at once

      // Auto-dismiss after 5s
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, 5000);
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
// ToastContainer — renders the in-app notification toasts
// Drop this anywhere in your tree (already included in ChatLauncher)
// ─────────────────────────────────────────────────────────────────
export function ToastContainer({ toasts, onDismiss }) {
  if (!toasts.length) return null;

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
          from { opacity: 0; transform: translateX(110%); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes toastOut {
          from { opacity: 1; transform: translateX(0); }
          to   { opacity: 0; transform: translateX(110%); }
        }
        .notif-toast {
          animation: toastIn 0.3s cubic-bezier(0.34,1.56,0.64,1) forwards;
          pointer-events: all;
        }
        .notif-toast-close:hover { opacity: 1 !important; }
        .notif-toast:hover { transform: translateY(-1px); box-shadow: 0 8px 30px rgba(0,0,0,0.15) !important; }
      `}</style>

      {toasts.map(t => (
        <div
          key={t.id}
          className="notif-toast"
          style={{
            background: "white",
            borderRadius: 14,
            boxShadow: "0 4px 20px rgba(0,0,0,0.12), 0 1px 4px rgba(0,0,0,0.06)",
            padding: "12px 14px",
            minWidth: 280,
            maxWidth: 340,
            display: "flex",
            gap: 12,
            alignItems: "flex-start",
            border: "1px solid rgba(0,0,0,0.06)",
            transition: "transform 0.2s, box-shadow 0.2s",
            fontFamily: "'DM Sans','Trebuchet MS',sans-serif",
          }}
        >
          {/* Icon */}
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

          {/* Text */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontWeight: 800, fontSize: 12.5, color: "#1f2937", margin: "0 0 3px" }}>
              {t.title}
            </p>
            <p style={{ fontSize: 12, color: "#6b7280", margin: 0, lineHeight: 1.4, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
              {t.body}
            </p>
          </div>

          {/* Dismiss */}
          <button
            onClick={() => onDismiss(t.id)}
            className="notif-toast-close"
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: "#9ca3af", opacity: 0.6, padding: 2, flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "opacity 0.15s",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}