import { useState } from "react";
import Loader from "../components/Loader";
import { auth, db } from "../utils/firebase/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";



// ─── Firebase error map ──────────────────────────────────────────
const FIREBASE_ERRORS = {
  "auth/email-already-in-use":  "An account already exists with this email.",
  "auth/invalid-email":         "The email address is not valid.",
  "auth/weak-password":         "Password must be at least 6 characters.",
  "auth/network-request-failed":"Network error. Check your connection.",
  "auth/operation-not-allowed": "Email/password accounts are not enabled.",
};
function friendlyError(code) {
  return FIREBASE_ERRORS[code] || "An unexpected error occurred. Please try again.";
}

// ─── CONSTANTS ───────────────────────────────────────────────────
const RELIGIONS = ["Christianity","Islam","Hinduism","Buddhism","Judaism","Sikhism","Traditional/Indigenous","Atheist/Agnostic","Other / Prefer not to say"];
const CURRENCIES = ["USD – US Dollar","EUR – Euro","GBP – British Pound","NGN – Nigerian Naira","GHS – Ghanaian Cedi","CAD – Canadian Dollar","AUD – Australian Dollar","JPY – Japanese Yen","ZAR – South African Rand","INR – Indian Rupee"];
const ACCOUNT_TYPES = ["Personal Checking","Personal Savings","Business Checking","Business Savings","Student Account","Joint Account","Fixed Deposit","Retirement (IRA)"];
const COUNTRIES = ["United States","United Kingdom","Nigeria","Canada","Australia","India","Germany","France","Ghana","South Africa","Other"];
const RELATIONSHIPS = ["Spouse","Parent","Child","Sibling","Friend","Guardian","Other"];

// ─── STEP LABELS ─────────────────────────────────────────────────
const STEPS = [
  { id: 1, label: "Personal Info",    icon: "👤" },
  { id: 2, label: "Security & Religion", icon: "🔐" },
  { id: 3, label: "Address",          icon: "📍" },
  { id: 4, label: "Next of Kin",      icon: "👨‍👩‍👧" },
  { id: 5, label: "Bank Settings",    icon: "🏦" },
];

// ─── Shield + Bank Logo ──────────────────────────────────────────
function ShieldLogo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 24 }}>
      <div style={{
        width: 66, height: 66,
        background: "linear-gradient(145deg, #1a1a5e 0%, #2a3aa0 100%)",
        borderRadius: "50%",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 6px 28px rgba(26,26,94,0.22)",
        marginBottom: 12,
      }}>
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L3 6v6c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V6L12 2z"
            fill="rgba(255,255,255,0.15)" stroke="#c8a951" strokeWidth="1.6" strokeLinejoin="round"/>
          <path d="M8 13h2v4H8zM11 13h2v4h-2zM14 13h2v4h-2z" fill="white" opacity="0.9"/>
          <path d="M7 12.5h10M12 8l-5 4.5h10L12 8z" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <div style={{ fontFamily: "'DM Sans','Trebuchet MS',sans-serif", fontWeight: 900, fontSize: 17, color: "#1a1a5e", letterSpacing: "0.04em" }}>
        RENEW PART BANK
      </div>
      <div style={{ fontSize: 10, color: "#c8a951", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginTop: 3 }}>
        Create Account
      </div>
    </div>
  );
}

