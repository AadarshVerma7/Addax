"use client";

import Image from "next/image";
import Link from "next/link";

const footerLinks = [

    {
        title: "Quick Links",
        links: [
            { name: "Home", href: "/" },
            { name: "About", href: "/about" },
            // { name: "Services", href: "/services" },
            // { name: "Blog", href: "#" },
            { name: "Careers", href: "#" },
        ],
    },
    {
        title: "Resources",
        links: [
            { name: "Help", href: "#" },
            { name: "Contact", href: "#" },
            { name: "FAQs", href: "#" },
            { name: "Privacy", href: "#" },
        ],
    },
];

export default function Footer() {
    return (
        <footer className="w-full border-t border-gray-200 bg-white">
            <div className="w-full px-6 md:px-12 lg:px-20 xl:px-28 py-8">
                <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between">
                    {/* Left */}
                    <div className="space-y-6 max-w-md">
                        <Link href="/" className="flex items-center gap-3">
                            <Image
                                src="/logo.png"
                                alt="ADDAX Logo"
                                width={42}
                                height={42}
                                className="object-contain"
                            />

                            <h2 className="text-3xl font-bold tracking-tight">
                                Addax
                            </h2>
                        </Link>

                        <p className="text-gray-500 leading-7">
                            Modern traditional fashion crafted for the new generation.
                            Timeless heritage with a contemporary touch.
                        </p>
                    </div>

                    {/* Right */}
                    <div className="grid grid-cols-2 gap-12 sm:gap-20 lg:gap-24 pr-10">
                        {footerLinks.map((section) => (
                            <div key={section.title}>
                                <h3 className="mb-5 text-lg font-semibold text-black">
                                    {section.title}
                                </h3>

                                <ul className="space-y-3">
                                    {section.links.map((link) => (
                                        <li key={link.name}>
                                            <Link
                                                href={link.href}
                                                className="text-gray-500 transition hover:text-black"
                                            >
                                                {link.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="my-4 border-t border-gray-200" />

                <div className="flex flex-col items-center justify-between gap-4 text-sm text-gray-500 md:flex-row">
                    <p>© {new Date().getFullYear()} ADDAX. All rights reserved.</p>

                    <div className="flex items-center gap-6">
                        <Link href="#">Terms & Conditions</Link>
                        <Link href="#">Privacy Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}