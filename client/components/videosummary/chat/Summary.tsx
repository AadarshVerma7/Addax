"use client";

import { useEffect, useState } from "react";

interface SummaryProps {
  videoId: string | null;
}

export function SummarySkeleton() {
  return (
    <div className="w-full space-y-4 animate-pulse p-4">
      {/* Title */}
      <div className="h-7 bg-zinc-800/60 rounded-md w-1/3" />
      {/* Short Overview */}
      <div className="space-y-2 mt-4">
        <div className="h-4 bg-zinc-800/60 rounded w-full" />
        <div className="h-4 bg-zinc-800/60 rounded w-5/6" />
      </div>
      {/* Section 1 */}
      <div className="h-6 bg-zinc-800/60 rounded-md w-1/4 mt-6" />
      <div className="space-y-2">
        <div className="h-4 bg-zinc-800/60 rounded w-full" />
        <div className="h-4 bg-zinc-800/60 rounded w-full" />
        <div className="h-4 bg-zinc-800/60 rounded w-4/5" />
      </div>
      {/* List items */}
      <div className="space-y-2 pl-4">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-zinc-800" />
          <div className="h-4 bg-zinc-800/60 rounded w-2/3" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-zinc-800" />
          <div className="h-4 bg-zinc-800/60 rounded w-1/2" />
        </div>
      </div>
    </div>
  );
}

function Summary({ videoId }: SummaryProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = async () => {
    if (!videoId) return;
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/summary/generateSummary`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ videoId }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to load or generate summary");
      }

      const data = await res.json();
      if (data.success && data.summary) {
        setSummary(data.summary.content || "");
      } else {
        throw new Error(data.message || "Failed to retrieve summary");
      }
    } catch (err: any) {
      console.error("Error fetching summary:", err);
      setError(err.message || "An error occurred while generating summary.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, [videoId]);

  // A custom inline parser to handle bold formatting (**text**)
  const parseInline = (text: string) => {
    const parts = [];
    let currentText = text;
    let boldIndex = currentText.indexOf("**");
    let keyIdx = 0;

    while (boldIndex !== -1) {
      if (boldIndex > 0) {
        parts.push(currentText.substring(0, boldIndex));
      }
      const endBoldIndex = currentText.indexOf("**", boldIndex + 2);
      if (endBoldIndex !== -1) {
        parts.push(
          <strong key={keyIdx++} className="font-bold text-white">
            {currentText.substring(boldIndex + 2, endBoldIndex)}
          </strong>
        );
        currentText = currentText.substring(endBoldIndex + 2);
      } else {
        parts.push(currentText.substring(boldIndex));
        currentText = "";
      }
      boldIndex = currentText.indexOf("**");
    }
    if (currentText) {
      parts.push(currentText);
    }
    return parts;
  };

  // Parses Markdown structure (headings, bullets, paragraphs)
  const renderMarkdown = (markdownText: string) => {
    const lines = markdownText.split("\n");
    return lines.map((line, idx) => {
      // Headers
      if (line.startsWith("### ")) {
        return (
          <h3 key={idx} className="text-md font-semibold text-zinc-100 mt-4 mb-2">
            {parseInline(line.slice(4))}
          </h3>
        );
      }
      if (line.startsWith("## ")) {
        return (
          <h2 key={idx} className="text-lg font-bold text-zinc-100 mt-6 mb-3 border-b border-zinc-800/40 pb-1">
            {parseInline(line.slice(3))}
          </h2>
        );
      }
      if (line.startsWith("# ")) {
        return (
          <h1 key={idx} className="text-xl font-extrabold text-zinc-500 mt-8 mb-4">
            {parseInline(line.slice(2))}
          </h1>
        );
      }
      // Bullet points
      if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
        return (
          <ul key={idx} className="list-disc pl-5 my-1.5 text-zinc-300 text-sm">
            <li>{parseInline(line.trim().slice(2))}</li>
          </ul>
        );
      }
      // Empty line
      if (!line.trim()) {
        return <div key={idx} className="h-2" />;
      }
      // Regular paragraph
      return (
        <p key={idx} className="text-sm leading-relaxed text-zinc-300 my-2">
          {parseInline(line)}
        </p>
      );
    });
  };

  if (loading) {
    return <SummarySkeleton />;
  }

  if (error) {
    return (
      <div className="p-4 rounded-xl border border-red-900/30 bg-red-950/20 text-center text-xs font-medium text-red-400 flex flex-col items-center gap-3">
        <span>{error}</span>
        <button
          onClick={fetchSummary}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition"
        >
          Generate Summary
        </button>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="p-4 text-center text-sm text-zinc-500">
        No summary available for this video.
      </div>
    );
  }

  return (
    <div className="w-full text-white p-4 overflow-y-auto no-scrollbar font-serif">
      {renderMarkdown(summary)}
    </div>
  );
}

export default Summary;