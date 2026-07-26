"use client";

import { Link } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="mx-auto w-full max-w-5xl px-4">
      {/* Outer Wrapper for the border effect */}
      <div className="group relative overflow-hidden rounded-full p-px shadow-[0_8px_40px_rgba(0,0,0,0.45)] transition-all duration-300 focus-within:p-0.5 focus-within:shadow-[0_0_35px_rgba(26,56,105,0.35)]">
        
        {/* Spinning Gradient (The Moving Border) */}
        <div className="absolute -inset-full animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_75%,#3b6aa3_100%)] opacity-60 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100" />

        {/* Inner Search Bar */}
        <div className="relative z-10 flex h-16 w-full items-center rounded-full bg-zinc-950/90 px-6 backdrop-blur-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition-all duration-300 focus-within:bg-zinc-900/90 focus-within:shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
          
          {/* Glass shine */}
          <div className="absolute inset-x-6 top-0 h-px bg-linear-to-r from-transparent via-white/20 to-transparent" />

          <button className="mr-3 flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-white/10">
            <Link className="h-5 w-5 text-zinc-200" />
          </button>

          <input
            type="url"
            placeholder="Paste YouTube video URL..."
            className="flex-1 bg-transparent text-white placeholder:text-zinc-400 outline-none"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}