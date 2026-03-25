import { useState } from "react";
import { FaGraduationCap, FaPlay, FaArrowRight, FaArrowLeft, FaCheck } from "react-icons/fa";
import { Navigate, useNavigate } from "react-router";
import { Link } from "react-router";

// ─────────────────────────────────────────────
//  CONSTANTS
// ─────────────────────────────────────────────


const COLORS = {
  // Background layers — black/grey blend
  bgBase:        "#0a0a0a",
  bgLayer1:      "#111111",
  bgLayer2:      "#1a1a1a",
  bgLayer3:      "#222222",
  bgCard:        "#1c1c1e",

  // Card accent — purple + gold blend
  cardPurple:    "#4c1d95",
  cardPurpleMid: "#6d28d9",
  cardGold:      "#b45309",
  cardGoldLight: "#f59e0b",
  cardGradient:  "linear-gradient(135deg, #4c1d95 0%, #6d28d9 50%, #92400e 100%)",

  // Text
  textPrimary:   "#ffffff",
  textMuted:     "#a1a1aa",
  textPurple:    "#c084fc",
  textGold:      "#fbbf24",

  // Accent
  accentPurple:  "#9333ea",
  accentGold:    "#f59e0b",
  accentBorder:  "#2a2a2a",

  // UI
  btnPrimary:    "#9333ea",
  btnPrimaryHover: "#7c3aed",
  btnOutline:    "transparent",
  poweredBy:     "#52525b",
};

const APP = {
  name:      "CoursePlay",
  poweredBy: "Powered by Netech",
};

// ─────────────────────────────────────────────
//  IMAGES ARRAY  — swap src values to your own assets
// ─────────────────────────────────────────────

const IMAGES = [
  {
    id: "onboard-1",
    src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80",
    alt: "Students learning together",
  },
  {
    id: "onboard-2",
    src: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&q=80",
    alt: "Interactive online course",
  },
  {
    id: "onboard-3",
    src: "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=600&q=80",
    alt: "Certificate and achievement",
  },
];

// ─────────────────────────────────────────────
//  ONBOARDING STEPS DATA
// ─────────────────────────────────────────────

const STEPS = [
  {
    id: 1,
    tag: "Welcome",
    headline: "Learn Anything,\nAnywhere.",
    subheading: "CoursePlay gives you access to world-class instructors, hands-on projects, and a community that keeps you moving forward.",
    image: IMAGES[0],
    stats: [
      { value: "50K+", label: "Learners" },
      { value: "1,200+", label: "Courses" },
      { value: "98%", label: "Satisfaction" },
    ],
    features: null,
  },
  {
    id: 2,
    tag: "How it Works",
    headline: "Your Learning,\nYour Pace.",
    subheading: "Pick a course, follow structured lessons, and earn certificates you can actually use. No pressure, no timelines.",
    image: IMAGES[1],
    stats: null,
    features: [
      { icon: "🎯", title: "Curated Paths",   desc: "Follow role-based learning tracks built by experts." },
      { icon: "⚡", title: "Bite-sized Lessons", desc: "Short, focused videos that fit your schedule." },
      { icon: "🤝", title: "Live Mentorship",  desc: "Get guidance from instructors in real time." },
      { icon: "📱", title: "Cross-device",     desc: "Start on desktop, continue on mobile seamlessly." },
    ],
  },
  {
    id: 3,
    tag: "Get Started",
    headline: "Ready to Level\nUp Your Skills?",
    subheading: "Join thousands of learners who are building real careers. Your first course is on us.",
    image: IMAGES[2],
    stats: null,
    features: null,
    cta: true,
  },
];

// ─────────────────────────────────────────────
//  LOGO
// ─────────────────────────────────────────────

