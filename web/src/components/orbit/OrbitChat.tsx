"use client";

import { useState, useEffect, useRef } from "react";
import { useWebSocket } from "@/hooks/useWebSocket";
import { IoSend } from "react-icons/io5";
import authStore from "@/store/authStore";

interface ChatMessage {
  senderId: string;
  senderName?: string;
  text: string;
  timestamp: string;
  isMe?: boolean;
}

interface OrbitChatProps {
  orbitId: string;
  wsData: any;
  wsSend: (data: unknown) => void;
  wsStatus: string;
  myClientId: string | null;
}

export function OrbitChat({ orbitId, wsData, wsSend, wsStatus, myClientId }: OrbitChatProps) {
  const { user } = authStore();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (wsData) {
      if (wsData.type === "CHAT_MESSAGE") {
        const newMessage = {
          ...wsData.data,
          isMe: wsData.data.senderId === myClientId
        };
        setMessages((prev) => [...prev, newMessage]);
      }
    }
  }, [wsData, myClientId]);

  // OrbitView handles LEAVE_ORBIT on unmount now

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    wsSend({
      type: "CHAT",
      payload: {
        orbitId,
        text: inputText.trim(),
        senderName: user?.username || user?.fullName || "Guest"
      }
    });

    setInputText("");
  };

  return (
    <div className="flex flex-col h-full bg-[#1e293b] rounded-xl overflow-hidden border border-slate-700 shadow-2xl">
      <div className="p-4 border-b border-slate-700 bg-slate-800/50 flex items-center justify-between">
        <h3 className="font-semibold text-lg text-white">Orbit Chat</h3>
        <div className="flex items-center gap-2">
          <div 
            className={`w-2.5 h-2.5 rounded-full ${wsStatus === 'OPEN' ? 'bg-emerald-500' : 'bg-red-500'}`} 
            title={`Status: ${wsStatus}`} 
          />
          <span className="text-xs text-slate-400 capitalize">{wsStatus.toLowerCase()}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-slate-500 text-sm">
            No messages yet. Be the first to say hi!
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}>
              {!msg.isMe && (
                <span className="text-xs text-slate-400 mb-1 px-1">
                  {msg.senderName || `User ${msg.senderId?.substring(0, 4)}`}
                </span>
              )}
              <div 
                className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${
                  msg.isMe 
                    ? 'bg-blue-600 text-white rounded-br-none' 
                    : 'bg-slate-700 text-slate-200 rounded-bl-none'
                }`}
              >
                {msg.text}
              </div>
              <span className="text-[10px] text-slate-500 mt-1 px-1">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 bg-slate-800 border-t border-slate-700">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-slate-900 text-white text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500 border border-slate-700 placeholder-slate-500"
            disabled={wsStatus !== 'OPEN'}
          />
          <button
            type="submit"
            disabled={!inputText.trim() || wsStatus !== 'OPEN'}
            className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white p-2.5 rounded-lg transition-colors flex items-center justify-center"
          >
            <IoSend size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
