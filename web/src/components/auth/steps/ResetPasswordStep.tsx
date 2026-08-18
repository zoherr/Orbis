"use client";

import { useEffect, useState } from "react";
import authStore from "@/store/authStore";
import { FormField } from "../ui/FormField";
import { OtpInput } from "../ui/OtpInput";

interface ResetPasswordStepProps {
  email: string;
  onSuccess: () => void;
}

export function ResetPasswordStep({ email, onSuccess }: ResetPasswordStepProps) {
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldError, setFieldError] = useState<string | null>(null);
  const { forgotPassword, isLoading, error, clearError, reSendOTP, activationToken } = authStore();

  const [secondsLeft, setSecondsLeft] = useState<number>(() => (activationToken ? 60 : 0));

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    clearError();
    setFieldError(null);

    if (otp.length !== 6) {
      setFieldError("Enter the 6-digit code we emailed you");
      return;
    }

    if (newPassword !== confirmPassword) {
      setFieldError("Passwords do not match");
      return;
    }

    try {
      await forgotPassword({ email, newPassword, otp: Number(otp) });
      onSuccess();
    } catch {
      // error already set in store
    }
  };

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const id = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [secondsLeft]);

  const handleResend = async () => {
    try {
      await reSendOTP(email);
      setSecondsLeft(60);
    } catch {
      // store sets error
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
        <div className="flex items-center justify-end mt-2">
          <button
            type="button"
            onClick={handleResend}
            disabled={secondsLeft > 0 || isLoading}
            className="text-xs font-semibold text-[#084ba7] hover:underline disabled:opacity-60"
          >
            {secondsLeft > 0 ? `Resend code (${secondsLeft}s)` : "Resend code"}
          </button>
        </div>
      </div>

      <FormField
        label="New password"
        type="password"
        name="newPassword"
        placeholder="••••••••"
        autoComplete="new-password"
        value={newPassword}
        onChange={(event) => setNewPassword(event.target.value)}
        minLength={8}
        maxLength={20}
        required
      />

      <FormField
        label="Confirm new password"
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
        {isLoading ? "Updating password…" : "Reset password"}
      </button>
    </form>
  );
}
