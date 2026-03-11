import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../utils/firebase/firebase";

const ADMIN_EMAILS = ["adminacc@gmail.com"];

function isAdminEmail(email) {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.trim().toLowerCase());
}

export function useAdmin() {
  // Start with checking:false and detect admin from cached auth state
  // synchronously if available — avoids blank render on iOS
  const currentUser = auth.currentUser;
  const [isAdmin,  setIsAdmin]  = useState(() => isAdminEmail(currentUser?.email));
  const [checking, setChecking] = useState(!currentUser); // skip wait if already authed
  const [user,     setUser]     = useState(currentUser);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser || null);
      setIsAdmin(isAdminEmail(firebaseUser?.email));
      setChecking(false);
    });
    return () => unsub();
  }, []);

  return { isAdmin, checking, user };
}