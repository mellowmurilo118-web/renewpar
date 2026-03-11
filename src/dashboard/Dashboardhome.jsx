import React, { useState, useEffect } from "react";
import { QUICK_ACTIONS, fmt } from "./mockData.js";

// ─── UserAvatar — iOS-safe image with initials fallback ─────────
function UserAvatar({ src, name, size = 40, className = "" }) {
  const [failed, setFailed] = React.useState(false);
  const initials = (name || "?").split(" ").filter(Boolean).slice(0,2).map(w=>w[0].toUpperCase()).join("");
  const colors = ["#1a1a5e","#2563eb","#7c3aed","#0891b2","#059669","#d97706"];
  const bg = colors[(name||"").split("").reduce((a,c)=>a+c.charCodeAt(0),0) % colors.length];
  const style = { width:size, height:size, borderRadius:"50%", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" };
  if (!src || failed) {
    return <div className={className} style={{...style, background:bg}}><span style={{color:"white",fontWeight:800,fontSize:size*0.36,lineHeight:1}}>{initials}</span></div>;
  }
  return <img src={src} alt={name||"avatar"} crossOrigin="anonymous" className={className} style={{...style,objectFit:"cover"}} onError={()=>setFailed(true)} />;
}

// ─── Balance Card ─────────────────────────────────────────────────
function BalanceCard({ user, account, onNavigate }) {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const greeting = () => {
    const h = time.getHours();
    if (h < 12) return "Good Morning!";
    if (h < 17) return "Good Afternoon!";
    return "Good Evening!";
  };

  const fmtTime = time.toLocaleString("en-US", {
    weekday: "long", year: "numeric", month: "long",
    day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit",
  });

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: "linear-gradient(135deg, #1a3cdd 0%, #1a1a9e 40%, #1515cc 100%)" }}>
      <div className="flex items-center justify-between px-6 pt-5 pb-3">
        <div className="flex items-center gap-3">
          <UserAvatar src={user.avatar} name={user.firstName} size={40} className="border-2 border-white/30" />
          <div>
            <p className="text-white/70 text-xs font-medium">{greeting()}</p>
            <p className="text-white font-bold text-sm">{user.firstName} {user.lastName}</p>
          </div>
        </div>
        <p className="text-white/60 text-xs sm:block w-20">{fmtTime}</p>
      </div>

      <div className="px-6 pb-4">
        <p className="text-white/70 text-xs font-medium mb-1">Available Balance</p>
        <p className="text-white font-black text-3xl sm:text-4xl tracking-tight">{fmt(account.balance)}</p>
      </div>

      <div className="px-6 pb-4 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-orange-400 flex items-center justify-center flex-shrink-0">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="white"><path d="M11.5 2a9.5 9.5 0 100 19 9.5 9.5 0 000-19zm1 13.5h-2v-5h2v5zm0-7h-2V7h2v1.5z"/></svg>
          </span>
          <div>
            <p className="text-white font-semibold text-sm">{account.btcBalance.toFixed(7)}</p>
            <p className="text-white/50 text-[10px]">BTC= ${account.btcUsd.toFixed(2)}</p>
          </div>
        </div>
        <div className="flex gap-2 sm:ml-auto">
          {[
            { label: "Receive", path: "receive", icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m0 0l-4-4m4 4l4-4"/> },
            { label: "Send",    path: "send",    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 20V4m0 0l-4 4m4-4l4 4"/> },
            { label: "Swap",    path: "swap",    icon: <><path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4"/><path strokeLinecap="round" strokeLinejoin="round" d="M17 8v12m0 0l4-4m-4 4l-4-4"/></> },
          ].map(a => (
            <button key={a.label} onClick={() => onNavigate(a.path)}
              className="flex flex-col items-center gap-1 px-4 sm:px-6 py-2.5 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 transition-colors flex-1 sm:flex-none">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">{a.icon}</svg>
              <span className="text-white text-[11px] font-semibold">{a.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mx-4 mb-4 rounded-xl bg-white/10 border border-white/10 flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-white/30 flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8">
              <path d="M12 2L3 6v6c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V6L12 2z"/>
            </svg>
          </div>
          <div>
            <p className="text-white/60 text-[10px] font-medium">Your Account Number</p>
            <p className="text-white font-bold text-sm tracking-widest">{account.accountNumber}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-green-400 text-xs font-bold bg-green-400/10 px-3 py-1 rounded-full border border-green-400/20">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
            Active
          </span>
          <button onClick={() => onNavigate("deposit")}
            className="flex items-center gap-1.5 text-white text-xs font-semibold bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-1.5 rounded-xl transition-colors">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
            Top up
          </button>
        </div>
      </div>
    </div>
  );
}

function TaxBanner() {
  const [show, setShow] = useState(true);
  if (!show) return null;
  return (
    <div className="text-center py-6 relative">
      <button onClick={() => setShow(false)} className="absolute top-2 right-2 text-gray-300 hover:text-gray-500">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
      <h3 className="font-black text-gray-800 text-lg mb-3">Claim your IRS Tax Refund</h3>
      <button className="bg-[#1a1a5e] hover:bg-[#2a2a8e] text-white font-bold px-8 py-2.5 rounded-xl text-sm transition-colors shadow-md">Tax Refund</button>
    </div>
  );
}

const QIcon = ({ id }) => {
  const p = { fill: "none", stroke: "#374151", strokeWidth: "1.6", strokeLinecap: "round", strokeLinejoin: "round" };
  if (id === "account-info") return <svg width="28" height="28" viewBox="0 0 24 24" {...p}><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="9" y1="7" x2="15" y2="7"/><line x1="9" y1="11" x2="15" y2="11"/><line x1="9" y1="15" x2="12" y2="15"/></svg>;
  if (id === "transfer")    return <svg width="28" height="28" viewBox="0 0 24 24" {...p}><path d="M4 9h16M4 9l4-4M4 9l4 4M20 15H4M20 15l-4-4M20 15l-4 4"/></svg>;
  if (id === "card")        return <svg width="28" height="28" viewBox="0 0 24 24" {...p}><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>;
  if (id === "statement")   return <svg width="28" height="28" viewBox="0 0 24 24" {...p}><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M9 7h6M9 11h6M9 15h4"/><path d="M15 18l2 2 4-4" stroke="#1a1a5e"/></svg>;
  return null;
};

function QuickActions({ onNavigate }) {
  const routeMap = { "account-info": "account-info", "transfer": "send", "card": "cards", "statement": "statement" };
  return (
    <div>
      <h3 className="font-black text-gray-800 text-lg text-center mb-1">What would you like to do today?</h3>
      <p className="text-gray-400 text-sm text-center mb-6">Choose from our popular actions below.</p>
      <div className="grid grid-cols-2 gap-4">
        {QUICK_ACTIONS.map(a => (
          <button key={a.id} onClick={() => onNavigate(routeMap[a.id] || a.id)}
            className="flex flex-col items-center justify-center gap-3 bg-gray-100 hover:bg-gray-200 rounded-2xl py-8 px-4 transition-all hover:-translate-y-0.5 hover:shadow-md">
            <QIcon id={a.id} />
            <span className="text-gray-700 text-sm font-semibold">{a.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function RecentTransactions({ transactions, onNavigate }) {
  return (
    <div className="rounded-2xl overflow-hidden border border-blue-200" style={{ background: "#e8eeff" }}>
      <div className="px-5 py-4 border-b border-blue-200">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-gray-800 text-base">Recent Transactions:</h3>
          <button onClick={() => onNavigate("transfer-history")} className="text-[#1a1a5e] text-xs font-bold hover:underline">View all →</button>
        </div>
      </div>
      <div className="bg-white mx-3 mb-3 mt-0 rounded-xl overflow-hidden border border-blue-100">
        <div className="grid grid-cols-4 gap-2 px-5 py-3 border-b border-gray-100 bg-gray-50">
          {["Account", "Amount", "Type", "Date"].map(h => (
            <span key={h} className="text-xs font-bold text-gray-500 uppercase tracking-wide">{h}</span>
          ))}
        </div>
        {transactions.slice(0, 5).map((t, i) => (
          <div key={t.id} className={`grid grid-cols-4 gap-2 px-5 py-3.5 items-center ${i !== transactions.length - 1 ? "border-b border-gray-50" : ""} hover:bg-gray-50 transition-colors`}>
            <span className="text-sm text-gray-700 font-medium truncate">{t.account}</span>
            <span className={`text-sm font-bold ${t.type === "credit" ? "text-green-600" : "text-red-500"}`}>
              {t.type === "credit" ? "+" : ""}{fmt(t.amount)}
            </span>
            <span>
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${t.type === "credit" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                {t.type}
              </span>
            </span>
            <span className="text-xs text-gray-400">{t.date}<br/><span className="text-gray-300">{t.time}</span></span>
          </div>
        ))}
        {transactions.length === 0 && (
          <div className="text-center py-10 text-gray-400">
            <p className="text-3xl mb-2">📭</p>
            <p className="font-semibold text-sm">No transactions yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function DashboardHome({ user, account, transactions, onNavigate }) {
  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto w-full space-y-6">
      <BalanceCard user={user} account={account} onNavigate={onNavigate} />
      <TaxBanner />
      <QuickActions onNavigate={onNavigate} />
      <RecentTransactions transactions={transactions} onNavigate={onNavigate} />
    </div>
  );
}