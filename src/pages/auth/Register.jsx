import { useState } from "react";
import { Link } from "react-router";
import { FaGraduationCap, FaPlay, FaGoogle, FaEye, FaEyeSlash, FaCheck } from "react-icons/fa";
import { COLORS, APP, ROUTES } from "../../libs/constants";
import { createUserWithEmailAndPassword, signInWithPopup, updateProfile } from "firebase/auth";
import { auth, db, googleProvider } from "../../libs/firebase";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../../libs/contexts/AuthConexts"; 



// ─────────────────────────────────────────────
//  AUTH FUNCTIONS
// ─────────────────────────────────────────────

async function registerWithEmail(displayName, email, password) {
  if (!auth) {
    throw new Error("Firebase auth is not initialized in this environment.");
  }

  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, { displayName });
    return result;
  } catch (error) {
    console.error("[registerWithEmail]", error);
    throw error;
  }
}

async function signUpWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result;
  } catch (error) {
    console.error("[signUpWithGoogle]", error);
    throw error;
  }
}

// BUG FIX: was referencing undefined `displayName` and `user` variables.
// Now correctly destructures arguments from the caller.
async function saveUserToFirestore(uid, { displayName, email, photo }) {
  if (!db) {
    throw new Error("Firestore is not initialized in this environment.");
  }

  try {
    await setDoc(doc(db, "users", uid), {
      name: displayName,
      email: email,
      role: "student",
      image: photo || "",
      createdAt: serverTimestamp(),
      enrolledCourses: [],
      completedLessons: [],
      points: 0,
      streak: 0,
    });
  } catch (error) {
    console.error("[saveUserToFirestore]", error);
    throw error;
  }
}

// ─────────────────────────────────────────────
//  PASSWORD STRENGTH
// ─────────────────────────────────────────────

const PASSWORD_RULES = [
  { label: "8+ characters",     test: (p) => p.length >= 8 },
  { label: "Uppercase letter",  test: (p) => /[A-Z]/.test(p) },
  { label: "Number",            test: (p) => /[0-9]/.test(p) },
  { label: "Special character", test: (p) => /[^A-Za-z0-9]/.test(p) },
];

const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"];
const strengthColor = ["", "#dc2626", "#f59e0b", "#65a30d", "#16a34a"];

// ─────────────────────────────────────────────
//  PAGE COMPONENT
// ─────────────────────────────────────────────

