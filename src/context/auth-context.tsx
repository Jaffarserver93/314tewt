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
// For example: const { data: session } = useSession(); const user = session?.user;
// You can also now use the supabase client to interact with your database.
