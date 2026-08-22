import { JoinOrbitView } from "@/components/orbit/JoinOrbitView";

export default async function JoinPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  return <JoinOrbitView code={code} />;
}