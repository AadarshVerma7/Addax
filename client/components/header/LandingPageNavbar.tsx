"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import Logo from "../../public/logo.png";
import { useAuth } from "../../context/AuthContext";
import defaultProfileImage from "../../assets/user/userDefaultProfileImage.png"

function LandingPageNavbar() {
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

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 md:px-16 lg:px-24 transition-colors duration-300">
            {/* Logo */}
            <div className="flex items-center gap-2 text-xl font-semibold tracking-tight">
                <Image
                    src={Logo}
                    alt="Addax"
                    width={48}
                    height={48}
                    className="h-12 w-auto"
                    priority
                />

                <p
                    className={`font-mono font-semibold transition-colors duration-300 ${isTop ? "text-white" : "text-black"
                        }`}
                >
                    Addax
                </p>
            </div>

            {/* Navigation */}
            <ul
                className={`hidden md:flex items-center gap-10 text-sm font-medium transition-colors duration-300 ${isTop ? "text-white" : "text-black"
                    }`}
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
                                className={`text-sm font-medium transition-colors duration-300 ${isTop ? "text-white" : "text-black"
                                    }`}
                            >
                                {user.name}
                            </span>
                        </button>

                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden">
                                <div className="px-4 py-3 border-b border-gray-100">
                                    <p className="text-sm font-semibold text-gray-900 truncate">
                                        {user.name}
                                    </p>
                                    {/* <p className="text-xs text-gray-500 truncate">
                                        {user.email}
                                    </p> */}
                                </div>

                                <button
                                    onClick={() => {
                                        setDropdownOpen(false);
                                        logout();
                                    }}
                                    className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-gray-50 transition-colors"
                                >
                                    Logout
                                </button>
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