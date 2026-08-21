"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useAppAuth } from "@/components/providers/AppAuthProvider";
import { 
  FiHome, 
  FiCalendar, 
  FiMessageSquare,
  FiVideo,
  FiUsers,
  FiSettings 
} from "react-icons/fi";

export function AppSidebar() {
  const { user } = useAppAuth();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const mainNav = [
    { name: "Dashboard", href: "/spaces", icon: FiHome },
    { name: "Meetings", href: "#", icon: FiVideo },
    { name: "Calendar", href: "#", icon: FiCalendar },
    { name: "Chat", href: "#", icon: FiMessageSquare },
    { name: "Contacts", href: "#", icon: FiUsers },
    { name: "Settings", href: "#", icon: FiSettings },
  ];

  const mySpaces = [
    { name: "NovaOps Workspace", members: "12 online", bg: "bg-[#084ba7]" },
    { name: "Design Team", members: "4 online", bg: "bg-[#5fa3ff]" },
    { name: "Marketing Q3", members: "", bg: "bg-transparent", icon: true },
  ];

  const directMessages = [
    { name: "Liam Smith", status: "online", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Liam" },
    { name: "Sarah Jenkins", status: "offline", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" },
    { name: "Maya Patel", status: "online", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maya" },
  ];

  return (
    <>
      <div className="md:hidden flex items-center justify-between bg-[#f0f2f5] p-4 border-b border-[#dfe7f3] shrink-0">
        <Link href="/">
          <Image
            src="/logo.png"
            alt="Orbis logo"
            width={90}
            height={32}
            className="h-8 w-auto object-contain"
          />
        </Link>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-[#0d172a] hover:bg-white rounded-md"
        >
          {isMobileMenuOpen ? "✕" : "☰"}
        </button>
      </div>

      <aside
        className={`${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 fixed md:static inset-y-0 left-0 z-40 flex w-64 flex-col bg-[#f0f2f5] transition-transform duration-200 ease-in-out font-sans text-[#1c2331]`}
      >
        <div className="flex flex-col p-6 shrink-0 gap-6">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="Orbis logo"
              width={110}
              height={38}
              priority
              className="h-9 w-auto object-contain"
            />
          </Link>
          
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-[#e2e8f0] overflow-hidden flex items-center justify-center shrink-0 border border-[#cbd5e1]">
               <img src={user?.profileImage || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.fullName || 'Alex'}`} alt="Avatar" className="h-full w-full object-cover" />
            </div>
            <span className="font-semibold text-sm">Work</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-8 space-y-8">
          <nav className="space-y-1">
            {mainNav.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[#d3f625] text-[#0d172a]"
                      : "text-[#4b5563] hover:bg-[#e2e6eb]"
                  }`}
                >
                  <Icon className="text-lg" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div>
            <h3 className="px-4 text-[10px] font-bold uppercase tracking-wider text-[#6b7280] mb-3">
              WORKSPACES
            </h3>
            <div className="space-y-1">
              {mySpaces.map((space, i) => (
                <div key={i} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl cursor-pointer ${i === 0 ? "bg-white shadow-sm" : "hover:bg-[#e2e6eb]"}`}>
                  {space.icon ? (
                    <div className="h-8 w-8 rounded-lg flex items-center justify-center text-[#6b7280] border border-dashed border-[#9ca3af]">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
                    </div>
                  ) : (
                    <div className={`h-8 w-8 rounded-lg ${space.bg} shrink-0 opacity-80`} />
                  )}
                  <div>
                    <div className="text-sm font-semibold">{space.name}</div>
                    {space.members && <div className="text-[10px] text-[#6b7280]">{space.members}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="px-4 text-[10px] font-bold uppercase tracking-wider text-[#6b7280] mb-3">
              DIRECT MESSAGES
            </h3>
            <div className="space-y-1">
              {directMessages.map((friend) => (
                <div key={friend.name} className="flex items-center gap-3 px-4 py-2 rounded-xl cursor-pointer hover:bg-[#e2e6eb]">
                   <div className="relative h-8 w-8 rounded-full overflow-hidden shrink-0 bg-gray-200">
                     <img src={friend.img} alt={friend.name} className="h-full w-full object-cover" />
                     {friend.status === 'online' && (
                       <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-[#f0f2f5]" />
                     )}
                   </div>
                   <div className="text-sm font-semibold">{friend.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>
      
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/20 md:hidden" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
