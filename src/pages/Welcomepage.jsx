import { useState, useEffect, useRef } from "react";

/* ════════════════════════════════════════════════════════════════
   ALL DATA ARRAYS
════════════════════════════════════════════════════════════════ */

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  {
    label: "Personal", href: "#",
    sub: [
      { label: "Ultimate Checking", href: "#" },
      { label: "Health Savings Account (NSA)", href: "#" },
      { label: "Individual Retirement Account (IRAs)", href: "#" },
    ],
  },
  {
    label: "Business", href: "#",
    sub: [
      { label: "Overdraft Protection & Sweeps", href: "#" },
      { label: "Business Essential Checking", href: "#" },
      { label: "Business Savings Account", href: "#" },
    ],
  },
  {
    label: "Loans", href: "#",
    sub: [
      { label: "Home Mortgage Loans", href: "#" },
      { label: "Personal Loans", href: "#" },
      { label: "Working Capital Loans", href: "#" },
      { label: "Investment Property Loans", href: "#" },
      { label: "Commercial Real Estate Loans", href: "#" },
      { label: "Business Term Loans", href: "#" },
    ],
  },
  {
    label: "Services", href: "#",
    sub: [
      { label: "Online Banking", href: "#" },
      { label: "Wire Transfers", href: "#" },
      { label: "Lost or Stolen Cards", href: "#" },
    ],
  },
  { label: "Contact", href: "#contact" },
];

// Hero: full-bleed woman photo as background
const HERO_BG =
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1200&q=85";

// About: tilted stacked image collage
const ABOUT_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&q=80",
    alt: "Team collaboration",
    rotate: "-6deg",
    zIndex: 1,
    bg: "#2d2060",
  },
  {
    src: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80",
    alt: "Business professional",
    rotate: "3deg",
    zIndex: 2,
    bg: "#1a1a5e",
  },
  {
    src: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600&q=80",
    alt: "Office team",
    rotate: "-2deg",
    zIndex: 3,
    bg: "transparent",
  },
];

const SERVICES = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 36, height: 36 }}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: "Secure Transactions",
    desc: "Very secured and supervised means to save, invest and transfer your funds at full guarantee.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 36, height: 36 }}>
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    title: "Real Estate",
    desc: "Invest in the Real Estate Industry, the Fastest and largest income generator. Renew Part Bank gives you this superior and unique edge.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 36, height: 36 }}>
        <circle cx="12" cy="12" r="11" fill="#1a1a5e" />
        <text x="12" y="16.5" textAnchor="middle" fontSize="10" fontWeight="bold" fill="white" fontFamily="serif">₿</text>
      </svg>
    ),
    title: "Digital Assets",
    desc: "Digital assets, like bitcoin, are an emerging asset class for investors. Our digital asset fund offers investors exposure to bitcoin and other assets.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 36, height: 36 }}>
        <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
      </svg>
    ),
    title: "Quick Loans",
    desc: "We have great loan offers to help meet your needs with very low interest rates. Also available to every one regardless of your status.",
  },
];

// Gallery: exact images matching screenshot (card payment, charts/resume, law firm meeting, pie chart analysis, + more)
const GALLERY_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
    alt: "Card payment transaction",
    title: "Renew Part Bank",
    sub: "Banking & Financial",
  },
  {
    src: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80",
    alt: "Business charts and resume",
    title: "Renew Part Bank",
    sub: "Business Consultation",
  },
  {
    src: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80",
    alt: "Law firm meeting",
    title: "Renew Part Bank",
    sub: "Legal & Advisory",
  },
  {
    src: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=800&q=80",
    alt: "Financial analysis pie chart",
    title: "Renew Part Bank",
    sub: "Home & Business Loan",
  },
];

const CLIENTS = [
  {
    name: "Survation.",
    style: { fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: 20, fontWeight: 700 },
  },
  {
    name: "G4S",
    style: { fontWeight: 900, fontSize: 22, letterSpacing: "-0.03em" },
    prefix: "⊙",
  },
  {
    name: "🍁 ISRC",
    style: { fontWeight: 800, fontSize: 16, letterSpacing: "0.05em" },
  },
];

