"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Logo from "../../public/logo.png";
import { PanelRightOpen, PanelRightClose } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

function SideBar() {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState<boolean | null>(null);

    useEffect(() => {
        const saved = localStorage.getItem("sidebar-open");
        setIsOpen(saved ? saved === "true" : true);
    }, []);

    useEffect(() => {
        if (isOpen !== null) {
            localStorage.setItem("sidebar-open", String(isOpen));
        }
    }, [isOpen]);

    if (isOpen === null) return null;

    return (
        <>
            <style jsx>{`
        .sidebar-scroll {
          scrollbar-width: thin;
          scrollbar-color: #27272a transparent;
        }

        .sidebar-scroll::-webkit-scrollbar {
          width: 6px;
        }

        .sidebar-scroll::-webkit-scrollbar-track {
          background: transparent;
        }

        .sidebar-scroll::-webkit-scrollbar-thumb {
          background-color: #27272a;
          border-radius: 9999px;
        }

        .sidebar-scroll::-webkit-scrollbar-thumb:hover {
          background-color: #52525b;
        }
      `}</style>

            <div
                className={`flex h-screen flex-col bg-black transition-all duration-300 ${isOpen ? "w-64 border-r border-zinc-700" : "w-16"
                    }`}
            >
                {/* Header */}
                <div
                    className={`flex items-center ${isOpen ? "justify-between p-4" : "justify-center py-4"
                        }`}
                >
                    {isOpen && (
                        <Link href="/" className="flex items-center gap-2">
                            <Image
                                src={Logo}
                                alt="Addax"
                                width={48}
                                height={48}
                                className="h-12 w-auto"
                                priority
                            />

                            <h1 className="font-mono text-3xl font-semibold text-white">
                                Addax
                            </h1>
                        </Link>
                    )}

                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="rounded-md p-1 transition hover:bg-zinc-800"
                    >
                        {isOpen ? (
                            <PanelRightOpen size={24} className="text-white" />
                        ) : (
                            < PanelRightClose size={24} className="text-white" />
                        )}
                    </button>
                </div>

                {/* Conversations */}
                {isOpen && (
                    <div className="sidebar-scroll flex-1 overflow-y-auto px-4">
                        <h2 className="mb-4 text-lg font-semibold text-zinc-400">
                            Conversations
                        </h2>

                        {Array.from({ length: 15 }).map((_, index) => (
                            <div
                                key={index}
                                className="mb-2 cursor-pointer rounded-lg px-3 py-2 text-zinc-300 transition hover:bg-zinc-800"
                            >
                                Conversation {index + 1}
                            </div>
                        ))}
                    </div>
                )}

                {/* User Profile */}
                {isOpen && user && (
                    <div className="border-t border-zinc-700 p-4">
                        <div className="flex items-center gap-3">
                            <div className="relative h-10 w-10 overflow-hidden rounded-full">
                                <Image
                                    src={user.image || "/default-avatar.png"}
                                    alt={user.name || "User"}
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            <div className="flex flex-col">
                                <span className="font-medium text-white">
                                    {user.name.split(" ")[0]}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default SideBar;