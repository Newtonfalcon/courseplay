// ============================================================
//  CoursePlay — App Constants
//  All design tokens, colors, and shared data live here.
//  Swap any value below to retheme the entire application.
// ============================================================

// ── Color Palette ────────────────────────────────────────────
export const COLORS = {
  // Body / layout  — black canvas, white text
  bodyBg:           "#080808",   // full page background (near-black)
  bodyText:         "#ffffff",   // default text on body
  bodyTextMuted:    "#a1a1aa",   // secondary / helper text on body

  // Card / auth surface  — WHITE card, dark text
  cardBg:           "#ffffff",   // card background (white)
  cardBorder:       "#e5e7eb",   // subtle light border
  cardText:         "#0f0f0f",   // primary text inside card (near-black)
  cardTextMuted:    "#6b7280",   // secondary text inside card (gray)

  // Brand accent  — purple used ONLY for interactive elements & decoration
  accentPrimary:    "#9333ea",   // main purple (buttons, focus rings, icons)
  accentSecondary:  "#7c3aed",   // deeper purple (hover states)
  accentLight:      "#f3e8ff",   // very light purple tint (input bg, chips)
  accentGlow:       "#9333ea33", // purple glow for card shadow

  // Logo  — on white card
  logoCourseText:   "#0f0f0f",   // "Course" text on card (dark)
  logoPlayIcon:     "#ffffff",   // play ▶ icon color
  logoPlayIconBg:   "#9333ea",   // play icon pill background (purple accent)

  // Inputs  — white card context
  inputBg:          "#f9fafb",   // input background (off-white)
  inputBorder:      "#d1d5db",   // input border (light gray)
  inputBorderFocus: "#9333ea",   // input focus ring (purple accent)
  inputText:        "#0f0f0f",   // typed text
  inputPlaceholder: "#9ca3af",   // placeholder (mid gray)

  // Buttons
  btnPrimaryBg:     "#9333ea",   // primary CTA (purple accent)
  btnPrimaryText:   "#ffffff",   // label on primary button
  btnPrimaryHover:  "#7c3aed",   // primary hover (deeper purple)
  btnGoogleBg:      "#ffffff",   // Google button (white)
  btnGoogleBorder:  "#d1d5db",   // Google button border
  btnGoogleText:    "#0f0f0f",   // Google button label

  // Divider
  divider:          "#e5e7eb",   // "or" divider line (light gray)

  // Error / success states
  error:            "#dc2626",   // error messages
  success:          "#16a34a",   // success messages

  // Misc
  linkColor:        "#9333ea",   // clickable links (purple accent)
  linkHover:        "#7c3aed",   // link hover
  poweredBy:        "#6b7280",   // "powered by netech" text
  overlay:          "#00000099", // full-screen overlay tint
};

// ── Typography ───────────────────────────────────────────────
export const FONTS = {
  heading: "'Syne', sans-serif",
  body:    "'DM Sans', sans-serif",
};

// ── App Meta ─────────────────────────────────────────────────
export const APP = {
  name:        "CoursePlay",
  tagline:     "Learn Without Limits",
  description: "The next-generation e-learning platform for curious minds.",
  poweredBy:   "Powered by Netech",
  supportEmail: "support@courseplay.io",
};

// ── Routes ───────────────────────────────────────────────────
export const ROUTES = {
  home:       "/",
  dashboard:  "/dashboard",
  createCourse: "/dashboard/create-course",
  createLesson: "/dashboard/:courseId/add-lesson",
  profile:    "/profile",
  signin:     "/auth/signin",
  signup:     "/auth/signup",
  code:       "/code-editor",
  learn: "/learn",
  completed: "/dashboard/completed",
  forgotPassword: "/auth/forgot-password",
};

// ── Firebase Auth Providers (string keys) ────────────────────
export const AUTH_PROVIDERS = {
  google:   "google",
  email:    "email",
};