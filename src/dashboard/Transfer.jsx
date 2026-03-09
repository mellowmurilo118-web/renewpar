import { useState } from "react";
import { ACCOUNT, TRANSACTIONS, CURRENT_USER, fmt, fmtDate } from "./mockData.js";

// ─────────────────────────────────────────────────────────────────
// Set to true  → Send Money form replaced with error + chat CTA
// Set to false → Send Money works normally
const TRANSFER_BLOCKED = true;
const TRANSFER_BLOCK_MSG =
  "Outgoing transfers are currently restricted on your account. Please contact our customer support team to resolve this before proceeding.";
// ─────────────────────────────────────────────────────────────────

function openChatWidget() {
  const fab = document.querySelector(".chat-fab, .chat-fab-admin");
  if (fab) { fab.click(); return; }
  const allBtns = Array.from(document.querySelectorAll("button"));
  const chatBtn = allBtns.find(b => b.querySelector('path[d*="M21 15"]'));
  if (chatBtn) chatBtn.click();
}

function TransferBlocked() {
  return (
    <div style={{ background: "white", border: "1.5px solid #fed7aa", borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 20px rgba(234,88,12,0.08)" }}>
      <style>{`
        @keyframes warnShakeT { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-3px)} 40%,80%{transform:translateX(3px)} }
        .warn-shake-t { animation: warnShakeT 0.5s ease 0.2s; }
        .chat-tx-btn { transition: filter 0.15s, transform 0.15s; }
        .chat-tx-btn:hover { filter: brightness(1.1); transform: translateY(-1px); }
        .chat-tx-btn:active { transform: none; }
      `}</style>
      <div style={{ background: "linear-gradient(135deg,#ea580c,#f97316)", padding: "18px 20px 16px", display: "flex", alignItems: "center", gap: 14 }}>
        <div className="warn-shake-t" style={{ width: 44, height: 44, borderRadius: "50%", flexShrink: 0, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid rgba(255,255,255,0.4)" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </div>
        <div>
          <p style={{ color: "white", fontWeight: 900, fontSize: 15, margin: "0 0 3px", fontFamily: "'DM Sans','Trebuchet MS',sans-serif" }}>Transfer Restricted</p>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 12, margin: 0, fontFamily: "'DM Sans','Trebuchet MS',sans-serif" }}>Action required before you can proceed</p>
        </div>
      </div>
      <div style={{ padding: "20px 20px 22px" }}>
        <p style={{ fontSize: 13.5, color: "#431407", lineHeight: 1.65, marginBottom: 18, fontFamily: "'DM Sans','Trebuchet MS',sans-serif" }}>
          {TRANSFER_BLOCK_MSG}
        </p>
        <div style={{ background: "#fff7ed", borderRadius: 12, padding: "14px 16px", marginBottom: 20, border: "1px solid #fed7aa" }}>
          <p style={{ fontSize: 10.5, fontWeight: 800, color: "#c2410c", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12, fontFamily: "'DM Sans','Trebuchet MS',sans-serif" }}>How to resolve</p>
          {[
            { n: "1", text: "Click the button below to open live chat" },
            { n: "2", text: "Explain your transfer request to our agent" },
            { n: "3", text: "Our team will lift the restriction for you"  },
          ].map(s => (
            <div key={s.n} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 9 }}>
              <div style={{ width: 22, height: 22, borderRadius: "50%", flexShrink: 0, background: "#ea580c", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 900, fontFamily: "'DM Sans','Trebuchet MS',sans-serif" }}>{s.n}</div>
              <span style={{ fontSize: 13, color: "#7c2d12", fontFamily: "'DM Sans','Trebuchet MS',sans-serif" }}>{s.text}</span>
            </div>
          ))}
        </div>
        <button className="chat-tx-btn" onClick={openChatWidget}
          style={{ width: "100%", background: "linear-gradient(135deg,#1a1a8e,#2563eb)", color: "white", border: "none", borderRadius: 12, padding: "14px 20px", fontWeight: 800, fontSize: 14.5, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, fontFamily: "'DM Sans','Trebuchet MS',sans-serif", boxShadow: "0 4px 18px rgba(37,99,235,0.3)" }}>
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
          </svg>
          Chat with Customer Support
        </button>
        <p style={{ textAlign: "center", fontSize: 11.5, color: "#9ca3af", marginTop: 10, fontFamily: "'DM Sans','Trebuchet MS',sans-serif" }}>
          🔒 Secure &nbsp;·&nbsp; Avg. response time &lt; 5 min
        </p>
      </div>
    </div>
  );
}

