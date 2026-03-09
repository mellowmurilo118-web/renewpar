// ─────────────────────────────────────────────────────────────────
// useAdmin.js
// Reads the `isAdmin` field from Firestore users/{uid}
// Firestore rule: users/{uid}.isAdmin === true
//
// To make a user admin, set in Firestore:
//   users/{uid} → { isAdmin: true }
// ─────────────────────────────────────────────────────────────────

import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../utils/firebase/firebase";

export function useAdmin() {
  const [isAdmin,  setIsAdmin]  = useState(false);
  const [checking, setChecking] = useState(true);
  const [user,     setUser]     = useState(null);

  useEffect(() => {
    // Step 1 — wait for Firebase Auth to resolve
    const unsubAuth = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setIsAdmin(false);
        setChecking(false);
        return;
      }

      setUser(firebaseUser);

      // Step 2 — subscribe to users/{uid} doc for isAdmin field
      const userRef = doc(db, "users", firebaseUser.uid);
      const unsubDoc = onSnapshot(
        userRef,
        (snap) => {
          if (snap.exists()) {
            setIsAdmin(snap.data()?.isAdmin === true);
          } else {
            setIsAdmin(false);
          }
          setChecking(false);
        },
        () => {
          // Permission error or no doc — not admin
          setIsAdmin(false);
          setChecking(false);
        }
      );

      // Cleanup doc listener when auth changes
      return () => unsubDoc();
    });

    return () => unsubAuth();
  }, []);

  return { isAdmin, checking, user };
}