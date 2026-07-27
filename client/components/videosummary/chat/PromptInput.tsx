"use client";

import { useRef, useState } from "react";
import { Mic } from "lucide-react";

export default function PromptInput() {
  const [value, setValue] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const handleMic = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Speech recognition is not supported in your browser.");
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = "en-US";
      recognitionRef.current.interimResults = false;
      recognitionRef.current.continuous = false;

      recognitionRef.current.onstart = () => setIsListening(true);

      recognitionRef.current.onend = () => setIsListening(false);

      recognitionRef.current.onerror = () => setIsListening(false);

      recognitionRef.current.onresult = (e: any) => {
        setValue((prev) => `${prev} ${e.results[0][0].transcript}`.trim());
      };
    }

    recognitionRef.current.start();
  };

  return (
    <div className="flex items-center rounded-full border border-zinc-700 bg-zinc-900 px-4 py-2 shadow-lg">
      <input
        type="text"
        placeholder="Describe what you want..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="flex-1 bg-transparent text-sm text-white placeholder:text-zinc-500 outline-none"
      />

      <button
        type="button"
        onClick={handleMic}
        className={`ml-2 rounded-full p-2 transition-colors ${
          isListening
            ? "bg-blue-500/20 text-blue-500"
            : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
        }`}
      >
        <Mic size={20} />
      </button>
    </div>
  );
}