"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Logo from "../../public/logo.png";
import { 
  PanelRightOpen, 
  PanelRightClose, 
  MessageSquare, 
  Plus, 
  MoreVertical,
  Sparkles,
  User,
  Settings,
  HelpCircle,
  LogOut,
  Trash2
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/ToastContext";


function SideBarContent() {
    const { user, logout } = useAuth();
    const { showToast } = useToast();
    const searchParams = useSearchParams();
    const [isOpen, setIsOpen] = useState<boolean | null>(null);
    const [conversations, setConversations] = useState<any[]>([]);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
    const userDropdownRef = useRef<HTMLDivElement>(null);

    const handleDeleteConversation = async (conversationId: string) => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/conversations/${conversationId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const data = await res.json();
            if (data.success) {
                setConversations((prev) => prev.filter((c) => c.id !== conversationId));
                showToast("Conversation deleted successfully.", "success");
                
                const currentUrl = searchParams.get("url");
                const deletedConv = conversations.find(c => c.id === conversationId);
                if (deletedConv && currentUrl === deletedConv.video?.url) {
                    window.location.href = "/videosummary";
                }
            } else {
                showToast(data.message || "Failed to delete conversation", "error");
            }
        } catch (err) {
            console.error("Error deleting conversation:", err);
            showToast("An error occurred while deleting the conversation.", "error");
        }
    };


    useEffect(() => {
        const saved = localStorage.getItem("sidebar-open");
        setIsOpen(saved ? saved === "true" : true);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                userDropdownRef.current &&
                !userDropdownRef.current.contains(event.target as Node)
            ) {
                setUserDropdownOpen(false);
            }
            const target = event.target as HTMLElement;
            if (!target.closest(".conv-item-container")) {
                setActiveMenuId(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
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

        const handleRefetch = () => {
            if (user) {
                fetchConversations();
            }
        };

        window.addEventListener("refetchConversations", handleRefetch);
        return () => {
            window.removeEventListener("refetchConversations", handleRefetch);
        };
    }, [user, searchParams]);

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

            {/* Mobile Header Bar (Only visible on mobile when sidebar is closed) */}
            {!isOpen && (
                <div className="flex items-center justify-between bg-zinc-950 px-4 py-3 border-b border-zinc-800 lg:hidden w-full shrink-0">
                    <button 
                        onClick={() => setIsOpen(true)} 
                        className="flex items-center justify-center p-1.5 rounded-md text-zinc-400 hover:bg-zinc-800 hover:text-white transition"
                    >
                        <PanelRightClose size={20} />
                    </button>
                    <div className="flex items-center gap-2">
                        <Image
                            src={Logo}
                            alt="Addax"
                            width={24}
                            height={24}
                            className="h-6 w-auto"
                            priority
                        />
                        <span className="font-mono text-sm text-white font-semibold">Addax</span>
                    </div>
                    {user ? (
                        <div className="relative h-6 w-6 overflow-hidden rounded-full bg-zinc-800">
                            <Image
                                src={user.image || "/default-avatar.png"}
                                alt={user.name || "User"}
                                fill
                                className="object-cover"
                            />
                        </div>
                    ) : (
                        <div className="w-6" />
                    )}
                </div>
            )}

            {/* Sidebar overlay backdrop for mobile */}
            {isOpen && (
                <div 
                    className="fixed inset-0 z-35 bg-black/60 backdrop-blur-xs lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <div
                className={`flex h-screen flex-col bg-black transition-all duration-300 
                fixed inset-y-0 left-0 z-40 lg:relative lg:translate-x-0 lg:z-auto
                ${isOpen 
                    ? "w-64 border-r border-zinc-800 translate-x-0" 
                    : "w-0 -translate-x-full overflow-hidden lg:w-16 lg:translate-x-0 lg:border-r lg:border-zinc-800/40"
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
                            conversations.map((conv) => {
                                const isMenuOpen = activeMenuId === conv.id;
                                return (
                                    <div key={conv.id} className="relative group/item conv-item-container">
                                        <Link
                                            href={`/videosummary/chat?url=${encodeURIComponent(conv.video?.url || "")}`}
                                            className="group flex cursor-pointer items-center justify-between rounded-md px-2 py-2 text-sm text-zinc-400 transition hover:bg-zinc-800/50 hover:text-zinc-100 pr-8"
                                        >
                                            <div className="flex items-center gap-2 min-w-0">
                                                <MessageSquare size={14} className="shrink-0 text-zinc-500 group-hover:text-zinc-400" />
                                                <span className="truncate" title={conv.title || conv.video?.title || "New Conversation"}>
                                                    {conv.title || conv.video?.title || "New Conversation"}
                                                </span>
                                            </div>
                                        </Link>

                                        {/* Settings dots */}
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setActiveMenuId(isMenuOpen ? null : conv.id);
                                            }}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 hidden group-hover/item:flex items-center justify-center h-6 w-6 rounded-md hover:bg-zinc-700 text-zinc-500 hover:text-zinc-200 transition-all cursor-pointer border-none outline-none"
                                            title="Settings"
                                        >
                                            <MoreVertical size={14} />
                                        </button>

                                        {/* Settings Dropdown */}
                                        {isMenuOpen && (
                                            <div className="absolute right-2 top-[80%] mt-1 bg-zinc-950 border border-zinc-850 rounded-lg shadow-2xl py-1 z-50 min-w-[120px]">
                                                <button
                                                    type="button"
                                                    onClick={async (e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        setActiveMenuId(null);
                                                        await handleDeleteConversation(conv.id);
                                                    }}
                                                    className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-red-400 hover:bg-red-950/20 hover:text-red-300 transition-colors text-left border-none outline-none cursor-pointer"
                                                >
                                                    <Trash2 size={12} className="shrink-0" />
                                                    <span>Delete</span>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        ) : (
                            <p className="px-2 text-xs text-zinc-600">No recent conversations.</p>
                        )}
                    </div>
                )}

                {/* User Profile (Compact) */}
                {user && (
                    <div className="mt-auto border-t border-zinc-800/50 p-2 relative" ref={userDropdownRef}>
                        {/* Dropdown Menu */}
                        {userDropdownOpen && (
                            <div className={`absolute left-2 bottom-full mb-2 bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden py-1.5 z-50 transition-all duration-200 ${isOpen ? "w-60" : "w-12 left-2"}`}>
                                {isOpen ? (
                                    <>
                                        <div className="px-3 py-2 border-b border-zinc-800/60 mb-1">
                                            <p className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">Account</p>
                                            <p className="text-xs font-medium text-zinc-200 truncate mt-0.5">{user.name}</p>
                                            <p className="text-[10px] text-zinc-500 truncate">{user.email}</p>
                                        </div>
                                        {/* <button
                                            onClick={() => setUserDropdownOpen(false)}
                                            className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-900 transition-colors text-left"
                                        >
                                            <Sparkles size={14} className="text-amber-400 shrink-0" />
                                            <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">Upgrade to Pro</span>
                                        </button> */}
                                        {/* <button
                                            onClick={() => setUserDropdownOpen(false)}
                                            className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-900 transition-colors text-left"
                                        >
                                            <User size={14} className="text-zinc-500 shrink-0" />
                                            <span>My Profile</span>
                                        </button> */}
                                        {/* <button
                                            onClick={() => setUserDropdownOpen(false)}
                                            className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-900 transition-colors text-left"
                                        >
                                            <Settings size={14} className="text-zinc-500 shrink-0" />
                                            <span>Settings</span>
                                        </button> */}
                                        {/* <button
                                            onClick={() => setUserDropdownOpen(false)}
                                            className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-900 transition-colors text-left border-b border-zinc-800/60 pb-2 mb-1"
                                        >
                                            <HelpCircle size={14} className="text-zinc-500 shrink-0" />
                                            <span>Help & Support</span>
                                        </button> */}
                                        <button
                                            onClick={() => {
                                                setUserDropdownOpen(false);
                                                logout();
                                            }}
                                            className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-red-400 hover:bg-red-950/20 hover:text-red-300 transition-colors text-left"
                                        >
                                            <LogOut size={14} className="text-red-400 shrink-0" />
                                            <span>Log out</span>
                                        </button>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center gap-1.5 py-1">
                                        <button
                                            onClick={() => setUserDropdownOpen(false)}
                                            title="Upgrade to Pro"
                                            className="flex h-8 w-8 items-center justify-center rounded-md text-amber-400 hover:bg-zinc-900 transition"
                                        >
                                            <Sparkles size={16} />
                                        </button>
                                        <button
                                            onClick={() => setUserDropdownOpen(false)}
                                            title="My Profile"
                                            className="flex h-8 w-8 items-center justify-center rounded-md text-zinc-400 hover:bg-zinc-900 transition"
                                        >
                                            <User size={16} />
                                        </button>
                                        <button
                                            onClick={() => setUserDropdownOpen(false)}
                                            title="Settings"
                                            className="flex h-8 w-8 items-center justify-center rounded-md text-zinc-400 hover:bg-zinc-900 transition"
                                        >
                                            <Settings size={16} />
                                        </button>
                                        <button
                                            onClick={() => {
                                                setUserDropdownOpen(false);
                                                logout();
                                            }}
                                            title="Log out"
                                            className="flex h-8 w-8 items-center justify-center rounded-md text-red-400 hover:bg-red-950/20 transition"
                                        >
                                            <LogOut size={16} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {isOpen ? (
                            <button 
                                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                                className="flex w-full items-center justify-between rounded-lg px-2 py-1.5 transition hover:bg-zinc-800/50"
                            >
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
                                <MoreVertical size={16} className="text-zinc-500 shrink-0" />
                            </button>
                        ) : (
                            <div className="flex justify-center py-2">
                                <button
                                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                                    className="relative h-8 w-8 overflow-hidden rounded-full bg-zinc-800 transition hover:opacity-80 cursor-pointer focus:outline-none"
                                >
                                    <Image
                                        src={user.image || "/default-avatar.png"}
                                        alt={user.name || "User"}
                                        fill
                                        className="object-cover"
                                    />
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}

function SideBar() {
    return (
        <Suspense fallback={null}>
            <SideBarContent />
        </Suspense>
    );
}

export default SideBar;