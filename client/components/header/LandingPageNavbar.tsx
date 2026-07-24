"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Logo from "../../public/logo.png";

function LandingPageNavbar() {
    const [isTop, setIsTop] = useState(true);

    useEffect(() => {
        const handleScroll = () => {
            setIsTop(window.scrollY < 1200);
        };

        handleScroll(); // Set initial state
        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navlinks = {
        Home: "/",
        About: "/about",
        Services: "/services",
        Blog: "/blog",
        Contact: "/contact",
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 md:px-16 lg:px-24 transition-colors duration-300">
            <div className="flex items-center gap-2 text-xl font-semibold tracking-tight">
                <img
                    className="h-12"
                    src={Logo.src}
                    alt="Addax"
                />
                <p
                    className={`font-mono font-semibold transition-colors duration-300 ${
                        isTop ? "text-white" : "text-black"
                    }`}
                >
                    Addax
                </p>
            </div>

            <ul
                className={`hidden md:flex gap-10 text-sm font-medium transition-colors duration-300 ${
                    isTop ? "text-white" : "text-black"
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
            </ul>
        </nav>
    );
}

export default LandingPageNavbar;