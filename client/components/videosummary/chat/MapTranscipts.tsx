"use client";

import { useEffect, useState } from "react";
import Transcripts, { TranscriptSkeleton } from "./Transcript";

interface TranscriptChunk {
  _id: string;
  videoId: string;
  transcriptId: string;
  content: string;
  startTime: number;
  endTime: number;
  chunkIndex: number;
  embedding: number[];
  createdAt: string;
}

interface MapTransciptsProps {
  videoId: string | null;
  isCreatingVideo?: boolean;
}

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);

  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

function MapTranscipts({ videoId, isCreatingVideo }: MapTransciptsProps) {
  const [transcripts, setTranscripts] = useState<TranscriptChunk[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!videoId) {
      if (!isCreatingVideo) {
        setLoading(false);
      }
      return;
    }

    let interval: NodeJS.Timeout;

    const fetchTranscripts = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/videos/getTranscript`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              videoId,
            }),
          }
        );

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message || "Failed to fetch transcripts");
        }

        const data = await res.json();
        const found = Array.isArray(data) ? data : data.transcript || data.transcripts || [];

        if (found.length > 0) {
            setTranscripts(found);
            setLoading(false);
            setError(null);
            if (interval) clearInterval(interval);
        } else {
            // Keep loading true while polling
            setLoading(true);
        }
      } catch (err) {
        console.error("Error fetching transcripts:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch transcripts.");
        setLoading(false);
        if (interval) clearInterval(interval);
      }
    };

    // Initial fetch
    fetchTranscripts();

    // Poll every 3 seconds while transcripts are being generated
    interval = setInterval(fetchTranscripts, 3000);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [videoId, isCreatingVideo]);

  const formatTime = (seconds: number) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  }

  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

  if (loading || isCreatingVideo) {
    return (
      <div className="flex h-[350px] lg:max-h-[calc(100vh-500px)] lg:h-auto w-full flex-col gap-2 overflow-y-auto rounded-2xl border border-zinc-800/40 p-2 no-scrollbar bg-zinc-950/10">
        {Array.from({ length: 5 }).map((_, index) => (
          <TranscriptSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!loading && !isCreatingVideo && (!videoId || transcripts.length === 0)) {
    return (
      <div className="flex h-[350px] lg:max-h-[calc(100vh-500px)] lg:h-auto w-full flex-col items-center justify-center gap-2 overflow-y-auto rounded-2xl border border-zinc-800/40 p-4 no-scrollbar bg-zinc-950/10">
        <p className="text-zinc-400 text-sm">{!videoId ? "No video selected." : error || "No transcripts found."}</p>
      </div>
    );
  }

  return (
    <div className="flex h-[350px] lg:max-h-[calc(100vh-500px)] lg:h-auto w-full flex-col gap-2 overflow-y-auto rounded-2xl border border-zinc-800/40 p-2 no-scrollbar">
      {transcripts.length > 0 ? (
        transcripts.map((chunk, index) => (
          <Transcripts
            key={chunk._id || index}
            duration={`${formatTime(chunk.startTime)} - ${formatTime(chunk.endTime)}`}
            text={chunk.content}
          />
        ))
      ) : (
        <p>No transcripts found.</p>
      )}
    </div>
  );
}

export default MapTranscipts;
