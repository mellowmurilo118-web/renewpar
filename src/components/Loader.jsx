export default function Loader({ message = "Please wait..." }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(6px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 0,
      }}
    >
      <style>{`
        @keyframes spin {
          0%   { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .loader-card {
          animation: fadeInUp 0.35s ease both;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0;
        }
        .spinner-ring {
          animation: spin 0.9s linear infinite;
        }
      `}</style>

      <div className="loader-card">
        {/* Spinner + icon stacked */}
        <div style={{ position: "relative", width: 96, height: 96, marginBottom: 24 }}>
          {/* Outer spinning ring */}
          <svg
            className="spinner-ring"
            width="96"
            height="96"
            viewBox="0 0 96 96"
            fill="none"
            style={{ position: "absolute", top: 0, left: 0 }}
          >
            <circle
              cx="48" cy="48" r="44"
              stroke="#e8edf8"
              strokeWidth="5"
              fill="none"
            />
            <circle
              cx="48" cy="48" r="44"
              stroke="#1a1a5e"
              strokeWidth="5"
              fill="none"
              strokeDasharray="100 176"
              strokeLinecap="round"
            />
          </svg>

          {/* Center bank icon */}
          <div style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <div style={{
              width: 62,
              height: 62,
              background: "linear-gradient(135deg, #1a1a5e 0%, #2a2a8e 100%)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 20px rgba(26,26,94,0.3)",
            }}>
              {/* Bank building SVG */}
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
                <path d="M3 21h18M3 10h18M12 3L2 10h20L12 3z" stroke="#c8a951" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5 10v11M9 10v11M15 10v11M19 10v11" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
          </div>
        </div>

        {/* App name */}
        <div style={{ textAlign: "center" }}>
          <div style={{
            fontFamily: "'DM Sans', 'Trebuchet MS', sans-serif",
            fontWeight: 900,
            fontSize: 20,
            color: "#1a1a5e",
            letterSpacing: "0.04em",
            lineHeight: 1.1,
          }}>
            RENEW PART BANK
          </div>
          <div style={{
            fontFamily: "'DM Sans', 'Trebuchet MS', sans-serif",
            fontSize: 12.5,
            color: "#c8a951",
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            marginTop: 4,
          }}>
            Secure Banking
          </div>
        </div>

        {/* Message */}
        <p style={{
          fontFamily: "'DM Sans', 'Trebuchet MS', sans-serif",
          fontSize: 13,
          color: "#aaa",
          marginTop: 16,
          fontWeight: 500,
          letterSpacing: "0.02em",
        }}>
          {message}
        </p>
      </div>
    </div>
  );
}