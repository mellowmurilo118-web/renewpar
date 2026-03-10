import { useState } from "react";
import { fmt } from "./mockData.js";

function Card3D({ card, flipped, onClick }) {
  const [bg1, bg2] = card.color;

  return (
    <div
      onClick={onClick}
      className="cursor-pointer select-none"
      style={{ perspective: 1000 }}
    >
      <div style={{
        position: "relative", width: "100%", maxWidth: 380,
        height: 220, transformStyle: "preserve-3d",
        transition: "transform 0.6s ease",
        transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
      }}>
        {/* Front */}
        <div style={{
          position: "absolute", inset: 0, backfaceVisibility: "hidden",
          borderRadius: 20, padding: 28,
          background: `linear-gradient(135deg, ${bg1} 0%, ${bg2} 100%)`,
          boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
          display: "flex", flexDirection: "column", justifyContent: "space-between",
        }}>
          {/* Top row */}
          <div className="flex justify-between items-start">
            <div>
              <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">{card.label}</p>
              <p className="text-white/30 text-[9px] mt-0.5">{card.virtual ? "Virtual Card" : "Physical Card"}</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              {/* Card network logo */}
              {card.type === "Visa" ? (
                <svg width="48" height="16" viewBox="0 0 750 240" fill="white" opacity="0.9">
                  <path d="M278.2 170L304 79h27l-25.8 91zM415.4 81c-5.4-2-13.9-4.2-24.5-4.2-27 0-46 14.3-46.1 34.8-.2 15.2 13.6 23.6 24 28.6 10.7 5.2 14.3 8.5 14.3 13.1-.1 7.1-8.6 10.3-16.5 10.3-11 0-16.9-1.6-26-5.6l-3.5-1.7-3.9 23.8c6.5 3 18.5 5.6 31 5.7 29.3 0 48.3-14.4 48.5-36.7.1-12.2-7.3-21.5-23.3-29.2-9.7-5-15.6-8.3-15.5-13.3 0-4.5 5-9.2 15.9-9.2 9 0 15.6 1.9 20.7 4l2.5 1.2 3.9-23.6zM498.7 79h-21.1c-6.5 0-11.4 1.9-14.3 8.8L416 170h29.3l5.8-16.1h35.8l3.4 16.1h25.9L498.7 79zm-34.5 55.7l10.9-29.7 6.2 29.7h-17.1zM237.5 79l-26.7 62.3-2.9-14.5c-4.9-16.6-20.3-34.7-37.5-43.7l24.5 87h29.5l43.8-91.1h-30.7z"/>
                  <path fill="white" opacity="0.9" d="M189.3 79H143l-.4 2c35.9 9.2 59.7 31.4 69.6 58l-10-50.6c-1.7-6.8-6.6-8.9-13-9.4z"/>
                </svg>
              ) : (
                <div className="flex">
                  <div className="w-8 h-8 rounded-full bg-red-500 opacity-80 -mr-3" />
                  <div className="w-8 h-8 rounded-full bg-yellow-400 opacity-80" />
                </div>
              )}
            </div>
          </div>

          {/* Chip + NFC */}
          <div className="flex items-center gap-4">
            <div style={{
              width: 40, height: 30, borderRadius: 4,
              background: "linear-gradient(135deg, #d4a843, #f0c866)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <div style={{ width: 24, height: 18, borderRadius: 2, border: "1px solid rgba(0,0,0,0.15)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, padding: 2 }}>
                {[...Array(4)].map((_,i) => <div key={i} style={{ background: "rgba(0,0,0,0.12)", borderRadius: 1 }}/>)}
              </div>
            </div>
            {card.contactless && (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" opacity="0.7">
                <path d="M12 1C8.4 1 5.3 2.7 3.3 5.3M12 1c3.6 0 6.7 1.7 8.7 4.3M12 5c2.2 0 4.2 1 5.5 2.5M12 5c-2.2 0-4.2 1-5.5 2.5M12 9c1 0 1.9.5 2.5 1.2M12 9c-1 0-1.9.5-2.5 1.2M12 13v.01"/>
              </svg>
            )}
          </div>

          {/* Card number */}
          <div>
            <p className="text-white font-mono text-lg tracking-[0.2em] mb-3">{card.number}</p>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-white/50 text-[9px] uppercase tracking-wider">Card Holder</p>
                <p className="text-white font-bold text-sm tracking-wider">{card.holder}</p>
              </div>
              <div className="text-right">
                <p className="text-white/50 text-[9px] uppercase tracking-wider">Expires</p>
                <p className="text-white font-bold text-sm">{card.expiry}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Back */}
        <div style={{
          position: "absolute", inset: 0, backfaceVisibility: "hidden",
          transform: "rotateY(180deg)",
          borderRadius: 20, overflow: "hidden",
          background: `linear-gradient(135deg, ${bg2} 0%, ${bg1} 100%)`,
          boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
        }}>
          <div style={{ height: 48, background: "rgba(0,0,0,0.5)", marginTop: 24 }}/>
          <div style={{ padding: "16px 24px" }}>
            <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 8, padding: "8px 14px", display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
              <p style={{ color: "white", fontFamily: "monospace", letterSpacing: "0.15em", fontSize: 16, fontWeight: "bold" }}>CVV: {card.cvv}</p>
            </div>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 9, marginTop: 10, textAlign: "center" }}>
              This card is issued by Renew Part Bank. For support call +1 769 0RENEW
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CardsPage({ onNavigate, cards, user }) {
  const [selected, setSelected] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [freezeStates, setFreezeStates] = useState(
    Object.fromEntries((cards||[]).map(c => [c.id, c.status === "frozen"]))
  );

  const card = (cards||[])[selected] || cards[0];
  const isFrozen = freezeStates[card.id];

  function toggleFreeze() {
    setFreezeStates(s => ({ ...s, [card.id]: !s[card.id] }));
  }

  const spentPct = Math.round((card.spent / card.limit) * 100);

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">My Cards</h1>
        <p className="text-gray-400 text-sm mt-1">Manage your debit and credit cards</p>
      </div>

      {/* Card selector tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {(cards||[]).map((c, i) => (
          <button key={c.id} onClick={() => { setSelected(i); setFlipped(false); }}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-colors border ${selected === i ? "bg-[#1a1a5e] text-white border-[#1a1a5e]" : "bg-white text-gray-500 border-gray-200 hover:border-[#1a1a5e]"}`}>
            {c.label}
          </button>
        ))}
      </div>

      {/* 3D Card display */}
      <div className="flex justify-center mb-2">
        <div className="w-full max-w-[380px]">
          <Card3D card={card} flipped={flipped} onClick={() => setFlipped(f => !f)} />
        </div>
      </div>
      <p className="text-center text-xs text-gray-400 mb-6">Click card to reveal CVV</p>

      {/* Status badge */}
      <div className="flex justify-center mb-6">
        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${isFrozen ? "bg-blue-100 text-blue-600" : "bg-green-100 text-green-600"}`}>
          <span className={`w-2 h-2 rounded-full ${isFrozen ? "bg-blue-400" : "bg-green-400 animate-pulse"}`}/>
          {isFrozen ? "Card Frozen" : "Card Active"}
        </span>
      </div>

      {/* Spending limit */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4">
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm font-bold text-gray-700">Spending Limit</p>
          <p className="text-xs text-gray-400">{fmt(card.spent)} / {fmt(card.limit)}</p>
        </div>
        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${spentPct > 80 ? "bg-red-400" : spentPct > 50 ? "bg-yellow-400" : "bg-[#1a1a5e]"}`}
            style={{ width: `${spentPct}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-1.5">{spentPct}% of limit used</p>
      </div>

      {/* Card details */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4">
        <h3 className="font-bold text-gray-800 text-sm mb-4">Card Details</h3>
        {[
          ["Card Type", card.type],
          ["Card Number", card.number],
          ["Expiry Date", card.expiry],
          ["Card Holder", card.holder],
          ["Contactless", card.contactless ? "Enabled" : "Disabled"],
          ["Virtual", card.virtual ? "Yes" : "No"],
        ].map(([k, v]) => (
          <div key={k} className="flex justify-between py-2.5 border-b border-gray-100 last:border-0">
            <span className="text-xs text-gray-400 font-semibold">{k}</span>
            <span className="text-xs font-bold text-gray-700">{v}</span>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={toggleFreeze}
          className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-colors border ${isFrozen ? "bg-green-50 border-green-200 text-green-700 hover:bg-green-100" : "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"}`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {isFrozen ? <path d="M12 22C6.48 22 2 17.52 2 12S6.48 2 12 2s10 4.48 10 10-4.48 10-10 10zm-2-9l2 2 4-4" strokeLinecap="round" strokeLinejoin="round"/> : <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>}
          </svg>
          {isFrozen ? "Unfreeze Card" : "Freeze Card"}
        </button>
        <button className="flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>
          Report Lost
        </button>
      </div>

      <button className="w-full mt-3 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm bg-[#1a1a5e] text-white hover:bg-[#2a2a8e] transition-colors">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Request New Card
      </button>
    </div>
  );
}