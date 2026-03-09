import { useState, useEffect, useRef } from "react";
import { useUserChat } from "./useChat.js";

// ─── Helpers ──────────────────────────────────────────────────────
function fmtTime(ts) {
  if (!ts) return "";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

function fmtDate(ts) {
  if (!ts) return "";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  const today = new Date();
  const diff  = today.setHours(0,0,0,0) - d.setHours(0,0,0,0);
  if (diff === 0) return "Today";
  if (diff === 86400000) return "Yesterday";
  return new Date(ts.toDate ? ts.toDate() : ts).toLocaleDateString("en-US", { month:"short", day:"numeric" });
}

// ─── Message bubble ───────────────────────────────────────────────
function Bubble({ msg, isUser }) {
  return (
    <div style={{
      display: "flex",
      flexDirection: isUser ? "row-reverse" : "row",
      alignItems: "flex-end",
      gap: 8,
      marginBottom: 12,
    }}>
      {/* Avatar */}
      {!isUser && (
        <div style={{
          width: 28, height: 28, borderRadius: "50%",
          background: "linear-gradient(135deg,#1a1a8e,#2a3aee)",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
          </svg>
        </div>
      )}
      <div style={{ maxWidth: "72%", display: "flex", flexDirection: "column", alignItems: isUser ? "flex-end" : "flex-start", gap: 3 }}>
        {!isUser && (
          <span style={{ fontSize: 10, color: "#9ca3af", fontWeight: 600, marginLeft: 2 }}>Support Agent</span>
        )}
        <div style={{
          background: isUser ? "linear-gradient(135deg,#1a1a8e,#2563eb)" : "#f3f4f6",
          color: isUser ? "white" : "#1f2937",
          borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
          padding: "10px 14px",
          fontSize: 13.5,
          lineHeight: 1.5,
          boxShadow: isUser ? "0 2px 8px rgba(37,99,235,0.25)" : "0 1px 3px rgba(0,0,0,0.06)",
        }}>
          {msg.text}
        </div>
        <span style={{ fontSize: 10, color: "#d1d5db", marginRight: isUser ? 2 : 0, marginLeft: isUser ? 0 : 2 }}>
          {fmtTime(msg.timestamp)}
          {isUser && (
            <span style={{ marginLeft: 4, color: msg.read ? "#60a5fa" : "#d1d5db" }}>
              {msg.read ? "✓✓" : "✓"}
            </span>
          )}
        </span>
      </div>
    </div>
  );
}

// ─── Date separator ───────────────────────────────────────────────
function DateSep({ label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "8px 0 14px" }}>
      <div style={{ flex: 1, height: 1, background: "#f3f4f6" }}/>
      <span style={{ fontSize: 10, color: "#9ca3af", fontWeight: 600, whiteSpace: "nowrap" }}>{label}</span>
      <div style={{ flex: 1, height: 1, background: "#f3f4f6" }}/>
    </div>
  );
}

// ─── Typing indicator ─────────────────────────────────────────────
function Typing() {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 8, marginBottom: 12 }}>
      <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#1a1a8e,#2a3aee)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
      </div>
      <div style={{ background: "#f3f4f6", borderRadius: "18px 18px 18px 4px", padding: "12px 16px", display: "flex", gap: 4 }}>
        {[0,1,2].map(i => (
          <span key={i} style={{
            width: 7, height: 7, borderRadius: "50%", background: "#9ca3af",
            display: "inline-block",
            animation: `typingDot 1.2s ${i*0.2}s infinite ease-in-out`,
          }}/>
        ))}
      </div>
    </div>
  );
}

// ─── Quick replies ────────────────────────────────────────────────
const QUICK_REPLIES = [
  "What is my account balance?",
  "I need help with a transfer",
  "How do I update my PIN?",
  "Report a suspicious transaction",
];

