import React from "react";

interface YoutubeVideoFramerSkeletonProps {
  width?: number | string;
  height?: number | string;
  className?: string;
}

function YoutubeVideoFramerSkeleton({
  width = 360,
  height = 250,
  className = "",
}: YoutubeVideoFramerSkeletonProps) {
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
    <div
      className={`animate-pulse overflow-hidden rounded-xl bg-zinc-800 ${className}`}
      style={{ width, height }}
    >
      <div className="h-full w-full bg-zinc-700" />
    </div>
  );
}

export default YoutubeVideoFramerSkeleton;