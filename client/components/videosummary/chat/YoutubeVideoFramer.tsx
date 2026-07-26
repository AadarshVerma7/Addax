import React from "react";

interface YoutubeVideoFramerProps {
  videoUrl: string | "";
  width?: number | string;
  height?: number | string;
  className?: string;
}

function YoutubeVideoFramer({
  videoUrl,
  width = 360,
  height = 250,
  className = "",
}: YoutubeVideoFramerProps) {
  return (
    <div
      className={`overflow-hidden rounded-xl ${className}`}
      style={{ width, height }}
    >
      <iframe
        width="100%"
        height="100%"
        src={videoUrl}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        className="h-full w-full"
      />
    </div>
  );
}

export default YoutubeVideoFramer;