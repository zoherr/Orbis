import { AuthFlow } from "@/components/auth/AuthFlow";

export const metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: "Get Started — Orbis | Orbis",
  description: "Create your space or sign back in to your orbit.",
  alternates: {
    canonical: "/get-started",
  },
};

export default function GetStartedPage() {
  return <AuthFlow />;
}
