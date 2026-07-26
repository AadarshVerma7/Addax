"use client";

import { motion } from "framer-motion";
import Link from "next/link";

function HeroSection() {
    return (
        <main className="flex flex-col lg:flex-row justify-between items-end md:pt-20 gap-16 lg:gap-8">

            {/* Left Column */}
            <motion.div
                className="flex-1 w-full"
                initial={{ opacity: 0, x: -80 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <motion.div
                    className="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-4 py-1.5 mb-8 backdrop-blur-md"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <span className="text-xs font-medium text-gray-200 tracking-wide">
                        Addax
                    </span>
                </motion.div>

                <motion.h1
                    className="text-5xl md:text-7xl lg:text-[5.5rem] font-medium leading-[1.1] tracking-tight text-white"
                    initial={{ opacity: 0, y: 60 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 0.9,
                        delay: 0.3,
                        ease: "easeOut",
                    }}
                >
                    Automate & <br />
                    elevate your <br />
                    learning with ease
                </motion.h1>
            </motion.div>

            {/* Right Column */}
            <motion.div
                className="flex-1 w-full max-w-lg lg:pb-6"
                initial={{ opacity: 0, x: 80 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
            >
                <motion.p
                    className="text-gray-200 text-sm md:text-base leading-relaxed mb-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                >
                    Transform YouTube playlists, lectures, and educational videos
                    into concise summaries instantly. Automate your learning
                    workflow and save hours of watch time with powerful AI tools.
                </motion.p>

                <motion.div
                    className="flex flex-wrap items-center gap-6"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                >
                    <Link href="/videosummary">
  <motion.button
    whileHover={{
      scale: 1.05,
      y: -2,
    }}
    whileTap={{ scale: 0.96 }}
    className="rounded-full bg-white px-7 py-3 text-sm font-semibold text-black shadow-lg"
  >
    Explore Now
  </motion.button>
</Link>

                    <div className="flex items-center gap-3">
                        {/* Avatars */}
                        <motion.div
                            className="flex -space-x-3"
                            initial="hidden"
                            animate="visible"
                            variants={{
                                visible: {
                                    transition: {
                                        staggerChildren: 0.15,
                                    },
                                },
                            }}
                        >
                            {[
                                "https://i.pravatar.cc/100?img=33",
                                "https://i.pravatar.cc/100?img=12",
                                "https://i.pravatar.cc/100?img=59",
                            ].map((src, i) => (
                                <motion.img
                                    key={i}
                                    src={src}
                                    alt={`Client ${i + 1}`}
                                    className="w-9 h-9 rounded-full border-[2.5px] border-[#366894] object-cover"
                                    variants={{
                                        hidden: {
                                            opacity: 0,
                                            scale: 0,
                                        },
                                        visible: {
                                            opacity: 1,
                                            scale: 1,
                                        },
                                    }}
                                    whileHover={{
                                        y: -5,
                                        scale: 1.1,
                                        zIndex: 10,
                                    }}
                                />
                            ))}
                        </motion.div>

                        {/* Trust Score */}
                        <motion.div
                            className="flex items-center gap-1.5 text-sm font-medium text-white"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1.2 }}
                        >
                            <motion.svg
                                className="w-5 h-5 text-[#f59e0b]"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                animate={{
                                    rotate: [0, 10, -10, 0],
                                    scale: [1, 1.2, 1],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    repeatDelay: 4,
                                }}
                            >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </motion.svg>

                            4.8 Trust Score
                        </motion.div>
                    </div>
                </motion.div>
            </motion.div>
        </main>
    );
}

export default HeroSection;