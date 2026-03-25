import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { FaGraduationCap, FaPlay, FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";
import { COLORS, APP, ROUTES } from "../../libs/constants";
import { GoogleAuthProvider, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth } from "../../libs/firebase";
import { useAuth } from "../../libs/contexts/AuthConexts";



// ─────────────────────────────────────────────
//  AUTH FUNCTIONS  — wire your Firebase logic here
// ─────────────────────────────────────────────

/**
 * Sign in with Google OAuth via Firebase.
 * @returns {Promise<import("firebase/auth").UserCredential>}
 */
async function signInWithGoogle() {
  try {
  
    
    const provider = new GoogleAuthProvider()
    const result = await signInWithPopup(auth, provider);
    return result;
  } catch (error) {
    console.error("[signInWithGoogle]", error);
    throw error;
  }
}

/**
 * Sign in with email + password via Firebase.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<import("firebase/auth").UserCredential>}
 */
async function signInWithEmail(email, password) {
  try {
    
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result;
  } catch (error) {
    console.error("[signInWithEmail]", error);
    throw error;
  }
}

/**
 * Send a password-reset email via Firebase.
 * @param {string} email
 */
async function sendPasswordReset(email) {
  try {
   
    
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error("[sendPasswordReset]", error);
    throw error;
  }
}

// ─────────────────────────────────────────────
//  PAGE COMPONENT
// ─────────────────────────────────────────────

export default function SignInPage() {
  const { user } = useAuth();


const navigate = useNavigate();

useEffect(() => {
  if (user) {
    navigate("/dashboard");
  }
}, [user]);



 
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setLoading(true);
    try {
      await signInWithEmail(email, password);
      navigate(ROUTES.dashboard);
    } catch (err) {
      setError(err.message || "Sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);
    try {
      await signInWithGoogle();
     navigate(ROUTES.dashboard);
    } catch (err) {
      setError(err.message || "Google sign-in failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden"
      style={{ backgroundColor: COLORS.bodyBg }}
    >
      <BgDecor />

      {/* ── White Card ── */}
      <div
        className="relative z-10 w-full max-w-[440px] rounded-3xl p-8 md:p-10"
        style={{
          backgroundColor: COLORS.cardBg,
          border: `1px solid ${COLORS.cardBorder}`,
          boxShadow: `0 32px 64px ${COLORS.accentGlow}, 0 8px 32px rgba(0,0,0,0.3)`,
        }}
      >
        <Logo />

        {/* Heading */}
        <div className="mt-7 mb-6">
          <h1
            className="text-[1.65rem] font-extrabold tracking-tight"
            style={{ color: COLORS.cardText, fontFamily: "'Syne', sans-serif" }}
          >
            Welcome back
          </h1>
          <p className="mt-1 text-sm" style={{ color: COLORS.cardTextMuted }}>
            Sign in to continue your learning journey.
          </p>
        </div>

        {/* Error banner */}
        {error && (
          <div
            className="mb-5 rounded-xl px-4 py-3 text-sm font-medium flex items-start gap-2"
            style={{ backgroundColor: "#fef2f2", color: COLORS.error, border: "1px solid #fecaca" }}
          >
            <span className="mt-0.5 shrink-0">⚠</span>
            <span>{error}</span>
          </div>
        )}

        {/* Google */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 rounded-xl py-[11px] px-4 font-semibold text-sm transition-all duration-200 hover:bg-gray-50 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: COLORS.btnGoogleBg,
            border: `1.5px solid ${COLORS.btnGoogleBorder}`,
            color: COLORS.btnGoogleText,
          }}
        >
          <FaGoogle style={{ color: "#4285F4", fontSize: "0.9rem" }} />
          Continue with Google
        </button>

        <Divider />

        {/* Form */}
        <form onSubmit={handleEmailSignIn} className="space-y-5">
          <InputField
            label="Email address"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <FieldLabel>Password</FieldLabel>
              <Link
                to={ROUTES.forgotPassword}
                className="text-xs font-medium"
                style={{ color: COLORS.linkColor }}
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="w-full rounded-xl py-[11px] pl-4 pr-11 text-sm outline-none transition-all duration-200"
                style={{
                  backgroundColor: COLORS.inputBg,
                  border: `1.5px solid ${COLORS.inputBorder}`,
                  color: COLORS.inputText,
                }}
                onFocus={(e) => (e.target.style.borderColor = COLORS.inputBorderFocus)}
                onBlur={(e) => (e.target.style.borderColor = COLORS.inputBorder)}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-60"
                style={{ color: COLORS.inputPlaceholder }}
              >
                {showPass ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl py-3.5 font-bold text-sm tracking-wide transition-all duration-200 hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: COLORS.btnPrimaryBg, color: COLORS.btnPrimaryText }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Spinner /> Signing in…
              </span>
            ) : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm" style={{ color: COLORS.cardTextMuted }}>
          Don&apos;t have an account?{" "}
          <Link to={ROUTES.signup} className="font-semibold" style={{ color: COLORS.linkColor }}>
            Create one free
          </Link>
        </p>
      </div>

      <PoweredBy />
    </main>
  );
}

// ─────────────────────────────────────────────
//  SHARED SUB-COMPONENTS
// ─────────────────────────────────────────────

export function Logo() {
  return (
    <div className="flex items-center gap-1.5 select-none">
      <FaGraduationCap className="text-[1.55rem]" style={{ color: COLORS.logoCourseText }} />
      <span
        className="text-[1.4rem] font-extrabold tracking-tight"
        style={{ color: COLORS.logoCourseText, fontFamily: "'Syne', sans-serif" }}
      >
        Course
      </span>
      <span
        className="flex items-center justify-center w-6 h-6 rounded-full text-[0.55rem]"
        style={{ backgroundColor: COLORS.logoPlayIconBg, color: COLORS.logoPlayIcon }}
      >
        <FaPlay className="ml-px" />
      </span>
      
    </div>
  );
}

function BgDecor() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {/* Purple blobs — accent only, never covering the body */}
      <div
        className="absolute -top-48 -left-48 w-[640px] h-[640px] rounded-full opacity-[0.18] blur-3xl"
        style={{ backgroundColor: COLORS.accentPrimary }}
      />
      <div
        className="absolute -bottom-40 -right-40 w-[560px] h-[560px] rounded-full opacity-[0.14] blur-3xl"
        style={{ backgroundColor: COLORS.accentSecondary }}
      />
      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.045]"
        style={{
          backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
    </div>
  );
}

function Divider() {
  return (
    <div className="flex items-center gap-3 my-6">
      <div className="flex-1 h-px" style={{ backgroundColor: COLORS.divider }} />
      <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: COLORS.cardTextMuted }}>
        or
      </span>
      <div className="flex-1 h-px" style={{ backgroundColor: COLORS.divider }} />
    </div>
  );
}

function FieldLabel({ children }) {
  return (
    <label className="block text-xs font-semibold uppercase tracking-widest" style={{ color: COLORS.cardTextMuted }}>
      {children}
    </label>
  );
}

function InputField({ label, type, placeholder, value, onChange, autoComplete }) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        className="mt-1.5 w-full rounded-xl py-[11px] px-4 text-sm outline-none transition-all duration-200"
        style={{
          backgroundColor: COLORS.inputBg,
          border: `1.5px solid ${COLORS.inputBorder}`,
          color: COLORS.inputText,
        }}
        onFocus={(e) => (e.target.style.borderColor = COLORS.inputBorderFocus)}
        onBlur={(e) => (e.target.style.borderColor = COLORS.inputBorder)}
      />
    </div>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  );
}

function PoweredBy() {
  return (
    <p className="mt-8 text-[11px] tracking-widest uppercase z-10 relative" style={{ color: COLORS.poweredBy }}>
      {APP.poweredBy}
    </p>
  );
}