"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { ArrowUp, Mic } from "lucide-react";

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
}

interface SpeechResultEvent {
  results: { [index: number]: { [index: number]: { transcript: string } } };
}

interface SpeechRecognitionInstance {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  onresult: ((event: SpeechResultEvent) => void) | null;
  start: () => void;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

export default function PromptInput({ value, onChange, onSubmit, disabled = false }: PromptInputProps) {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const valueRef = useRef(value);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (value.trim() && !disabled) onSubmit();
  };

  const handleMic = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Speech recognition is not supported in your browser.");
      return;
    }

    const browserWindow = window as Window & {
      SpeechRecognition?: SpeechRecognitionConstructor;
      webkitSpeechRecognition?: SpeechRecognitionConstructor;
    };
    const SpeechRecognition = browserWindow.SpeechRecognition || browserWindow.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = "en-US";
      recognitionRef.current.interimResults = false;
      recognitionRef.current.continuous = false;
      recognitionRef.current.onstart = () => setIsListening(true);
      recognitionRef.current.onend = () => setIsListening(false);
      recognitionRef.current.onerror = () => setIsListening(false);
      recognitionRef.current.onresult = (event) => {
        onChange(`${valueRef.current} ${event.results[0][0].transcript}`.trim());
      };
    }
    recognitionRef.current.start();
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 pt-2 bg-transparent w-full">
      <div className="flex-1 flex items-center gap-2 rounded-full border border-zinc-800 bg-[#1C1C1E] px-4 py-1.5 focus-within:border-zinc-700 transition-colors">
        <input
          type="text"
          placeholder="Message"
          value={value}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
          className="min-w-0 flex-1 bg-transparent text-[15px] text-white placeholder:text-zinc-500 outline-none disabled:cursor-not-allowed"
        />
        <button
          type="button"
          onClick={handleMic}
          disabled={disabled}
          aria-label="Use voice input"
          className={`rounded-full p-1 transition-colors disabled:opacity-40 shrink-0 ${
            isListening ? "bg-[#0A84FF]/20 text-[#0A84FF]" : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <Mic size={17} />
        </button>
      </div>
      <button
        type="submit"
        disabled={!value.trim() || disabled}
        aria-label="Send message"
        className="rounded-full w-8 h-8 flex items-center justify-center bg-[#0A84FF] text-white transition hover:opacity-90 active:scale-95 disabled:bg-zinc-800 disabled:text-zinc-600 disabled:opacity-40 disabled:pointer-events-none shrink-0"
      >
        <ArrowUp size={18} strokeWidth={2.5} />
      </button>
    </form>
  );
}
