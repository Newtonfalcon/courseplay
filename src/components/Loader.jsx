export default function Loader({ label = "Loading" }) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500&display=swap');

        .ldr-root {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: #0a0a0a;
          gap: 32px;
          font-family: 'DM Sans', sans-serif;
        }

        /* ── ORBIT ── */
        .ldr-ring {
          position: relative;
          width: 160px;
          height: 160px;
        }

        .ldr-track {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 1px solid #1f1f1f;
        }

        .ldr-icons {
          position: absolute;
          inset: 0;
          animation: ldr-orbit 3.2s linear infinite;
        }

        @keyframes ldr-orbit {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        .ldr-icon {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: #111;
          border: 1px solid #2a2a2a;
          display: flex;
          align-items: center;
          justify-content: center;
          /* counter-rotate so icons stay upright */
          animation: ldr-counter 3.2s linear infinite;
          box-sizing: border-box;
        }

        @keyframes ldr-counter {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to   { transform: translate(-50%, -50%) rotate(-360deg); }
        }

        .ldr-icon svg {
          width: 16px;
          height: 16px;
          flex-shrink: 0;
        }

        /* place each icon on the circle (r = 62px) */
        .ldr-icon-0 { margin-top:  -62px; }
        .ldr-icon-1 { margin-left:  62px; }
        .ldr-icon-2 { margin-top:   62px; }
        .ldr-icon-3 { margin-left: -62px; }

        /* ── CENTER ── */
        .ldr-center {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #1a0a2e;
          border: 1px solid #9333ea33;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: ldr-pulse 2s ease-in-out infinite;
        }

        @keyframes ldr-pulse {
          0%, 100% { box-shadow: 0 0 0 0   #9333ea22; }
          50%       { box-shadow: 0 0 0 10px #9333ea00; }
        }

        /* ── TEXT ── */
        .ldr-text {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .ldr-label {
          font-size: 13px;
          font-weight: 500;
          color: #fff;
          letter-spacing: 0.04em;
        }

        .ldr-dots {
          display: flex;
          gap: 5px;
        }

        .ldr-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #9333ea;
          animation: ldr-dot-pulse 1.2s ease-in-out infinite;
        }

        .ldr-dot:nth-child(2) { animation-delay: 0.2s; }
        .ldr-dot:nth-child(3) { animation-delay: 0.4s; }

        @keyframes ldr-dot-pulse {
          0%, 80%, 100% { opacity: 0.2; transform: scale(0.8); }
          40%           { opacity: 1;   transform: scale(1); }
        }
      `}</style>

      <div className="ldr-root">
        <div className="ldr-ring">
          <div className="ldr-track" />

          <div className="ldr-icons">
            {/* Book — top */}
            <div className="ldr-icon ldr-icon-0" style={{ color: "#c084fc" }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
            </div>

            {/* Play — right */}
            <div className="ldr-icon ldr-icon-1" style={{ color: "#818cf8" }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <polygon points="10,8 16,12 10,16" fill="currentColor" stroke="none" />
              </svg>
            </div>

            {/* Monitor — bottom */}
            <div className="ldr-icon ldr-icon-2" style={{ color: "#f97316" }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
            </div>

            {/* HTML / code — left */}
            <div className="ldr-icon ldr-icon-3" style={{ color: "#f59e0b" }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
              </svg>
            </div>
          </div>

          {/* center orb */}
          <div className="ldr-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9333ea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
        </div>

        <div className="ldr-text">
          <span className="ldr-label">{label}</span>
          <div className="ldr-dots">
            <div className="ldr-dot" />
            <div className="ldr-dot" />
            <div className="ldr-dot" />
          </div>
        </div>
      </div>
    </>
  );
}