// ─────────────────────────────────────────────────────────────────
// Chatlauncher.jsx  —  iOS-safe complete rewrite
//
// Bug fixes vs original:
//
// 1. HOOK ISOLATION (critical iOS crash fix):
//    Original called useUserChat() AND useAdminChat() at the top level
//    of ChatLauncher for EVERY user. useAdminChat() fires a Firestore
//    onSnapshot on the conversations collection — regular users don't
//    have permission to read this. On iOS Safari, the resulting
//    permission-denied error from Firebase propagates as an unhandled
//    rejection that crashes the entire component tree silently, leaving
//    the dashboard blank after PIN entry.
//    Fix: useUserChat is only called inside UserChatShell (non-admins).
//         useAdminChat is only called inside AdminChatShell (admins).
//         Each hook runs ONCE — data is passed down as props.
//
// 2. NO DOUBLE HOOK CALLS:
//    Original UserChatShell called useUserChat() for the badge count,
//    then CustomerChatWidget called it again internally = two Firebase
//    listeners, potential duplicate writes, race conditions.
//    Fix: hook called once in the shell, data passed as props.
//
// 3. iOS VIEWPORT HEIGHT:
//    Mobile panel used calc(100vh - 110px) which is broken on iOS.
//    Fixed to use calc(100dvh - 110px) with vh fallback.
//
// 4. TEXTAREA FONT SIZE:
//    Inputs < 16px trigger iOS auto-zoom. Fixed to 16px.
// ─────────────────────────────────────────────────────────────────

import { useState, useEffect, useRef } from "react";
import { useAdmin }                    from "./useAdmin.js";
import { useUserChat }                 from "./useChat.js";
import { useAdminChat }                from "./useChat.js";
import { useChatNotifications, ToastContainer } from "./Usechatnotification.jsx";

// ─── Shared helpers ───────────────────────────────────────────────
function fmtTime(ts) {
  if (!ts) return "";
  try {
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  } catch (_) { return ""; }
}
function fmtDate(ts) {
  if (!ts) return "";
  try {
    const d  = ts.toDate ? ts.toDate() : new Date(ts);
    const now = new Date();
    const diff = new Date(now.setHours(0,0,0,0)) - new Date(new Date(d).setHours(0,0,0,0));
    if (diff === 0)         return "Today";
    if (diff === 86400000)  return "Yesterday";
    return d.toLocaleDateString("en-US", { month:"short", day:"numeric" });
  } catch (_) { return ""; }
}

