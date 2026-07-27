"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface TranscriptI {
  duration: string;
  text: string;
}

function Transcripts({ duration, text }: TranscriptI) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="max-w-3xl rounded-xl border border-zinc-800 bg-zinc-900 transition-all duration-200">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-start gap-3 p-3 text-left"
      >
        <span className="shrink-0 rounded-full bg-blue-500/15 px-2.5 py-1 text-xs font-semibold text-blue-400">
          {duration}
        </span>

        <div className="flex-1 overflow-hidden">
          {!isOpen && (
            <p className="text-md leading-6 text-zinc-300 line-clamp-1 font-serif">
              {text}
            </p>
          )}
        </div>

        <ChevronDown
          className={`mt-0.5 h-4 w-4 shrink-0 text-zinc-500 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-96 pb-3" : "max-h-0"
        }`}
      >
        <div className="px-3 pl-8">
          <p className="text-md leading-6 text-zinc-300 font-serif">{text}</p>
        </div>
      </div>
    </div>
  );
}

export function TranscriptSkeleton() {
  return (
    <div className="max-w-3xl rounded-xl border border-zinc-800/40 bg-zinc-900/60 p-3 animate-pulse flex items-center gap-3">
      <div className="h-6 w-20 shrink-0 rounded-full bg-zinc-800" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-zinc-800 rounded w-5/6" />
      </div>
      <div className="h-4 w-4 shrink-0 rounded bg-zinc-800" />
    </div>
  );
}

export default Transcripts;