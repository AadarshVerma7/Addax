"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "What is Addax?",
    answer:
      "Addax is an AI-powered learning assistant that lets you summarize, outline, and chat with any YouTube video. Just paste a video link and get instant structured notes.",
  },
  {
    question: "How does the video chat work?",
    answer:
      "Once Addax processes a video, it uses the transcript to power a dedicated AI chat. You can ask follow-up questions, request code snippets, or get clarifications, and the AI will respond based on the video's context.",
  },
  {
    question: "Is there a limit on video length?",
    answer:
      "Addax can process videos of almost any length, including hours-long lectures, tutorials, and tech talks. For extremely long videos, the AI dynamically partitions the transcript to ensure accurate summary coverage.",
  },
  {
    question: "Can I see my previous summaries?",
    answer:
      "Yes! Your dashboard keeps a sidebar history of all your recent video summaries and chat logs, allowing you to resume your learning sessions at any time.",
  },
  {
    question: "Does Addax support playlists or private videos?",
    answer:
      "Currently, Addax supports all public YouTube videos. Playlist support and private video uploads are on our roadmap for future updates.",
  },
  {
    question: "Is Addax free to use?",
    answer:
      "Addax offers a generous free tier for daily video summarization and AI chat. For users requiring unlimited summaries, batch processing, and advanced AI models, we will soon offer a Pro plan.",
  },
];

export default function FaqSection() {
  const [active, setActive] = useState<number | null>(0);

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl rounded-3xl bg-white p-8 md:p-14">
        <div className="grid gap-12 md:grid-cols-2">
          {/* Left */}
          <div className="max-w-sm">
            <h2 className="text-4xl font-semibold tracking-tight text-gray-900">
              Frequently Asked Questions
            </h2>

            <p className="mt-4 text-sm leading-6 text-gray-500">
              Find quick answers to common questions about our video summary
              features, interactive AI chatbot, and platform capabilities.
            </p>
          </div>

          {/* Right */}
          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = active === index;

              return (
                <div
                  key={faq.question}
                  className="overflow-hidden rounded-xl border border-gray-100 bg-gray-50"
                >
                  <button
                    onClick={() =>
                      setActive(isOpen ? null : index)
                    }
                    className="flex w-full items-center justify-between px-5 py-4 text-left"
                  >
                    <span className="font-medium text-gray-900">
                      {faq.question}
                    </span>

                    {isOpen ? (
                      <Minus className="h-5 w-5 text-blue-600" />
                    ) : (
                      <Plus className="h-5 w-5 text-blue-600" />
                    )}
                  </button>

                  <div
                    className={`grid transition-all duration-300 ${
                      isOpen
                        ? "grid-rows-[1fr]"
                        : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5 pb-5 text-sm leading-6 text-gray-600">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}