// ─── Global styles ────────────────────────────────────────────────
const SHARED_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,600;9..40,700;9..40,800;9..40,900&display=swap');

  @keyframes typingDot {
    0%,60%,100% { transform:translateY(0); opacity:0.4; }
    30%          { transform:translateY(-5px); opacity:1; }
  }
  @keyframes widgetPop {
    from { opacity:0; transform:scale(0.88) translateY(16px); }
    to   { opacity:1; transform:scale(1) translateY(0); }
  }
  @keyframes widgetPopMobile {
    from { opacity:0; transform:translateY(30px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes pulseFab {
    0%,100% { box-shadow:0 0 0 0 rgba(37,99,235,0.45); }
    50%      { box-shadow:0 0 0 12px rgba(37,99,235,0); }
  }
  @keyframes adminPulseFab {
    0%,100% { box-shadow:0 0 0 0 rgba(200,169,81,0.5); }
    50%      { box-shadow:0 0 0 12px rgba(200,169,81,0); }
  }
  @keyframes spin { to { transform:rotate(360deg); } }

  .chat-fab        { animation: pulseFab 2.5s infinite; }
  .chat-fab-admin  { animation: adminPulseFab 2.5s infinite; }
  .chat-panel      { animation: widgetPop 0.25s cubic-bezier(0.34,1.56,0.64,1) forwards; }
  .chat-input:focus { outline:none; border-color:#2563eb !important; box-shadow:0 0 0 3px rgba(37,99,235,0.1) !important; }
  .chat-send:hover:not(:disabled) { filter:brightness(1.12); }
  .chat-send:disabled { opacity:0.45 !important; cursor:not-allowed; }
  .qr-btn:hover { background:#1a1a8e !important; color:white !important; border-color:#1a1a8e !important; }
  .canned-row:hover { background:#eff6ff !important; color:#1a1a8e !important; }
  .msg-scroll::-webkit-scrollbar { width:3px; }
  .msg-scroll::-webkit-scrollbar-thumb { background:#e5e7eb; border-radius:3px; }
  .conv-row:hover { background:#f9fafb !important; }

  .chat-fab-wrap { position:fixed; bottom:28px; right:28px; z-index:9998; }

  @media (max-width:480px) {
    .chat-fab-wrap { bottom:20px; right:20px; }
    .chat-panel {
      animation: widgetPopMobile 0.28s cubic-bezier(0.32,0.72,0,1) forwards !important;
      left:12px !important; right:12px !important;
      bottom:84px !important; top:auto !important;
      width:auto !important;
      max-height:calc(100vh - 110px) !important;
      max-height:calc(100dvh - 110px) !important;
      border-radius:20px !important;
    }
  }
`;

// ─── Typing dots ──────────────────────────────────────────────────
function TypingDots() {
  return (
    <div style={{ display:"flex", alignItems:"flex-end", gap:8, marginBottom:12 }}>
      <div style={{ width:28, height:28, borderRadius:"50%", background:"linear-gradient(135deg,#1a1a8e,#2563eb)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
      </div>
      <div style={{ background:"#f3f4f6", borderRadius:"18px 18px 18px 4px", padding:"11px 15px", display:"flex", gap:4 }}>
        {[0,1,2].map(i => (
          <span key={i} style={{ width:6, height:6, borderRadius:"50%", background:"#9ca3af", display:"inline-block", animation:`typingDot 1.2s ${i*0.2}s infinite` }}/>
        ))}
      </div>
    </div>
  );
}

// ─── Date separator ───────────────────────────────────────────────
function DateSep({ label }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:10, margin:"6px 0 12px" }}>
      <div style={{ flex:1, height:1, background:"#f3f4f6" }}/>
      <span style={{ fontSize:10, color:"#9ca3af", fontWeight:700, whiteSpace:"nowrap" }}>{label}</span>
      <div style={{ flex:1, height:1, background:"#f3f4f6" }}/>
    </div>
  );
}

// ─── Message bubble ───────────────────────────────────────────────
function Bubble({ msg, viewerRole }) {
  const isMine =
    (viewerRole === "user"  && msg.senderRole === "user") ||
    (viewerRole === "admin" && msg.senderRole === "admin");
  return (
    <div style={{ display:"flex", flexDirection:isMine?"row-reverse":"row", alignItems:"flex-end", gap:8, marginBottom:10 }}>
      {!isMine && (
        <div style={{ width:28, height:28, borderRadius:"50%", flexShrink:0, background: viewerRole==="admin" ? "linear-gradient(135deg,#c8a951,#e0c060)" : "linear-gradient(135deg,#1a1a8e,#2563eb)", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <span style={{ color:"white", fontWeight:800, fontSize:11 }}>
            {viewerRole==="admin" ? (msg.senderName||"U").charAt(0).toUpperCase() : "A"}
          </span>
        </div>
      )}
      <div style={{ maxWidth:"72%", display:"flex", flexDirection:"column", alignItems:isMine?"flex-end":"flex-start", gap:2 }}>
        {!isMine && (
          <span style={{ fontSize:10, color:"#9ca3af", fontWeight:600, marginLeft:2 }}>
            {viewerRole==="admin" ? (msg.senderName||"Customer") : "Support Agent"}
          </span>
        )}
        <div style={{
          background: isMine ? "linear-gradient(135deg,#1a1a8e,#2563eb)" : "#f3f4f6",
          color: isMine ? "white" : "#1f2937",
          borderRadius: isMine ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
          padding:"10px 14px", fontSize:13.5, lineHeight:1.5,
          boxShadow: isMine ? "0 2px 10px rgba(37,99,235,0.22)" : "0 1px 3px rgba(0,0,0,0.05)",
        }}>
          {msg.text}
        </div>
        <span style={{ fontSize:10, color:"#d1d5db", margin:isMine?"0 2px 0 0":"0 0 0 2px" }}>
          {fmtTime(msg.timestamp)}
          {isMine && <span style={{ marginLeft:3, color: msg.read ? "#60a5fa" : "#d1d5db" }}>{msg.read ? " ✓✓" : " ✓"}</span>}
        </span>
      </div>
    </div>
  );
}

// ─── FAB ──────────────────────────────────────────────────────────
function FAB({ isAdmin, unread, onClick, open }) {
  return (
    <div className="chat-fab-wrap">
      <button onClick={onClick} className={isAdmin ? "chat-fab-admin" : "chat-fab"}
        style={{
          width:56, height:56, borderRadius:"50%", border:"none", cursor:"pointer",
          background: isAdmin ? "linear-gradient(135deg,#1a1a5e,#c8a951)" : "linear-gradient(135deg,#1a1a8e,#2563eb)",
          display:"flex", alignItems:"center", justifyContent:"center",
          boxShadow:"0 4px 18px rgba(0,0,0,0.2)",
          transition:"transform 0.2s",
          transform: open ? "rotate(90deg)" : "rotate(0deg)",
        }}>
        {open
          ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          : <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
        }
      </button>
      {isAdmin && !open && (
        <span style={{ position:"absolute", top:-4, left:-4, background:"#c8a951", color:"white", fontSize:8, fontWeight:900, padding:"2px 5px", borderRadius:20, border:"2px solid white", letterSpacing:"0.05em" }}>ADMIN</span>
      )}
      {!open && unread > 0 && (
        <span style={{ position:"absolute", top:-4, right:-4, background:"#ef4444", color:"white", width:20, height:20, borderRadius:"50%", fontSize:10, fontWeight:800, border:"2px solid white", display:"flex", alignItems:"center", justifyContent:"center" }}>
          {unread > 9 ? "9+" : unread}
        </span>
      )}
    </div>
  );
}

// ─── CUSTOMER CHAT PANEL ─────────────────────────────────────────
// Props come from UserChatShell — hook is NOT called here
const QUICK_REPLIES = [
  "What is my account balance?",
  "I need help with a transfer",
  "How do I update my PIN?",
  "Report a suspicious transaction",
  "Request a bank statement",
];

function CustomerChatPanel({ open, onClose, messages, loading, sending, sendMessage, markRead }) {
  const [input, setInput]             = useState("");
  const [showQuick, setShowQuick]     = useState(true);
  const [agentTyping, setAgentTyping] = useState(false);
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  const { toasts, dismissToast } = useChatNotifications({ messages, role:"user", chatOpen: open });

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:"smooth" }); }, [messages, agentTyping]);
  useEffect(() => {
    if (open) { markRead(); setShowQuick(messages.length === 0); }
  }, [open, messages.length]);

  useEffect(() => {
    if (messages.length && messages[messages.length-1]?.senderRole === "user") {
      setAgentTyping(true);
      const t = setTimeout(() => setAgentTyping(false), 2800);
      return () => clearTimeout(t);
    }
  }, [messages.length]);

  async function handleSend(text) {
    const msg = (text || input).trim();
    if (!msg) return;
    setInput(""); setShowQuick(false);
    await sendMessage(msg);
    inputRef.current?.focus();
  }

  const grouped = [];
  let lastDate = null;
  messages.forEach(m => {
    const d = m.timestamp ? fmtDate(m.timestamp) : null;
    if (d && d !== lastDate) { grouped.push({ type:"date", label:d }); lastDate = d; }
    grouped.push({ type:"msg", ...m });
  });

  return (
    <>
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      {open && (
        <div className="chat-panel" style={{
          position:"fixed", bottom:98, right:28, zIndex:9997,
          width:358, maxHeight:580,
          background:"white", borderRadius:20,
          boxShadow:"0 20px 60px rgba(0,0,0,0.16), 0 4px 20px rgba(0,0,0,0.08)",
          display:"flex", flexDirection:"column", overflow:"hidden",
          fontFamily:"'DM Sans','Trebuchet MS',sans-serif",
        }}>
          {/* Header */}
          <div style={{ background:"linear-gradient(135deg,#1a1a8e,#2563eb)", padding:"15px 16px 13px", display:"flex", alignItems:"center", gap:11 }}>
            <div style={{ position:"relative" }}>
              <div style={{ width:38, height:38, borderRadius:"50%", background:"rgba(255,255,255,0.15)", border:"2px solid rgba(255,255,255,0.3)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M12 2L3 6v6c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V6L12 2z"/></svg>
              </div>
              <span style={{ position:"absolute", bottom:1, right:1, width:9, height:9, borderRadius:"50%", background:"#4ade80", border:"2px solid #1a1a8e" }}/>
            </div>
            <div style={{ flex:1 }}>
              <p style={{ color:"white", fontWeight:800, fontSize:14, margin:0 }}>Renew Part Bank</p>
              <p style={{ color:"rgba(255,255,255,0.65)", fontSize:11, margin:"1px 0 0" }}>Support · Online</p>
            </div>
            <button onClick={onClose} style={{ background:"rgba(255,255,255,0.12)", border:"none", borderRadius:"50%", width:28, height:28, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          {/* Status bar */}
          <div style={{ background:"#f0fdf4", borderBottom:"1px solid #dcfce7", padding:"6px 16px", display:"flex", alignItems:"center", gap:6 }}>
            <span style={{ width:6, height:6, borderRadius:"50%", background:"#4ade80", display:"inline-block" }}/>
            <span style={{ fontSize:11, color:"#16a34a", fontWeight:600 }}>We typically reply within a few minutes</span>
          </div>

          {/* Messages */}
          <div className="msg-scroll" style={{ flex:1, overflowY:"auto", padding:"14px 14px 0", WebkitOverflowScrolling:"touch" }}>
            {messages.length === 0 && !loading && (
              <div style={{ textAlign:"center", padding:"22px 14px 10px" }}>
                <div style={{ width:50, height:50, borderRadius:"50%", background:"linear-gradient(135deg,#1a1a8e,#2563eb)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 11px" }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                </div>
                <p style={{ fontWeight:800, color:"#1f2937", fontSize:14, marginBottom:5 }}>Welcome to Support 👋</p>
                <p style={{ color:"#6b7280", fontSize:12.5, lineHeight:1.6, margin:0 }}>How can we help you today?</p>
              </div>
            )}
            {loading && (
              <div style={{ display:"flex", justifyContent:"center", padding:20 }}>
                <div style={{ width:22, height:22, border:"2px solid #e5e7eb", borderTopColor:"#2563eb", borderRadius:"50%", animation:"spin 0.7s linear infinite" }}/>
              </div>
            )}
            {grouped.map((item, i) =>
              item.type === "date"
                ? <DateSep key={`d${i}`} label={item.label} />
                : <Bubble key={item.id} msg={item} viewerRole="user" />
            )}
            {agentTyping && <TypingDots />}
            <div ref={bottomRef} style={{ height:8 }}/>
          </div>

          {/* Quick replies */}
          {showQuick && messages.length === 0 && (
            <div style={{ padding:"8px 12px 4px", display:"flex", flexWrap:"wrap", gap:6, borderTop:"1px solid #f9fafb" }}>
              {QUICK_REPLIES.map(r => (
                <button key={r} className="qr-btn" onClick={() => handleSend(r)}
                  style={{ fontSize:11, fontWeight:600, color:"#1a1a8e", background:"white", border:"1.5px solid #dbeafe", borderRadius:20, padding:"4px 11px", cursor:"pointer", fontFamily:"inherit" }}>
                  {r}
                </button>
              ))}
            </div>
          )}

          {/* Input — font-size:16px prevents iOS auto-zoom */}
          <div style={{ padding:"10px 12px", borderTop:"1px solid #f3f4f6", display:"flex", gap:8, alignItems:"flex-end" }}>
            <textarea ref={inputRef} value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key==="Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder="Type your message..."
              rows={1} className="chat-input"
              style={{ flex:1, resize:"none", border:"1.5px solid #e5e7eb", borderRadius:12, padding:"8px 11px", fontSize:16, fontFamily:"inherit", lineHeight:1.5, maxHeight:76, overflowY:"auto", color:"#1f2937", WebkitAppearance:"none" }}
            />
            <button onClick={() => handleSend()} disabled={!input.trim()||sending} className="chat-send"
              style={{ width:36, height:36, borderRadius:"50%", background:"linear-gradient(135deg,#1a1a8e,#2563eb)", border:"none", cursor:"pointer", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 2px 8px rgba(37,99,235,0.3)" }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </button>
          </div>

          <div style={{ background:"#fafafa", borderTop:"1px solid #f3f4f6", padding:"5px", textAlign:"center" }}>
            <span style={{ fontSize:10, color:"#9ca3af" }}>🔒 Secured by Renew Part Bank</span>
          </div>
        </div>
      )}
    </>
  );
}

// ─── ADMIN CHAT PANEL ─────────────────────────────────────────────
// Props come from AdminChatShell — hook is NOT called here
const CANNED = [
  "Hello! How can I assist you today?",
  "Thank you for contacting Renew Part Bank support.",
  "I can see your account details — let me check that for you.",
  "Your request has been processed successfully.",
  "For security purposes, please verify your identity.",
  "Is there anything else I can help you with?",
  "Your issue has been escalated to our specialist team.",
  "Please allow 2-3 business days for this to reflect.",
];

function AdminChatPanel({ open, onClose, conversations, messages, sending, loadingMsgs, sendMessage, setStatus, selectedId, setSelectedId }) {
  const [input, setInput]     = useState("");
  const [showCanned, setShowCanned] = useState(false);
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  const { toasts, dismissToast } = useChatNotifications({ messages, role:"admin", chatOpen: open });
  const selectedConv = conversations.find(c => c.id === selectedId);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:"smooth" }); }, [messages]);

  async function handleSend(text) {
    const msg = (text || input).trim();
    if (!msg) return;
    setInput(""); setShowCanned(false);
    await sendMessage(msg);
    inputRef.current?.focus();
  }

  const STATUS_STYLE = {
    open:    { bg:"#dcfce7", color:"#16a34a" },
    pending: { bg:"#fef9c3", color:"#ca8a04" },
    closed:  { bg:"#f3f4f6", color:"#6b7280" },
  };

  return (
    <>
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      {open && (
        <div className="chat-panel" style={{
          position:"fixed", bottom:98, right:28, zIndex:9997,
          width:680, height:560, maxHeight:"80vh",
          background:"white", borderRadius:20,
          boxShadow:"0 20px 60px rgba(0,0,0,0.16)",
          display:"flex", overflow:"hidden",
          fontFamily:"'DM Sans','Trebuchet MS',sans-serif",
          border:"1px solid #f0f0f0",
        }}>
          {/* Conversation list */}
          <div style={{ width:230, borderRight:"1px solid #f3f4f6", display:"flex", flexDirection:"column", flexShrink:0 }}>
            <div style={{ padding:"14px 14px 10px", borderBottom:"1px solid #f3f4f6", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <p style={{ fontWeight:900, fontSize:13, color:"#1f2937", margin:0 }}>Inbox</p>
              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                <span style={{ background:"#eff6ff", color:"#2563eb", fontWeight:800, fontSize:11, padding:"2px 8px", borderRadius:20 }}>{conversations.length}</span>
                <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", color:"#9ca3af", display:"flex", padding:2 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
            </div>
            <div className="msg-scroll" style={{ flex:1, overflowY:"auto", WebkitOverflowScrolling:"touch" }}>
              {conversations.length === 0 && (
                <p style={{ textAlign:"center", padding:"30px 16px", color:"#9ca3af", fontSize:11, fontWeight:600 }}>No conversations</p>
              )}
              {conversations.map(conv => {
                const s = STATUS_STYLE[conv.status] || STATUS_STYLE.open;
                const active = conv.id === selectedId;
                return (
                  <button key={conv.id} className="conv-row" onClick={() => setSelectedId(conv.id)}
                    style={{ width:"100%", textAlign:"left", padding:"11px 12px", background:active?"#eff6ff":"white", borderLeft:`3px solid ${active?"#2563eb":"transparent"}`, border:"none", borderBottom:"1px solid #f9fafb", cursor:"pointer", fontFamily:"inherit" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:9 }}>
                      <div style={{ width:34, height:34, borderRadius:"50%", background:"linear-gradient(135deg,#1a1a8e,#2563eb)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                        <span style={{ color:"white", fontWeight:800, fontSize:13 }}>{(conv.userName||"U").charAt(0).toUpperCase()}</span>
                      </div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                          <span style={{ fontWeight:700, fontSize:12, color:"#1f2937", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:100 }}>{conv.userName||"User"}</span>
                          {conv.unreadAdmin > 0 && (
                            <span style={{ background:"#2563eb", color:"white", borderRadius:"50%", width:16, height:16, fontSize:9, fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                              {conv.unreadAdmin > 9 ? "9+" : conv.unreadAdmin}
                            </span>
                          )}
                        </div>
                        <p style={{ fontSize:11, color:"#9ca3af", margin:"2px 0 3px", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{conv.lastMessage||"No messages"}</p>
                        <span style={{ fontSize:9, fontWeight:700, padding:"1px 7px", borderRadius:20, background:s.bg, color:s.color }}>{conv.status||"open"}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Chat pane */}
          <div style={{ flex:1, display:"flex", flexDirection:"column", minWidth:0 }}>
            {!selectedId ? (
              <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
                <p style={{ fontWeight:700, fontSize:13, color:"#6b7280", margin:"0 0 4px" }}>Select a conversation</p>
                <p style={{ fontSize:12, color:"#9ca3af", margin:0 }}>Pick a customer from the inbox</p>
              </div>
            ) : (
              <>
                <div style={{ padding:"12px 16px", borderBottom:"1px solid #f3f4f6", display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ fontWeight:800, fontSize:13, color:"#1f2937", margin:0 }}>{selectedConv?.userName}</p>
                    <p style={{ fontSize:10, color:"#9ca3af", margin:0 }}>ID: {selectedConv?.uid?.slice(0,10)}...</p>
                  </div>
                  <select value={selectedConv?.status||"open"} onChange={e => setStatus(selectedId, e.target.value)}
                    style={{ fontSize:11, fontWeight:700, padding:"3px 8px", borderRadius:20, border:"1.5px solid #e5e7eb", cursor:"pointer", fontFamily:"inherit", WebkitAppearance:"none" }}>
                    <option value="open">Open</option>
                    <option value="pending">Pending</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>

                <div className="msg-scroll" style={{ flex:1, overflowY:"auto", padding:"14px 14px 0", WebkitOverflowScrolling:"touch" }}>
                  {loadingMsgs && <div style={{ display:"flex", justifyContent:"center", padding:20 }}><div style={{ width:20, height:20, border:"2px solid #e5e7eb", borderTopColor:"#2563eb", borderRadius:"50%", animation:"spin 0.7s linear infinite" }}/></div>}
                  {!loadingMsgs && messages.length === 0 && <p style={{ textAlign:"center", padding:"30px 16px", color:"#9ca3af", fontSize:12 }}>No messages yet</p>}
                  {messages.map(msg => <Bubble key={msg.id} msg={msg} viewerRole="admin" />)}
                  <div ref={bottomRef} style={{ height:10 }}/>
                </div>

                <div style={{ padding:"10px 12px", borderTop:"1px solid #f3f4f6" }}>
                  {showCanned && (
                    <div style={{ background:"white", border:"1px solid #e5e7eb", borderRadius:12, marginBottom:8, maxHeight:160, overflowY:"auto", WebkitOverflowScrolling:"touch" }}>
                      {CANNED.map((c,i) => (
                        <button key={i} className="canned-row" onClick={() => { setInput(c); setShowCanned(false); inputRef.current?.focus(); }}
                          style={{ width:"100%", textAlign:"left", padding:"7px 12px", background:"none", border:"none", cursor:"pointer", fontSize:12, color:"#374151", fontFamily:"inherit", borderBottom:i<CANNED.length-1?"1px solid #f9fafb":"none" }}>
                          {c}
                        </button>
                      ))}
                    </div>
                  )}
                  <div style={{ display:"flex", gap:8, alignItems:"flex-end" }}>
                    <button onClick={() => setShowCanned(o=>!o)}
                      style={{ width:32, height:32, borderRadius:8, flexShrink:0, background:showCanned?"#eff6ff":"#f9fafb", border:`1.5px solid ${showCanned?"#bfdbfe":"#e5e7eb"}`, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                    </button>
                    <textarea ref={inputRef} value={input} onChange={e => setInput(e.target.value)}
                      onKeyDown={e => { if (e.key==="Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                      placeholder="Reply... (Enter to send)" rows={2} className="chat-input"
                      style={{ flex:1, resize:"none", border:"1.5px solid #e5e7eb", borderRadius:10, padding:"8px 11px", fontSize:16, fontFamily:"inherit", lineHeight:1.5, maxHeight:80, overflowY:"auto", color:"#1f2937", WebkitAppearance:"none" }}
                    />
                    <button onClick={() => handleSend()} disabled={!input.trim()||sending} className="chat-send"
                      style={{ width:36, height:36, borderRadius:"50%", background:"linear-gradient(135deg,#1a1a8e,#2563eb)", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

// ─── USER CHAT SHELL ──────────────────────────────────────────────
// useUserChat() called ONCE here. Data passed as props to panel.
function UserChatShell() {
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null); // unused for user but keeps pattern
  const chatData = useUserChat();

  return (
    <>
      <FAB isAdmin={false} unread={chatData.unreadCount} open={open} onClick={() => setOpen(o => !o)} />
      <CustomerChatPanel
        open={open}
        onClose={() => setOpen(false)}
        messages={chatData.messages}
        loading={chatData.loading}
        sending={chatData.sending}
        sendMessage={chatData.sendMessage}
        markRead={chatData.markRead}
      />
    </>
  );
}

// ─── ADMIN CHAT SHELL ─────────────────────────────────────────────
// useAdminChat() called ONCE here. Data passed as props to panel.
function AdminChatShell() {
  const [open, setOpen]           = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const chatData = useAdminChat(selectedId);

  return (
    <>
      <FAB isAdmin={true} unread={chatData.totalUnread} open={open} onClick={() => setOpen(o => !o)} />
      <AdminChatPanel
        open={open}
        onClose={() => setOpen(false)}
        conversations={chatData.conversations}
        messages={chatData.messages}
        sending={chatData.sending}
        loadingMsgs={chatData.loadingMsgs}
        sendMessage={chatData.sendMessage}
        setStatus={chatData.setStatus}
        selectedId={selectedId}
        setSelectedId={setSelectedId}
      />
    </>
  );
}

// ─── CHAT LAUNCHER ────────────────────────────────────────────────
export default function ChatLauncher() {
  const { isAdmin, checking } = useAdmin();

  // Render nothing until admin status resolved — prevents any hook
  // from firing before we know which shell to mount
  if (checking) return null;

  return (
    <>
      <style>{SHARED_STYLES}</style>
      {isAdmin ? <AdminChatShell /> : <UserChatShell />}
    </>
  );
}