const VALUES_LIST = [
  "Integrity and Honesty",
  "Loyalty",
  "Teamwork",
  "Community",
  "Accountability",
  "Excellence",
  "Confidentiality",
  "Relationship",
];

// News: exact images matching screenshot
const NEWS_ITEMS = [
  {
    src: "https://images.unsplash.com/photo-1494412651409-8963ce7935a7?w=800&q=80",
    alt: "Shipping containers aerial",
    tag: "Home Mortgage Loans",
    title: "The keys to your dream home are within reach — and we can help you get them with affordable and flexible rates.",
    date: "December 14th, 2020",
    author: "Admin",
  },
  {
    src: "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=800&q=80",
    alt: "Counting money",
    tag: "Personal Needs",
    title: "Whether it's a sudden expense or just vacation to get away from everything, Renew Part Bank can make it happen.",
    date: "June 6th, 2003",
    author: "Admin",
  },
  {
    src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    alt: "Analytics dashboard tablet",
    tag: "HSA",
    title: "An HSA (Health Saving Account) helps employees save in advance for future medical expenses.",
    date: "May 13th, 2013",
    author: "Admin",
  },
];

const FOOTER_COMPANY = [
  { label: "About Us", href: "#" },
  { label: "Working Loans", href: "#" },
  { label: "Ultimate Checking", href: "#" },
];

const FOOTER_QUICK = [
  { label: "Business Account", href: "#" },
  { label: "Lost Card", href: "#" },
  { label: "Health Savings", href: "#" },
];

const SOCIAL_LINKS = [
  {
    href: "#",
    label: "Twitter",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 16, height: 16 }}>
        <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
      </svg>
    ),
  },
  {
    href: "#",
    label: "Facebook",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 16, height: 16 }}>
        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
      </svg>
    ),
  },
  {
    href: "#",
    label: "Instagram",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}>
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
];