// ─── Input field ─────────────────────────────────────────────────
function Field({ label, type = "text", value, onChange, placeholder, required, id, autoComplete, children, hint }) {
  const [focused, setFocused] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const isPwd = type === "password";
  return (
    <div style={{ marginBottom: 16 }}>
      <label htmlFor={id} style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#1a1a5e", marginBottom: 5, letterSpacing: "0.03em" }}>
        {label} {required && <span style={{ color: "#e53e3e" }}>*</span>}
      </label>
      {children ? children : (
        <div style={{ position: "relative" }}>
          <input
            id={id}
            type={isPwd && showPwd ? "text" : type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            autoComplete={autoComplete}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            style={{
              width: "100%",
              padding: isPwd ? "10px 42px 10px 13px" : "10px 13px",
              fontSize: 13.5,
              border: `1.5px solid ${focused ? "#1a1a5e" : "#e2e6f0"}`,
              borderRadius: 9, outline: "none",
              background: "#fafbff", color: "#111",
              transition: "border 0.2s, box-shadow 0.2s",
              boxShadow: focused ? "0 0 0 3px rgba(26,26,94,0.08)" : "none",
              fontFamily: "'DM Sans','Trebuchet MS',sans-serif",
            }}
          />
          {isPwd && (
            <button type="button" onClick={() => setShowPwd(!showPwd)} tabIndex={-1}
              style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#888", padding: 3 }}>
              {showPwd
                ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23" strokeWidth="2"/></svg>
                : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              }
            </button>
          )}
        </div>
      )}
      {hint && <p style={{ fontSize: 11, color: "#aaa", marginTop: 4, fontStyle: "italic" }}>{hint}</p>}
    </div>
  );
}

function Select({ label, value, onChange, options, required, id, placeholder }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: 16 }}>
      <label htmlFor={id} style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#1a1a5e", marginBottom: 5, letterSpacing: "0.03em" }}>
        {label} {required && <span style={{ color: "#e53e3e" }}>*</span>}
      </label>
      <select
        id={id} value={value} onChange={onChange} required={required}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          width: "100%", padding: "10px 13px", fontSize: 13.5,
          border: `1.5px solid ${focused ? "#1a1a5e" : "#e2e6f0"}`,
          borderRadius: 9, outline: "none", background: "#fafbff", color: value ? "#111" : "#aaa",
          transition: "border 0.2s, box-shadow 0.2s",
          boxShadow: focused ? "0 0 0 3px rgba(26,26,94,0.08)" : "none",
          fontFamily: "'DM Sans','Trebuchet MS',sans-serif",
          cursor: "pointer",
          appearance: "none",
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 12px center",
          paddingRight: 36,
        }}>
        <option value="" disabled>{placeholder || "Select an option"}</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

// ─── Error Alert ─────────────────────────────────────────────────
function ErrorAlert({ message, onClose }) {
  if (!message) return null;
  return (
    <div style={{
      background: "#fff5f5", border: "1.5px solid #fc8181", borderRadius: 10,
      padding: "11px 14px", marginBottom: 18,
      display: "flex", alignItems: "flex-start", gap: 9,
    }}>
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#e53e3e" strokeWidth="2" style={{ flexShrink: 0, marginTop: 1 }}>
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      <span style={{ fontSize: 12.5, color: "#c53030", fontWeight: 600, lineHeight: 1.5, flex: 1 }}>{message}</span>
      <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#fc8181", padding: 0 }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
  );
}

// ─── Step Progress Bar ────────────────────────────────────────────
function StepBar({ current, total }) {
  return (
    <div style={{ marginBottom: 28 }}>
      {/* Progress line */}
      <div style={{ position: "relative", height: 4, background: "#eef0f8", borderRadius: 4, marginBottom: 10 }}>
        <div style={{
          height: "100%", borderRadius: 4, background: "linear-gradient(to right, #1a1a5e, #3a4ab0)",
          width: `${((current - 1) / (total - 1)) * 100}%`,
          transition: "width 0.4s ease",
        }}></div>
      </div>
      {/* Step circles */}
      <div style={{ display: "flex", justifyContent: "space-between", position: "relative" }}>
        {STEPS.map(s => (
          <div key={s.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, flex: 1 }}>
            <div style={{
              width: 30, height: 30, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: s.id < current ? 14 : (s.id === current ? 13 : 12),
              fontWeight: 900,
              background: s.id < current ? "#1a1a5e" : (s.id === current ? "#1a1a5e" : "#f0f2f8"),
              color: s.id <= current ? "white" : "#aaa",
              border: s.id === current ? "2.5px solid #c8a951" : (s.id < current ? "none" : "1.5px solid #dde"),
              boxShadow: s.id === current ? "0 0 0 4px rgba(26,26,94,0.12)" : "none",
              transition: "all 0.3s",
              fontSize: 11,
            }}>
              {s.id < current ? "✓" : s.id}
            </div>
            <span style={{
              fontSize: 9.5, fontWeight: 700, color: s.id <= current ? "#1a1a5e" : "#bbb",
              textAlign: "center", letterSpacing: "0.02em", lineHeight: 1.3,
              display: window.innerWidth < 400 ? "none" : "block",
            }}>
              {s.label}
            </span>
          </div>
        ))}
      </div>
      <p style={{ textAlign: "right", fontSize: 11, color: "#aaa", marginTop: 8 }}>Step {current} of {total}</p>
    </div>
  );
}

