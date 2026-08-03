"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { Mic, Send } from "lucide-react";

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
    <form onSubmit={handleSubmit} className="flex items-center gap-1 rounded-full border border-white/10 bg-black/40 px-3 py-2 backdrop-blur-xl shadow-[0_0_30px_rgba(59,130,246,0.08)]">
      <input
        type="text"
        placeholder="Ask about this video..."
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="min-w-0 flex-1 bg-transparent px-2 text-sm text-white placeholder:text-zinc-500 outline-none disabled:cursor-not-allowed"
      />
      <button type="button" onClick={handleMic} disabled={disabled} aria-label="Use voice input" className={`rounded-full p-2 transition-colors disabled:opacity-40 ${isListening ? "bg-blue-500/20 text-blue-300" : "text-zinc-400 hover:bg-white/10 hover:text-white"}`}>
        <Mic size={18} />
      </button>
      <button type="submit" disabled={!value.trim() || disabled} aria-label="Send message" className="rounded-full bg-blue-500 p-2 text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-40">
        <Send size={17} />
      </button>
    </form>
  );
}
