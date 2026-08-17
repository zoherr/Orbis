"use client";

import { useState } from "react";
import authStore from "@/store/authStore";
import { FormField } from "../ui/FormField";
import { GoogleButton } from "../ui/GoogleButton";

interface InitStepProps {
  initialEmail: string;
  onExistingUser: (email: string) => void;
  onNewUser: (email: string) => void;
}

export function InitStep({ initialEmail, onExistingUser, onNewUser }: InitStepProps) {
  const [email, setEmail] = useState(initialEmail);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const { initiateAuth, isLoading, error, clearError } = authStore();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    clearError();
    setFieldError(null);

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setFieldError("Enter a valid email address");
      return;
    }

    try {
      const { isExistingUser } = await initiateAuth(email);
      if (isExistingUser) {
        onExistingUser(email);
      } else {
        onNewUser(email);
      }
    } catch {
      // error already set in store
    }
  };

  return (
    <div className="space-y-5">
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <FormField
          label="Email"
          type="email"
          name="email"
          placeholder="you@example.com"
          autoComplete="email"
          autoFocus
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          error={fieldError ?? undefined}
        />

        {error && !fieldError && (
          <p className="rounded-lg bg-[#fdecec] px-3 py-2 text-xs text-[#e5484d]">{error}</p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-full bg-[#d3f625] px-6 py-3.5 text-sm font-semibold text-[#0d172a] shadow-[0_18px_36px_rgba(211,246,37,0.35)] transition hover:translate-y-[-1px] hover:bg-[#defd5f] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? "Checking…" : "Continue with email"}
        </button>
      </form>

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-[#dfe7f3]" />
        <span className="text-xs uppercase tracking-[0.14em] text-[#9aa6b8]">or</span>
        <div className="h-px flex-1 bg-[#dfe7f3]" />
      </div>

      <GoogleButton label="Continue with Google" />
    </div>
  );
}