// ─── Shared page wrapper ──────────────────────────────────────────
function PageWrap({ title, subtitle, children }) {
  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">{title}</h1>
        {subtitle && <p className="text-gray-400 text-sm mt-1">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

function Card({ children, className = "" }) {
  return <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm ${className}`}>{children}</div>;
}

function InputField({ label, type = "text", value, onChange, placeholder, required, hint, prefix }) {
  const [f, setF] = useState(false);
  return (
    <div className="mb-4">
      <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-semibold">{prefix}</span>
        )}
        <input
          type={type} value={value} onChange={onChange} placeholder={placeholder} required={required}
          onFocus={() => setF(true)} onBlur={() => setF(false)}
          className={`w-full ${prefix ? "pl-8" : "pl-3"} pr-3 py-2.5 text-sm border rounded-xl outline-none bg-gray-50 text-gray-800 transition-all
            ${f ? "border-[#1a1a5e] shadow-[0_0_0_3px_rgba(26,26,94,0.08)] bg-white" : "border-gray-200"}`}
        />
      </div>
      {hint && <p className="text-[11px] text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

function SuccessBanner({ msg }) {
  if (!msg) return null;
  return (
    <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
      <p className="text-sm text-green-700 font-semibold">{msg}</p>
    </div>
  );
}

function ErrorBanner({ msg }) {
  if (!msg) return null;
  return (
    <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      <p className="text-sm text-red-600 font-semibold">{msg}</p>
    </div>
  );
}

// ─── SEND MONEY ───────────────────────────────────────────────────
export function SendMoney({ onNavigate }) {
  const [form, setForm] = useState({ recipient: "", recipientBank: "", accountNum: "", amount: "", description: "", pin: "" });
  const [step, setStep] = useState(1);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  function handleReview(e) {
    e.preventDefault();
    setError("");
    if (!form.recipient || !form.accountNum || !form.amount) return setError("Please fill all required fields.");
    if (isNaN(form.amount) || Number(form.amount) <= 0) return setError("Please enter a valid amount.");
    if (Number(form.amount) > ACCOUNT.balance) return setError("Insufficient balance.");
    setStep(2);
  }

  function handleConfirm(e) {
    e.preventDefault();
    setError("");
    if (!form.pin || form.pin.length < 4) return setError("Please enter your transaction PIN.");
    // Firebase: deduct from account, add to transactions
    setSuccess(`$${Number(form.amount).toLocaleString()} sent successfully to ${form.recipient}!`);
    setStep(3);
  }

  return (
    <PageWrap title="Send Money" subtitle="Transfer funds to any bank account">
      {/* Progress steps */}
      <div className="flex items-center gap-2 mb-6">
        {["Details", "Review", "Done"].map((s, i) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div className={`flex items-center gap-2 ${i < 2 ? "flex-1" : ""}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 ${step > i + 1 ? "bg-green-500 text-white" : step === i + 1 ? "bg-[#1a1a5e] text-white" : "bg-gray-100 text-gray-400"}`}>
                {step > i + 1 ? "✓" : i + 1}
              </div>
              <span className={`text-xs font-semibold hidden sm:block ${step === i + 1 ? "text-[#1a1a5e]" : "text-gray-400"}`}>{s}</span>
            </div>
            {i < 2 && <div className={`flex-1 h-0.5 ${step > i + 1 ? "bg-[#1a1a5e]" : "bg-gray-200"}`}></div>}
          </div>
        ))}
      </div>

      {TRANSFER_BLOCKED ? (
        <TransferBlocked />
      ) : (
        <>
          <ErrorBanner msg={error} />
          <SuccessBanner msg={success} />

          {step === 1 && (
            <Card className="p-6">
              <form onSubmit={handleReview}>
                {/* From account */}
                <div className="bg-blue-50 rounded-xl p-4 mb-5 border border-blue-100">
                  <p className="text-xs text-blue-400 font-bold uppercase tracking-wide mb-1">From Account</p>
                  <p className="font-black text-gray-800">{ACCOUNT.accountNumber}</p>
                  <p className="text-sm text-gray-500 mt-0.5">Balance: <span className="font-bold text-gray-700">{fmt(ACCOUNT.balance)}</span></p>
                </div>
                <InputField label="Recipient Full Name" value={form.recipient} onChange={set("recipient")} placeholder="John Doe" required />
                <InputField label="Recipient Account Number" value={form.accountNum} onChange={set("accountNum")} placeholder="1234567890" required />
                <InputField label="Recipient Bank" value={form.recipientBank} onChange={set("recipientBank")} placeholder="Chase Bank" />
                <InputField label="Amount (USD)" type="number" value={form.amount} onChange={set("amount")} placeholder="0.00" required prefix="$" hint={`Available: ${fmt(ACCOUNT.balance)}`} />
                <InputField label="Description (Optional)" value={form.description} onChange={set("description")} placeholder="e.g. Rent payment" />
                <button type="submit" className="w-full bg-[#1a1a5e] hover:bg-[#2a2a8e] text-white font-bold py-3 rounded-xl transition-colors mt-2">
                  Continue to Review →
                </button>
              </form>
            </Card>
          )}

          {step === 2 && (
            <Card className="p-6">
              <h3 className="font-black text-gray-800 mb-4">Review Transfer</h3>
              <div className="space-y-3 mb-6">
                {[
                  ["From", ACCOUNT.accountNumber],
                  ["To", form.recipient],
                  ["Account No.", form.accountNum],
                  ["Bank", form.recipientBank || "N/A"],
                  ["Amount", fmt(Number(form.amount))],
                  ["Description", form.description || "N/A"],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between py-2.5 border-b border-gray-100 last:border-0">
                    <span className="text-sm text-gray-400 font-medium">{k}</span>
                    <span className="text-sm font-bold text-gray-800">{v}</span>
                  </div>
                ))}
              </div>
              <form onSubmit={handleConfirm}>
                <InputField label="Transaction PIN" type="password" value={form.pin} onChange={set("pin")} placeholder="Enter your PIN" required hint="Enter your 4-6 digit transaction PIN to authorise." />
                <div className="flex gap-3 mt-2">
                  <button type="button" onClick={() => { setStep(1); setError(""); }} className="flex-1 border border-gray-200 text-gray-600 font-bold py-3 rounded-xl hover:bg-gray-50 transition-colors">
                    ← Back
                  </button>
                  <button type="submit" className="flex-2 flex-1 bg-[#1a1a5e] hover:bg-[#2a2a8e] text-white font-bold py-3 rounded-xl transition-colors">
                    Confirm Transfer
                  </button>
                </div>
              </form>
            </Card>
          )}

          {step === 3 && (
            <Card className="p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              </div>
              <h3 className="font-black text-gray-800 text-xl mb-2">Transfer Successful!</h3>
              <p className="text-gray-400 text-sm mb-6">{success}</p>
              <div className="flex gap-3">
                <button onClick={() => { setStep(1); setForm({ recipient:"", recipientBank:"", accountNum:"", amount:"", description:"", pin:"" }); setSuccess(""); }} className="flex-1 border border-gray-200 font-bold py-3 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors text-sm">
                  New Transfer
                </button>
                <button onClick={() => onNavigate("transfer-history")} className="flex-1 bg-[#1a1a5e] text-white font-bold py-3 rounded-xl hover:bg-[#2a2a8e] transition-colors text-sm">
                  View History
                </button>
              </div>
            </Card>
          )}
        </>
      )}
    </PageWrap>
  );
}

// ─── RECEIVE MONEY ────────────────────────────────────────────────
export function ReceiveMoney() {
  const [copied, setCopied] = useState("");
  const copy = (val, key) => {
    navigator.clipboard?.writeText(val);
    setCopied(key);
    setTimeout(() => setCopied(""), 2000);
  };
  const details = [
    { label: "Account Name",   value: `${CURRENT_USER.firstName} ${CURRENT_USER.lastName}`, key: "name" },
    { label: "Account Number", value: ACCOUNT.accountNumber, key: "acc" },
    { label: "Routing Number", value: ACCOUNT.routingNumber, key: "routing" },
    { label: "Bank Name",      value: "Renew Part Bank", key: "bank" },
    { label: "SWIFT / BIC",    value: ACCOUNT.swift, key: "swift" },
    { label: "IBAN",           value: ACCOUNT.iban, key: "iban" },
  ];
  return (
    <PageWrap title="Receive Money" subtitle="Share your account details to receive funds">
      <Card className="p-6">
        {/* Visual account card */}
        <div className="rounded-2xl p-5 mb-6 text-white" style={{ background: "linear-gradient(135deg,#1a1a5e,#2a3aa0)" }}>
          <p className="text-white/60 text-xs mb-1">Account Holder</p>
          <p className="font-black text-lg">{CURRENT_USER.firstName} {CURRENT_USER.lastName}</p>
          <p className="font-mono text-2xl tracking-[0.15em] mt-3">{ACCOUNT.accountNumber}</p>
          <div className="flex gap-4 mt-3">
            <div><p className="text-white/50 text-[10px]">Routing</p><p className="font-mono text-sm">{ACCOUNT.routingNumber}</p></div>
            <div><p className="text-white/50 text-[10px]">SWIFT</p><p className="font-mono text-sm">{ACCOUNT.swift}</p></div>
          </div>
        </div>
        {/* Details list */}
        <div className="space-y-0">
          {details.map(d => (
            <div key={d.key} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
              <div>
                <p className="text-xs text-gray-400 font-semibold">{d.label}</p>
                <p className="text-sm font-bold text-gray-800 mt-0.5 font-mono">{d.value}</p>
              </div>
              <button onClick={() => copy(d.value, d.key)} className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${copied === d.key ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
                {copied === d.key ? "✓ Copied" : "Copy"}
              </button>
            </div>
          ))}
        </div>
      </Card>
    </PageWrap>
  );
}

// ─── TRANSFER HISTORY ─────────────────────────────────────────────
export function TransferHistory() {
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? TRANSACTIONS : TRANSACTIONS.filter(t => t.type === filter);
  return (
    <PageWrap title="Transaction History" subtitle="All your account transactions">
      {/* Filter tabs */}
      <div className="flex gap-2 mb-5">
        {[["all","All"],["credit","Credits"],["debit","Debits"]].map(([v, l]) => (
          <button key={v} onClick={() => setFilter(v)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${filter === v ? "bg-[#1a1a5e] text-white" : "bg-white border border-gray-200 text-gray-500 hover:border-[#1a1a5e] hover:text-[#1a1a5e]"}`}>
            {l}
          </button>
        ))}
      </div>
      <Card>
        {filtered.map((t, i) => (
          <div key={t.id} className={`flex items-center gap-4 px-5 py-4 ${i < filtered.length - 1 ? "border-b border-gray-100" : ""} hover:bg-gray-50 transition-colors`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${t.type === "credit" ? "bg-green-100" : "bg-red-100"}`}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={t.type === "credit" ? "#16a34a" : "#dc2626"} strokeWidth="2">
                {t.type === "credit"
                  ? <path strokeLinecap="round" d="M12 4v16m0 0l-4-4m4 4l4-4"/>
                  : <path strokeLinecap="round" d="M12 20V4m0 0l-4 4m4-4l4 4"/>}
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-800 truncate">{t.description}</p>
              <p className="text-xs text-gray-400 mt-0.5">{t.date} {t.time} · Ref: {t.reference}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className={`font-black text-base ${t.type === "credit" ? "text-green-600" : "text-red-500"}`}>
                {t.type === "credit" ? "+" : ""}{fmt(t.amount)}
              </p>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${t.type === "credit" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-500"}`}>
                {t.type}
              </span>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-4xl mb-3">📭</p>
            <p className="font-semibold">No transactions found</p>
          </div>
        )}
      </Card>
    </PageWrap>
  );
}