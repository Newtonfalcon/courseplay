// src/components/Protected.jsx
// ─────────────────────────────────────────────
//  FIX 3: ProtectedRoute no longer needs its OWN loading check
//  because AppShell already blocks until auth resolves.
//  We keep a lightweight guard here as a safety net, but the
//  real source of truth is the AppShell gating in main.jsx.
//
//  The key addition is the black background div that wraps the
//  Loader — this prevents any white background from bleeding
//  through before the protected page has mounted and painted.
// ─────────────────────────────────────────────

import { Navigate } from "react-router-dom";
import { useAuth } from "../libs/contexts/AuthConexts";
import Loader from "./Loader";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // Safety net: in the rare case this renders before AppShell
  // has finished, show the loader with a solid black background
  // to guarantee zero white flash.
  if (loading) {
    return (
      <div style={{ background: "#0a0a0a", minHeight: "100vh" }}>
        <Loader label="Checking authentication" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth/signin" replace />;
  }

  return children;
}