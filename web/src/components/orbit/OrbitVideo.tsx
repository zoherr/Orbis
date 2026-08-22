"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import authStore from "@/store/authStore";
import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash } from "react-icons/fa";

interface OrbitVideoProps {
  orbitId: string;
  wsData: any;
  wsSend: (data: unknown) => void;
  myClientId: string | null;
}

export function OrbitVideo({ orbitId, wsData, wsSend, myClientId }: OrbitVideoProps) {
  const { user } = authStore();
  const myName = user?.fullName || user?.username || "Guest";
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [peers, setPeers] = useState<{ [clientId: string]: { stream: MediaStream; name: string } }>({});
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const peerNames = useRef<{ [clientId: string]: string }>({});
  
  // Store peer connections and their ICE candidates queues
  const peerConnections = useRef<{ [clientId: string]: RTCPeerConnection }>({});
  const iceCandidateQueues = useRef<{ [clientId: string]: RTCIceCandidateInit[] }>({});
  const signalingQueue = useRef<any[]>([]);

  const configuration = {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" }
    ]
  };

  // 1. Get local media
  useEffect(() => {
    let stream: MediaStream | null = null;
    
    async function getMedia() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing media devices.", err);
      }
    }
    getMedia();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const createPeerConnection = useCallback((targetClientId: string) => {
    if (peerConnections.current[targetClientId]) return peerConnections.current[targetClientId];

    const pc = new RTCPeerConnection(configuration);
    peerConnections.current[targetClientId] = pc;

    // Add local tracks
    if (localStream) {
      localStream.getTracks().forEach(track => {
        pc.addTrack(track, localStream);
      });
    }

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        wsSend({
          type: "WEBRTC_ICE_CANDIDATE",
          payload: {
            targetClientId,
            candidate: event.candidate
          }
        });
      }
    };

    pc.ontrack = (event) => {
      setPeers(prev => ({
        ...prev,
        [targetClientId]: {
          stream: event.streams[0],
          name: peerNames.current[targetClientId] || `User ${targetClientId.substring(0, 4)}`
        }
      }));
    };

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed' || pc.connectionState === 'closed') {
        setPeers(prev => {
          const next = { ...prev };
          delete next[targetClientId];
          return next;
        });
        delete peerConnections.current[targetClientId];
      }
    };

    return pc;
  }, [localStream, wsSend]);

  const processIceQueue = async (pc: RTCPeerConnection, targetClientId: string) => {
    const queue = iceCandidateQueues.current[targetClientId];
    if (queue) {
      for (const candidate of queue) {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (e) {
          console.error("Error adding queued ICE candidate", e);
        }
      }
      iceCandidateQueues.current[targetClientId] = [];
    }
  };

  // 2. Handle signaling from WebSocket
  useEffect(() => {
    if (!wsData || !myClientId) return;
    
    // Add to queue
    signalingQueue.current.push(wsData);

  }, [wsData, myClientId]);

  // 3. Process signaling queue when localStream is ready
  useEffect(() => {
    if (!localStream || !myClientId) return;

    const processQueue = async () => {
      while (signalingQueue.current.length > 0) {
        const msg = signalingQueue.current.shift();
        if (!msg) continue;
        
        const { type, data } = msg;

        if (type === "USER_JOINED") {
          const targetClientId = data.clientId;
          if (targetClientId === myClientId) continue;

          const pc = createPeerConnection(targetClientId);
          try {
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            wsSend({
              type: "WEBRTC_OFFER",
              payload: {
                targetClientId,
                offer,
                senderName: myName
              }
            });
          } catch (e) {
            console.error("Error creating offer", e);
          }
        } 
        else if (type === "WEBRTC_OFFER") {
          const { senderId, offer, senderName } = data;
          if (senderName) peerNames.current[senderId] = senderName;
          const pc = createPeerConnection(senderId);
          try {
            await pc.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            
            wsSend({
              type: "WEBRTC_ANSWER",
              payload: {
                targetClientId: senderId,
                answer,
                senderName: myName
              }
            });
            
            processIceQueue(pc, senderId);
          } catch (e) {
            console.error("Error handling offer", e);
          }
        } 
        else if (type === "WEBRTC_ANSWER") {
          const { senderId, answer, senderName } = data;
          if (senderName) peerNames.current[senderId] = senderName;
          const pc = peerConnections.current[senderId];
          if (pc) {
            try {
              await pc.setRemoteDescription(new RTCSessionDescription(answer));
              processIceQueue(pc, senderId);
            } catch (e) {
              console.error("Error handling answer", e);
            }
          }
        } 
        else if (type === "WEBRTC_ICE_CANDIDATE") {
          const { senderId, candidate } = data;
          const pc = peerConnections.current[senderId];
          
          if (pc && pc.remoteDescription) {
            try {
              await pc.addIceCandidate(new RTCIceCandidate(candidate));
            } catch (e) {
              console.error("Error adding ICE candidate", e);
            }
          } else {
            if (!iceCandidateQueues.current[senderId]) {
              iceCandidateQueues.current[senderId] = [];
            }
            iceCandidateQueues.current[senderId].push(candidate);
          }
        }
        else if (type === "USER_LEFT") {
          const targetClientId = data.clientId;
          const pc = peerConnections.current[targetClientId];
          if (pc) {
            pc.close();
            delete peerConnections.current[targetClientId];
            
            setPeers(prev => {
              const next = { ...prev };
              delete next[targetClientId];
              return next;
            });
          }
        }
      }
    };

    processQueue();
  }, [localStream, myClientId, createPeerConnection, wsSend, myName, wsData]);

  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => {
        track.enabled = !isVideoEnabled;
      });
      setIsVideoEnabled(!isVideoEnabled);
    }
  };

  const toggleAudio = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !isAudioEnabled;
      });
      setIsAudioEnabled(!isAudioEnabled);
    }
  };

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-2">
      {/* Local Video */}
      <div className="relative aspect-video bg-black rounded-xl overflow-hidden shadow-lg border border-slate-800">
        <video 
          ref={localVideoRef} 
          autoPlay 
          playsInline 
          muted 
          className="w-full h-full object-cover transform scale-x-[-1]" 
        />
        <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-1 rounded-md text-xs font-semibold text-white backdrop-blur-sm">
          {myName} (You)
        </div>
        <div className="absolute bottom-2 right-2 flex gap-2">
          <button 
            onClick={toggleAudio}
            className={`p-2 rounded-full backdrop-blur-sm transition-colors ${isAudioEnabled ? 'bg-slate-800/80 text-white hover:bg-slate-700' : 'bg-red-500/90 text-white hover:bg-red-600'}`}
          >
            {isAudioEnabled ? <FaMicrophone size={14} /> : <FaMicrophoneSlash size={14} />}
          </button>
          <button 
            onClick={toggleVideo}
            className={`p-2 rounded-full backdrop-blur-sm transition-colors ${isVideoEnabled ? 'bg-slate-800/80 text-white hover:bg-slate-700' : 'bg-red-500/90 text-white hover:bg-red-600'}`}
          >
            {isVideoEnabled ? <FaVideo size={14} /> : <FaVideoSlash size={14} />}
          </button>
        </div>
      </div>

      {/* Remote Videos */}
      {Object.entries(peers).map(([clientId, peerData]) => (
        <div key={clientId} className="relative aspect-video bg-black rounded-xl overflow-hidden shadow-lg border border-slate-800">
          <video 
            autoPlay 
            playsInline 
            className="w-full h-full object-cover" 
            ref={el => {
              if (el && el.srcObject !== peerData.stream) {
                el.srcObject = peerData.stream;
              }
            }}
          />
          <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-1 rounded-md text-xs font-semibold text-white backdrop-blur-sm shadow-sm">
            {peerData.name}
          </div>
        </div>
      ))}
    </div>
  );
}
