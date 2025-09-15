"use client";

import type { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}

// NOTE: useAuth hook is no longer needed with next-auth, useSession can be used directly in components.
// If you have components that use useAuth(), they will need to be updated to use useSession() from next-auth/react.
// For example: const { data: session } = useSession(); const user = session?.user;
