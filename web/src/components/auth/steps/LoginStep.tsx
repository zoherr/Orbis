"use client";

import { useState } from "react";
import authStore from "@/store/authStore";
import { FormField } from "../ui/FormField";

interface LoginStepProps {
  email: string;
  onForgotPassword: () => void;
  onSuccess: () => void;
}

export function LoginStep({ email, onForgotPassword, onSuccess }: LoginStepProps) {
  const [password, setPassword] = useState("");
  const { login, isLoading, error, clearError } = authStore();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    clearError();

    try {
      await login(email, password);
      onSuccess();
    } catch {
      // error already set in store
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <FormField label="Email" type="email" value={email} disabled readOnly />

      <FormField
        label="Password"
        type="password"
        name="password"
        placeholder="••••••••"
        autoComplete="current-password"
        autoFocus
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />

      <div className="flex justify-end">
        <button
          type="button"
          onClick={onForgotPassword}
          className="text-xs font-medium text-[#084ba7] hover:underline"
        >
          Forgot password?
        </button>
      </div>

      {error && (
        <p className="rounded-lg bg-[#fdecec] px-3 py-2 text-xs text-[#e5484d]">{error}</p>
      )}

      <button
        type="submit"
        disabled={isLoading || password.length < 8}
        className="w-full rounded-full bg-[#d3f625] px-6 py-3.5 text-sm font-semibold text-[#0d172a] shadow-[0_18px_36px_rgba(211,246,37,0.35)] transition hover:translate-y-[-1px] hover:bg-[#defd5f] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
