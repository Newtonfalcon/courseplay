// src/main.jsx
// ─────────────────────────────────────────────
//  FIX 2: Wrap the entire app in AuthProvider FIRST, then use
//  a thin AppShell component that blocks rendering until
//  Firebase has resolved the auth state.
//  This prevents the white flicker on initial load AND on
//  every protected-route navigation.
// ─────────────────────────────────────────────

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider, useAuth } from "./libs/contexts/AuthConexts.jsx";
import Loader from "./components/Loader.jsx";

// AppShell sits between AuthProvider and App.
// It reads `loading` from context and shows the full-screen
// Loader until Firebase has resolved — zero white flash.
function AppShell() {
  const { loading } = useAuth();

  if (loading) {
    return <Loader label="Starting up" />;
  }

  return <App />;
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  </StrictMode>
);