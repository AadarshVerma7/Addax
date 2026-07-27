"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import YoutubeVideoFramer from "@/components/videosummary/chat/YoutubeVideoFramer";
import { getYoutubeEmbedUrl } from "@/lib/getYoutubeEmbedUrl";
import MapTranscipts from "@/components/videosummary/chat/MapTranscipts";

function ChatContent() {
  const searchParams = useSearchParams();
  const url = searchParams.get("url");
  const embedUrl = url ? getYoutubeEmbedUrl(url) : null;

  return (
    <div className="bg-black h-screen">
      {embedUrl && (
        <YoutubeVideoFramer
          width={580}
          height={380}
          videoUrl={embedUrl}
          className="max-w-1/2"
        />
      )}
      <MapTranscipts/>
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