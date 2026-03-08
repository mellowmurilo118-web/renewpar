import { useState } from "react";
import { LOANS, fmt, fmtDate } from "./mockData.js";

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

function InputField({ label, type = "text", value, onChange, placeholder, required, hint, options }) {
  const [f, setF] = useState(false);
  return (
    <div className="mb-4">
      <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {options ? (
        <select value={value} onChange={onChange} required={required}
          className={`w-full px-3 py-2.5 text-sm border rounded-xl outline-none bg-gray-50 text-gray-800 appearance-none cursor-pointer transition-all ${f ? "border-[#1a1a5e]" : "border-gray-200"}`}
          onFocus={() => setF(true)} onBlur={() => setF(false)}>
          <option value="">Select...</option>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input type={type} value={value} onChange={onChange} placeholder={placeholder} required={required}
          onFocus={() => setF(true)} onBlur={() => setF(false)}
          className={`w-full px-3 py-2.5 text-sm border rounded-xl outline-none bg-gray-50 text-gray-800 transition-all ${f ? "border-[#1a1a5e] shadow-[0_0_0_3px_rgba(26,26,94,0.08)] bg-white" : "border-gray-200"}`}
        />
      )}
      {hint && <p className="text-[11px] text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

// ─── MY LOANS ─────────────────────────────────────────────────────
export function MyLoans({ onNavigate }) {
  const totalOutstanding = LOANS.reduce((s, l) => s + l.outstanding, 0);

  return (
    <PageWrap title="My Loans" subtitle="Overview of your active loans">
      {/* Summary */}
      <div className="rounded-2xl p-5 mb-6 text-white" style={{ background: "linear-gradient(135deg,#1a1a5e,#2a3aa0)" }}>
        <p className="text-white/60 text-xs mb-1">Total Outstanding Balance</p>
        <p className="text-3xl font-black">{fmt(totalOutstanding)}</p>
        <p className="text-white/40 text-xs mt-1">{LOANS.length} active loan{LOANS.length !== 1 ? "s" : ""}</p>
      </div>

      {/* Loan cards */}
      <div className="space-y-4 mb-6">
        {LOANS.map(loan => {
          const paidPct = Math.round(((loan.amount - loan.outstanding) / loan.amount) * 100);
          return (
            <div key={loan.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="font-black text-gray-800">{loan.type}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{loan.interestRate}% p.a. interest</p>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-green-100 text-green-600">
                  {loan.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-x-6 gap-y-3 mb-4">
                {[
                  ["Loan Amount", fmt(loan.amount)],
                  ["Outstanding", fmt(loan.outstanding)],
                  ["Monthly Payment", fmt(loan.monthlyPayment)],
                  ["Next Payment", fmtDate(loan.nextPaymentDate)],
                  ["Start Date", fmtDate(loan.startDate)],
                  ["End Date", fmtDate(loan.endDate)],
                ].map(([k, v]) => (
                  <div key={k}>
                    <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">{k}</p>
                    <p className="text-sm font-bold text-gray-800 mt-0.5">{v}</p>
                  </div>
                ))}
              </div>

              {/* Progress bar */}
              <div>
                <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                  <span>Repayment Progress</span>
                  <span className="font-bold text-gray-600">{paidPct}%</span>
                </div>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#1a1a5e] rounded-full transition-all duration-700" style={{ width: `${paidPct}%` }} />
                </div>
              </div>

              <button className="w-full mt-4 border border-[#1a1a5e] text-[#1a1a5e] font-bold py-2.5 rounded-xl text-sm hover:bg-[#1a1a5e] hover:text-white transition-colors">
                Make Payment
              </button>
            </div>
          );
        })}
      </div>

      <button onClick={() => onNavigate("apply-loan")}
        className="w-full bg-[#1a1a5e] hover:bg-[#2a2a8e] text-white font-bold py-3 rounded-xl transition-colors">
        + Apply for New Loan
      </button>
    </PageWrap>
  );
}

// ─── APPLY LOAN ───────────────────────────────────────────────────
const LOAN_TYPES = ["Personal Loan","Home Mortgage","Auto Loan","Business Loan","Student Loan","Working Capital Loan"];
const LOAN_TERMS = ["6 months","12 months","24 months","36 months","48 months","60 months","120 months","180 months","240 months","360 months"];
const EMPLOYMENT = ["Employed Full-time","Employed Part-time","Self-Employed","Business Owner","Retired","Student","Unemployed"];

export function ApplyLoan() {
  const [form, setForm] = useState({ type: "", amount: "", term: "", purpose: "", employment: "", income: "", collateral: "" });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  // Simple monthly payment estimate
  const monthlyEst = () => {
    if (!form.amount || !form.term) return null;
    const months = parseInt(form.term);
    const rate = 0.065 / 12;
    const P = Number(form.amount);
    if (isNaN(P) || P <= 0 || isNaN(months)) return null;
    const payment = (P * rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1);
    return isFinite(payment) ? payment : null;
  };
  const est = monthlyEst();

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!form.type || !form.amount || !form.term || !form.employment || !form.income) return setError("Please fill all required fields.");
    // Firebase: create loan application document
    setSuccess(true);
  }

  if (success) return (
    <PageWrap title="Application Submitted" subtitle="">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        </div>
        <h3 className="font-black text-gray-800 text-xl mb-2">Application Received!</h3>
        <p className="text-gray-400 text-sm mb-2">Your loan application for <span className="font-bold text-gray-700">{fmt(Number(form.amount))}</span> has been submitted.</p>
        <p className="text-gray-400 text-sm mb-6">Our team will review your application and contact you within 2-3 business days.</p>
        <button onClick={() => { setSuccess(false); setForm({ type:"",amount:"",term:"",purpose:"",employment:"",income:"",collateral:"" }); }}
          className="bg-[#1a1a5e] text-white font-bold px-8 py-3 rounded-xl hover:bg-[#2a2a8e] transition-colors">
          Apply Again
        </button>
      </div>
    </PageWrap>
  );

  return (
    <PageWrap title="Apply for a Loan" subtitle="Fill in your details to get started">
      {error && (
        <div className="flex gap-3 bg-red-50 border border-red-200 rounded-xl p-4 mb-5">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" className="flex-shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <p className="text-sm text-red-600 font-semibold">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <form onSubmit={handleSubmit}>
          <InputField label="Loan Type" value={form.type} onChange={set("type")} options={LOAN_TYPES} required />
          <InputField label="Loan Amount (USD)" type="number" value={form.amount} onChange={set("amount")} placeholder="50000" required hint="Minimum $1,000 — Maximum $2,000,000" />
          <InputField label="Loan Term" value={form.term} onChange={set("term")} options={LOAN_TERMS} required />
          <InputField label="Loan Purpose" value={form.purpose} onChange={set("purpose")} placeholder="Describe how you'll use the loan" />
          <InputField label="Employment Status" value={form.employment} onChange={set("employment")} options={EMPLOYMENT} required />
          <InputField label="Monthly Income (USD)" type="number" value={form.income} onChange={set("income")} placeholder="5000" required />
          <InputField label="Collateral (if any)" value={form.collateral} onChange={set("collateral")} placeholder="e.g. Property, Vehicle" hint="Providing collateral may improve your approval chances." />

          {/* Monthly estimate */}
          {est && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-5">
              <p className="text-xs text-blue-400 font-bold uppercase tracking-wide mb-1">Estimated Monthly Payment</p>
              <p className="text-2xl font-black text-[#1a1a5e]">{fmt(est)}</p>
              <p className="text-xs text-blue-300 mt-1">Based on 6.5% interest rate · Subject to approval</p>
            </div>
          )}

          <button type="submit" className="w-full bg-[#1a1a5e] hover:bg-[#2a2a8e] text-white font-bold py-3 rounded-xl transition-colors">
            Submit Application
          </button>
        </form>
      </div>
    </PageWrap>
  );
}