// src/libs/contexts/AuthConexts.jsx
// ─────────────────────────────────────────────
//  FIX 1: Auth context now holds a stable `loading` state.
//  The app waits for Firebase to resolve the auth state before
//  rendering anything — this eliminates the white flicker on
//  protected routes and the blank screen on initial load.
// ─────────────────────────────────────────────

import { createContext, useState, useEffect, useContext } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

const AuthContext = createContext({
  user:    null,
  loading: true,   // ← default to true so consumers always wait
});

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);   // start loading

  useEffect(() => {
    // onAuthStateChanged fires ONCE on mount with the persisted user
    // (or null). Only then do we set loading = false.
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);   // auth resolved — safe to render
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}