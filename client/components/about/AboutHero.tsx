"use client";

import React from "react";

function AboutHero() {
    return (
        <div className="text-center pt-32 pb-6 px-6">
            <div className="inline-block bg-zinc-250/60 text-zinc-600 text-[10px] md:text-xs font-semibold px-4 py-1 rounded-full uppercase tracking-wider mb-4">
                Addax
            </div>
            
            <h1 className="text-3xl md:text-5xl lg:text-5xl font-normal text-zinc-950 tracking-tight leading-tight max-w-4xl mx-auto">
                An Idea shaped Into an Real life Entity
            </h1>
            
            <p className="text-zinc-550 text-sm md:text-base max-w-2xl mx-auto mt-4 leading-relaxed font-light">
                Interactive summaries, timestamp navigations, and vector-powered transcript chats designed to optimize your study workflow and save hours of video watch time.
            </p>
        </div>
    );
}

export default AboutHero;
