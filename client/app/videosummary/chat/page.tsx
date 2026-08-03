"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import YoutubeVideoFramer from "@/components/videosummary/chat/YoutubeVideoFramer";
import { getYoutubeEmbedUrl } from "@/lib/getYoutubeEmbedUrl";
import MapTranscipts from "@/components/videosummary/chat/MapTranscipts";
import SideBar from "@/components/videosummary/SideBar";
import Conversations from "@/components/videosummary/chat/Conversations";

function ChatContent() {
  const searchParams = useSearchParams();
  const url = searchParams.get("url");
  const title = searchParams.get("title");
  const thumbnail = searchParams.get("thumbnail");
  const channel = searchParams.get("channel");
  const embedUrl = url ? getYoutubeEmbedUrl(url) : null;
  const [videoId, setVideoId] = useState<string | null>(null);
  const [isCreatingVideo, setIsCreatingVideo] = useState(true);

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
    <div className="bg-black h-screen">
      <div className="flex flex-row">
        <div>
          <SideBar />
        </div>

        <div className="flex">
          <div className="flex flex-col gap-4 p-4 justify-top w-full max-w-210">
            {isCreatingVideo ? (
              <div className="w-[780px] h-[400px] animate-pulse bg-zinc-900/60 rounded-xl border border-zinc-800/40 flex items-center justify-center">
                 <div className="w-16 h-16 bg-zinc-800/60 rounded-full" />
              </div>
            ) : embedUrl ? (
              <YoutubeVideoFramer
                width={780}
                height={400}
                videoUrl={embedUrl}
                className="border border-zinc-800/40 "
              />
            ) : null}
            <MapTranscipts videoId={videoId} isCreatingVideo={isCreatingVideo} />
          </div>
        </div>

        <div className="w-full p-4 ">
            <Conversations/>
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