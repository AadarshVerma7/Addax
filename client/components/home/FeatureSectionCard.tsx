"use client";

import { LucideIcon } from "lucide-react";

interface FeatureSectionCardProps {
    icon: LucideIcon;
    title: string;
    description: string;
    iconClassName?: string;
}

function FeatureSectionCard({
    icon: Icon,
    title,
    description,
    iconClassName = "",
}: FeatureSectionCardProps) {
    return (
        <div className="bg-gray-100 rounded-2xl p-6 sm:p-8 h-full transition-all duration-300 hover:shadow-lg">
            <div className="flex flex-col gap-4 mb-6">
                <Icon
                    className={`w-6 h-6 sm:w-10 sm:h-10 text-[#3B7597] ${iconClassName}`}
                />

                <h3 className="font-semibold text-xl sm:text-2xl text-zinc-900">
                    {title}
                </h3>
            </div>

            <p className="text-sm sm:text-base text-zinc-600 leading-7">
                {description}
            </p>
        </div>
    );
}

export default FeatureSectionCard;