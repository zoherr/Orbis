import { OrbitView } from "@/components/orbit/OrbitView";
import { useWebSocket } from "@/hooks/useWebSocket";

export default async function OrbitPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <OrbitView orbitId={id} />;
}