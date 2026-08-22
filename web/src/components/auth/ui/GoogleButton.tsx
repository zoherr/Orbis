"use client";

import { useEffect, useRef } from "react";
import authStore from "@/store/authStore";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
          }) => void;
          prompt: () => void;
          renderButton: (parent: HTMLElement, options: any) => void;
        };
      };
    };
  }
}

interface GoogleButtonProps {
  onSuccess?: () => void;
  label?: string;
}

export function GoogleButton({
  onSuccess,
  label = "Continue with Google",
}: GoogleButtonProps) {
  const googleLogin = authStore((state) => state.googleLogin);

  const buttonRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) {
      return;
    }

    const initializeGoogle = () => {
      if (!window.google || !buttonRef.current) {
        return;
      }

      if (initializedRef.current) {
        return;
      }

      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        callback: async (response) => {
          try {
            await googleLogin(response.credential);
            onSuccess?.();
          } catch {}
        },
      });

      window.google.accounts.id.renderButton(buttonRef.current, {
        type: "standard",
        theme: "outline",
        size: "large",
        text: "continue_with",
        shape: "pill",
        logo_alignment: "center",
        width: buttonRef.current.offsetWidth || 320,
      });

      initializedRef.current = true;
    };

    if (window.google) {
      initializeGoogle();
      return;
    }

    const existingScript = document.querySelector(
      'script[src="https://accounts.google.com/gsi/client"]',
    );

    if (existingScript) {
      existingScript.addEventListener("load", initializeGoogle);
      return () => {
        existingScript.removeEventListener("load", initializeGoogle);
      };
    }

    const script = document.createElement("script");

    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = initializeGoogle;

    document.head.appendChild(script);

    return () => {
      script.onload = null;
    };
  }, []);

  return (
    <div className="flex w-full justify-center overflow-hidden rounded-full">
      <div
        ref={buttonRef}
        className="w-full"
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      />
    </div>
  );
}
