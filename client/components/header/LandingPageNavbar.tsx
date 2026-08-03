"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import Logo from "../../public/logo.png";
import { useAuth } from "../../context/AuthContext";
import defaultProfileImage from "../../assets/user/userDefaultProfileImage.png";
import { LayoutDashboard, User, Settings, HelpCircle, LogOut } from "lucide-react";

interface LandingPageNavbarProps {
    theme?: "dark" | "light";
}

function LandingPageNavbar({ theme = "dark" }: LandingPageNavbarProps) {
    const [isTop, setIsTop] = useState(true);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { user, logout } = useAuth();
    const dropdownRef = useRef<HTMLLIElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            setIsTop(window.scrollY < 800);
        };

        handleScroll();
        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const navlinks = {
        Home: "/",
        About: "/about",
        Contact: "/contact",
    };

    const isNavbarDark = theme === "dark" && isTop;
    const textColor = isNavbarDark ? "text-white" : "text-black";

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 md:px-16 lg:px-24 transition-colors duration-300">
            {/* Logo */}
            <Link href={'/'} className="flex items-center gap-2 text-xl font-semibold tracking-tight">
                <Image
                    src={Logo}
                    alt="Addax"
                    width={48}
                    height={48}
                    className="h-12 w-auto"
                    priority
                />

                <p
                    className={`font-mono font-semibold transition-colors duration-300 ${textColor}`}
                >
                    Addax
                </p>
            </Link>

            {/* Navigation */}
            <ul
                className={`hidden md:flex items-center gap-10 text-sm font-medium transition-colors duration-300 ${textColor}`}
            >
                {Object.entries(navlinks).map(([label, href]) => (
                    <li key={label}>
                        <Link
                            href={href}
                            className="transition-colors hover:text-blue-600"
                        >
                            {label}
                        </Link>
                    </li>
                ))}

                {user ? (
                    <li className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setDropdownOpen((prev) => !prev)}
                            className="flex items-center gap-1 focus:outline-none"
                        >
                            <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-transparent hover:border-blue-500 transition-all">
                                <Image
                                    src={user.image || defaultProfileImage}
                                    alt={user.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            <span
                                className={`text-sm font-medium transition-colors duration-300 ${textColor}`}
                            >
                                {user.name}
                            </span>
                        </button>

                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden text-gray-700">
                                <div className="px-4 py-3 border-b border-gray-100">
                                    <p className="text-sm font-semibold text-gray-900 truncate">
                                        {user.name}
                                    </p>
                                    <p className="text-xs text-gray-400 truncate">
                                        {user.email}
                                    </p>
                                </div>

                                <div className="py-1">
                                    <Link
                                        href="/videosummary"
                                        onClick={() => setDropdownOpen(false)}
                                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        <LayoutDashboard size={15} className="text-gray-500" />
                                        <span>Dashboard</span>
                                    </Link>

                                    {/* <button
                                        onClick={() => setDropdownOpen(false)}
                                        className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
                                    >
                                        <User size={15} className="text-gray-500" />
                                        <span>My Profile</span>
                                    </button> */}

                                    {/* <button
                                        onClick={() => setDropdownOpen(false)}
                                        className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
                                    >
                                        <Settings size={15} className="text-gray-500" />
                                        <span>Settings</span>
                                    </button> */}

                                    {/* <button
                                        onClick={() => setDropdownOpen(false)}
                                        className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left border-b border-gray-100 pb-2 mb-1"
                                    >
                                        <HelpCircle size={15} className="text-gray-500" />
                                        <span>Help & FAQ</span>
                                    </button> */}

                                    <button
                                        onClick={() => {
                                            setDropdownOpen(false);
                                            logout();
                                        }}
                                        className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                                    >
                                        <LogOut size={15} className="text-red-500" />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </li>
                ) : (
                    <li>
                        <Link
                            href="/auth/login"
                            className="transition-colors hover:text-blue-600"
                        >
                            Login
                        </Link>
                    </li>
                )}
            </ul>
        </nav>
    );
}

export default LandingPageNavbar;