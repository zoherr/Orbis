"use client";

import { useState } from "react";
import authStore from "@/store/authStore";
import { FormField } from "../ui/FormField";
import { OtpInput } from "../ui/OtpInput";

interface RegisterStepProps {
  email: string;
  onSuccess: () => void;
}

export function RegisterStep({ email, onSuccess }: RegisterStepProps) {
  const [otp, setOtp] = useState("");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldError, setFieldError] = useState<string | null>(null);
  const { register, isLoading, error, clearError } = authStore();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    clearError();
    setFieldError(null);

    if (otp.length !== 6) {
      setFieldError("Enter the 6-digit code we emailed you");
      return;
    }

    if (password !== confirmPassword) {
      setFieldError("Passwords do not match");
      return;
    }

    try {
      await register({ fullName, email, username, password, otp: Number(otp) });
      onSuccess();
    } catch {
      // error already set in store
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div>
        <p className="mb-1.5 text-xs font-medium uppercase tracking-[0.14em] text-[#5b697d]">
          Verification code
        </p>
        <p className="mb-3 text-xs text-[#9aa6b8]">Sent to {email}</p>
        <OtpInput value={otp} onChange={setOtp} />
      </div>

      <FormField
        label="Full name"
        name="fullName"
        placeholder="Jordan Rivers"
        autoComplete="name"
        value={fullName}
        onChange={(event) => setFullName(event.target.value)}
        minLength={5}
        maxLength={20}
        required
      />

      <FormField
        label="Username"
        name="username"
        placeholder="jordanrivers"
        autoComplete="username"
        value={username}
        onChange={(event) => setUsername(event.target.value.trim())}
        minLength={5}
        maxLength={20}
        required
      />

      <div className="grid grid-cols-2 gap-3">
        <FormField
          label="Password"
          type="password"
          name="password"
          placeholder="••••••••"
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          minLength={8}
          maxLength={20}
          required
        />
        <FormField
          label="Confirm"
          type="password"
          name="confirmPassword"
          placeholder="••••••••"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          minLength={8}
          maxLength={20}
          required
        />
      </div>

      {(fieldError || error) && (
        <p className="rounded-lg bg-[#fdecec] px-3 py-2 text-xs text-[#e5484d]">
          {fieldError ?? error}
        </p>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-full bg-[#d3f625] px-6 py-3.5 text-sm font-semibold text-[#0d172a] shadow-[0_18px_36px_rgba(211,246,37,0.35)] transition hover:translate-y-[-1px] hover:bg-[#defd5f] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? "Creating your orbit…" : "Create account"}
      </button>
    </form>
  );
}
