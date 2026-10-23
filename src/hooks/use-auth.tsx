import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "firebase/auth";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  configured: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: false,
  configured: false,
  signIn: async () => {},
  signOut: async () => {},
});

function isConfigured(): boolean {
  const key = import.meta.env.VITE_FIREBASE_API_KEY;
  return !!key && key !== "your_api_key_here";
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false); // start false — don't block render

  useEffect(() => {
    if (!isConfigured()) return;

    // Dynamically import Firebase only when needed
    let unsub: (() => void) | undefined;
    const timeout = setTimeout(() => setLoading(false), 6000);

    import("firebase/auth").then(({ onAuthStateChanged }) => {
      import("@/lib/firebase").then(({ auth }) => {
        if (!auth) { clearTimeout(timeout); return; }
        unsub = onAuthStateChanged(auth, (u) => {
          clearTimeout(timeout);
          setUser(u);
          setLoading(false);
        }, () => {
          clearTimeout(timeout);
          setLoading(false);
        });
      });
    });

    return () => {
      clearTimeout(timeout);
      unsub?.();
    };
  }, []);

  async function signIn(email: string, password: string) {
    const { signInWithEmailAndPassword } = await import("firebase/auth");
    const { auth } = await import("@/lib/firebase");
    if (!auth) throw new Error("Firebase not configured.");
    await signInWithEmailAndPassword(auth, email, password);
  }

  async function signOut() {
    const { signOut: fbSignOut } = await import("firebase/auth");
    const { auth } = await import("@/lib/firebase");
    if (!auth) return;
    await fbSignOut(auth);
  }

  return (
    <AuthContext.Provider value={{ user, loading, configured: isConfigured(), signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
