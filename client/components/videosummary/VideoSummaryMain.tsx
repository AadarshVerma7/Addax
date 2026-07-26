"use client";

import React, { useState, useEffect } from "react";
import SearchBar from "./SearchBar";
import ProceedWithVideo from "./ProceedWithVideo";
import { motion, AnimatePresence } from "framer-motion";

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
            } catch (_) {
                return false;
            }
        };

        if (!url) {
            setVideoData(null);
            setError(null);
            return;
        }

        if (!isYouTubeUrl(url)) {
            setVideoData(null);
            setError("Please enter a valid YouTube URL");
            return;
        }

        const fetchVideoDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`https://noembed.com/embed?url=${encodeURIComponent(url)}`);
                if (!res.ok) throw new Error("Failed to fetch video details");
                const data = await res.json();
                if (data.error) {
                    throw new Error(data.error);
                }
                setVideoData({
                    title: data.title || "Unknown Title",
                    thumbnail: data.thumbnail_url || "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=500&auto=format&fit=crop&q=60",
                    channelName: data.author_name || "Unknown Creator",
                    duration: undefined
                });
            } catch (err: any) {
                setError(err.message || "An error occurred fetching video details");
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
        <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#03050f]">
            {/* Localized background glow */}
            <div className="absolute inset-0 flex items-center justify-center">
                {/* Main blue glow */}
                <div className="absolute h-112.5 w-225 rounded-full bg-[#1a3869]/40 blur-[140px]" />

                {/* Dark vignette */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.55)_100%)]" />
            </div>

            {/* Content */}
            <div className="relative z-10 w-full max-w-2xl px-6 flex flex-col items-center justify-center">
                <div className="relative w-full flex flex-col items-center">
                    <SearchBar value={url} onChange={setUrl} />

                    {/* Absolutely positioned container so SearchBar stays perfectly centered */}
                    <div className="absolute top-20 left-0 right-0 flex flex-col items-center z-20">
                        <AnimatePresence mode="wait">
                            {loading && (
                                <motion.div
                                    key="loader"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="flex flex-col items-center gap-2 mt-4"
                                >
                                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#2F80ED] border-t-transparent" />
                                    <span className="text-xs text-zinc-400">Loading video details...</span>
                                </motion.div>
                            )}

                            {error && !loading && url && (
                                <motion.div
                                    key="error"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="mt-4 text-xs text-red-400 font-medium bg-red-950/20 border border-red-900/30 px-3 py-1.5 rounded-full"
                                >
                                    {error}
                                </motion.div>
                            )}

                            {videoData && !loading && (
                                <motion.div
                                    key="video-card"
                                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                                    transition={{ duration: 0.3, ease: "easeOut" }}
                                    className="w-full flex justify-center"
                                >
                                    <ProceedWithVideo
                                        title={videoData.title}
                                        thumbnail={videoData.thumbnail}
                                        duration={videoData.duration}
                                        channelName={videoData.channelName}
                                        proceedUrl={`/videosummary/chat?url=${encodeURIComponent(url)}`}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default VideoSummaryMain;