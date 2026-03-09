// ─────────────────────────────────────────────────────────────────
// useAdmin.js
// Admin check — email whitelist only (no Firestore read).
// Add emails to ADMIN_EMAILS to grant admin access.
// For regular users, isAdmin is always false.
// ─────────────────────────────────────────────────────────────────

import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../utils/firebase/firebase";

// ── Admin email whitelist ─────────────────────────────────────────
const ADMIN_EMAILS = [
  "adminacc@gmail.com",
];

function isAdminEmail(email) {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.trim().toLowerCase());
}
// ─────────────────────────────────────────────────────────────────

export function useAdmin() {
  const [isAdmin,  setIsAdmin]  = useState(false);
  const [checking, setChecking] = useState(true);
  const [user,     setUser]     = useState(null);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setIsAdmin(false);
        setChecking(false);
        return;
      }

      setUser(firebaseUser);
      setIsAdmin(isAdminEmail(firebaseUser.email));
      setChecking(false);
    });

    return () => unsubAuth();
  }, []);

  return { isAdmin, checking, user };
}