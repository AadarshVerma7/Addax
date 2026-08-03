"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import YoutubeVideoFramer from "@/components/videosummary/chat/YoutubeVideoFramer";
import { getYoutubeEmbedUrl } from "@/lib/getYoutubeEmbedUrl";
import MapTranscipts from "@/components/videosummary/chat/MapTranscipts";
import SideBar from "@/components/videosummary/SideBar";
import Conversations from "@/components/videosummary/chat/Conversations";
import Summary from "@/components/videosummary/chat/Summary";

function ChatContent() {
  const searchParams = useSearchParams();
  const url = searchParams.get("url");
  const title = searchParams.get("title");
  const thumbnail = searchParams.get("thumbnail");
  const channel = searchParams.get("channel");
  const embedUrl = url ? getYoutubeEmbedUrl(url) : null;
  const [videoId, setVideoId] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isCreatingVideo, setIsCreatingVideo] = useState(true);
  const [activeTab, setActiveTab] = useState<"transcript" | "summary">("transcript");

  useEffect(() => {
    if (!url) {
      setIsCreatingVideo(false);
      return;
    }

    const fetchVideo = async () => {
      try {
        const token = localStorage.getItem("token");
        
        // Call createVideo to get/create the video and ensure the user's conversation is initialized
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/videos/createVideo`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ 
            url,
            title: title || undefined,
            thumbnailUrl: thumbnail || undefined,
            channelTitle: channel || undefined
          }),
        });

        if (!res.ok) {
          throw new Error("Failed to create/get video");
        }

        const data = await res.json();
        if (data.success && data.video) {
          setVideoId(data.video.id);
          setConversationId(data.conversation?.id || null);
          window.dispatchEvent(new Event("refetchConversations"));
        }
      } catch (err) {
        console.error("Error creating/getting video:", err);
      } finally {
        setIsCreatingVideo(false);
      }
    };

    fetchVideo();
  }, [url, title, thumbnail, channel]);

  return (
    <div className="bg-black min-h-screen lg:h-screen lg:overflow-hidden">
      <div className="flex flex-col lg:flex-row h-full w-full">
        <div className="lg:h-full shrink-0">
          <SideBar />
        </div>

        {/* Middle and Right columns wrapper */}
        <div className="flex-1 flex flex-col lg:flex-row min-w-0 h-full overflow-y-auto lg:overflow-hidden">
          {/* Middle Column: Video and Transcript/Summary */}
          <div className="flex flex-col gap-4 p-4 justify-top w-full lg:w-[812px] shrink-0">
            {isCreatingVideo ? (
              <div className="w-full max-w-[780px] aspect-[780/400] animate-pulse bg-zinc-900/60 rounded-xl border border-zinc-800/40 flex items-center justify-center">
                 <div className="w-16 h-16 bg-zinc-800/60 rounded-full" />
              </div>
            ) : embedUrl ? (
              <div className="w-full max-w-[780px] aspect-[780/400]">
                <YoutubeVideoFramer
                  width="100%"
                  height="100%"
                  videoUrl={embedUrl}
                  className="border border-zinc-800/40"
                />
              </div>
            ) : null}

            {/* Tab Toggles */}
            <div className="flex gap-4 border-b border-zinc-800/60 pb-2">
              <button
                type="button"
                onClick={() => setActiveTab("transcript")}
                className={`pb-2 text-sm font-semibold transition-all relative ${
                  activeTab === "transcript"
                    ? "text-blue-400 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-blue-500"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                Transcript
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("summary")}
                className={`pb-2 text-sm font-semibold transition-all relative ${
                  activeTab === "summary"
                    ? "text-blue-400 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-blue-500"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                Summary
              </button>
            </div>

            {activeTab === "transcript" ? (
              <MapTranscipts videoId={videoId} isCreatingVideo={isCreatingVideo} />
            ) : (
              <div className="flex h-[350px] lg:max-h-[calc(100vh-500px)] lg:h-auto w-full flex-col gap-2 overflow-y-auto rounded-2xl border border-zinc-800/40 p-2 no-scrollbar bg-zinc-950/10">
                <Summary videoId={videoId} />
              </div>
            )}
          </div>

          {/* Right Column: Chat */}
          <div className="flex-1 p-4 min-w-0 lg:h-full lg:overflow-hidden">
            <Conversations conversationId={conversationId} isCreatingVideo={isCreatingVideo} />
          </div>
        </div>
      </div>
    </div>
  );
}

function VideoSummarisedChat() {
  return (
    <Suspense fallback={<div className="bg-black h-screen flex items-center justify-center text-white">Loading...</div>}>
      <ChatContent />
    </Suspense>
  );
}

export default VideoSummarisedChat;
