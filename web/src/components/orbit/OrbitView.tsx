"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import orbitStore from "@/store/orbitStore";
import { OrbitChat } from "./OrbitChat";
import { OrbitVideo } from "./OrbitVideo";
import { useWebSocket } from "@/hooks/useWebSocket";

export function OrbitView({ orbitId }: { orbitId: string }) {
  const router = useRouter();

  const { joinOrbit, currentOrbit } = orbitStore();
  const [isJoiningOrbit, setIsJoiningOrbit] = useState(false);
  const [hasJoinedOrbit, setHasJoinedOrbit] = useState(false);
  const [myClientId, setMyClientId] = useState<string | null>(null);

  const { status: wsStatus, send: wsSend, data: wsData } = useWebSocket<{
    type: string;
    data: any;
  }>({
    url: "",
    reconnect: true,
  });

  useEffect(() => {
    if (wsData?.type === "WELCOME") {
      setMyClientId(wsData.data.clientId);
      wsSend({
        type: "JOIN_ORBIT",
        payload: { orbitId }
      });
    }
  }, [wsData, wsSend, orbitId]);

  useEffect(() => {
    return () => {
      if (wsStatus === "OPEN") {
        wsSend({
          type: "LEAVE_ORBIT",
          payload: { orbitId }
        });
      }
    };
  }, [wsStatus, wsSend, orbitId]);

  const handleJoinOrbit = async () => {
    setIsJoiningOrbit(true);
    try {
      const orbitData = await joinOrbit({ id: orbitId });
      if (!orbitData) {
        toast.error("Invalid orbit");
        router.push("/");
        return;
      }
      toast.success("Joined Orbit Successfully!");
      setHasJoinedOrbit(true);
    } catch (err: any) {
      toast.error(err?.message || "Failed to join orbit");
      router.push("/");
    } finally {
      setIsJoiningOrbit(false);
    }
  };

  const hasJoinedRef = useRef(false);

  useEffect(() => {
    if (!hasJoinedRef.current) {
      hasJoinedRef.current = true;
      handleJoinOrbit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-[#0d172a] text-white flex">
      {/* Main Orbit Content Area */}
      <div className="flex-1 flex flex-col p-6 overflow-hidden">
        <h1 className="text-3xl font-bold mb-6">
          {isJoiningOrbit ? "Joining Orbit..." : currentOrbit?.title || "Orbit"}
        </h1>
        {hasJoinedOrbit && (
          <div className="flex-1 min-h-0 overflow-y-auto">
            <OrbitVideo
              orbitId={orbitId}
              wsData={wsData}
              wsSend={wsSend}
              myClientId={myClientId}
            />
          </div>
        )}
      </div>

      {/* Sidebar Chat Area */}
      {hasJoinedOrbit && (
        <div className="w-[350px] lg:w-[400px] bg-[#0d172a] border-l border-slate-800 p-4 shrink-0 h-screen overflow-hidden">
          <OrbitChat
            orbitId={orbitId}
            wsData={wsData}
            wsSend={wsSend}
            wsStatus={wsStatus}
            myClientId={myClientId}
          />
        </div>
      )}
    </div>
  );
}
