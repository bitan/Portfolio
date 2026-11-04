import { useUser, useSignIn, useSignUp, useClerk } from "@clerk/react";

interface AuthContextValue {
  user: any;
  loading: boolean;
  signOut: () => Promise<void>;
}

export function useAuth(): AuthContextValue {
  const { user, isLoaded } = useUser();
  const { signOut: clerkSignOut } = useClerk();

  return {
    user: user || null,
    loading: !isLoaded,
    signOut: async () => {
      await clerkSignOut();
    },
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return children;
}
