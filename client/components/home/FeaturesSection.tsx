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
        title: "Qucik Summarizer",
        iconClassName: "text-zinc-600",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae, fugiat, voluptas, reiciendis animi consectetur iusto neque sequi totam quisquam ea natus. Reiciendis saepe",
    },
    {
        icon: Brain,
        title: "Smart Practice",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae, fugiat, voluptas, reiciendis animi consectetur iusto neque sequi totam quisquam ea natus. Reiciendis saepe",
        iconClassName: "text-zinc-600",
    },
    {
        icon: BookOpen,
        title: "Structured Learning",
        iconClassName: "text-zinc-600",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae, fugiat, voluptas, reiciendis animi consectetur iusto neque sequi totam quisquam ea natus. Reiciendis saepe",
    },
    {
        icon: Bot,
        title: "AI Assistant",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae, fugiat, voluptas, reiciendis animi consectetur iusto neque sequi totam quisquam ea natus. Reiciendis saepe",
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