// ─── ChatWidget (floating button + panel) ─────────────────────────
export default function ChatWidget() {
  const [open, setOpen]           = useState(false);
  const [input, setInput]         = useState("");
  const [showQuick, setShowQuick] = useState(true);
  const [agentTyping, setAgentTyping] = useState(false);
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  const { messages, loading, sending, sendMessage, markRead, unreadCount } = useUserChat();

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, agentTyping]);

  // Mark read when opened
  useEffect(() => {
    if (open) { markRead(); setShowQuick(messages.length === 0); }
  }, [open, messages.length]);

  // Simulate agent typing briefly after user sends
  useEffect(() => {
    if (messages.length > 0 && messages[messages.length - 1]?.senderRole === "user") {
      setAgentTyping(true);
      const t = setTimeout(() => setAgentTyping(false), 3000);
      return () => clearTimeout(t);
    }
  }, [messages.length]);

  async function handleSend(text) {
    const msg = text || input.trim();
    if (!msg) return;
    setInput("");
    setShowQuick(false);
    await sendMessage(msg);
    inputRef.current?.focus();
  }

  // Group messages by date
  const grouped = [];
  let lastDate = null;
  messages.forEach(m => {
    const d = m.timestamp ? fmtDate(m.timestamp) : null;
    if (d && d !== lastDate) { grouped.push({ type: "date", label: d }); lastDate = d; }
    grouped.push({ type: "msg", ...m });
  });

  return (
    <>
      <style>{`
        @keyframes typingDot {
          0%,60%,100% { transform: translateY(0); opacity:0.4; }
          30% { transform: translateY(-5px); opacity:1; }
        }
        @keyframes widgetPop {
          from { opacity:0; transform: scale(0.85) translateY(20px); }
          to   { opacity:1; transform: scale(1) translateY(0); }
        }
        @keyframes widgetPopMobile {
          from { opacity:0; transform: translateY(40px); }
          to   { opacity:1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(37,99,235,0.4); }
          50%      { box-shadow: 0 0 0 10px rgba(37,99,235,0); }
        }
        .chat-widget-btn { animation: pulse 2.5s infinite; }
        .chat-panel { animation: widgetPop 0.25s cubic-bezier(0.34,1.56,0.64,1) forwards; }
        .chat-input:focus { outline: none; border-color: #2563eb !important; }
        .chat-send-btn:hover { background: #1d4ed8 !important; }
        .chat-send-btn:disabled { opacity: 0.5 !important; cursor: not-allowed !important; }
        .quick-reply-btn:hover { background: #1a1a8e !important; color: white !important; border-color: #1a1a8e !important; }
        .msg-list::-webkit-scrollbar { width: 3px; }
        .msg-list::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 3px; }
        /* Mobile: slide up from bottom, full width centered */
        @media (max-width: 480px) {
          .chat-panel {
            animation: widgetPopMobile 0.3s cubic-bezier(0.32,0.72,0,1) forwards !important;
            position: fixed !important;
            left: 12px !important;
            right: 12px !important;
            bottom: 84px !important;
            top: auto !important;
            width: auto !important;
            max-height: calc(100vh - 110px) !important;
            border-radius: 20px !important;
          }
        }
      `}</style>

      {/* ── Floating button ── */}
      <style>{`
        .chat-fab-wrap {
          position: fixed;
          bottom: 28px;
          right: 28px;
          z-index: 9998;
        }
        @media (max-width: 480px) {
          .chat-fab-wrap {
            bottom: 20px;
            right: 20px;
          }
        }
      `}</style>
      <div className="chat-fab-wrap">
        <button
          onClick={() => setOpen(o => !o)}
          className="chat-widget-btn"
          style={{
            width: 58, height: 58, borderRadius: "50%",
            background: "linear-gradient(135deg,#1a1a8e,#2563eb)",
            border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 20px rgba(37,99,235,0.45)",
            transition: "transform 0.2s",
            transform: open ? "rotate(0deg)" : "rotate(0deg)",
          }}
        >
          {open ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
            </svg>
          )}
        </button>

        {/* Unread badge */}
        {!open && unreadCount > 0 && (
          <span style={{
            position: "absolute", top: -4, right: -4,
            background: "#ef4444", color: "white",
            width: 20, height: 20, borderRadius: "50%",
            fontSize: 11, fontWeight: 800,
            display: "flex", alignItems: "center", justifyContent: "center",
            border: "2px solid white",
          }}>
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </div>

      {/* ── Chat panel ── */}
      {open && (
        <div
          className="chat-panel"
          style={{
            position: "fixed", bottom: 98, right: 28, zIndex: 9997,
            width: 360, maxHeight: 580,
            /* desktop default — mobile overridden by CSS */
            background: "white", borderRadius: 20,
            boxShadow: "0 20px 60px rgba(0,0,0,0.18), 0 4px 20px rgba(0,0,0,0.08)",
            display: "flex", flexDirection: "column", overflow: "hidden",
            fontFamily: "'DM Sans','Trebuchet MS',sans-serif",
          }}
        >
          {/* Header */}
          <div style={{
            background: "linear-gradient(135deg,#1a1a8e 0%,#2563eb 100%)",
            padding: "16px 18px 14px",
            display: "flex", alignItems: "center", gap: 12,
          }}>
            <div style={{ position: "relative" }}>
              <div style={{
                width: 40, height: 40, borderRadius: "50%",
                background: "rgba(255,255,255,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center",
                border: "2px solid rgba(255,255,255,0.3)",
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M12 2L3 6v6c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V6L12 2z"/>
                </svg>
              </div>
              <span style={{
                position: "absolute", bottom: 1, right: 1,
                width: 10, height: 10, borderRadius: "50%",
                background: "#4ade80", border: "2px solid #1a1a8e",
              }}/>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ color: "white", fontWeight: 800, fontSize: 14, margin: 0 }}>Renew Part Bank</p>
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, margin: 0, marginTop: 1 }}>
                Support Agent · Online
              </p>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setOpen(false)} style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: "50%", width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
          </div>

          {/* Status bar */}
          <div style={{ background: "#f0fdf4", borderBottom: "1px solid #dcfce7", padding: "7px 18px", display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", display: "inline-block" }}/>
            <span style={{ fontSize: 11, color: "#16a34a", fontWeight: 600 }}>We typically reply within a few minutes</span>
          </div>

          {/* Messages */}
          <div className="msg-list" style={{ flex: 1, overflowY: "auto", padding: "16px 16px 0" }}>
            {/* Welcome message */}
            {messages.length === 0 && !loading && (
              <div style={{ textAlign: "center", padding: "20px 16px 12px" }}>
                <div style={{ width: 52, height: 52, borderRadius: "50%", background: "linear-gradient(135deg,#1a1a8e,#2563eb)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                </div>
                <p style={{ fontWeight: 800, color: "#1f2937", fontSize: 14, marginBottom: 6 }}>Welcome to Support 👋</p>
                <p style={{ color: "#6b7280", fontSize: 12.5, lineHeight: 1.6 }}>
                  Hi there! How can we help you today? Our team is ready to assist you with any banking questions.
                </p>
              </div>
            )}

            {loading && (
              <div style={{ textAlign: "center", padding: 24 }}>
                <div style={{ width: 24, height: 24, border: "2px solid #e5e7eb", borderTopColor: "#2563eb", borderRadius: "50%", animation: "typingDot 0.8s linear infinite", margin: "0 auto" }}/>
              </div>
            )}

            {grouped.map((item, i) =>
              item.type === "date"
                ? <DateSep key={`d-${i}`} label={item.label} />
                : <Bubble key={item.id} msg={item} isUser={item.senderRole === "user"} />
            )}

            {agentTyping && <Typing />}
            <div ref={bottomRef} style={{ height: 8 }} />
          </div>

          {/* Quick replies */}
          {showQuick && messages.length === 0 && (
            <div style={{ padding: "8px 14px", display: "flex", flexWrap: "wrap", gap: 6, borderTop: "1px solid #f9fafb" }}>
              {QUICK_REPLIES.map(r => (
                <button key={r} className="quick-reply-btn" onClick={() => handleSend(r)}
                  style={{ fontSize: 11.5, fontWeight: 600, color: "#1a1a8e", background: "white", border: "1.5px solid #dbeafe", borderRadius: 20, padding: "5px 12px", cursor: "pointer", transition: "all 0.15s", fontFamily: "'DM Sans','Trebuchet MS',sans-serif" }}>
                  {r}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{ padding: "12px 14px", borderTop: "1px solid #f3f4f6", display: "flex", gap: 8, alignItems: "flex-end", background: "white" }}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder="Type your message..."
              rows={1}
              className="chat-input"
              style={{
                flex: 1, resize: "none", border: "1.5px solid #e5e7eb", borderRadius: 12,
                padding: "9px 12px", fontSize: 13.5, fontFamily: "'DM Sans','Trebuchet MS',sans-serif",
                lineHeight: 1.5, maxHeight: 80, overflowY: "auto", color: "#1f2937",
                transition: "border-color 0.2s",
              }}
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || sending}
              className="chat-send-btn"
              style={{
                width: 38, height: 38, borderRadius: "50%",
                background: "linear-gradient(135deg,#1a1a8e,#2563eb)",
                border: "none", cursor: "pointer", flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "background 0.2s", boxShadow: "0 2px 8px rgba(37,99,235,0.3)",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>

          {/* Footer */}
          <div style={{ background: "#fafafa", borderTop: "1px solid #f3f4f6", padding: "6px", textAlign: "center" }}>
            <span style={{ fontSize: 10, color: "#9ca3af", fontWeight: 500 }}>
              🔒 Secured by Renew Part Bank
            </span>
          </div>
        </div>
      )}
    </>
  );
}