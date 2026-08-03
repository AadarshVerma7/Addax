"use client";

import Link from "next/link";

interface ProceedWithVideoProps {
  title: string;
  thumbnail: string;
  duration?: number | string;
  channelName: string;
  proceedUrl: string;
}

/**
 * Supported formats:
 *
 * 125        -> 2:05
 * "125"      -> 2:05
 * "PT2M5S"   -> 2:05
 * "PT1H2M5S" -> 1:02:05
 * "2:05"     -> 2:05
 */
const formatDuration = (duration?: number | string): string => {
  if (duration === undefined || duration === null || duration === "") {
    return "";
  }

  // --------------------------------
  // Number: assume seconds
  // --------------------------------
  if (typeof duration === "number") {
    return formatSeconds(duration);
  }

  // --------------------------------
  // String
  // --------------------------------
  if (typeof duration === "string") {
    const value = duration.trim();

    if (!value) {
      return "";
    }

    // Already formatted: 2:05 or 1:02:05
    if (/^\d+:\d{2}(:\d{2})?$/.test(value)) {
      return value;
    }

    // Numeric string: "125"
    if (/^\d+(\.\d+)?$/.test(value)) {
      return formatSeconds(Number(value));
    }

    // YouTube ISO 8601:
    // PT2M5S
    // PT1H2M5S
    // PT45S
    const match = value.match(
      /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/i
    );

    if (match) {
      const hours = Number(match[1] || 0);
      const minutes = Number(match[2] || 0);
      const seconds = Number(match[3] || 0);

      if (hours > 0) {
        return `${hours}:${String(minutes).padStart(
          2,
          "0"
        )}:${String(seconds).padStart(2, "0")}`;
      }

      return `${minutes}:${String(seconds).padStart(2, "0")}`;
    }
  }

  // If API sends something unexpected
  return String(duration);
};

const formatSeconds = (totalSeconds: number): string => {
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) {
    return "";
  }

  const total = Math.floor(totalSeconds);

  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
  }

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
};

export default function ProceedWithVideo({
  title,
  thumbnail,
  duration,
  channelName,
  proceedUrl,
}: ProceedWithVideoProps) {
  const formattedDuration = formatDuration(duration);

  return (
    <div className="mx-auto mt-4 w-full max-w-md rounded-2xl bg-black p-3 shadow-md">
      <div className="flex items-center gap-4">

        {/* Thumbnail */}
        <div className="relative h-24 w-36 flex-shrink-0 overflow-hidden rounded-xl">
          <img
            src={thumbnail}
            alt={title}
            className="h-full w-full object-cover"
          />

          {/* Duration */}
          {formattedDuration && (
            <div className="absolute bottom-1 right-1 rounded bg-black/80 px-1.5 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
              {formattedDuration}
            </div>
          )}
        </div>

        {/* Right Content */}
        <div className="flex min-w-0 flex-1 flex-col justify-between self-stretch">

          {/* Title + Channel */}
          <div>
            <h2
              className="line-clamp-2 text-sm font-bold leading-5 text-white"
              title={title}
            >
              {title}
            </h2>

            <p className="mt-1 truncate text-xs font-medium text-zinc-400">
              {channelName}
            </p>
          </div>

          {/* Proceed Button */}
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