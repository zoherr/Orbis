"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { AuthShell } from "./AuthShell";
import { InitStep } from "./steps/InitStep";
import { LoginStep } from "./steps/LoginStep";
import { RegisterStep } from "./steps/RegisterStep";
import { ForgotPasswordStep } from "./steps/ForgotPasswordStep";
import { ResetPasswordStep } from "./steps/ResetPasswordStep";

type Step = "init" | "login" | "register" | "forgot-email" | "forgot-reset";

const COPY: Record<Step, { eyebrow: string; title: string; subtitle: string }> = {
  init: {
    eyebrow: "get started",
    title: "Find your orbit",
    subtitle: "Enter your email to sign in or create a new space.",
  },
  login: {
    eyebrow: "welcome back",
    title: "Good to see you",
    subtitle: "Enter your password to jump back into your spaces.",
  },
  register: {
    eyebrow: "new account",
    title: "Claim your orbit",
    subtitle: "Verify your email and set up your profile.",
  },
  "forgot-email": {
    eyebrow: "reset access",
    title: "Lost your way?",
    subtitle: "We'll send a code to get you back in.",
  },
  "forgot-reset": {
    eyebrow: "reset access",
    title: "Set a new password",
    subtitle: "Enter the code we sent and choose a new password.",
  },
};

export function AuthFlow() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("init");
  const [email, setEmail] = useState("");

  const goToApp = () => {
    toast.success("You’re in. Welcome to Orbis.");
    router.push("/");
  };

  const { eyebrow, title, subtitle } = COPY[step];

  return (
    <AuthShell
      eyebrow={eyebrow}
      title={title}
      subtitle={subtitle}
      footer={
        step === "init" ? (
          <>
            
          </>
        ) : step === "forgot-email" || step === "forgot-reset" ? (
          <button
            type="button"
            onClick={() => setStep("login")}
            className="font-semibold text-[#084ba7] hover:underline"
          >
            ← Back to sign in
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setStep("init")}
            className="font-semibold text-[#084ba7] hover:underline"
          >
            ← Use a different email
          </button>
        )
      }
    >
      {step === "init" && (
        <InitStep
          initialEmail={email}
          onExistingUser={(userEmail) => {
            setEmail(userEmail);
            setStep("login");
          }}
          onNewUser={(userEmail) => {
            setEmail(userEmail);
            setStep("register");
          }}
          onSuccess={goToApp}
        />
      )}

      {step === "login" && (
        <LoginStep
          email={email}
          onForgotPassword={() => setStep("forgot-email")}
          onSuccess={goToApp}
        />
      )}

      {step === "register" && <RegisterStep email={email} onSuccess={goToApp} />}

      {step === "forgot-email" && (
        <ForgotPasswordStep
          initialEmail={email}
          onSent={(userEmail) => {
            setEmail(userEmail);
            setStep("forgot-reset");
          }}
        />
      )}

      {step === "forgot-reset" && <ResetPasswordStep email={email} onSuccess={() => setStep("login")} />}
    </AuthShell>
  );
}
