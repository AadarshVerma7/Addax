"use client";

import React, { useEffect, useState } from "react";
import SearchBar from "./SearchBar";
import ProceedWithVideo from "./ProceedWithVideo";
import { AnimatePresence, motion } from "framer-motion";
import SideBar from "./SideBar";

interface VideoData {
    title: string;
    thumbnail: string;
    duration?: string;
    channelName: string;
}

function VideoSummaryMain() {
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [videoData, setVideoData] = useState<VideoData | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const isYouTubeUrl = (testUrl: string) => {
            try {
                const parsed = new URL(testUrl);

                return (
                    parsed.hostname.includes("youtube.com") ||
                    parsed.hostname.includes("youtu.be")
                );
            } catch {
                return false;
            }
        };

        if (!url) {
            setVideoData(null);
            setError(null);
            setLoading(false);
            return;
        }

        if (!isYouTubeUrl(url)) {
            setVideoData(null);
            setError("Please enter a valid YouTube URL");
            setLoading(false);
            return;
        }

        const fetchVideoDetails = async () => {
            setLoading(true);
            setError(null);

            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/videos/getVideoDetails`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ url }),
                    }
                );

                const data = await res.json();

                if (!res.ok || !data.success) {
                    throw new Error(
                        data.message || "Failed to fetch video details"
                    );
                }

                setVideoData({
                    title: data.data.title || "Unknown Title",
                    thumbnail:
                        data.data.thumbnailUrl ||
                        "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=500&auto=format&fit=crop&q=60",
                    channelName:
                        data.data.channelTitle || "Unknown Creator",
                    duration: data.data.duration,
                });
            } catch (err: unknown) {
                const message =
                    err instanceof Error
                        ? err.message
                        : "An error occurred fetching video details";

                setError(message);
                setVideoData(null);
            } finally {
                setLoading(false);
            }
        };

        const delayDebounce = setTimeout(() => {
            fetchVideoDetails();
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [url]);

    return (
        <main className="flex min-h-screen w-full bg-[#03050f]">
            {/* Sidebar */}
            <SideBar />

            {/* Main content */}
            <section className="relative flex min-h-screen min-w-0 flex-1 overflow-hidden">
                {/* Background effects */}
                <div className="pointer-events-none absolute inset-0">
                    {/* Blue glow */}
                    <div
                        className="
                            absolute
                            left-1/2
                            top-1/2
                            h-[450px]
                            w-[900px]
                            -translate-x-1/2
                            -translate-y-1/2
                            rounded-full
                            bg-[#1a3869]/40
                            blur-[140px]
                        "
                    />

                    {/* Vignette */}
                    <div
                        className="
                            absolute
                            inset-0
                            bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.55)_100%)]
                        "
                    />
                </div>

                {/* Page content */}
                <div
                    className="
                        relative
                        z-10
                        flex
                        min-h-screen
                        w-full
                        items-center
                        justify-center
                        px-4
                        py-12
                        sm:px-6
                        lg:px-8
                    "
                >
                    <div className="flex w-full max-w-2xl flex-col items-center">
                        {/* Search */}
                        <div className="w-full">
                            <SearchBar
                                value={url}
                                onChange={setUrl}
                            />
                        </div>

                        {/* Dynamic content */}
                        <div className="mt-5 flex min-h-[80px] w-full justify-center">
                            <AnimatePresence mode="wait">
                                {loading && (
                                    <motion.div
                                        key="loader"
                                        initial={{
                                            opacity: 0,
                                            y: -8,
                                        }}
                                        animate={{
                                            opacity: 1,
                                            y: 0,
                                        }}
                                        exit={{
                                            opacity: 0,
                                            y: -8,
                                        }}
                                        className="flex flex-col items-center gap-2"
                                    >
                                        <div
                                            className="
                                                h-6
                                                w-6
                                                animate-spin
                                                rounded-full
                                                border-2
                                                border-[#2F80ED]
                                                border-t-transparent
                                            "
                                        />

                                        <span className="text-xs text-zinc-400">
                                            Loading video details...
                                        </span>
                                    </motion.div>
                                )}

                                {error && !loading && url && (
                                    <motion.div
                                        key="error"
                                        initial={{
                                            opacity: 0,
                                            y: -10,
                                        }}
                                        animate={{
                                            opacity: 1,
                                            y: 0,
                                        }}
                                        exit={{
                                            opacity: 0,
                                            y: -10,
                                        }}
                                        className="
                                            h-fit
                                            rounded-full
                                            border
                                            border-red-900/30
                                            bg-red-950/20
                                            px-4
                                            py-2
                                            text-center
                                            text-xs
                                            font-medium
                                            text-red-400
                                        "
                                    >
                                        {error}
                                    </motion.div>
                                )}

                                {videoData && !loading && (
                                    <motion.div
                                        key="video-card"
                                        initial={{
                                            opacity: 0,
                                            y: -15,
                                            scale: 0.97,
                                        }}
                                        animate={{
                                            opacity: 1,
                                            y: 0,
                                            scale: 1,
                                        }}
                                        exit={{
                                            opacity: 0,
                                            y: -15,
                                            scale: 0.97,
                                        }}
                                        transition={{
                                            duration: 0.3,
                                            ease: "easeOut",
                                        }}
                                        className="w-full"
                                    >
                                        <ProceedWithVideo
                                            title={videoData.title}
                                            thumbnail={videoData.thumbnail}
                                            duration={videoData.duration}
                                            channelName={
                                                videoData.channelName
                                            }
                                            proceedUrl={`/videosummary/chat?url=${encodeURIComponent(
                                                url
                                            )}&title=${encodeURIComponent(
                                                videoData.title
                                            )}&thumbnail=${encodeURIComponent(
                                                videoData.thumbnail
                                            )}&channel=${encodeURIComponent(
                                                videoData.channelName
                                            )}`}
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default VideoSummaryMain;
