import ChatLauncher from "../components/chat/Chatlauncher.jsx";
import { useState, useRef, useEffect } from "react";
import { NAV_ITEMS } from "./mockData.js";
import { signOut } from "firebase/auth";
import { auth } from "../utils/firebase/firebase.js";

// ─── Icons ───────────────────────────────────────────────────────
const Icon = ({ name, size = 20, color = "currentColor" }) => {
  const s = { width: size, height: size, flexShrink: 0 };
  const icons = {
    dashboard: <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
    security:  <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><path d="M12 2L3 6v6c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V6L12 2z"/></svg>,
    transfer:  <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4"/></svg>,
    monetary:  <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>,
    loan:      <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    account:   <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    bell:      <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>,
    chevron:   <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>,
    menu:      <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16"/></svg>,
    close:     <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path strokeLinecap="round" d="M18 6L6 18M6 6l12 12"/></svg>,
    logout:    <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  };
  return icons[name] || <svg style={s} viewBox="0 0 24 24"/>;
};

// ─── Sidebar ──────────────────────────────────────────────────────
function Sidebar({ activePage, onNavigate, collapsed, onClose }) {
  const [openSub, setOpenSub] = useState(null);

  useEffect(() => {
    // auto-open sub that contains activePage
    for (const item of NAV_ITEMS) {
      if (item.sub?.some(s => s.path === activePage)) {
        setOpenSub(item.id);
        break;
      }
    }
  }, [activePage]);

  const isActive = (item) => activePage === item.path || item.sub?.some(s => s.path === activePage);

  return (
    <>
      {/* Overlay on mobile */}
      {!collapsed && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed top-0 left-0 h-full z-40 flex flex-col
        bg-white border-r border-gray-100
        transition-all duration-300 ease-in-out
        ${collapsed ? "-translate-x-full lg:translate-x-0 lg:w-16" : "translate-x-0 w-64"}
        lg:relative lg:flex lg:flex-col
        shadow-xl lg:shadow-none
      `}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-gray-100 min-h-[68px]">
          <div className="w-9 h-9 rounded-full bg-[#1a1a5e] flex items-center justify-center flex-shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M3 21h18M3 10h18M12 3L2 10h20L12 3z" stroke="#c8a951" strokeWidth="1.8" strokeLinecap="round"/>
              <path d="M5 10v11M9 10v11M15 10v11M19 10v11" stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
          </div>
          {!collapsed && (
            <div>
              <div className="text-[#1a1a5e] font-black text-sm tracking-tight leading-none">RENEW</div>
              <div className="text-[#c8a951] font-bold text-[9px] tracking-[0.2em] mt-0.5">PART BANK</div>
            </div>
          )}
          <button onClick={onClose} className="ml-auto lg:hidden text-gray-400 hover:text-gray-600">
            <Icon name="close" size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          {NAV_ITEMS.map(item => (
            <div key={item.id}>
              <button
                onClick={() => {
                  if (item.sub) {
                    setOpenSub(openSub === item.id ? null : item.id);
                  } else {
                    onNavigate(item.path);
                    onClose();
                  }
                }}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-0.5
                  text-left text-sm font-semibold transition-all duration-150
                  ${isActive(item)
                    ? "bg-[#1a1a5e] text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-50 hover:text-[#1a1a5e]"}
                `}
              >
                <Icon name={item.icon} size={18} color={isActive(item) ? "white" : "#6b7280"} />
                {!collapsed && (
                  <>
                    <span className="flex-1">{item.label}</span>
                    {item.sub && (
                      <span className={`transition-transform duration-200 ${openSub === item.id ? "rotate-180" : ""}`}>
                        <Icon name="chevron" size={14} color={isActive(item) ? "white" : "#9ca3af"} />
                      </span>
                    )}
                  </>
                )}
              </button>

              {/* Sub items */}
              {item.sub && openSub === item.id && !collapsed && (
                <div className="ml-4 pl-3 border-l-2 border-gray-100 mb-1">
                  {item.sub.map(sub => (
                    <button
                      key={sub.id}
                      onClick={() => { onNavigate(sub.path); onClose(); }}
                      className={`
                        w-full text-left px-3 py-2 rounded-lg text-[13px] font-medium transition-colors mb-0.5
                        ${activePage === sub.path
                          ? "text-[#1a1a5e] bg-blue-50 font-bold"
                          : "text-gray-500 hover:text-[#1a1a5e] hover:bg-gray-50"}
                      `}
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Logout */}
        <div className="border-t border-gray-100 p-3">
          <button
            onClick={() => { return signOut(auth) }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors"
          >
            <Icon name="logout" size={18} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}

// ─── Topbar ───────────────────────────────────────────────────────
function Topbar({ onMenuClick, onNavigate, user, notifications }) {
  const [showNotifs, setShowNotifs] = useState(false);
  const [notifs, setNotifs] = useState(notifications || []);
  const unread = notifs.filter(n => !n.read).length;
  const ref = useRef(null);

  useEffect(() => {
    const fn = (e) => { if (ref.current && !ref.current.contains(e.target)) setShowNotifs(false); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  const typeIcon = { credit: "💚", debit: "🔴", alert: "⚠️", info: "ℹ️" };

  return (
    <header className="h-[68px] bg-white border-b border-gray-100 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-20">
      {/* Left: hamburger */}
      <button onClick={onMenuClick} className="text-gray-500 hover:text-[#1a1a5e] transition-colors lg:hidden">
        <Icon name="menu" size={22} />
      </button>
      <div className="hidden lg:block" />

      {/* Right: search + notifs + avatar */}
      <div className="flex items-center gap-3">
        {/* Search stub */}
        <div className="hidden sm:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 w-48">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input placeholder="Search..." className="bg-transparent text-sm text-gray-500 outline-none w-full placeholder-gray-400" />
        </div>

        {/* Notifications */}
        <div className="relative" ref={ref}>
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="relative w-9 h-9 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            <Icon name="bell" size={17} color="#6b7280" />
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[9px] font-bold flex items-center justify-center">
                {unread}
              </span>
            )}
          </button>

          {showNotifs && (
            <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <span className="font-bold text-sm text-[#1a1a5e]">Notifications</span>
                <button
                  onClick={() => setNotifs(n => n.map(x => ({ ...x, read: true })))}
                  className="text-[11px] text-blue-500 font-semibold hover:underline"
                >
                  Mark all read
                </button>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifs.map(n => (
                  <div
                    key={n.id}
                    onClick={() => setNotifs(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x))}
                    className={`flex gap-3 px-4 py-3 cursor-pointer border-b border-gray-50 hover:bg-gray-50 transition-colors ${!n.read ? "bg-blue-50/40" : ""}`}
                  >
                    <span className="text-lg flex-shrink-0 mt-0.5">{typeIcon[n.type]}</span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm leading-snug ${!n.read ? "font-bold text-gray-800" : "font-medium text-gray-600"}`}>{n.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{n.message}</p>
                      <p className="text-[10px] text-gray-300 mt-1">{n.date}</p>
                    </div>
                    {!n.read && <div className="w-2 h-2 rounded-full bg-blue-500 mt-1 flex-shrink-0" />}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Avatar */}
        <button onClick={() => onNavigate("profile")} className="flex items-center gap-2 group">
          <div className="relative">
            <img
              src={user?.avatar}
              alt={user?.firstName}
              className="w-9 h-9 rounded-full object-cover border-2 border-gray-200 group-hover:border-[#1a1a5e] transition-colors"
              onError={e => { e.target.style.display = "none"; }}
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
          </div>
        </button>
      </div>
    </header>
  );
}

// ─── DashboardLayout ──────────────────────────────────────────────
export default function DashboardLayout({ activePage, onNavigate, children, data }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700;9..40,800;9..40,900&display=swap');
        .font-sans { font-family: 'DM Sans', 'Trebuchet MS', sans-serif !important; }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 4px; }
      `}</style>

      {/* Sidebar */}
      <div className="hidden lg:flex flex-shrink-0">
        <div className="w-64">
          <Sidebar activePage={activePage} onNavigate={onNavigate} collapsed={false} onClose={() => {}} />
        </div>
      </div>

      {/* Mobile sidebar */}
      <Sidebar
        activePage={activePage}
        onNavigate={onNavigate}
        collapsed={!sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar onMenuClick={() => setSidebarOpen(true)} onNavigate={onNavigate} user={data?.user} notifications={data?.notifications || []} />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Chat launcher — auto-detects admin vs user */}
      <ChatLauncher />
    </div>
  );
}