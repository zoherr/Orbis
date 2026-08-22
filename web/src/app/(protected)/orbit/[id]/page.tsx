"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import orbitStore from "@/store/orbitStore";

export default function OrbitPage() {
  const params = useParams();
  const router = useRouter();
  const orbitId = params.id as string;

  const { joinOrbit, currentOrbit } = orbitStore();
  const [isJoiningOrbit, setIsJoiningOrbit] = useState(false);
  const [hasJoinedOrbit, setHasJoinedOrbit] = useState(false);

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
    <div className="min-h-screen bg-[#0d172a] text-white flex flex-col items-center justify-center gap-6 p-6">
      <h1 className="text-3xl font-bold text-center">
        {isJoiningOrbit ? "Joining Orbit..." : currentOrbit?.title || "Orbit"}
      </h1>
    </div>
  );
}