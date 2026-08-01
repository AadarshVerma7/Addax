"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Logo from "../../public/logo.png";
import { 
  PanelRightOpen, 
  PanelRightClose, 
  MessageSquare, 
  Plus, 
  MoreHorizontal 
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

function SideBar() {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState<boolean | null>(null);
    const [conversations, setConversations] = useState<any[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem("sidebar-open");
        setIsOpen(saved ? saved === "true" : true);
    }, []);

    useEffect(() => {
        if (isOpen !== null) {
            localStorage.setItem("sidebar-open", String(isOpen));
        }
    }, [isOpen]);

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/conversations`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const data = await res.json();
                if (data.success) {
                    setConversations(data.conversations || []);
                }
            } catch (err) {
                console.error("Failed to fetch conversations", err);
            }
        };

        if (user) {
            fetchConversations();
        }
    }, [user]);

    if (isOpen === null) return null;

    return (
        <>
            <style jsx>{`
        .sidebar-scroll {
          scrollbar-width: thin;
          scrollbar-color: #27272a transparent;
        }
        .sidebar-scroll::-webkit-scrollbar {
          width: 4px;
        }
        .sidebar-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .sidebar-scroll::-webkit-scrollbar-thumb {
          background-color: #27272a;
          border-radius: 9999px;
        }
        .sidebar-scroll::-webkit-scrollbar-thumb:hover {
          background-color: #3f3f46;
        }
      `}</style>

            <div
                className={`flex h-screen flex-col bg-black transition-all duration-300 ${
                    isOpen ? "w-64 border-r border-zinc-800" : "w-16"
                }`}
            >
                {/* Header */}
                <div
                    className={`flex items-center ${
                        isOpen ? "justify-between p-3" : "justify-center py-4"
                    }`}
                >
                    {isOpen && (
                        <Link href="/" className="flex items-center gap-2 px-1">
                            <Image
                                src={Logo}
                                alt="Addax"
                                width={32}
                                height={32}
                                className="h-8 w-auto"
                                priority
                            />
                            <h1 className="font-mono text-xl font-semibold tracking-tight text-white">
                                Addax
                            </h1>
                        </Link>
                    )}

                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex h-8 w-8 items-center justify-center rounded-md text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
                        aria-label="Toggle Sidebar"
                    >
                        {isOpen ? (
                            <PanelRightOpen size={20} />
                        ) : (
                            <PanelRightClose size={20} />
                        )}
                    </button>
                </div>

                {/* New Chat Button */}
                {isOpen && (
                    <div className="px-3 pb-3 pt-1">
                        <Link href={'/videosummary'} className="flex w-full items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-sm font-medium text-white transition hover:bg-white/15">
                            <Plus size={16} />
                            New chat
                        </Link>
                    </div>
                )}

                {/* Conversations */}
                {isOpen && (
                    <div className="sidebar-scroll flex-1 overflow-y-auto px-3">
                        <h2 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                            Recent
                        </h2>

                        {conversations.length > 0 ? (
                            conversations.map((conv) => (
                                <Link
                                    key={conv.id}
                                    href={`/videosummary/chat?url=${encodeURIComponent(conv.video?.url || "")}`}
                                    className="group flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm text-zinc-400 transition hover:bg-zinc-800/50 hover:text-zinc-100"
                                >
                                    <MessageSquare size={14} className="shrink-0 text-zinc-500 group-hover:text-zinc-400" />
                                    <span className="truncate" title={conv.title || conv.video?.title || "New Conversation"}>
                                        {conv.title || conv.video?.title || "New Conversation"}
                                    </span>
                                </Link>
                            ))
                        ) : (
                            <p className="px-2 text-xs text-zinc-600">No recent conversations.</p>
                        )}
                    </div>
                )}

                {/* User Profile (Compact) */}
                {user && (
                    <div className="mt-auto border-t border-zinc-800/50 p-2">
                        {isOpen ? (
                            <button className="flex w-full items-center justify-between rounded-lg px-2 py-1.5 transition hover:bg-zinc-800/50">
                                <div className="flex items-center gap-2 overflow-hidden">
                                    <div className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full bg-zinc-800">
                                        <Image
                                            src={user.image || "/default-avatar.png"}
                                            alt={user.name || "User"}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <span className="truncate text-sm font-medium text-zinc-300">
                                        {user.name}
                                    </span>
                                </div>
                                <MoreHorizontal size={16} className="text-zinc-500 shrink-0" />
                            </button>
                        ) : (
                            <div className="flex justify-center py-2">
                                <div className="relative h-8 w-8 overflow-hidden rounded-full bg-zinc-800 transition hover:opacity-80 cursor-pointer">
                                    <Image
                                        src={user.image || "/default-avatar.png"}
                                        alt={user.name || "User"}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}

export default SideBar;