/* ════════════════════════════════════════════════════════════════
   SCROLL REVEAL HOOK
════════════════════════════════════════════════════════════════ */
function useReveal(threshold = 0.1) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function Reveal({ children, delay = 0, from = "bottom", className = "", style = {} }) {
  const [ref, visible] = useReveal();
  const initTransform = { bottom: "translateY(32px)", left: "translateX(-32px)", right: "translateX(32px)", top: "translateY(-20px)" }[from];
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : initTransform,
        transition: `opacity 0.7s cubic-bezier(.4,0,.2,1) ${delay}s, transform 0.7s cubic-bezier(.4,0,.2,1) ${delay}s`,
        willChange: "opacity, transform",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   MAIN APP
════════════════════════════════════════════════════════════════ */
export default function WelcomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDrop, setOpenDrop] = useState(null); // desktop hover
  const [mobileExpand, setMobileExpand] = useState(null); // mobile accordion
  const [scrolled, setScrolled] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 900) setMenuOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const C = {
    navy: "#1a1a5e",
    navyDark: "#0f1235",
    navyMid: "#2d2060",
    gold: "#c8a951",
    goldLight: "#e0bb6a",
    text: "#333",
    textLight: "#777",
    textMuted: "#aaa",
    bg: "#f5f6fa",
    white: "#ffffff",
    border: "#e8eaf0",
  };

  return (
    <div style={{ fontFamily: "'Barlow', 'Trebuchet MS', Arial, sans-serif", color: C.text, overflowX: "hidden" }}>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { font-family: 'Barlow', 'Trebuchet MS', Arial, sans-serif; }
        a { text-decoration: none; color: inherit; }
        img { display: block; max-width: 100%; }
        button { font-family: inherit; }

        /* Nav dropdown hover */
        .dd-item { position: relative; }
        .dd-menu { display: none; position: absolute; top: 100%; left: 0; z-index: 300; padding-top: 6px; min-width: 220px; }
        .dd-item:hover .dd-menu { display: block; animation: fadeDown .15s ease; }
        @keyframes fadeDown { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } }

        /* Hover utilities */
        .hover-gold:hover { color: ${C.gold} !important; }
        .hover-lift:hover { transform: translateY(-3px) !important; box-shadow: 0 12px 32px rgba(26,26,94,.14) !important; }
        .img-zoom:hover img { transform: scale(1.06) !important; }

        /* Services card hover */
        .svc-card:hover { border-color: ${C.gold} !important; box-shadow: 0 8px 32px rgba(26,26,94,.10) !important; transform: translateY(-3px) !important; }

        /* Gallery img zoom on hover */
        .gal-img { overflow:hidden; }
        .gal-img img { transition: transform .6s ease; }
        .gal-img:hover img { transform: scale(1.05); }

        /* Mobile menu transition */
        .mob-menu { max-height: 0; overflow: hidden; transition: max-height .35s ease; }
        .mob-menu.open { max-height: 600px; }

        /* Clients ticker on mobile */
        @media (max-width: 600px) {
          .clients-row { flex-wrap: wrap; gap: 24px !important; justify-content: center; }
        }

        /* Responsive grid helpers */
        @media (max-width: 900px) {
          .desktop-only { display: none !important; }
          .two-col { flex-direction: column !important; }
          .gallery-grid { grid-template-columns: 1fr !important; grid-template-rows: auto !important; }
          .gallery-grid > * { grid-area: unset !important; }
          .news-grid { grid-template-columns: 1fr !important; }
          .news-grid > * { grid-area: unset !important; }
          .values-grid { flex-direction: column !important; }
        }
        @media (min-width: 901px) {
          .mobile-only { display: none !important; }
        }
      `}</style>

      {/* ══════════════ TOPBAR ══════════════════════════════════════ */}
      <div style={{ background: C.navyDark, color: "#aaa", fontSize: 12, padding: "8px 24px", display: "flex", justifyContent: "center", gap: 32, alignItems: "center" }}>
        <a href="#" className="hover-gold" style={{ display: "flex", alignItems: "center", gap: 6, color: "#aaa", fontWeight: 500 }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 14, height: 14 }}><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>
          Internet Banking
        </a>
        <a href="#" className="hover-gold" style={{ display: "flex", alignItems: "center", gap: 6, color: "#aaa", fontWeight: 500 }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 14, height: 14 }}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
          Why Trust Home
        </a>
      </div>

      {/* ══════════════ NAVBAR ══════════════════════════════════════ */}
      <nav style={{
        position: !scrolled?"sticky" :"fixed", top: 0, zIndex: 200, background: C.white, width: "100%",
        boxShadow: scrolled ? "0 2px 20px rgba(0,0,0,0.09)" : "0 1px 0 " + C.border,
        transition: "box-shadow .3s",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 62 }}>

          {/* Logo */}
          <a href="#home" style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            {/* Bank icon */}
            <svg viewBox="0 0 40 40" style={{ width: 38, height: 38 }}>
              <rect width="40" height="40" rx="4" fill={C.navy} />
              <rect x="5" y="28" width="30" height="3" fill="white" />
              <rect x="5" y="10" width="30" height="3" fill="white" />
              {[8, 13, 18, 23, 28].map(x => (
                <rect key={x} x={x} y="13" width="3" height="15" fill="white" />
              ))}
            </svg>
            <div style={{ lineHeight: 1 }}>
              <div style={{ color: C.navy, fontWeight: 900, fontSize: 13.5, letterSpacing: "0.04em" }}>RENEW</div>
              <div style={{ color: C.navy, fontWeight: 700, fontSize: 11, letterSpacing: "0.04em" }}>PART BANK</div>
            </div>
          </a>

          {/* Desktop Nav */}
          <div className="desktop-only" style={{ display: "flex", alignItems: "center", gap: 2 }}>
            {NAV_LINKS.map(link => (
              <div key={link.label} className="dd-item"
                onMouseEnter={() => setOpenDrop(link.label)}
                onMouseLeave={() => setOpenDrop(null)}>
                <a href={link.href} style={{
                  display: "flex", alignItems: "center", gap: 3,
                  padding: "8px 12px", fontSize: 12.5, fontWeight: 700,
                  color: "#333", textTransform: "uppercase", letterSpacing: "0.07em",
                  borderRadius: 6, transition: "color .2s",
                }}
                  onMouseEnter={e => e.currentTarget.style.color = C.navy}
                  onMouseLeave={e => e.currentTarget.style.color = "#333"}>
                  {link.label}
                  {link.sub && (
                    <svg width="9" height="9" viewBox="0 0 12 12" fill="#999">
                      <path d="M1 3.5L6 8.5L11 3.5" stroke="#999" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    </svg>
                  )}
                </a>
                {link.sub && (
                  <div className="dd-menu">
                    <div style={{ background: C.white, border: "1px solid " + C.border, borderRadius: 10, boxShadow: "0 12px 40px rgba(0,0,0,.13)", overflow: "hidden" }}>
                      {link.sub.map(s => (
                        <a key={s.label} href={s.href}
                          style={{ display: "block", padding: "10px 18px", fontSize: 13, color: "#555", fontWeight: 500, transition: "all .15s" }}
                          onMouseEnter={e => { e.currentTarget.style.background = C.navy; e.currentTarget.style.color = "white"; }}
                          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#555"; }}>
                          {s.label}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right: Banking CTA + Hamburger */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <a href="#" style={{
              background: C.navy, color: "white", fontWeight: 800, fontSize: 12,
              letterSpacing: "0.12em", textTransform: "uppercase", padding: "9px 20px",
              borderRadius: 6, transition: "background .2s",
            }}
              onMouseEnter={e => e.currentTarget.style.background = "#2a2a7e"}
              onMouseLeave={e => e.currentTarget.style.background = C.navy}>
              BANKING
            </a>
            <button
              className="mobile-only"
              onClick={() => setMenuOpen(!menuOpen)}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 6, color: C.navy }}
              aria-label="Toggle menu">
              {menuOpen
                ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: 24, height: 24 }}><path strokeLinecap="round" d="M18 6L6 18M6 6l12 12" /></svg>
                : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: 24, height: 24 }}><path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
              }
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        <div className={`mob-menu mobile-only ${menuOpen ? "open" : ""}`}
          style={{ borderTop: "1px solid " + C.border, background: C.white }}>
          <div style={{ padding: "8px 16px 16px" }}>
            {NAV_LINKS.map(link => (
              <div key={link.label}>
                <button
                  onClick={() => setMobileExpand(mobileExpand === link.label ? null : link.label)}
                  style={{
                    width: "100%", background: "none", border: "none", cursor: "pointer",
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "12px 8px", fontSize: 13.5, fontWeight: 700, color: C.navy,
                    textTransform: "uppercase", letterSpacing: "0.06em",
                  }}>
                  {link.label}
                  {link.sub && (
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke={C.navy} strokeWidth="1.8" strokeLinecap="round"
                      style={{ transition: "transform .2s", transform: mobileExpand === link.label ? "rotate(180deg)" : "none" }}>
                      <path d="M1 3.5L6 8.5L11 3.5" />
                    </svg>
                  )}
                </button>
                {link.sub && mobileExpand === link.label && (
                  <div style={{ paddingLeft: 16, paddingBottom: 8 }}>
                    {link.sub.map(s => (
                      <a key={s.label} href={s.href}
                        style={{ display: "block", padding: "9px 8px", fontSize: 13, color: C.textLight, borderBottom: "1px solid " + C.border }}
                        onMouseEnter={e => e.currentTarget.style.color = C.navy}
                        onMouseLeave={e => e.currentTarget.style.color = C.textLight}>
                        {s.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </nav>

      {/* ══════════════ HERO ════════════════════════════════════════ */}
      <section id="home" style={{
        position: "relative", minHeight: "88vh",
        display: "flex", alignItems: "center", overflow: "hidden",
      }}>
        {/* Full-bleed background image */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 0,
          backgroundImage: `url(${HERO_BG})`,
          backgroundSize: "cover", backgroundPosition: "center top",
          backgroundRepeat: "no-repeat",
        }} />
        {/* Left dark navy gradient overlay */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 1,
          background: "linear-gradient(90deg, rgba(15,18,53,0.92) 0%, rgba(26,26,94,0.82) 45%, rgba(26,26,94,0.3) 70%, transparent 100%)",
        }} />

        {/* Content */}
        <div style={{ position: "relative", zIndex: 2, maxWidth: 1200, margin: "0 auto", padding: "80px 24px", width: "100%" }}>
          <Reveal from="left">
            <h1 style={{
              fontSize: "clamp(34px, 5.5vw, 64px)", fontWeight: 900, color: C.white,
              lineHeight: 1.08, marginBottom: 20, maxWidth: 560,
              textShadow: "0 2px 12px rgba(0,0,0,0.3)",
            }}>
              Offering Financial<br />Inclusion for all
            </h1>
          </Reveal>
          <Reveal from="left" delay={0.1}>
            <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "clamp(14px,1.5vw,17px)", lineHeight: 1.7, maxWidth: 460, marginBottom: 36 }}>
              Renew Part Bank continues to offer diverse financial products through our many product lines.
            </p>
          </Reveal>
          <Reveal from="left" delay={0.2}>
            <a href="#"
              style={{
                display: "inline-block", background: C.navy, color: C.white,
                fontWeight: 800, fontSize: 13, letterSpacing: "0.14em", textTransform: "uppercase",
                padding: "14px 34px", borderRadius: 4, border: `2px solid ${C.navy}`,
                transition: "all .25s", boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = C.white; }}
              onMouseLeave={e => { e.currentTarget.style.background = C.navy; e.currentTarget.style.borderColor = C.navy; }}>
              LOGIN NOW
            </a>
          </Reveal>
        </div>
      </section>

      {/* ══════════════ SUPPORT BANNER ══════════════════════════════ */}
      <section style={{ background: C.navy, color: C.white, padding: "32px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h3 style={{ fontSize: "clamp(16px, 2.5vw, 22px)", fontWeight: 800, marginBottom: 8, lineHeight: 1.4 }}>
            For Enquires Or Support <strong style={{ color: C.white }}>Call us now!</strong>
          </h3>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, marginBottom: 16 }}>
            We provide a dedicated support 24/7 for any your question
          </p>
          <div style={{ fontSize: 28, fontWeight: 900, color: C.white }}>+</div>
        </div>
      </section>

      {/* ══════════════ ABOUT ════════════════════════════════════════ */}
      <section style={{ padding: "80px 24px", background: C.white, overflow: "hidden" }}>
        <div className="two-col" style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", gap: 70 }}>

          {/* Image collage — rotated stacked cards like original */}
          <Reveal from="left" style={{ flex: "0 0 auto", width: "clamp(280px, 42%, 440px)", position: "relative", height: 360, margin: "0 auto" }}>
            {/* Background dark blobs */}
            <div style={{ position: "absolute", top: 20, left: 30, width: "80%", height: "80%", background: "#2d2060", borderRadius: 20, transform: "rotate(-6deg)", zIndex: 0 }} />
            <div style={{ position: "absolute", top: 10, left: 10, width: "80%", height: "80%", background: "#1a1a5e", borderRadius: 20, transform: "rotate(3deg)", zIndex: 0 }} />
            {/* Main photo */}
            <img
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&q=80"
              alt="Team meeting"
              style={{
                position: "absolute", top: 30, left: 20, width: "82%", height: "82%",
                objectFit: "cover", borderRadius: 18,
                boxShadow: "0 16px 50px rgba(0,0,0,0.25)", zIndex: 2,
              }}
            />
          </Reveal>

          {/* Text */}
          <Reveal from="right" delay={0.12} style={{ flex: 1, minWidth: 260 }}>
            <p style={{ color: C.textMuted, fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 8 }}>About Us</p>
            <h2 style={{ fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 900, color: C.navy, marginBottom: 20, lineHeight: 1.15 }}>Renew Part Bank</h2>
            <p style={{ color: C.textLight, lineHeight: 1.8, fontSize: 15, marginBottom: 16 }}>
              Renew Part Bank continues to serve the financial needs of individuals, farmers, businesses, and industries by offering the traditional banking products, as well as online, mobile and telephone banking products.
            </p>
            <p style={{ color: "#bbb", fontSize: 18, fontStyle: "italic", fontFamily: "Georgia, serif", fontWeight: 400, marginBottom: 8 }}>
              Winsthood
            </p>
            <div style={{ width: "100%", height: 1, background: C.border, margin: "20px 0" }} />
          </Reveal>
        </div>
      </section>

      {/* ══════════════ SERVICES ════════════════════════════════════ */}
      <section style={{ padding: "72px 24px", background: C.bg }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Reveal>
            <p style={{ color: C.textMuted, fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 8 }}>Our Services</p>
            <h2 style={{ fontSize: "clamp(24px, 3vw, 38px)", fontWeight: 900, color: C.navy, marginBottom: 48, lineHeight: 1.2 }}>
              <strong>Best Solutions</strong>{" "}
              <span style={{ fontWeight: 400, color: C.text }}>For Your Business</span>
            </h2>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 16 }}>
            {SERVICES.map((s, i) => (
              <Reveal key={i} delay={i * 0.07} from="bottom">
                <div className="svc-card" style={{
                  background: C.white, borderRadius: 12, padding: "32px 28px",
                  border: "1px solid " + C.border, transition: "all .3s", cursor: "pointer",
                }}>
                  <div style={{ color: C.navy, marginBottom: 20 }}>{s.icon}</div>
                  <h4 style={{ fontWeight: 800, color: C.navy, fontSize: 16, marginBottom: 12 }}>{s.title}</h4>
                  <p style={{ color: C.textLight, fontSize: 14, lineHeight: 1.75 }}>{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ GALLERY ═════════════════════════════════════ */}
      <section style={{ padding: "72px 0 0", background: C.white }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", paddingLeft: 24, paddingRight: 24, marginBottom: 36 }}>
          <Reveal>
            <h2 style={{ fontSize: "clamp(24px, 3vw, 38px)", fontWeight: 900, color: C.text }}>
              See Our <strong style={{ color: C.navy }}>Successful Strategies</strong>
            </h2>
          </Reveal>
        </div>

        {/* Gallery: on mobile stacked full-width, on desktop 2×2 grid */}
        <div className="gallery-grid" style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gridTemplateRows: "340px 340px",
          gap: 0,
        }}>
          {GALLERY_IMAGES.map((img, i) => (
            <Reveal key={i} delay={i * 0.06} from="bottom" className="gal-img" style={{
              position: "relative", cursor: "pointer", overflow: "hidden",
            }}>
              <img src={img.src} alt={img.alt} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              {/* Caption bar */}
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0,
                background: C.navy, padding: "14px 20px",
              }}>
                <p style={{ color: C.white, fontWeight: 800, fontSize: 15, marginBottom: 3 }}>{img.title}</p>
                <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 13 }}>{img.sub}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══════════════ CLIENTS ═════════════════════════════════════ */}
      <section style={{ padding: "40px 24px", borderTop: "1px solid " + C.border, borderBottom: "1px solid " + C.border, background: C.white }}>
        <div className="clients-row" style={{ maxWidth: 900, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-around", gap: 32, flexWrap: "wrap" }}>
          {CLIENTS.map((c, i) => (
            <div key={i} style={{ color: "#bbb", transition: "color .2s", cursor: "pointer", ...c.style }}
              onMouseEnter={e => e.currentTarget.style.color = C.navy}
              onMouseLeave={e => e.currentTarget.style.color = "#bbb"}>
              {c.name}
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════ WHY US + VALUES ══════════════════════════════ */}
      <section style={{ padding: "80px 24px", background: C.white }}>
        <div className="values-grid two-col" style={{ maxWidth: 1200, margin: "0 auto", display: "flex", gap: 60, alignItems: "flex-start" }}>

          {/* Left: Why us */}
          <Reveal from="left" style={{ flex: 1, minWidth: 260 }}>
            <p style={{ color: C.textMuted, fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 8 }}>Why Choose Us</p>
            <h2 style={{ fontSize: "clamp(24px, 3vw, 40px)", fontWeight: 900, color: C.navy, marginBottom: 36, lineHeight: 1.2 }}>
              <strong>Your Success</strong> <span style={{ fontWeight: 400 }}>Means a lot To Us</span>
            </h2>
            <div style={{ marginBottom: 28 }}>
              <h4 style={{ fontWeight: 800, color: C.navy, fontSize: 16, marginBottom: 10 }}>Our Vision</h4>
              <p style={{ color: C.textLight, fontSize: 14.5, lineHeight: 1.8 }}>
                To be a leading bank in the World, supporting the development of small businesses and financial inclusion around the world.
              </p>
            </div>
            <div>
              <h4 style={{ fontWeight: 800, color: C.navy, fontSize: 16, marginBottom: 10 }}>Our Mission</h4>
              <p style={{ color: C.textLight, fontSize: 14.5, lineHeight: 1.8 }}>
                The mission of Renew Part Bank is to contribute to the sustainable development of the international banking sector by providing responsible financial services and solutions to households and micro, small and medium enterprises, using internationally recognized best banking practices. We are committed to delivering value for our clients, shareholders, employees, and society at large. The mission is based on our values: integrity and openness, professionalism, commitment to customers, team work, and social and environmental responsibility.
              </p>
            </div>
          </Reveal>

          {/* Right: Values box */}
          <Reveal from="right" delay={0.1} style={{ flex: 1, minWidth: 260 }}>
            <div style={{ border: "1px solid " + C.border, borderRadius: 12, padding: "28px 28px", background: C.white }}>
              <p style={{ color: C.textLight, fontSize: 13, lineHeight: 1.75, marginBottom: 18, fontWeight: 500 }}>
                The mission of Renew Part Bank is to contribute to the sustainable development of the international banking sector by providing. Below are our core values
              </p>
              <h4 style={{ fontWeight: 800, color: C.navy, fontSize: 16, marginBottom: 16 }}>Our Values</h4>
              <div>
                {VALUES_LIST.map((v, i) => (
                  <div key={i} style={{
                    padding: "11px 0", borderBottom: i < VALUES_LIST.length - 1 ? "1px solid " + C.border : "none",
                    fontSize: 12.5, fontWeight: 700, color: "#555", textTransform: "uppercase", letterSpacing: "0.08em",
                  }}>
                    {v}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════════════ NEWS ════════════════════════════════════════ */}
      <section style={{ padding: "0 0 72px", background: C.bg }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          {/* Each news card: full-width image on top, dark navy caption below */}
          <div className="news-grid" style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 0,
          }}>
            {NEWS_ITEMS.map((item, i) => (
              <Reveal key={i} delay={i * 0.08} from="bottom" style={{ display: "flex", flexDirection: "column", cursor: "pointer" }}
                className="gal-img hover-lift">
                {/* Image */}
                <div style={{ overflow: "hidden", height: 260, flexShrink: 0 }}>
                  <img src={item.src} alt={item.alt} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform .6s" }} />
                </div>
                {/* Caption */}
                <div style={{ background: C.navy, padding: "22px 24px", flex: 1 }}>
                  <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 10 }}>
                    {item.tag}
                  </p>
                  <p style={{ color: C.white, fontWeight: 800, fontSize: 15, lineHeight: 1.55, marginBottom: 16 }}>
                    {item.title}
                  </p>
                  <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>
                    {item.date} by {item.author}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ FOOTER ══════════════════════════════════════ */}
      <footer id="contact" style={{ background: C.navyDark, color: C.white }}>

        {/* WhatsApp / contact bar */}
        <div style={{ padding: "32px 24px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 10 }}>
              Message Us Directly On Whatsapp
            </p>
            <p style={{ fontSize: "clamp(20px, 3vw, 28px)", fontWeight: 900, marginBottom: 8 }}>+1 769 0RENEW</p>
            <a href="mailto:info@renewpar.com" className="hover-gold" style={{ color: "rgba(255,255,255,0.55)", fontSize: 14 }}>
              Info@Renewpar.Com
            </a>
          </div>
        </div>

        {/* Main footer columns */}
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "52px 24px 40px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 40 }}>

          {/* Company */}
          <div>
            <h5 style={{ fontWeight: 900, fontSize: 16, marginBottom: 20 }}>Company</h5>
            <ul style={{ listStyle: "none" }}>
              {FOOTER_COMPANY.map(l => (
                <li key={l.label} style={{ marginBottom: 12 }}>
                  <a href={l.href} className="hover-gold" style={{ color: "rgba(255,255,255,0.55)", fontSize: 14, fontWeight: 500 }}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h5 style={{ fontWeight: 900, fontSize: 16, marginBottom: 20 }}>Quick Links</h5>
            <ul style={{ listStyle: "none" }}>
              {FOOTER_QUICK.map(l => (
                <li key={l.label} style={{ marginBottom: 12 }}>
                  <a href={l.href} className="hover-gold" style={{ color: "rgba(255,255,255,0.55)", fontSize: 14, fontWeight: 500 }}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div style={{ gridColumn: "span 2" }}>
            <h5 style={{ fontWeight: 900, fontSize: 16, marginBottom: 12 }}>Our Newsletter</h5>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>
              Subscribe to our newsletter and we will inform you about latest updates and offers
            </p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Your email address"
                style={{
                  flex: "1 1 200px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: 6, padding: "11px 16px", color: C.white, fontSize: 13,
                  outline: "none", transition: "border .2s",
                }}
                onFocus={e => e.target.style.borderColor = C.gold}
                onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.15)"}
              />
              <button style={{
                background: C.navy, color: C.white, fontWeight: 800, fontSize: 12,
                letterSpacing: "0.1em", textTransform: "uppercase", padding: "11px 24px",
                borderRadius: 6, border: "none", cursor: "pointer", transition: "background .2s",
                flexShrink: 0,
              }}
                onMouseEnter={e => e.currentTarget.style.background = C.gold}
                onMouseLeave={e => e.currentTarget.style.background = C.navy}>
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom: copyright + social icons */}
        <div style={{
          borderTop: "1px solid rgba(255,255,255,0.08)", padding: "20px 24px",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 14,
          textAlign: "center",
        }}>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13 }}>
            © 2025{" "}
            <a href="#" style={{ color: C.gold, fontWeight: 700 }}>Renew Part Bank</a>
          </p>
          {/* Social icons */}
          <div style={{ display: "flex", gap: 16 }}>
            {SOCIAL_LINKS.map(s => (
              <a key={s.label} href={s.href} aria-label={s.label}
                style={{
                  width: 34, height: 34, borderRadius: "50%",
                  border: "1px solid rgba(255,255,255,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "rgba(255,255,255,0.5)", transition: "all .2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = C.gold; e.currentTarget.style.borderColor = C.gold; e.currentTarget.style.color = "white"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; e.currentTarget.style.color = "rgba(255,255,255,0.5)"; }}>
                {s.icon}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
