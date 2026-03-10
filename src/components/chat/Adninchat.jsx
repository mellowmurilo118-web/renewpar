import { useState, useEffect, useRef } from "react";
import { useAdminChat } from "./useChat.js";
import { signOut } from "firebase/auth";
import { auth } from "../../utils/firebase/firebase";

// ─── Helpers ──────────────────────────────────────────────────────
function fmtTime(ts) {
  if (!ts) return "";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}
function fmtRelative(ts) {
  if (!ts) return "";
  const d   = ts.toDate ? ts.toDate() : new Date(ts);
  const now = new Date();
  const diff = now - d;
  if (diff < 60000)    return "just now";
  if (diff < 3600000)  return `${Math.floor(diff/60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff/3600000)}h ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// Status colors + labels
const STATUS = {
  open:    { label: "Open",    bg: "#dcfce7", color: "#16a34a", dot: "#4ade80" },
  pending: { label: "Pending", bg: "#fef9c3", color: "#ca8a04", dot: "#facc15" },
  closed:  { label: "Closed",  bg: "#f3f4f6", color: "#6b7280", dot: "#9ca3af" },
};

// ─── Conversation list item ────────────────────────────────────────
function ConvItem({ conv, active, onClick }) {
  const s = STATUS[conv.status] || STATUS.open;
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%", textAlign: "left", padding: "14px 16px",
        background: active ? "#eff6ff" : "white",
        borderLeft: active ? "3px solid #2563eb" : "3px solid transparent",
        border: "none", cursor: "pointer",
        borderBottom: "1px solid #f3f4f6",
        transition: "background 0.15s",
        fontFamily: "'DM Sans','Trebuchet MS',sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
        {/* Avatar */}
        <div style={{ position: "relative", flexShrink: 0 }}>
          <div style={{
            width: 40, height: 40, borderRadius: "50%",
            background: "linear-gradient(135deg,#1a1a8e,#2563eb)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ color: "white", fontWeight: 800, fontSize: 15 }}>
              {(conv.userName || "U").charAt(0).toUpperCase()}
            </span>
          </div>
          <span style={{
            position: "absolute", bottom: 1, right: 1,
            width: 10, height: 10, borderRadius: "50%",
            background: s.dot, border: "2px solid white",
          }}/>
        </div>
        {/* Text */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
            <span style={{ fontWeight: 700, fontSize: 13, color: "#1f2937", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {conv.userName || "Unknown User"}
            </span>
            <span style={{ fontSize: 10, color: "#9ca3af", flexShrink: 0, marginLeft: 6 }}>
              {fmtRelative(conv.lastMessageAt)}
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 12, color: "#6b7280", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 150 }}>
              {conv.lastMessage || "No messages yet"}
            </span>
            {conv.unreadAdmin > 0 && (
              <span style={{
                background: "#2563eb", color: "white",
                borderRadius: "50%", width: 18, height: 18,
                fontSize: 10, fontWeight: 800, flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {conv.unreadAdmin > 9 ? "9+" : conv.unreadAdmin}
              </span>
            )}
          </div>
          <div style={{ marginTop: 5 }}>
            <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: s.bg, color: s.color }}>
              {s.label}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}

// ─── Message bubble ───────────────────────────────────────────────
function Bubble({ msg }) {
  const isAdmin = msg.senderRole === "admin";
  return (
    <div style={{
      display: "flex",
      flexDirection: isAdmin ? "row-reverse" : "row",
      alignItems: "flex-end",
      gap: 8,
      marginBottom: 12,
    }}>
      <div style={{
        width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
        background: isAdmin ? "linear-gradient(135deg,#c8a951,#e0c060)" : "linear-gradient(135deg,#1a1a8e,#2563eb)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <span style={{ color: "white", fontSize: 11, fontWeight: 800 }}>
          {isAdmin ? "A" : (msg.senderName || "U").charAt(0).toUpperCase()}
        </span>
      </div>
      <div style={{ maxWidth: "68%", display: "flex", flexDirection: "column", alignItems: isAdmin ? "flex-end" : "flex-start", gap: 3 }}>
        <span style={{ fontSize: 10, color: "#9ca3af", fontWeight: 600 }}>
          {isAdmin ? "You (Support)" : msg.senderName}
        </span>
        <div style={{
          background: isAdmin ? "linear-gradient(135deg,#1a1a8e,#2563eb)" : "#f3f4f6",
          color: isAdmin ? "white" : "#1f2937",
          borderRadius: isAdmin ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
          padding: "10px 14px",
          fontSize: 13.5, lineHeight: 1.5,
          boxShadow: isAdmin ? "0 2px 8px rgba(37,99,235,0.25)" : "0 1px 3px rgba(0,0,0,0.06)",
        }}>
          {msg.text}
        </div>
        <span style={{ fontSize: 10, color: "#d1d5db" }}>{fmtTime(msg.timestamp)}</span>
      </div>
    </div>
  );
}

// ─── Canned responses ─────────────────────────────────────────────
const CANNED = [
  "Hello! How can I assist you today?",
  "Thank you for contacting Renew Part Bank support.",
  "I can see your account details. Let me look into this for you.",
  "Your request has been processed successfully.",
  "For security purposes, please verify your identity.",
  "Is there anything else I can help you with?",
  "Your issue has been escalated to our specialist team.",
  "Please allow 2-3 business days for this to reflect.",
];

// ─── Admin Chat Page ──────────────────────────────────────────────
export default function AdminChat() {
  const [selectedId, setSelectedId]   = useState(null);
  const [input, setInput]             = useState("");
  const [search, setSearch]           = useState("");
  const [showCanned, setShowCanned]   = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  async function handleLogout() {
    try { await signOut(auth); window.location.href = "/login"; } catch (e) { console.error(e); }
  }

  const { conversations, messages, sending, loadingMsgs, sendMessage, setStatus, totalUnread } = useAdminChat(selectedId);

  const selectedConv = conversations.find(c => c.id === selectedId);

  const filtered = conversations.filter(c =>
    !search || (c.userName || "").toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(text) {
    const msg = text || input.trim();
    if (!msg) return;
    setInput("");
    setShowCanned(false);
    await sendMessage(msg);
    inputRef.current?.focus();
  }

  return (
    <div style={{
      display: "flex", height: "100vh", background: "#f8fafc",
      fontFamily: "'DM Sans','Trebuchet MS',sans-serif",
      overflow: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,600;9..40,700;9..40,800&display=swap');
        .admin-input:focus { outline: none; border-color: #2563eb !important; }
        .conv-item:hover { background: #f9fafb !important; }
        .canned-item:hover { background: #eff6ff !important; color: #1a1a8e !important; }
        .admin-scroll::-webkit-scrollbar { width: 3px; }
        .admin-scroll::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 3px; }
        @keyframes fadeIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
        .fade-in { animation: fadeIn 0.2s ease forwards; }
      `}</style>

      {/* ── Sidebar ── */}
      <div style={{
        width: sidebarOpen ? 300 : 0, minWidth: sidebarOpen ? 300 : 0,
        background: "white", borderRight: "1px solid #f0f0f0",
        display: "flex", flexDirection: "column",
        transition: "width 0.25s ease, min-width 0.25s ease",
        overflow: "hidden",
      }}>
        {/* Sidebar header */}
        <div style={{ padding: "20px 16px 12px", borderBottom: "1px solid #f3f4f6" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div>
              <h2 style={{ fontWeight: 900, fontSize: 16, color: "#1f2937", margin: 0 }}>Support Inbox</h2>
              {totalUnread > 0 && (
                <p style={{ fontSize: 11, color: "#6b7280", margin: "2px 0 0", fontWeight: 500 }}>
                  {totalUnread} unread message{totalUnread !== 1 ? "s" : ""}
                </p>
              )}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ background: "#eff6ff", color: "#2563eb", fontWeight: 800, fontSize: 12, padding: "3px 10px", borderRadius: 20 }}>
                {conversations.length}
              </span>
              <button
                onClick={handleLogout}
                title="Logout"
                style={{ display: "flex", alignItems: "center", gap: 6, background: "#fff1f2", border: "1.5px solid #fecdd3", borderRadius: 8, padding: "5px 10px", cursor: "pointer", color: "#dc2626", fontWeight: 700, fontSize: 12, fontFamily: "'DM Sans','Trebuchet MS',sans-serif", transition: "background 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.background = "#ffe4e6"}
                onMouseLeave={e => e.currentTarget.style.background = "#fff1f2"}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                Logout
              </button>
            </div>
          </div>
          {/* Search */}
          <div style={{ position: "relative" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }}>
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search conversations..."
              className="admin-input"
              style={{ width: "100%", paddingLeft: 30, paddingRight: 10, paddingTop: 8, paddingBottom: 8, border: "1.5px solid #e5e7eb", borderRadius: 10, fontSize: 12.5, fontFamily: "'DM Sans','Trebuchet MS',sans-serif", background: "#fafafa", boxSizing: "border-box" }}
            />
          </div>
        </div>

        {/* Conversation list */}
        <div className="admin-scroll" style={{ flex: 1, overflowY: "auto" }}>
          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "40px 20px", color: "#9ca3af" }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" style={{ margin: "0 auto 8px", display: "block" }}>
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
              </svg>
              <p style={{ fontSize: 12, fontWeight: 600 }}>No conversations yet</p>
            </div>
          )}
          {filtered.map(conv => (
            <ConvItem key={conv.id} conv={conv} active={conv.id === selectedId} onClick={() => setSelectedId(conv.id)} />
          ))}
        </div>
      </div>

      {/* ── Main chat area ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

        {/* Top bar */}
        <div style={{
          height: 65, background: "white", borderBottom: "1px solid #f0f0f0",
          display: "flex", alignItems: "center", padding: "0 20px", gap: 14,
        }}>
          <button
            onClick={() => setSidebarOpen(o => !o)}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 6, borderRadius: 8, color: "#6b7280", display: "flex" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>

          {selectedConv ? (
            <>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#1a1a8e,#2563eb)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: "white", fontWeight: 800, fontSize: 14 }}>{(selectedConv.userName || "U").charAt(0).toUpperCase()}</span>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 800, fontSize: 14, color: "#1f2937", margin: 0 }}>{selectedConv.userName}</p>
                <p style={{ fontSize: 11, color: "#9ca3af", margin: 0 }}>UID: {selectedConv.uid?.slice(0,12)}...</p>
              </div>
              {/* Status selector */}
              <select
                value={selectedConv.status || "open"}
                onChange={e => setStatus(selectedId, e.target.value)}
                style={{
                  fontSize: 12, fontWeight: 700, padding: "5px 10px", borderRadius: 20,
                  border: "1.5px solid #e5e7eb", background: STATUS[selectedConv.status]?.bg || "#f3f4f6",
                  color: STATUS[selectedConv.status]?.color || "#6b7280",
                  cursor: "pointer", fontFamily: "'DM Sans','Trebuchet MS',sans-serif",
                }}
              >
                <option value="open">Open</option>
                <option value="pending">Pending</option>
                <option value="closed">Closed</option>
              </select>
            </>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#1a1a8e,#2563eb)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M12 2L3 6v6c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V6L12 2z"/></svg>
              </div>
              <div>
                <p style={{ fontWeight: 800, fontSize: 14, color: "#1f2937", margin: 0 }}>Renew Part Bank</p>
                <p style={{ fontSize: 11, color: "#9ca3af", margin: 0 }}>Customer Support Panel</p>
              </div>
            </div>
          )}

          {selectedConv && totalUnread > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#fef3c7", padding: "4px 12px", borderRadius: 20 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#f59e0b", display: "inline-block" }}/>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#92400e" }}>{totalUnread} unread</span>
            </div>
          )}
        </div>

        {/* No conversation selected */}
        {!selectedId && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#9ca3af" }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#93c5fd" strokeWidth="1.5">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
              </svg>
            </div>
            <p style={{ fontWeight: 700, fontSize: 15, color: "#6b7280", marginBottom: 6 }}>Select a conversation</p>
            <p style={{ fontSize: 13, color: "#9ca3af" }}>Choose a customer from the inbox to start chatting</p>
          </div>
        )}

        {/* Messages */}
        {selectedId && (
          <>
            <div className="admin-scroll fade-in" style={{ flex: 1, overflowY: "auto", padding: "20px 24px 0" }}>
              {loadingMsgs && (
                <div style={{ textAlign: "center", padding: 30 }}>
                  <div style={{ width: 24, height: 24, border: "2px solid #e5e7eb", borderTopColor: "#2563eb", borderRadius: "50%", animation: "spin 0.7s linear infinite", margin: "0 auto" }}/>
                </div>
              )}
              {!loadingMsgs && messages.length === 0 && (
                <div style={{ textAlign: "center", padding: "40px 20px", color: "#9ca3af" }}>
                  <p style={{ fontSize: 13, fontWeight: 600 }}>No messages yet. Send the first message!</p>
                </div>
              )}
              {messages.map(msg => <Bubble key={msg.id} msg={msg} />)}
              <div ref={bottomRef} style={{ height: 12 }} />
            </div>

            {/* Input area */}
            <div style={{ background: "white", borderTop: "1px solid #f3f4f6", padding: "12px 16px" }}>
              {/* Canned responses */}
              {showCanned && (
                <div style={{
                  background: "white", border: "1px solid #e5e7eb", borderRadius: 12,
                  marginBottom: 10, maxHeight: 200, overflowY: "auto",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                }}>
                  <p style={{ fontSize: 10, fontWeight: 800, color: "#9ca3af", padding: "8px 14px 4px", textTransform: "uppercase", letterSpacing: "0.08em", margin: 0 }}>
                    Quick Replies
                  </p>
                  {CANNED.map((c, i) => (
                    <button key={i} onClick={() => { setInput(c); setShowCanned(false); inputRef.current?.focus(); }}
                      className="canned-item"
                      style={{ width: "100%", textAlign: "left", padding: "9px 14px", background: "none", border: "none", cursor: "pointer", fontSize: 12.5, color: "#374151", fontFamily: "'DM Sans','Trebuchet MS',sans-serif", borderBottom: i < CANNED.length-1 ? "1px solid #f9fafb" : "none", transition: "background 0.15s" }}>
                      {c}
                    </button>
                  ))}
                </div>
              )}

              <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
                {/* Canned toggle */}
                <button
                  onClick={() => setShowCanned(o => !o)}
                  title="Quick replies"
                  style={{
                    width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                    background: showCanned ? "#eff6ff" : "#f9fafb",
                    border: "1.5px solid " + (showCanned ? "#bfdbfe" : "#e5e7eb"),
                    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                    color: showCanned ? "#2563eb" : "#6b7280",
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                  </svg>
                </button>

                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                  placeholder="Type a reply... (Enter to send, Shift+Enter for new line)"
                  rows={2}
                  className="admin-input"
                  style={{
                    flex: 1, resize: "none", border: "1.5px solid #e5e7eb", borderRadius: 12,
                    padding: "9px 12px", fontSize: 13.5, lineHeight: 1.5,
                    fontFamily: "'DM Sans','Trebuchet MS',sans-serif", color: "#1f2937",
                    maxHeight: 100, overflowY: "auto", transition: "border-color 0.2s",
                  }}
                />

                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || sending}
                  style={{
                    width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
                    background: !input.trim() || sending ? "#e5e7eb" : "linear-gradient(135deg,#1a1a8e,#2563eb)",
                    border: "none", cursor: !input.trim() || sending ? "not-allowed" : "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "background 0.2s", boxShadow: input.trim() ? "0 2px 8px rgba(37,99,235,0.3)" : "none",
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                    <line x1="22" y1="2" x2="11" y2="13"/>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                  </svg>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}