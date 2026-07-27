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
  videoId: string;
}

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);

  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

function MapTranscipts({ videoId }: MapTransciptsProps) {
  const [transcripts, setTranscripts] = useState<TranscriptChunk[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!videoId) return;

    const fetchTranscripts = async () => {
      try {
        setLoading(true);

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
          throw new Error("Failed to fetch transcripts");
        }

        const data = await res.json();

        setTranscripts(Array.isArray(data) ? data : data.transcript || data.transcripts || []);
      } catch (err) {
        console.error("Error fetching transcripts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTranscripts();
  }, [videoId]);

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

  if (loading) {
    return (
      <div className="flex max-h-[calc(100vh-500px)] h-full w-full flex-col gap-2 overflow-y-auto rounded-2xl border border-gray-600/40 p-2 no-scrollbar bg-zinc-950/10">
        {Array.from({ length: 5 }).map((_, index) => (
          <TranscriptSkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className="flex max-h-[calc(100vh-500px)] w-full flex-col gap-2 overflow-y-auto rounded-2xl border border-gray-600/40 p-2 no-scrollbar">
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