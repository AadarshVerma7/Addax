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
          <p
            className={`text-sm leading-6 text-zinc-300 ${
              !isOpen ? "line-clamp-1" : ""
            }`}
          >
            {text}
          </p>
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
        <div className="px-3 pl-[4.75rem]">
          <p className="text-sm leading-6 text-zinc-300">{text}</p>
        </div>
      </div>
    </div>
  );
}

export default Transcripts;