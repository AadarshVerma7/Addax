"use client"

import FeatureSectionCard from "./FeatureSectionCard";
import {
    CircleCheckBig,
    Brain,
    BookOpen,
    Sparkles,
    Bot
} from "lucide-react";

const features = [
    {
        icon: CircleCheckBig,
        title: "Quick Summarizer",
        iconClassName: "text-zinc-600",
        description: "Generate structured summaries from any YouTube video in seconds. Get high-level overviews and bullet-point key takeaways instantly.",
    },
    {
        icon: Brain,
        title: "Smart Practice",
        description: "Reinforce what you learn. Query the AI to generate questions, flashcards, or practice prompts directly based on the video's content.",
        iconClassName: "text-zinc-600",
    },
    {
        icon: BookOpen,
        title: "Structured Learning",
        iconClassName: "text-zinc-600",
        description: "Navigate through complex videos with automated sections. Jump to important timestamps and see how the lecture is outline-structured.",
    },
    {
        icon: Bot,
        title: "AI Assistant",
        description: "Have a dynamic, context-aware conversation with our chatbot. Ask specific questions, clarify concepts, or request code snippets from the video.",
        iconClassName: "text-zinc-600",
    },
];

function FeaturesSection() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:my-20 px-10 md:px-20">
            {features.map((feature) => (
                <FeatureSectionCard
                    key={feature.title}
                    icon={feature.icon}
                    title={feature.title}
                    description={feature.description}
                    iconClassName={feature.iconClassName}
                />
            ))}
        </div>
    );
}

export default FeaturesSection;