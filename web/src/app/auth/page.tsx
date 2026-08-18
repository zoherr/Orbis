import { AuthFlow } from "@/components/auth/AuthFlow";

export const metadata = {
  title: "Get Started — Orbis | Orbis",
  description: "Create your space or sign back in to your orbit.",
};

export default function AuthPage() {
  return <AuthFlow />;
}
