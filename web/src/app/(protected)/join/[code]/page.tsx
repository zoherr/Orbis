"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FiMic, FiMicOff, FiVideo, FiVideoOff, FiArrowLeft } from "react-icons/fi";
import Link from "next/link";
import toast from "react-hot-toast";
import orbitStore, { Orbit } from "@/store/orbitStore";

export default function JoinLobbyPage() {
  const params = useParams();
  const router = useRouter();
  const { verifyOrbitCode } = orbitStore();
  const code = params.code as string;

  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isJoining, setIsJoining] = useState(false);

  const [orbit, setOrbit] = useState<Orbit | null>(null);
  const [isVerifying, setIsVerifying] = useState(true);
  const [verifyError, setVerifyError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function verify() {
      try {
        const data = await verifyOrbitCode(code);
        if (mounted) {
            
          setOrbit(data);
        }
      } catch (err: any) {
        if (mounted) {
          setVerifyError(err?.message || "Invalid Orbit Code");
          toast.error(err?.message || "Invalid Orbit Code");
          router.push("/");
        }
      } finally {
        if (mounted) setIsVerifying(false);
      }
    }

    if (code) verify();

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  useEffect(() => {
    let mounted = true;

    async function setupMedia() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        if (mounted) {
          setStream(mediaStream);
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
          }
        } else {
          mediaStream.getTracks().forEach((track) => track.stop());
        }
      } catch (err: any) {
        console.error("Failed to get media devices", err);
        toast.error("Could not access camera or microphone.");
        setIsVideoEnabled(false);
        setIsAudioEnabled(false);
      }
    }

    setupMedia();

    return () => {
      mounted = false;
      // Use videoRef to avoid stale closure on stream state
      if (videoRef.current && videoRef.current.srcObject) {
        const s = videoRef.current.srcObject as MediaStream;
        s.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const toggleVideo = async () => {
    if (!stream) return;

    if (isVideoEnabled) {
      stream.getVideoTracks().forEach((track) => {
        track.stop(); // Turn off hardware light
        stream.removeTrack(track);
      });
      setIsVideoEnabled(false);
    } else {
      try {
        const newStream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        newStream.getVideoTracks().forEach((track) => stream.addTrack(track));
        setIsVideoEnabled(true);
      } catch (err) {
        toast.error("Could not access camera");
      }
    }
  };

  const toggleAudio = async () => {
    if (!stream) return;

    if (isAudioEnabled) {
      stream.getAudioTracks().forEach((track) => {
        track.stop(); // Turn off mic hardware
        stream.removeTrack(track);
      });
      setIsAudioEnabled(false);
    } else {
      try {
        const newStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        newStream.getAudioTracks().forEach((track) => stream.addTrack(track));
        setIsAudioEnabled(true);
      } catch (err) {
        toast.error("Could not access microphone");
      }
    }
  };

  const handleJoin = () => {
    if (!orbit?._id) {
      toast.error("Orbit not verified yet");
      return;
    }

    setIsJoining(true);
    router.push(`/orbit/${orbit._id}`);
  };

  return (
    <div className="min-h-screen bg-[#0d172a] text-white flex flex-col font-sans selection:bg-[#d3f625] selection:text-black">
      {/* Header */}
      <header className="flex items-center justify-between p-4 sm:p-6">
        <Link
          href="/spaces"
          className="flex items-center gap-2 text-white/70 hover:text-white transition"
        >
          <FiArrowLeft size={20} />
          <span className="font-semibold">Back to Spaces</span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:flex-row items-center justify-center p-4 sm:p-6 gap-8 sm:gap-12 max-w-7xl mx-auto w-full">
        {/* Left Side - Video Preview */}
        <div className="w-full max-w-3xl flex flex-col items-center">
          <div className="relative w-full aspect-video bg-[#1a2842] rounded-2xl sm:rounded-[2rem] overflow-hidden shadow-2xl border border-white/10">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover transform scale-x-[-1] transition-opacity duration-300 ${isVideoEnabled ? "opacity-100" : "opacity-0"}`}
            />

            {!isVideoEnabled && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#1a2842] z-10">
                <div className="h-16 w-16 sm:h-24 sm:w-24 rounded-full bg-[#0d172a] flex items-center justify-center border border-white/5 mb-4 shadow-inner">
                  <FiVideoOff size={28} className="text-white/40" />
                </div>
                <p className="text-white/60 font-medium text-sm sm:text-base">
                  Camera is off
                </p>
              </div>
            )}

            {/* Audio Indicator */}
            {!isAudioEnabled && (
              <div className="absolute top-4 right-4 bg-red-500/80 backdrop-blur-md text-white p-2 rounded-full shadow-lg">
                <FiMicOff size={16} />
              </div>
            )}
          </div>

          {/* Media Controls */}
          <div className="flex items-center justify-center gap-4 mt-6 sm:mt-8">
            <button
              onClick={toggleAudio}
              className={`flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full transition-all duration-300 shadow-lg border ${
                isAudioEnabled
                  ? "bg-white/10 border-white/10 text-white hover:bg-white/20"
                  : "bg-red-500 border-red-500 text-white hover:bg-red-600"
              }`}
            >
              {isAudioEnabled ? <FiMic size={22} /> : <FiMicOff size={22} />}
            </button>

            <button
              onClick={toggleVideo}
              className={`flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full transition-all duration-300 shadow-lg border ${
                isVideoEnabled
                  ? "bg-white/10 border-white/10 text-white hover:bg-white/20"
                  : "bg-red-500 border-red-500 text-white hover:bg-red-600"
              }`}
            >
              {isVideoEnabled ? (
                <FiVideo size={22} />
              ) : (
                <FiVideoOff size={22} />
              )}
            </button>
          </div>
        </div>

        {/* Right Side - Orbit Info & Join */}
        <div className="w-full max-w-sm flex flex-col items-center lg:items-start text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 mb-6">
            <span
              className={`w-2 h-2 rounded-full ${verifyError ? "bg-red-500" : "bg-[#d3f625] animate-pulse"}`}
            ></span>
            <span className="text-xs font-bold uppercase tracking-wider text-white/80">
              {isVerifying
                ? "Verifying..."
                : verifyError
                  ? "Invalid Orbit"
                  : "Orbit Ready"}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 tracking-tight">
            {verifyError ? "Orbit not found" : orbit?.title || "Ready to join?"}
          </h1>
          <p className="text-white/60 mb-8 font-medium">
            Orbit Code:{" "}
            <span className="font-mono text-white bg-white/10 px-2 py-1 rounded">
              {code}
            </span>
          </p>

          <button
            onClick={handleJoin}
            disabled={isJoining || isVerifying || !!verifyError}
            className="group relative w-full lg:w-auto inline-flex items-center justify-center gap-3 rounded-full bg-[#d3f625] px-8 sm:px-10 py-4 sm:py-5 text-base sm:text-lg font-bold text-[#0d172a] shadow-[0_0_40px_rgba(211,246,37,0.2)] transition-all hover:bg-[#defd5f] hover:shadow-[0_0_60px_rgba(211,246,37,0.3)] hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:hover:scale-100"
          >
            {isJoining ? (
              <>
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#0d172a] border-t-transparent"></div>
                Joining...
              </>
            ) : isVerifying ? (
              <>
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#0d172a] border-t-transparent"></div>
                Verifying...
              </>
            ) : (
              <>
                Join Orbit
                <FiArrowLeft
                  className="rotate-180 transition-transform group-hover:translate-x-1"
                  size={20}
                />
              </>
            )}
          </button>
        </div>
      </main>
    </div>
  );
}