export default function SignUpPage() {



   const { user } = useAuth();
  
  
  const navigate = useNavigate();
  
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user]);




  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConf, setShowConf] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState(false);

  const passScore = PASSWORD_RULES.filter((r) => r.test(password)).length;

  const confirmBorderColor = () => {
    if (!confirm.length) return COLORS.inputBorder;
    return confirm === password ? COLORS.success : COLORS.error;
  };

  // ── Email Sign Up ──────────────────────────
  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password || !confirm) {
      setError("Please fill in all fields.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (passScore < PASSWORD_RULES.length) {
      setError("Please meet all password requirements.");
      return;
    }

    setLoading(true);
    try {
      const result = await registerWithEmail(name, email, password);
      await saveUserToFirestore(result.user.uid, {
        displayName: name,
        email,
        photo: "",
      });
      setSuccess(true);
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Google Sign Up ─────────────────────────
  // BUG FIX: was using undefined `displayName` — now uses `user.displayName`
  // BUG FIX: removed duplicate inline Firestore write; uses saveUserToFirestore instead
  const handleGoogleSignUp = async () => {
    setError("");
    setLoading(true);
    try {
      const result = await signUpWithGoogle();
      const user = result.user;

      await saveUserToFirestore(user.uid, {
        displayName: user.displayName || "",
        email: user.email,
        photo: user.photoURL || "",
      });

      setSuccess(true);
    } catch (err) {
      setError(err.message || "Google sign-up failed.");
    } finally {
      setLoading(false);
    }
  };

  // ── Success Screen ─────────────────────────
  if (success) {
    return (
      <main
        className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden"
        style={{ backgroundColor: COLORS.bodyBg }}
      >
        <BgDecor />
        <div
          className="relative z-10 w-full max-w-[440px] rounded-3xl p-10 text-center"
          style={{
            backgroundColor: COLORS.cardBg,
            border: `1px solid ${COLORS.cardBorder}`,
            boxShadow: `0 32px 64px ${COLORS.accentGlow}, 0 8px 32px rgba(0,0,0,0.3)`,
          }}
        >
          <Logo />
          <div
            className="mt-8 mx-auto w-16 h-16 rounded-2xl flex items-center justify-center text-2xl"
            style={{ backgroundColor: COLORS.accentLight, color: COLORS.accentPrimary }}
          >
            ✉️
          </div>
          <h2
            className="mt-4 text-2xl font-extrabold"
            style={{ color: COLORS.cardText, fontFamily: "'Syne', sans-serif" }}
          >
            Verify your email
          </h2>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: COLORS.cardTextMuted }}>
            We sent a confirmation link to{" "}
            <strong style={{ color: COLORS.cardText }}>{email}</strong>.
            Click it to activate your account.
          </p>
          <Link
            to={ROUTES.signin}
            className="mt-6 inline-block rounded-xl py-3 px-8 font-bold text-sm transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
            style={{ backgroundColor: COLORS.btnPrimaryBg, color: COLORS.btnPrimaryText }}
          >
            Go to Sign In
          </Link>
        </div>
        <PoweredBy />
      </main>
    );
  }

  // ── Main Render ────────────────────────────
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden"
      style={{ backgroundColor: COLORS.bodyBg }}
    >
      <BgDecor />

      <div
        className="relative z-10 w-full max-w-[440px] rounded-3xl p-8 md:p-10"
        style={{
          backgroundColor: COLORS.cardBg,
          border: `1px solid ${COLORS.cardBorder}`,
          boxShadow: `0 32px 64px ${COLORS.accentGlow}, 0 8px 32px rgba(0,0,0,0.3)`,
        }}
      >
        <Logo />

        <div className="mt-7 mb-6">
          <h1
            className="text-[1.65rem] font-extrabold tracking-tight"
            style={{ color: COLORS.cardText, fontFamily: "'Syne', sans-serif" }}
          >
            Create your account
          </h1>
          <p className="mt-1 text-sm" style={{ color: COLORS.cardTextMuted }}>
            Join thousands of learners on {APP.name}.
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
          onClick={handleGoogleSignUp}
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

        <form onSubmit={handleEmailSignUp} className="space-y-5">
          <InputField
            label="Full name"
            type="text"
            placeholder="Jane Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
          />

          <InputField
            label="Email address"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />

          {/* Password + strength */}
          <div>
            <FieldLabel>Password</FieldLabel>
            <div className="relative mt-1.5">
              <input
                type={showPass ? "text" : "password"}
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
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

            {password.length > 0 && (
              <div className="mt-2.5 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex flex-1 gap-1">
                    {[0, 1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="flex-1 h-1.5 rounded-full transition-all duration-300"
                        style={{
                          backgroundColor: i < passScore ? strengthColor[passScore] : "#e5e7eb",
                        }}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] font-semibold w-10 text-right" style={{ color: strengthColor[passScore] }}>
                    {strengthLabel[passScore]}
                  </span>
                </div>
                <ul className="grid grid-cols-2 gap-x-3 gap-y-1">
                  {PASSWORD_RULES.map((rule) => {
                    const passed = rule.test(password);
                    return (
                      <li
                        key={rule.label}
                        className="flex items-center gap-1.5 text-[11px] transition-colors duration-200"
                        style={{ color: passed ? COLORS.success : COLORS.cardTextMuted }}
                      >
                        <FaCheck className="text-[9px] shrink-0" style={{ opacity: passed ? 1 : 0.25 }} />
                        {rule.label}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>

          {/* Confirm password */}
          <div>
            <FieldLabel>Confirm password</FieldLabel>
            <div className="relative mt-1.5">
              <input
                type={showConf ? "text" : "password"}
                placeholder="Repeat your password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                autoComplete="new-password"
                className="w-full rounded-xl py-[11px] pl-4 pr-11 text-sm outline-none transition-all duration-200"
                style={{
                  backgroundColor: COLORS.inputBg,
                  border: `1.5px solid ${confirmBorderColor()}`,
                  color: COLORS.inputText,
                }}
                onFocus={(e) => (e.target.style.borderColor = COLORS.inputBorderFocus)}
                onBlur={(e) => (e.target.style.borderColor = confirmBorderColor())}
              />
              <button
                type="button"
                onClick={() => setShowConf(!showConf)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-60"
                style={{ color: COLORS.inputPlaceholder }}
              >
                {showConf ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Terms */}
          <p className="text-xs leading-relaxed" style={{ color: COLORS.cardTextMuted }}>
            By creating an account you agree to our{" "}
            <Link href="/terms" style={{ color: COLORS.linkColor }} className="font-medium">Terms of Service</Link>{" "}
            and{" "}
            <Link to="/privacy" style={{ color: COLORS.linkColor }} className="font-medium">Privacy Policy</Link>.
          </p>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl py-3.5 font-bold text-sm tracking-wide transition-all duration-200 hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: COLORS.btnPrimaryBg, color: COLORS.btnPrimaryText }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Spinner /> Creating account…
              </span>
            ) : "Create Free Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm" style={{ color: COLORS.cardTextMuted }}>
          Already have an account?{" "}
          <Link to={ROUTES.signin} className="font-semibold" style={{ color: COLORS.linkColor }}>
            Sign in
          </Link>
        </p>
      </div>

      <PoweredBy />
    </main>
  );
}

// ─────────────────────────────────────────────
//  SUB-COMPONENTS
// ─────────────────────────────────────────────

function Logo() {
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
      <div
        className="absolute -top-48 -left-48 w-[640px] h-[640px] rounded-full opacity-[0.18] blur-3xl"
        style={{ backgroundColor: COLORS.accentPrimary }}
      />
      <div
        className="absolute -bottom-40 -right-40 w-[560px] h-[560px] rounded-full opacity-[0.14] blur-3xl"
        style={{ backgroundColor: COLORS.accentSecondary }}
      />
      <div
        className="absolute inset-0 opacity-[0.04]"
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