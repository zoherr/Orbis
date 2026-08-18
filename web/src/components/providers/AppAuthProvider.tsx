"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import authStore from "@/store/authStore";

export type AppUser = {
  fullName: string;
  email: string;
  username: string;
  profileImage?: string;
};

interface AppAuthContextValue {
  user: AppUser | null;
  isAuthenticated: boolean;
  ready: boolean;
  refresh: () => Promise<void>;
}

const AppAuthContext = createContext<AppAuthContextValue | undefined>(undefined);

export function AppAuthProvider({ children }: { children: ReactNode }) {
  const user = authStore((state) => state.user);
  const isAuthenticated = authStore((state) => state.isAuthenticated);
  const getMe = authStore((state) => state.getMe);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;

    const bootstrap = async () => {
      try {
        await getMe();
      } catch {
        // keep unauthenticated state for guests
      } finally {
        if (active) setReady(true);
      }
    };

    bootstrap();

    return () => {
      active = false;
    };
  }, [getMe]);

  const value = useMemo<AppAuthContextValue>(
    () => ({
      user,
      isAuthenticated,
      ready,
      refresh: async () => {
        try {
          await getMe();
        } catch {
          // no-op: refresh failure leaves guest state intact
        }
      },
    }),
    [getMe, isAuthenticated, ready, user]
  );

  return <AppAuthContext.Provider value={value}>{children}</AppAuthContext.Provider>;
}

export function useAppAuth() {
  const context = useContext(AppAuthContext);

  if (!context) {
    throw new Error("useAppAuth must be used within AppAuthProvider");
  }

  return context;
}
