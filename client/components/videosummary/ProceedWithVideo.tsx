"use client";

import Link from "next/link";

interface ProceedWithVideoProps {
  title: string;
  thumbnail: string;
  duration?: string;
  channelName: string;
  proceedUrl: string;
}

export default function ProceedWithVideo({
  title,
  thumbnail,
  duration,
  channelName,
  proceedUrl,
}: ProceedWithVideoProps) {
  return (
    <div className="mt-4 w-full max-w-md rounded-2xl bg-black p-4 shadow-md p-2">
      <div className="flex items-center gap-4">
        
        {/* Thumbnail with Duration Overlay */}
        <div className="relative w-32 flex-shrink-0 rounded-2xl">
          <img
            src={thumbnail}
            alt={title}
            className="h-full w-full object-cover"
          />
          {duration && (
            <div className="absolute bottom-1 right-1 rounded bg-black/80 px-1 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
              {duration}
            </div>
          )}
        </div>

        {/* Right Content */}
        <div className="flex h-20 flex-1 flex-col justify-between">
          <div>
            <h2 className="line-clamp-2 text-base font-bold text-white" title={title}>
              {title}
            </h2>

            {/* Replaced duration with channelName */}
            <p className="mt-0.5 text-xs font-medium text-zinc-400">
              {channelName}
            </p>
          </div>

          <div className="flex justify-end">
            <Link
              href={proceedUrl}
              className="rounded-md bg-[#2F80ED] px-4 py-1.5 text-xs font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-[#2563eb]"
            >
              Proceed
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}