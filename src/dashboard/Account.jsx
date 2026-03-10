import { useState } from "react";
import { fmt, fmtDate } from "./mockData.js";

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

function InputField({ label, type = "text", value, onChange, placeholder, readOnly, hint }) {
  const [f, setF] = useState(false);
  return (
    <div className="mb-4">
      <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">{label}</label>
      <input type={type} value={value} onChange={onChange} placeholder={placeholder} readOnly={readOnly}
        onFocus={() => setF(true)} onBlur={() => setF(false)}
        className={`w-full px-3 py-2.5 text-sm border rounded-xl outline-none transition-all
          ${readOnly ? "bg-gray-50 text-gray-400 cursor-not-allowed border-gray-100" : f ? "bg-white border-[#1a1a5e] shadow-[0_0_0_3px_rgba(26,26,94,0.08)]" : "bg-gray-50 text-gray-800 border-gray-200"}`}
      />
      {hint && <p className="text-[11px] text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

// ─── PROFILE ──────────────────────────────────────────────────────
export function Profile({ user, account }) {
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({ ...user });
  const [saved, setSaved] = useState(false);
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  function handleSave() {
    // Firebase: update user doc
    setSaved(true);
    setEdit(false);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <PageWrap title="My Profile" subtitle="View and update your personal information">
      {saved && (
        <div className="flex gap-3 bg-green-50 border border-green-200 rounded-xl p-4 mb-5">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          <p className="text-sm text-green-700 font-semibold">Profile updated successfully!</p>
        </div>
      )}

      {/* Avatar block */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4">
        <div className="flex items-center gap-5">
          <div className="relative">
            <img src={user.avatar} alt="avatar" className="w-20 h-20 rounded-full object-cover border-4 border-gray-100"
              onError={e => { e.target.style.display="none"; }} />
            <div className="absolute bottom-0 right-0 w-6 h-6 bg-[#1a1a5e] rounded-full flex items-center justify-center border-2 border-white cursor-pointer">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
            </div>
          </div>
          <div>
            <p className="font-black text-gray-800 text-lg">{user.firstName} {user.lastName}</p>
            <p className="text-gray-400 text-sm">{user.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                KYC Verified
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Info */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4">
        <div className="flex justify-between items-center mb-5">
          <h3 className="font-black text-gray-800">Personal Information</h3>
          <button onClick={() => setEdit(!edit)}
            className={`text-xs font-bold px-4 py-2 rounded-xl transition-colors ${edit ? "bg-gray-100 text-gray-600" : "bg-[#1a1a5e] text-white hover:bg-[#2a2a8e]"}`}>
            {edit ? "Cancel" : "Edit"}
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5">
          <InputField label="First Name" value={form.firstName} onChange={set("firstName")} readOnly={!edit} />
          <InputField label="Last Name" value={form.lastName} onChange={set("lastName")} readOnly={!edit} />
          <InputField label="Email" type="email" value={form.email} onChange={set("email")} readOnly={!edit} />
          <InputField label="Phone" type="tel" value={form.phone} onChange={set("phone")} readOnly={!edit} />
          <InputField label="Date of Birth" type="date" value={form.dob} onChange={set("dob")} readOnly={!edit} />
          <InputField label="Gender" value={form.gender} onChange={set("gender")} readOnly={!edit} />
          <InputField label="Religion" value={form.religion} onChange={set("religion")} readOnly={!edit} />
          <InputField label="Country" value={form.country} onChange={set("country")} readOnly={!edit} />
        </div>
        <div>
          <InputField label="Address" value={form.address} onChange={set("address")} readOnly={!edit} />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-5">
            <InputField label="City" value={form.city} onChange={set("city")} readOnly={!edit} />
            <InputField label="State" value={form.state} onChange={set("state")} readOnly={!edit} />
            <InputField label="ZIP" value={form.zipcode} onChange={set("zipcode")} readOnly={!edit} />
          </div>
        </div>
        {edit && (
          <button onClick={handleSave} className="w-full mt-2 bg-[#1a1a5e] hover:bg-[#2a2a8e] text-white font-bold py-3 rounded-xl transition-colors">
            Save Changes
          </button>
        )}
      </div>

      {/* Account info */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-black text-gray-800 mb-5">Account Information</h3>
        {[
          ["Account Number", account.accountNumber],
          ["Account Type", account.type],
          ["Routing Number", account.routingNumber],
          ["SWIFT", account.swift],
          ["IBAN", account.iban],
          ["Opened", fmtDate(account.openedDate)],
          ["Status", account.status.toUpperCase()],
        ].map(([k, v]) => (
          <div key={k} className="flex justify-between py-3 border-b border-gray-100 last:border-0">
            <span className="text-xs text-gray-400 font-semibold">{k}</span>
            <span className="text-xs font-bold text-gray-800 font-mono">{v}</span>
          </div>
        ))}
      </div>
    </PageWrap>
  );
}

// ─── ACCOUNT INFO (quick action from dashboard) ───────────────────
export function AccountInfo({ user, account }) {
  return <Profile />;
}

// ─── STATEMENT ────────────────────────────────────────────────────
export function Statement({ user, account, transactions }) {
  const [month, setMonth] = useState("all");
  const months = [...new Set(transactions.map(t => t.date.slice(0, 7)))];

  const filtered = month === "all" ? transactions : transactions.filter(t => t.date.startsWith(month));
  const totalCredit = filtered.filter(t => t.type === "credit").reduce((s, t) => s + t.amount, 0);
  const totalDebit  = filtered.filter(t => t.type === "debit").reduce((s, t) => s + Math.abs(t.amount), 0);

  return (
    <PageWrap title="Account Statement" subtitle="Download or view your account history">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: "Total Credits", value: fmt(totalCredit), color: "text-green-600", bg: "bg-green-50 border-green-100" },
          { label: "Total Debits",  value: fmt(totalDebit),  color: "text-red-500",   bg: "bg-red-50 border-red-100" },
          { label: "Net Balance",   value: fmt(totalCredit - totalDebit), color: "text-[#1a1a5e]", bg: "bg-blue-50 border-blue-100" },
        ].map(s => (
          <div key={s.label} className={`rounded-xl border p-3 ${s.bg}`}>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide mb-1">{s.label}</p>
            <p className={`text-sm font-black ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3 mb-5">
        <select value={month} onChange={e => setMonth(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-200 rounded-xl outline-none bg-white text-gray-700 font-semibold">
          <option value="all">All Time</option>
          {months.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#1a1a5e] text-white text-sm font-bold rounded-xl hover:bg-[#2a2a8e] transition-colors ml-auto">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Download PDF
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-[#1a1a5e] px-5 py-4">
          <p className="text-white font-black text-sm">Renew Part Bank — Account Statement</p>
          <p className="text-white/50 text-xs">{user.firstName} {user.lastName} · {account.accountNumber}</p>
        </div>
        {/* Table header */}
        <div className="grid grid-cols-4 gap-2 px-5 py-3 bg-gray-50 border-b border-gray-100">
          {["Description","Amount","Type","Date"].map(h => (
            <span key={h} className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">{h}</span>
          ))}
        </div>
        {filtered.map((t, i) => (
          <div key={t.id} className={`grid grid-cols-4 gap-2 px-5 py-3.5 items-center text-sm ${i < filtered.length - 1 ? "border-b border-gray-50" : ""} hover:bg-gray-50`}>
            <span className="text-gray-700 font-medium truncate text-xs">{t.description}</span>
            <span className={`font-bold text-xs ${t.type === "credit" ? "text-green-600" : "text-red-500"}`}>
              {t.type === "credit" ? "+" : ""}{fmt(t.amount)}
            </span>
            <span className={`text-[10px] font-bold px-2 py-1 rounded-full w-fit ${t.type === "credit" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-500"}`}>
              {t.type}
            </span>
            <span className="text-[11px] text-gray-400">{t.date}</span>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-4xl mb-3">📋</p>
            <p className="font-semibold text-sm">No transactions for this period</p>
          </div>
        )}
      </div>
    </PageWrap>
  );
}

// ─── SETTINGS ─────────────────────────────────────────────────────
export function Settings({ user, account }) {
  const [settings, setSettings] = useState({
    emailNotif:   true,
    smsNotif:     true,
    loginAlert:   true,
    txnAlert:     true,
    twoFactor:    false,
    darkMode:     false,
    currency:     "USD",
    language:     "English",
  });
  const [saved, setSaved] = useState(false);
  const toggle = k => setSettings(s => ({ ...s, [k]: !s[k] }));

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  const Toggle = ({ k }) => (
    <button onClick={() => toggle(k)}
      className={`w-11 h-6 rounded-full transition-colors duration-200 relative flex-shrink-0 ${settings[k] ? "bg-[#1a1a5e]" : "bg-gray-200"}`}>
      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-200 ${settings[k] ? "left-6" : "left-1"}`}/>
    </button>
  );

  const Row = ({ label, desc, k }) => (
    <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
      <div>
        <p className="text-sm font-semibold text-gray-800">{label}</p>
        {desc && <p className="text-xs text-gray-400 mt-0.5">{desc}</p>}
      </div>
      <Toggle k={k} />
    </div>
  );

  return (
    <PageWrap title="Settings" subtitle="Manage your account preferences">
      {saved && (
        <div className="flex gap-3 bg-green-50 border border-green-200 rounded-xl p-4 mb-5">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          <p className="text-sm text-green-700 font-semibold">Settings saved successfully!</p>
        </div>
      )}

      <div className="space-y-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-black text-gray-800 text-sm uppercase tracking-wide mb-2">Notifications</h3>
          <Row label="Email Notifications" desc="Receive updates via email" k="emailNotif" />
          <Row label="SMS Notifications" desc="Receive updates via SMS" k="smsNotif" />
          <Row label="Login Alerts" desc="Alert on new device login" k="loginAlert" />
          <Row label="Transaction Alerts" desc="Alert on every transaction" k="txnAlert" />
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-black text-gray-800 text-sm uppercase tracking-wide mb-2">Security</h3>
          <Row label="Two-Factor Authentication" desc="Extra security on login" k="twoFactor" />
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-black text-gray-800 text-sm uppercase tracking-wide mb-4">Preferences</h3>
          <div className="mb-4">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-1.5">Default Currency</label>
            <select value={settings.currency} onChange={e => setSettings(s => ({ ...s, currency: e.target.value }))}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl outline-none bg-gray-50 text-gray-800">
              {["USD","EUR","GBP","NGN","GHS"].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-1.5">Language</label>
            <select value={settings.language} onChange={e => setSettings(s => ({ ...s, language: e.target.value }))}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl outline-none bg-gray-50 text-gray-800">
              {["English","French","Spanish","Hausa","Yoruba","Igbo"].map(l => <option key={l}>{l}</option>)}
            </select>
          </div>
        </div>

        <button onClick={handleSave}
          className="w-full bg-[#1a1a5e] hover:bg-[#2a2a8e] text-white font-bold py-3 rounded-xl transition-colors">
          Save Settings
        </button>

        {/* Danger zone */}
        <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-5">
          <h3 className="font-black text-red-500 text-sm uppercase tracking-wide mb-4">Danger Zone</h3>
          <button className="w-full border border-red-200 text-red-500 font-bold py-3 rounded-xl hover:bg-red-50 transition-colors text-sm">
            Close Account
          </button>
        </div>
      </div>
    </PageWrap>
  );
}

// ─── SECURITY ────────────────────────────────────────────────────
export function Security({ user }) {
  const [form, setForm] = useState({ current: "", newPwd: "", confirm: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  function handleSubmit(e) {
    e.preventDefault();
    setError(""); setSuccess("");
    if (!form.current || !form.newPwd || !form.confirm) return setError("All fields required.");
    if (form.newPwd.length < 6) return setError("New password must be at least 6 characters.");
    if (form.newPwd !== form.confirm) return setError("Passwords do not match.");
    // Firebase: reauthenticate then updatePassword
    setSuccess("Password changed successfully!");
    setForm({ current: "", newPwd: "", confirm: "" });
  }

  return (
    <PageWrap title="Security" subtitle="Manage your password and security settings">
      {error && <div className="flex gap-3 bg-red-50 border border-red-200 rounded-xl p-4 mb-5"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" className="flex-shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg><p className="text-sm text-red-600 font-semibold">{error}</p></div>}
      {success && <div className="flex gap-3 bg-green-50 border border-green-200 rounded-xl p-4 mb-5"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg><p className="text-sm text-green-700 font-semibold">{success}</p></div>}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4">
        <h3 className="font-black text-gray-800 mb-5">Change Password</h3>
        <form onSubmit={handleSubmit}>
          <InputField label="Current Password" type="password" value={form.current} onChange={set("current")} placeholder="Current password" />
          <InputField label="New Password" type="password" value={form.newPwd} onChange={set("newPwd")} placeholder="Min. 6 characters" hint="Use a strong mix of letters, numbers and symbols." />
          <InputField label="Confirm New Password" type="password" value={form.confirm} onChange={set("confirm")} placeholder="Repeat new password" />
          <button type="submit" className="w-full bg-[#1a1a5e] hover:bg-[#2a2a8e] text-white font-bold py-3 rounded-xl transition-colors">
            Update Password
          </button>
        </form>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-black text-gray-800 mb-4">Security Overview</h3>
        {[
          ["Last Login", "March 8, 2026 at 3:08 PM"],
          ["Login Device", "Chrome on Windows"],
          ["2FA Status", "Disabled"],
          ["KYC Status", "Verified ✓"],
          ["Account Created", fmtDate(user.joinDate)],
        ].map(([k, v]) => (
          <div key={k} className="flex justify-between py-3 border-b border-gray-100 last:border-0">
            <span className="text-xs text-gray-400 font-semibold">{k}</span>
            <span className="text-xs font-bold text-gray-800">{v}</span>
          </div>
        ))}
      </div>
    </PageWrap>
  );
}