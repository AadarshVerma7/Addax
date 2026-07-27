"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import YoutubeVideoFramer from "@/components/videosummary/chat/YoutubeVideoFramer";
import { getYoutubeEmbedUrl } from "@/lib/getYoutubeEmbedUrl";
import MapTranscipts from "@/components/videosummary/chat/MapTranscipts";
import SideBar from "@/components/videosummary/SideBar";
import Conversations from "@/components/videosummary/chat/Conversations";

function ChatContent() {
  const searchParams = useSearchParams();
  const url = searchParams.get("url");
  const embedUrl = url ? getYoutubeEmbedUrl(url) : null;

  const sizeOfVideo = {
    small: {
      width: 120,
      hight: 80
    },
    medium: {
      width: 400,
      hight: 300
    },
    large: {
      width: 780,
      hight: 400
    }
  }
  return (
    <div className="bg-black h-screen">
      <div className="flex flex-row">
        <div>
          <SideBar />
        </div>

        <div className="flex">
          <div className="flex flex-col gap-4 p-4 justify-center w-full max-w-210">
            {embedUrl && (
              <YoutubeVideoFramer
                width={780}
                height={400}
                videoUrl={embedUrl}
                className="border border-zinc-800/40 "
              />
            )}
            <MapTranscipts videoId="6a649ae0451c0f554f58ab2b" />
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