// ─── REGISTER PAGE ───────────────────────────────────────────────
export default function Register({ onNavigateLogin }) {
  const navigate = useNavigate()

  const [step, setStep]       = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  // Personal Info
  const [firstName, setFirstName]   = useState("");
  const [lastName, setLastName]     = useState("");
  const [email, setEmail]           = useState("");
  const [phone, setPhone]           = useState("");
  const [dob, setDob]               = useState("");
  const [gender, setGender]         = useState("");

  // Security & Religion
  const [password, setPassword]     = useState("");
  const [confirm, setConfirm]       = useState("");
  const [pin, setPin]               = useState("");
  const [religion, setReligion]     = useState("");

  // Address
  const [address, setAddress]       = useState("");
  const [city, setCity]             = useState("");
  const [state, setState]           = useState("");
  const [zipcode, setZipcode]       = useState("");
  const [country, setCountry]       = useState("");

  // Next of Kin
  const [kinFirst, setKinFirst]     = useState("");
  const [kinLast, setKinLast]       = useState("");
  const [kinPhone, setKinPhone]     = useState("");
  const [kinEmail, setKinEmail]     = useState("");
  const [kinRelation, setKinRelation] = useState("");
  const [kinAddress, setKinAddress] = useState("");

  // Bank Settings
  const [currency, setCurrency]     = useState("");
  const [accountType, setAccountType] = useState("");
  const [agree, setAgree]           = useState(false);

  function validateStep() {
    setError("");
    switch (step) {
      case 1:
        if (!firstName || !lastName || !email || !phone || !dob || !gender)
          return setError("Please fill in all required fields."), false;
        if (!/\S+@\S+\.\S+/.test(email))
          return setError("Please enter a valid email address."), false;
        return true;
      case 2:
        if (!password || !confirm || !pin)
          return setError("Please fill in all security fields."), false;
        if (password.length < 6)
          return setError("Password must be at least 6 characters."), false;
        if (password !== confirm)
          return setError("Passwords do not match."), false;
        if (!/^\d{4,6}$/.test(pin))
          return setError("PIN must be 4–6 digits only."), false;
        return true;
      case 3:
        if (!address || !city || !zipcode || !country)
          return setError("Please fill in all address fields."), false;
        return true;
      case 4:
        if (!kinFirst || !kinLast || !kinPhone || !kinRelation)
          return setError("Please fill in all next of kin fields."), false;
        return true;
      case 5:
        if (!currency || !accountType)
          return setError("Please select your preferred currency and account type."), false;
        if (!agree)
          return setError("You must agree to the Terms of Service to continue."), false;
        return true;
      default: return true;
    }
  }

  function nextStep() {
    if (validateStep()) setStep(s => Math.min(s + 1, 5));
  }
  function prevStep() {
    setError("");
    setStep(s => Math.max(s - 1, 1));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validateStep()) return;
    setLoading(true);
    try {
      const userCredentials = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredentials.user

      await setDoc(doc(db, "users", user.uid),{
        email:user?.email,
        firstName:firstName,
        lastName:lastName,
        phone:phone,
        dob:dob,
        gender:gender,
        pin:pin,
        religion:religion || "",
        address:address,
        city:city,
        state:state,
        zipcode:zipcode,
        country:country,
        kinFirst:kinFirst,
        kinLast:kinLast,
        kinRelation:kinRelation,
        kinPhone:kinPhone,
        kinEmail:kinEmail,
        kinAddress:kinAddress || "",
        currency:currency,
        accountType:accountType,


        
      })


      

  
     
      alert(`Account created for ${firstName} ${lastName}!`);
      navigate("/dashboard")
    } catch (err) {
      setError(friendlyError(err.code));
    } finally {
      setLoading(false);
    }
  }

  const btnStyle = {
    padding: "11px 24px", borderRadius: 10, fontSize: 13.5,
    fontWeight: 800, cursor: "pointer", border: "none",
    fontFamily: "'DM Sans','Trebuchet MS',sans-serif",
    transition: "all 0.2s",
  };

  return (
    <>
      {loading && <Loader message="Creating your account..." />}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700;9..40,800;9..40,900&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; background: #f4f6fb; font-family: 'DM Sans','Trebuchet MS',sans-serif; }
        .next-btn:hover { background: #2a2a8e !important; transform: translateY(-1px); box-shadow: 0 6px 24px rgba(26,26,94,0.28) !important; }
        .back-btn:hover { background: #eef0f8 !important; }
        .auth-link { cursor:pointer; color:#1a1a5e; font-weight:700; text-decoration:none; }
        .auth-link:hover { text-decoration:underline; }
        .pin-input::-webkit-outer-spin-button,.pin-input::-webkit-inner-spin-button{-webkit-appearance:none}
        .check-box:checked { accent-color: #1a1a5e; }
        @media(max-width:520px){
          .reg-card{padding:28px 18px !important}
          .two-col{grid-template-columns:1fr !important}
        }
      `}</style>

      <div style={{
        minHeight: "100vh", background: "#f4f6fb",
        display: "flex", alignItems: "flex-start", justifyContent: "center",
        padding: "28px 16px 48px",
        fontFamily: "'DM Sans','Trebuchet MS',sans-serif",
      }}>
        <div className="reg-card" style={{
          background: "white", borderRadius: 20, padding: "40px 40px",
          width: "100%", maxWidth: 560,
          boxShadow: "0 8px 48px rgba(26,26,94,0.10), 0 1px 4px rgba(0,0,0,0.06)",
          border: "1px solid rgba(26,26,94,0.07)",
        }}>
          <ShieldLogo />
          <StepBar current={step} total={5} />

          {/* Step title */}
          <div style={{ marginBottom: 20 }}>
            <h2 style={{ fontSize: 18, fontWeight: 900, color: "#111", marginBottom: 4 }}>
              {STEPS[step - 1].icon} {STEPS[step - 1].label}
            </h2>
            <p style={{ fontSize: 12.5, color: "#aaa" }}>
              {step === 1 && "Tell us a bit about yourself"}
              {step === 2 && "Set up your account security and religious preference"}
              {step === 3 && "Where are you located?"}
              {step === 4 && "Provide your next of kin details"}
              {step === 5 && "Configure your banking preferences"}
            </p>
          </div>

          <ErrorAlert message={error} onClose={() => setError("")} />

          <form onSubmit={step === 5 ? handleSubmit : (e) => { e.preventDefault(); nextStep(); }}>

            {/* ── STEP 1: Personal Info ─────────────────────────────── */}
            {step === 1 && (
              <>
                <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
                  <Field id="firstName" label="First Name" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="John" required />
                  <Field id="lastName"  label="Last Name"  value={lastName}  onChange={e => setLastName(e.target.value)}  placeholder="Doe"  required />
                </div>
                <Field id="email" label="Email Address" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required autoComplete="email" />
                <Field id="phone" label="Phone Number" type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+1 234 567 8900" required />
                <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
                  <Field id="dob" label="Date of Birth" type="date" value={dob} onChange={e => setDob(e.target.value)} required />
                  <Select id="gender" label="Gender" value={gender} onChange={e => setGender(e.target.value)} options={["Male","Female","Non-binary","Prefer not to say"]} placeholder="Select gender" required />
                </div>
              </>
            )}

            {/* ── STEP 2: Security & Religion ──────────────────────── */}
            {step === 2 && (
              <>
                <Field id="password" label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 6 characters" required autoComplete="new-password" hint="Use a mix of letters, numbers, and symbols." />
                <Field id="confirm" label="Confirm Password" type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Re-enter your password" required autoComplete="new-password" />
                <Field id="pin" label="Transaction PIN" type="password" value={pin} onChange={e => { if (/^\d{0,6}$/.test(e.target.value)) setPin(e.target.value); }} placeholder="4–6 digit PIN" required hint="Used to authorise transactions. Numbers only." />
                <Select id="religion" label="Religion (Optional)" value={religion} onChange={e => setReligion(e.target.value)} options={RELIGIONS} placeholder="Select religion" />
              </>
            )}

            {/* ── STEP 3: Address ───────────────────────────────────── */}
            {step === 3 && (
              <>
                <Field id="address" label="Street Address" value={address} onChange={e => setAddress(e.target.value)} placeholder="123 Main Street, Apt 4B" required />
                <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
                  <Field id="city" label="City" value={city} onChange={e => setCity(e.target.value)} placeholder="New York" required />
                  <Field id="state" label="State / Province" value={state} onChange={e => setState(e.target.value)} placeholder="NY" />
                </div>
                <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
                  <Field id="zipcode" label="ZIP / Postal Code" value={zipcode} onChange={e => setZipcode(e.target.value)} placeholder="10001" required />
                  <Select id="country" label="Country" value={country} onChange={e => setCountry(e.target.value)} options={COUNTRIES} placeholder="Select country" required />
                </div>
              </>
            )}

            {/* ── STEP 4: Next of Kin ──────────────────────────────── */}
            {step === 4 && (
              <>
                <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
                  <Field id="kinFirst" label="First Name" value={kinFirst} onChange={e => setKinFirst(e.target.value)} placeholder="Jane" required />
                  <Field id="kinLast"  label="Last Name"  value={kinLast}  onChange={e => setKinLast(e.target.value)}  placeholder="Doe"  required />
                </div>
                <Select id="kinRelation" label="Relationship" value={kinRelation} onChange={e => setKinRelation(e.target.value)} options={RELATIONSHIPS} placeholder="Select relationship" required />
                <Field id="kinPhone" label="Phone Number" type="tel" value={kinPhone} onChange={e => setKinPhone(e.target.value)} placeholder="+1 234 567 8900" required />
                <Field id="kinEmail" label="Email Address (Optional)" type="email" value={kinEmail} onChange={e => setKinEmail(e.target.value)} placeholder="kin@example.com" />
                <Field id="kinAddress" label="Address (Optional)" value={kinAddress} onChange={e => setKinAddress(e.target.value)} placeholder="123 Street, City, Country" />
              </>
            )}

            {/* ── STEP 5: Bank Settings ─────────────────────────────── */}
            {step === 5 && (
              <>
                <div style={{ background: "#f8f9ff", borderRadius: 12, padding: "16px 18px", marginBottom: 20, border: "1px solid #e8eaf6" }}>
                  <p style={{ fontSize: 12, color: "#888", lineHeight: 1.6, margin: 0 }}>
                    🏦 Configure your account preferences. These settings can be updated later from your dashboard.
                  </p>
                </div>

                <Select id="currency" label="Preferred Currency" value={currency} onChange={e => setCurrency(e.target.value)} options={CURRENCIES} placeholder="Select currency" required />
                <Select id="accountType" label="Account Type" value={accountType} onChange={e => setAccountType(e.target.value)} options={ACCOUNT_TYPES} placeholder="Select account type" required />

                {/* Summary before submit */}
                <div style={{ background: "#f0f4ff", borderRadius: 12, padding: "14px 16px", marginBottom: 20, border: "1px solid #dde4f8" }}>
                  <p style={{ fontSize: 11.5, fontWeight: 800, color: "#1a1a5e", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.05em" }}>Account Summary</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 12px", fontSize: 12 }}>
                    {[
                      ["Name", `${firstName} ${lastName}`],
                      ["Email", email],
                      ["Phone", phone],
                      ["Country", country],
                      ["Currency", currency.split(" – ")[0]],
                      ["Account", accountType],
                    ].map(([k, v]) => (
                      <div key={k} style={{ color: "#555" }}>
                        <span style={{ color: "#aaa", fontWeight: 600 }}>{k}: </span>
                        <span style={{ fontWeight: 700 }}>{v || "—"}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Terms checkbox */}
                <label style={{
                  display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer",
                  padding: "14px 16px", borderRadius: 10,
                  background: agree ? "#f0f4ff" : "#fafbff",
                  border: `1.5px solid ${agree ? "#1a1a5e" : "#e2e6f0"}`,
                  transition: "all 0.2s", marginBottom: 6,
                }}>
                  <input
                    type="checkbox"
                    checked={agree}
                    onChange={e => setAgree(e.target.checked)}
                    className="check-box"
                    style={{ width: 17, height: 17, marginTop: 1, flexShrink: 0, cursor: "pointer", accentColor: "#1a1a5e" }}
                  />
                  <span style={{ fontSize: 12.5, color: "#555", lineHeight: 1.6 }}>
                    I agree to the{" "}
                    <a href="#" style={{ color: "#1a1a5e", fontWeight: 700, textDecoration: "none" }}
                      onMouseEnter={e => e.target.style.textDecoration = "underline"}
                      onMouseLeave={e => e.target.style.textDecoration = "none"}>
                      Terms of Service
                    </a>
                    {" "}and{" "}
                    <a href="#" style={{ color: "#1a1a5e", fontWeight: 700, textDecoration: "none" }}
                      onMouseEnter={e => e.target.style.textDecoration = "underline"}
                      onMouseLeave={e => e.target.style.textDecoration = "none"}>
                      Privacy Policy
                    </a>
                    {" "}of Renew Part Bank. I confirm that the information provided is accurate and complete.
                    <span style={{ color: "#e53e3e", fontWeight: 700 }}> *</span>
                  </span>
                </label>
              </>
            )}

            {/* ── Navigation Buttons ───────────────────────────────── */}
            <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
              {step > 1 && (
                <button type="button" onClick={prevStep} className="back-btn"
                  style={{ ...btnStyle, flex: 1, background: "#f4f6fb", color: "#555", border: "1.5px solid #e2e6f0" }}>
                  ← Back
                </button>
              )}
              <button type="submit" className="next-btn"
                style={{
                  ...btnStyle, flex: 2,
                  background: "#1a1a5e", color: "white",
                  boxShadow: "0 4px 20px rgba(26,26,94,0.25)",
                }}>
                {step === 5 ? "Create Account →" : "Continue →"}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "24px 0 18px" }}>
            <div style={{ flex: 1, height: 1, background: "#eee" }}></div>
            <span style={{ fontSize: 11.5, color: "#ccc", fontWeight: 600 }}>OR</span>
            <div style={{ flex: 1, height: 1, background: "#eee" }}></div>
          </div>

          {/* Link to Login */}
          <p style={{ textAlign: "center", fontSize: 13.5, color: "#555" }}>
            Already have an account?{" "}
            <span
              className="auth-link"
              onClick={onNavigateLogin}
              style={{ color: "#1a1a5e", fontWeight: 800, cursor: "pointer" }}
            >
                <a href="/login"> 
              Sign In
              </a>
            </span>
          </p>

          <p style={{ textAlign: "center", marginTop: 20, fontSize: 11, color: "#bbb", lineHeight: 1.6 }}>
            🔒 Your data is secured with 256-bit SSL encryption
          </p>
        </div>
      </div>
    </>
  );
}