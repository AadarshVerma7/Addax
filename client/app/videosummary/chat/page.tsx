"use client";

import { useSearchParams } from "next/navigation";
import YoutubeVideoFramer from "@/components/videosummary/chat/YoutubeVideoFramer";
import { getYoutubeEmbedUrl } from "@/lib/getYoutubeEmbedUrl";

function VideoSummarisedChat() {
  const searchParams = useSearchParams();

  const url = searchParams.get("url");

  const embedUrl = url ? getYoutubeEmbedUrl(url) : null;

  return (
    <>
      <div className="bg-black h-screen">
        {embedUrl && (
          <YoutubeVideoFramer
            width={580}
            height={380}
            videoUrl={embedUrl}
            className="max-w-1/2"
          />
        )}
      </div>
    </>
  );
}

export default VideoSummarisedChat;