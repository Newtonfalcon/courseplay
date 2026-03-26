import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ROUTES } from "../../libs/constants";
import BottomNav from "../../components/Nav";



export default function CourseCompleted() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const duration = 2000;

    const tick = () => {
      const elapsed = Date.now() - start;
      const pct = Math.min((elapsed / duration) * 100, 100);
      setProgress(pct);
      if (pct < 100) {
        requestAnimationFrame(tick);
      } else {
        setTimeout(() => navigate(ROUTES.learn), 80);
      }
    };

    requestAnimationFrame(tick);
  }, [courseId, navigate]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500&display=swap');

        .fc-root * { box-sizing: border-box; margin: 0; padding: 0; }

        .fc-root {
          font-family: 'DM Sans', sans-serif;
          background: #0a0a0a;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 24px;
          gap: 0;
          position: relative;
        }

        /* ── CONFETTI DOTS ── */
        .fc-dot {
          position: absolute;
          border-radius: 50%;
          opacity: 0;
          animation: fc-float 2s ease-out forwards;
        }

        @keyframes fc-float {
          0%   { opacity: 0; transform: translateY(0) scale(0.4); }
          20%  { opacity: 1; }
          100% { opacity: 0; transform: translateY(-120px) scale(1); }
        }

        /* ── CARD ── */
        .fc-card {
          width: 100%;
          max-width: 380px;
          background: #111;
          border: 1px solid #1f1f1f;
          border-radius: 20px;
          padding: 40px 32px 32px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 24px;
          position: relative;
          overflow: hidden;
        }

        .fc-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, #9333ea88, transparent);
        }

        /* ── TROPHY ── */
        .fc-trophy-wrap {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: #1a0a2e;
          border: 1px solid #9333ea33;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          animation: fc-pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        @keyframes fc-pop {
          from { transform: scale(0.4); opacity: 0; }
          to   { transform: scale(1);   opacity: 1; }
        }

        /* ── TEXT ── */
        .fc-heading {
          font-family: 'Syne', sans-serif;
          font-size: 22px;
          font-weight: 800;
          color: #fff;
          text-align: center;
          line-height: 1.2;
          animation: fc-fade-up 0.4s 0.15s ease both;
        }

        .fc-sub {
          font-size: 13px;
          color: #555;
          text-align: center;
          line-height: 1.6;
          animation: fc-fade-up 0.4s 0.25s ease both;
        }

        @keyframes fc-fade-up {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── PROGRESS BAR ── */
        .fc-bar-wrap {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 8px;
          animation: fc-fade-up 0.4s 0.35s ease both;
        }

        .fc-bar-track {
          width: 100%;
          height: 3px;
          background: #1f1f1f;
          border-radius: 99px;
          overflow: hidden;
        }

        .fc-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #7e22ce, #9333ea, #c084fc);
          border-radius: 99px;
          transition: width 0.05s linear;
        }

        .fc-bar-label {
          font-size: 11px;
          color: #444;
          text-align: center;
          font-weight: 500;
          letter-spacing: 0.04em;
        }

        /* ── POWERED BY ── */
        .fc-powered {
          position: absolute;
          bottom: 20px;
          display: flex;
          align-items: center;
          gap: 6px;
          animation: fc-fade-up 0.4s 0.5s ease both;
        }

        .fc-powered-line {
          width: 24px;
          height: 1px;
          background: #222;
        }

        .fc-powered-text {
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #333;
        }

        .fc-powered-brand {
          font-family: 'Syne', sans-serif;
          font-size: 11px;
          font-weight: 800;
          color: #9333ea;
          letter-spacing: 0.08em;
        }
      `}</style>

      {/* floating dots */}
      {[
        { size: 6,  left: "30%", top: "58%", color: "#9333ea", delay: "0s"    },
        { size: 4,  left: "50%", top: "62%", color: "#c084fc", delay: "0.2s"  },
        { size: 5,  left: "68%", top: "56%", color: "#4ade80", delay: "0.1s"  },
        { size: 4,  left: "22%", top: "60%", color: "#f97316", delay: "0.3s"  },
        { size: 6,  left: "76%", top: "64%", color: "#818cf8", delay: "0.15s" },
        { size: 3,  left: "42%", top: "66%", color: "#fbbf24", delay: "0.25s" },
      ].map((d, i) => (
        <div
          key={i}
          className="fc-dot"
          style={{
            width: d.size,
            height: d.size,
            left: d.left,
            top: d.top,
            background: d.color,
            animationDelay: d.delay,
          }}
        />
      ))}

      <div className="fc-card">
        <div className="fc-trophy-wrap">🏆</div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "center" }}>
          <h1 className="fc-heading">Course Completed!</h1>
          <p className="fc-sub">
            Great work finishing this course.<br />
            Redirecting you back to your dashboard.
          </p>
        </div>

        <div className="fc-bar-wrap">
          <div className="fc-bar-track">
            <div className="fc-bar-fill" style={{ width: `${progress}%` }} />
          </div>
          <span className="fc-bar-label">Redirecting…</span>
        </div>

        {/* powered by */}
        <div className="fc-powered">
          <div className="fc-powered-line" />
          <span className="fc-powered-text">Powered by</span>
          <span className="fc-powered-brand">NETECH</span>
          <div className="fc-powered-line" />
        </div>
      </div>
      <BottomNav />
    </>
  );
}