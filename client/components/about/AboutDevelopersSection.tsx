"use client";

import React from "react";

const GithubIcon = ({ size = 12 }: { size?: number }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const LinkedinIcon = ({ size = 12 }: { size?: number }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const developers = [
    {
        name: "Aadarsh Verma",
        // role: "Lead AI Engineer",
        quote: '"Addax completely transformed my study flow. Instead of watching 3-hour dev conferences, I get direct vector-powered answers and code insights in seconds."',
        github: "https://github.com/AadarshVerma7",
        linkedin: "https://www.linkedin.com/in/aadarsh-verma-av/",
        avatar: "https://avatars.githubusercontent.com/u/181336759?v=4"
    },
    {
        name: "Abhishek Sharma",
        // role: "Lead UI Designer",
        quote: '"We designed the summarizer to feel clean and visual. Learning technical concepts is hard enough; the user interface should be fluid, fast, and completely out of the way."',
        github: "https://github.com/abhishekkksharma",
        linkedin: "https://www.linkedin.com/in/abhish3k-sharma/",
        avatar: "https://media.licdn.com/dms/image/v2/D5603AQFDcgiBqmGweg/profile-displayphoto-crop_800_800/B56ZqqIqbbHIAI-/0/1763790989742?e=1787184000&v=beta&t=Ih7ERCli6opn5IujtBysV2tYOq2paFDg7KTUo6zvMPQ"
    }
];

function AboutDevelopersSection() {
    return (
        <section className="py-16 md:py-24 px-6 sm:px-10 md:px-20 lg:px-32 max-w-7xl mx-auto w-full">
            <div className="text-center mb-12">
                <div className="inline-block bg-zinc-250/60 text-zinc-600 text-[10px] md:text-xs font-semibold px-4 py-1 rounded-full uppercase tracking-wider mb-4">
                    Developers
                </div>
                
                <h2 className="text-3xl md:text-5xl font-normal text-zinc-950 tracking-tight leading-tight">
                    The minds behind Addax
                </h2>
                
                <p className="text-zinc-500 text-sm max-w-2xl mx-auto mt-3 leading-relaxed font-light">
                    Meet the engineering and design team responsible for building the video summarization engine.
                </p>
            </div>

            <div className="flex flex-col md:flex-row justify-center items-stretch gap-6 md:gap-5 mt-10 max-w-4xl mx-auto">
    {developers.map((dev) => (
        <div
            key={dev.name}
            className="relative w-full md:w-[310px] pb-4 "
        >
            {/* Testimonial Card */}
            <div className="bg-[#F3F4F6] rounded-[18px] min-h-60 lg:min-h-70 px-6 pt-6 pb-14">
                {/* Large Quote Mark */}
                <div
                    className="text-[#D5D8DC] text-[58px] font-serif font-bold leading-[0.8] mb-5 select-none"
                    aria-hidden="true"
                >
                    “
                </div>

                {/* Quote */}
                <p className="text-zinc-900 text-[15px] md:text-[16px] font-normal leading-[1.45]">
                    {dev.quote.replace(/^"|"$/g, "")}
                </p>
            </div>

            {/* Profile — overlaps bottom of card */}
            <div className="absolute left-0 bottom-2">
                <div className="bg-white rounded-r-[14px] rounded-l- px-2.5 py-2 flex items-center gap-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                    <img
                        src={dev.avatar}
                        alt={dev.name}
                        className="h-9 w-9 rounded-full object-cover"
                    />

                    <div className="text-left pr-1">
                        <h4 className="font-semibold text-zinc-900 text-[12px] leading-tight whitespace-nowrap">
                            {dev.name}
                        </h4>

                        <div className="flex items-center gap-2 mt-1">
                            <a
                                href={dev.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`${dev.name} GitHub`}
                                className="text-zinc-400 hover:text-zinc-900 transition-colors"
                            >
                                <GithubIcon size={14} />
                            </a>

                            <a
                                href={dev.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`${dev.name} LinkedIn`}
                                className="text-zinc-400 hover:text-blue-600 transition-colors"
                            >
                                <LinkedinIcon size={14} />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    ))}
</div>
        </section>
    );
}

export default AboutDevelopersSection;