function Logo() {
  return (
    <div className="flex items-center gap-1.5 select-none">
      <FaGraduationCap style={{ color: COLORS.textPrimary, fontSize: "1.4rem" }} />
      <span style={{
        color: COLORS.textPrimary,
        fontFamily: "'Syne', sans-serif",
        fontSize: "1.25rem",
        fontWeight: 800,
        letterSpacing: "-0.02em",
      }}>
        Course
      </span>
      <span style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "22px",
        height: "22px",
        borderRadius: "50%",
        backgroundColor: COLORS.accentPurple,
        color: "#fff",
        fontSize: "0.5rem",
      }}>
        <FaPlay style={{ marginLeft: "1px" }} />
      </span>
      
    </div>
  );
}

// ─────────────────────────────────────────────
//  PROGRESS DOTS
// ─────────────────────────────────────────────

function ProgressDots({ total, current }) {
  return (
    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={{
            width:  i === current ? "24px" : "8px",
            height: "8px",
            borderRadius: "4px",
            backgroundColor: i === current ? COLORS.accentPurple : COLORS.bgLayer3,
            transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
          }}
        />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
//  STAT CHIP
// ─────────────────────────────────────────────

function StatChip({ value, label }) {
  return (
    <div style={{
      background: COLORS.bgLayer2,
      border: `1px solid ${COLORS.accentBorder}`,
      borderRadius: "12px",
      padding: "12px 16px",
      textAlign: "center",
      flex: 1,
    }}>
      <div style={{
        fontFamily: "'Syne', sans-serif",
        fontSize: "1.4rem",
        fontWeight: 800,
        background: `linear-gradient(135deg, ${COLORS.textPurple}, ${COLORS.textGold})`,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}>
        {value}
      </div>
      <div style={{ color: COLORS.textMuted, fontSize: "0.72rem", marginTop: "2px", letterSpacing: "0.05em" }}>
        {label}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  FEATURE CARD
// ─────────────────────────────────────────────

function FeatureCard({ icon, title, desc }) {
  return (
    <div style={{
      background: COLORS.bgLayer2,
      border: `1px solid ${COLORS.accentBorder}`,
      borderRadius: "14px",
      padding: "16px",
      display: "flex",
      gap: "12px",
      alignItems: "flex-start",
    }}>
      <span style={{
        fontSize: "1.2rem",
        width: "36px",
        height: "36px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: COLORS.cardGradient,
        borderRadius: "10px",
        flexShrink: 0,
      }}>
        {icon}
      </span>
      <div>
        <div style={{
          color: COLORS.textPrimary,
          fontWeight: 700,
          fontSize: "0.88rem",
          fontFamily: "'Syne', sans-serif",
        }}>
          {title}
        </div>
        <div style={{ color: COLORS.textMuted, fontSize: "0.78rem", marginTop: "3px", lineHeight: 1.5 }}>
          {desc}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  IMAGE CARD (with purple-gold glow border)
// ─────────────────────────────────────────────

function ImageCard({ image, step }) {
  return (
    <div style={{
      position: "relative",
      borderRadius: "24px",
      overflow: "hidden",
      background: COLORS.cardGradient,
      padding: "3px",
      flexShrink: 0,
    }}>
      {/* Step badge */}
      <div style={{
        position: "absolute",
        top: "18px",
        left: "18px",
        zIndex: 10,
        background: "rgba(0,0,0,0.55)",
        backdropFilter: "blur(8px)",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: "20px",
        padding: "4px 12px",
        color: COLORS.textGold,
        fontSize: "0.7rem",
        fontWeight: 700,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
      }}>
        Step {step}
      </div>

      <img
        src={image.src}
        alt={image.alt}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          borderRadius: "22px",
          display: "block",
          minHeight: "200px",
          maxHeight: "280px",
        }}
        onError={(e) => {
          // Fallback if image fails to load
          e.target.style.display = "none";
          e.target.parentNode.style.background = COLORS.cardGradient;
          e.target.parentNode.style.minHeight = "200px";
        }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────
//  MAIN ONBOARDING PAGE
// ─────────────────────────────────────────────

export default function OnboardingPage() {

    const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const current = STEPS[step];
  const isLast  = step === STEPS.length - 1;
  const isFirst = step === 0;

  const goNext = () => { if (!isLast)  setStep((s) => s + 1); };
  const goPrev = () => { if (!isFirst) setStep((s) => s - 1); };
  const handleGetStarted = () => {
    // TODO: navigate to signup or dashboard
        navigate("/auth/signup")
  };
 

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: COLORS.bgBase,
      display: "flex",
      flexDirection: "column",
      fontFamily: "'DM Sans', sans-serif",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* ── Ambient blobs ── */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
      }}>
        <div style={{
          position: "absolute", top: "-200px", left: "-200px",
          width: "600px", height: "600px", borderRadius: "50%",
          backgroundColor: COLORS.cardPurpleMid, opacity: 0.08, filter: "blur(80px)",
        }} />
        <div style={{
          position: "absolute", bottom: "-150px", right: "-150px",
          width: "500px", height: "500px", borderRadius: "50%",
          backgroundColor: COLORS.cardGold, opacity: 0.07, filter: "blur(80px)",
        }} />
        {/* Grid */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.03,
          backgroundImage: "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }} />
      </div>

      {/* ── Header ── */}
      <header style={{
        position: "relative", zIndex: 10,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "20px 24px",
        borderBottom: `1px solid ${COLORS.accentBorder}`,
      }}>
        <Logo />

        <a href="/auth/signin">
        <button
          
          style={{
            background: "none", border: "none", cursor: "pointer",
            color: COLORS.textMuted, fontSize: "0.82rem", fontWeight: 500,
            padding: "6px 12px", borderRadius: "8px",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => (e.target.style.color = COLORS.textPrimary)}
          onMouseLeave={(e) => (e.target.style.color = COLORS.textMuted)}
        >
          Skip →
        </button>
        </a>
      </header>

      {/* ── Body ── */}
      <main style={{
        flex: 1, position: "relative", zIndex: 10,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "24px 20px",
        maxWidth: "520px", margin: "0 auto", width: "100%",
      }}>

        {/* Tag */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "6px",
          background: `linear-gradient(135deg, ${COLORS.cardPurple}33, ${COLORS.cardGold}22)`,
          border: `1px solid ${COLORS.cardPurpleMid}44`,
          borderRadius: "20px", padding: "5px 14px",
          marginBottom: "20px",
        }}>
          <span style={{
            width: "6px", height: "6px", borderRadius: "50%",
            background: `linear-gradient(135deg, ${COLORS.accentPurple}, ${COLORS.accentGold})`,
          }} />
          <span style={{
            color: COLORS.textPurple, fontSize: "0.72rem",
            fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
          }}>
            {current.tag}
          </span>
        </div>

        {/* Headline */}
        <h1 style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: "clamp(2rem, 7vw, 2.8rem)",
          fontWeight: 800,
          color: COLORS.textPrimary,
          textAlign: "center",
          lineHeight: 1.15,
          letterSpacing: "-0.03em",
          marginBottom: "14px",
          whiteSpace: "pre-line",
        }}>
          {current.headline}
        </h1>

        {/* Subheading */}
        <p style={{
          color: COLORS.textMuted,
          fontSize: "clamp(0.88rem, 3vw, 1rem)",
          textAlign: "center",
          lineHeight: 1.7,
          maxWidth: "400px",
          marginBottom: "28px",
        }}>
          {current.subheading}
        </p>

        {/* Image card */}
        <div style={{ width: "100%", marginBottom: "24px" }}>
          <ImageCard image={current.image} step={current.id} />
        </div>

        {/* Stats */}
        {current.stats && (
          <div style={{
            display: "flex", gap: "10px", width: "100%", marginBottom: "8px",
          }}>
            {current.stats.map((s) => (
              <StatChip key={s.label} value={s.value} label={s.label} />
            ))}
          </div>
        )}

        {/* Features */}
        {current.features && (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "10px",
            width: "100%",
            marginBottom: "8px",
          }}>
            {current.features.map((f) => (
              <FeatureCard key={f.title} icon={f.icon} title={f.title} desc={f.desc} />
            ))}
          </div>
        )}

        {/* CTA (last step only) */}
        {current.cta && (
          <div style={{
            width: "100%",
            background: COLORS.cardGradient,
            borderRadius: "18px",
            padding: "24px",
            textAlign: "center",
            marginBottom: "8px",
          }}>
            <div style={{
              fontSize: "2rem", marginBottom: "8px",
            }}>🎓</div>
            <div style={{
              color: COLORS.textPrimary,
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              fontSize: "1rem",
              marginBottom: "4px",
            }}>
              Your first course is free
            </div>
            <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.82rem" }}>
              No credit card required. Cancel anytime.
            </div>
            <div style={{
              display: "flex", justifyContent: "center", gap: "16px",
              marginTop: "16px", flexWrap: "wrap",
            }}>
              {["HD Video Lessons", "Lifetime Access", "Certificate"].map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <FaCheck style={{ color: COLORS.textGold, fontSize: "0.65rem" }} />
                  <span style={{ color: "rgba(255,255,255,0.85)", fontSize: "0.78rem" }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ── Footer / Navigation ── */}
      <footer style={{
        position: "relative", zIndex: 10,
        padding: "20px 24px 28px",
        borderTop: `1px solid ${COLORS.accentBorder}`,
        display: "flex", flexDirection: "column", alignItems: "center", gap: "16px",
      }}>
        {/* Progress dots */}
        <ProgressDots total={STEPS.length} current={step} />

        {/* Nav buttons */}
        <div style={{
          display: "flex", gap: "12px", width: "100%", maxWidth: "520px",
        }}>
          {/* Back */}
          {!isFirst && (
            <button
              onClick={goPrev}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                padding: "14px 20px",
                borderRadius: "14px",
                border: `1.5px solid ${COLORS.accentBorder}`,
                background: "transparent",
                color: COLORS.textMuted,
                fontWeight: 600,
                fontSize: "0.88rem",
                cursor: "pointer",
                transition: "all 0.2s",
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = COLORS.accentPurple;
                e.currentTarget.style.color = COLORS.textPrimary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = COLORS.accentBorder;
                e.currentTarget.style.color = COLORS.textMuted;
              }}
            >
              <FaArrowLeft style={{ fontSize: "0.75rem" }} />
              Back
            </button>
          )}

          {/* Next / Get Started */}
          <button
            onClick={isLast ? handleGetStarted : goNext}
            style={{
              flex: 1,
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              padding: "14px 24px",
              borderRadius: "14px",
              border: "none",
              background: isLast
                ? `linear-gradient(135deg, ${COLORS.accentPurple}, ${COLORS.accentGold})`
                : COLORS.btnPrimary,
              color: "#fff",
              fontWeight: 700,
              fontSize: "0.9rem",
              fontFamily: "'Syne', sans-serif",
              cursor: "pointer",
              letterSpacing: "0.01em",
              transition: "opacity 0.2s, transform 0.15s",
              boxShadow: isLast
                ? `0 8px 24px rgba(147,51,234,0.35), 0 4px 12px rgba(245,158,11,0.2)`
                : `0 8px 24px rgba(147,51,234,0.3)`,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.9"; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = "1";   e.currentTarget.style.transform = "translateY(0)"; }}
          >
            {isLast ? "Get Started — It's Free" : "Continue"}
            <FaArrowRight style={{ fontSize: "0.75rem" }} />
          </button>
        </div>

        {/* Powered by */}
        <p style={{
          color: COLORS.poweredBy,
          fontSize: "0.68rem",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          marginTop: "4px",
        }}>
          {APP.poweredBy}
        </p>
      </footer>

      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${COLORS.bgBase}; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: ${COLORS.bgBase}; }
        ::-webkit-scrollbar-thumb { background: ${COLORS.cardPurpleMid}; border-radius: 4px; }
      `}</style>
    </div>
  );
}