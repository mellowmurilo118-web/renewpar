import { useState } from "react";
import { ACCOUNT, fmt } from "./mockData.js";

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
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" className="flex-shrink-0 mt-0.5"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
      <p className="text-sm text-green-700 font-semibold">{msg}</p>
    </div>
  );
}

function ErrorBanner({ msg }) {
  if (!msg) return null;
  return (
    <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4 mb-5">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" className="flex-shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      <p className="text-sm text-red-600 font-semibold">{msg}</p>
    </div>
  );
}

const DEPOSIT_METHODS = [
  { value: "bank-transfer", label: "Bank Transfer / Wire" },
  { value: "check",         label: "Check Deposit" },
  { value: "cash",          label: "Cash Deposit" },
  { value: "crypto",        label: "Crypto Deposit" },
];

// ─── DEPOSIT ─────────────────────────────────────────────────────
export function Deposit() {
  const [form, setForm] = useState({ method: "", amount: "", reference: "" });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!form.method || !form.amount) return setError("Please fill all required fields.");
    if (isNaN(form.amount) || Number(form.amount) <= 0) return setError("Enter a valid amount.");
    // Firebase: add deposit transaction
    setSuccess(`Deposit of ${fmt(Number(form.amount))} via ${form.method} submitted successfully! Funds will reflect within 1-3 business days.`);
    setForm({ method: "", amount: "", reference: "" });
  }

  return (
    <PageWrap title="Deposit Funds" subtitle="Add money to your account">
      {/* Balance widget */}
      <div className="rounded-2xl p-5 mb-6 text-white" style={{ background: "linear-gradient(135deg,#1a1a5e,#2a3aa0)" }}>
        <p className="text-white/60 text-xs mb-1">Current Balance</p>
        <p className="text-3xl font-black">{fmt(ACCOUNT.balance)}</p>
        <p className="text-white/40 text-xs mt-1">Account: {ACCOUNT.accountNumber}</p>
      </div>

      <SuccessBanner msg={success} />
      <ErrorBanner msg={error} />

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <form onSubmit={handleSubmit}>
          <InputField label="Deposit Method" value={form.method} onChange={set("method")} options={DEPOSIT_METHODS} required />
          <InputField label="Amount (USD)" type="number" value={form.amount} onChange={set("amount")} placeholder="0.00" required prefix="$" />
          <InputField label="Reference / Note" value={form.reference} onChange={set("reference")} placeholder="Optional reference" hint="This will appear on your statement." />

          {/* Bank details for wire */}
          {form.method === "bank-transfer" && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-4">
              <p className="text-xs font-bold text-blue-600 uppercase tracking-wide mb-3">Wire Transfer Instructions</p>
              {[
                ["Bank Name", "Renew Part Bank"],
                ["Account Name", "Elliana Wilson"],
                ["Account No.", ACCOUNT.accountNumber],
                ["Routing No.", ACCOUNT.routingNumber],
                ["SWIFT", ACCOUNT.swift],
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
export function Withdrawal() {
  const [form, setForm] = useState({ method: "", amount: "", bankName: "", accountNum: "", pin: "" });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const WITHDRAW_METHODS = [
    { value: "bank-transfer", label: "Bank Transfer" },
    { value: "atm",           label: "ATM Withdrawal" },
    { value: "check",         label: "Cashier's Check" },
    { value: "crypto",        label: "Crypto Withdrawal" },
  ];

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!form.method || !form.amount) return setError("Please fill all required fields.");
    if (isNaN(form.amount) || Number(form.amount) <= 0) return setError("Enter a valid amount.");
    if (Number(form.amount) > ACCOUNT.balance) return setError("Insufficient funds in your account.");
    if (!form.pin || form.pin.length < 4) return setError("Please enter your transaction PIN.");
    // Firebase: deduct and add withdrawal transaction
    setSuccess(`Withdrawal of ${fmt(Number(form.amount))} processed! Please allow 1-2 business days.`);
    setForm({ method: "", amount: "", bankName: "", accountNum: "", pin: "" });
  }

  return (
    <PageWrap title="Withdraw Funds" subtitle="Withdraw money from your account">
      <div className="rounded-2xl p-5 mb-6 text-white" style={{ background: "linear-gradient(135deg,#1a1a5e,#2a3aa0)" }}>
        <p className="text-white/60 text-xs mb-1">Available Balance</p>
        <p className="text-3xl font-black">{fmt(ACCOUNT.balance)}</p>
        <p className="text-white/40 text-xs mt-1">Account: {ACCOUNT.accountNumber}</p>
      </div>

      <SuccessBanner msg={success} />
      <ErrorBanner msg={error} />

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <form onSubmit={handleSubmit}>
          <InputField label="Withdrawal Method" value={form.method} onChange={set("method")} options={WITHDRAW_METHODS} required />
          <InputField label="Amount (USD)" type="number" value={form.amount} onChange={set("amount")} placeholder="0.00" required prefix="$" hint={`Max: ${fmt(ACCOUNT.balance)}`} />

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
    </PageWrap>
  );
}